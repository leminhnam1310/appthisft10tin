"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import {
  onAuthStateChanged
} from "firebase/auth";

import {
  ref,
  onValue
} from "firebase/database";

import {
  auth,
  db,
  rtdb
} from "@/app/lib/firebase";

export default function ProfileById() {
  const { uid } = useParams();

  const [userData, setUserData] = useState(null);
  const [me, setMe] = useState(null);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [online, setOnline] = useState(false);

  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    location: "",
    school: "",
  });

  const isMe = me?.uid === uid;

  /* ================= AUTH ================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setMe(u || null);
    });

    return () => unsub();
  }, []);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    if (!uid) return;

    async function fetchUser() {
      setLoading(true);

      const refUser = doc(db, "users", uid);
      const snap = await getDoc(refUser);

      if (snap.exists()) {
        const data = snap.data();

        setUserData(data);

        setForm({
          displayName: data.displayName || "",
          bio: data.bio || "",
          location: data.location || "",
          school: data.school || "",
        });
      } else {
        setUserData(null);
      }

      setLoading(false);
    }

    fetchUser();
  }, [uid]);

  /* ================= ONLINE STATUS ================= */
  useEffect(() => {
    if (!uid) return;

    const statusRef = ref(rtdb, `/status/${uid}`);

    const unsub = onValue(statusRef, (snap) => {
      const data = snap.val();

      if (!data) {
        setOnline(false);
        return;
      }

      setOnline(data.state === "online");
    });

    return () => unsub();
  }, [uid]);

  /* ================= SAVE ================= */
  async function handleSave() {
    try {
      const refUser = doc(db, "users", uid);

      await updateDoc(refUser, {
        displayName: form.displayName,
        bio: form.bio,
        location: form.location,
        school: form.school,
      });

      // update local state ngay lập tức
      setUserData((prev) => ({
        ...prev,
        ...form,
      }));

      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  }

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="p-6 text-center">
        Đang tải...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-6 text-center">
        Không tìm thấy user
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="p-6 max-w-2xl mx-auto">

      {/* COVER */}
      <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl" />

      {/* AVATAR */}
      <div className="flex justify-center -mt-10 relative">

        <img
          src={userData.avatar || "/default-avatar.png"}
          className="w-24 h-24 rounded-full border-4 border-white"
        />

        {/* ONLINE DOT */}
        <span
          className={`absolute bottom-2 right-[calc(50%-40px)] w-4 h-4 rounded-full border-2 border-white ${
            online ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      </div>

      {/* INFO */}
      <div className="text-center mt-4">

        {/* NAME */}
        {editing && isMe ? (
          <input
            className="border px-3 py-1 rounded w-full text-center"
            value={form.displayName}
            onChange={(e) =>
              setForm({
                ...form,
                displayName: e.target.value,
              })
            }
          />
        ) : (
          <h1 className="text-xl font-bold">
            {userData.displayName}
          </h1>
        )}

        <p className="text-gray-500">
          @{userData.username}
        </p>

        {/* BIO */}
        {editing && isMe ? (
          <textarea
            className="border mt-2 w-full p-2 rounded"
            value={form.bio}
            onChange={(e) =>
              setForm({
                ...form,
                bio: e.target.value,
              })
            }
          />
        ) : (
          <p className="mt-2 text-sm text-gray-600">
            {userData.bio || "Chưa có giới thiệu"}
          </p>
        )}
      </div>

      {/* DETAIL */}
      <div className="mt-5 space-y-3 text-center text-sm text-gray-700">

        {/* LOCATION */}
        {editing && isMe ? (
          <input
            className="border px-3 py-1 rounded w-full"
            value={form.location}
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value,
              })
            }
          />
        ) : (
          <p>📍 {userData.location || "Chưa có vị trí"}</p>
        )}

        {/* SCHOOL */}
        {editing && isMe ? (
          <input
            className="border px-3 py-1 rounded w-full"
            value={form.school}
            onChange={(e) =>
              setForm({
                ...form,
                school: e.target.value,
              })
            }
          />
        ) : (
          <p>🏫 {userData.school || "Chưa có trường học"}</p>
        )}
      </div>

      {/* BUTTONS */}
      {isMe && (
        <div className="mt-6 flex gap-3 justify-center">

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Chỉnh sửa hồ sơ
            </button>
          ) : (
            <>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Huỷ
              </button>

              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Lưu
              </button>
            </>
          )}

        </div>
      )}
    </div>
  );
}