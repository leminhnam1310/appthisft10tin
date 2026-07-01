"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProfile } from "@/app/lib/friends";
import FriendProfile from "@/components/friends/FriendProfile";

export default function ProfilePage() {
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getProfile(uid);
      setUser(data);
      setLoading(false);
    }

    if (uid) load();
  }, [uid]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return <p className="p-6">User not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <FriendProfile user={user} />
    </div>
  );
}