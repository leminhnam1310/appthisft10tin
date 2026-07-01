    "use client";

    import { useEffect, useMemo, useState } from "react";
    import Image from "next/image";
    import { useRouter } from "next/navigation";

    import {
    MapPin,
    GraduationCap,
    Globe,
    Users,
    FileText,
    UserPlus,
    UserMinus,
    MessageCircle,
    ShieldBan,
    Check,
    Clock3,
    Loader2,
    } from "lucide-react";

    import {
    listenProfile,
    listenFriendCount,
    listenFriendProfile,
    getFriendStats,
    getMutualFriends,
    getAISuggestions,
    isFriend,
    isBlocked,
    sendFriendRequest,
    removeFriend,
    blockUser,
    createChat,
    } from "@/app/lib/friends";

    export default function FriendProfile({
    user,
    currentUser,
    }) {
    const router = useRouter();

    /* ===========================================
                    PROFILE
    =========================================== */

    const [profile, setProfile] = useState(user);

    const [loading, setLoading] = useState(true);

    /* ===========================================
                    STATUS
    =========================================== */

    const [friendCount, setFriendCount] =
        useState(0);

    const [postCount, setPostCount] =
        useState(0);

    const [online, setOnline] =
        useState(false);

    /* ===========================================
                    FRIEND
    =========================================== */

    const [friend, setFriend] =
        useState(false);

    const [blocked, setBlocked] =
        useState(false);

    const [sending, setSending] =
        useState(false);

    const [removing, setRemoving] =
        useState(false);

    const [blocking, setBlocking] =
        useState(false);

    /* ===========================================
                    MUTUAL
    =========================================== */

    const [mutualFriends, setMutualFriends] =
        useState([]);

    /* ===========================================
                    AI SCORE
    =========================================== */

    const [score, setScore] =
        useState(0);

    /* ===========================================
                    EFFECT
    =========================================== */

    useEffect(() => {
        if (!profile?.uid) return;

        const unsubscribe =
        listenFriendProfile(
            profile.uid,
            (data) => {
            if (data) setProfile(data);
            }
        );

        return unsubscribe;
    }, [profile?.uid]);

    /* ===========================================
                FRIEND COUNT
    =========================================== */

    useEffect(() => {
        if (!profile?.uid) return;

        const unsubscribe =
        listenFriendCount(
            profile.uid,
            (count) => {
            setFriendCount(count);
            }
        );

        return unsubscribe;
    }, [profile?.uid]);

    /* ===========================================
                LOAD STATS
    =========================================== */

    useEffect(() => {
        if (!profile?.uid) return;

        async function loadStats() {
        const stats =
            await getFriendStats(
            profile.uid
            );

        if (!stats) return;

        setPostCount(
            stats.postCount || 0
        );

        setOnline(
            stats.online || false
        );
        }

        loadStats();
    }, [profile?.uid]);

    /* ===========================================
                CHECK FRIEND
    =========================================== */

    useEffect(() => {
        if (
        !currentUser ||
        !profile
        )
        return;

        async function check() {
        const ok = await isFriend(
            currentUser.uid,
            profile.uid
        );

        setFriend(ok);
        }

        check();
    }, [
        currentUser,
        profile,
    ]);

    /* ===========================================
                CHECK BLOCK
    =========================================== */

    useEffect(() => {
        if (
        !currentUser ||
        !profile
        )
        return;

        async function check() {
        const ok =
            await isBlocked(
            currentUser.uid,
            profile.uid
            );

        setBlocked(ok);
        }

        check();
    }, [
        currentUser,
        profile,
    ]);

    /* ===========================================
                MUTUAL FRIENDS
    =========================================== */

    useEffect(() => {
        if (
        !currentUser ||
        !profile
        )
        return;

        async function load() {
        const list =
            await getMutualFriends(
            currentUser.uid,
            profile.uid
            );

        setMutualFriends(list);
        }

        load();
    }, [
        currentUser,
        profile,
    ]);

    /* ===========================================
                    AI SCORE
    =========================================== */

    useEffect(() => {
        if (
        !currentUser
        )
        return;

        async function load() {
        const list =
            await getAISuggestions(
            currentUser.uid
            );

        const me =
            list.find(
            (u) =>
                u.uid === profile.uid
            );

        if (me) {
            setScore(
            me.score || 0
            );
        }
        }

        load();
    }, [
        currentUser,
        profile,
    ]);

    /* ===========================================
                FINISH LOADING
    =========================================== */

    useEffect(() => {
        if (!profile) return;

        setLoading(false);
    }, [profile]);

    /* ===========================================
                    ACTION
    =========================================== */

    async function handleAddFriend() {
        try {
        setSending(true);

        await sendFriendRequest(
            currentUser.uid,
            profile.uid
        );
        } finally {
        setSending(false);
        }
    }

    async function handleRemoveFriend() {
        if (
        !confirm(
            "Xóa người này khỏi danh sách bạn bè?"
        )
        )
        return;

        try {
        setRemoving(true);

        await removeFriend(
            currentUser.uid,
            profile.uid
        );

        setFriend(false);
        } finally {
        setRemoving(false);
        }
    }

    async function handleMessage() {
        const chatId =
        await createChat(
            currentUser.uid,
            profile.uid
        );

        router.push(
        `/chat/${chatId}`
        );
    }

    async function handleBlock() {
        if (
        !confirm(
            "Chặn người dùng này?"
        )
        )
        return;

        try {
        setBlocking(true);

        await blockUser(
            currentUser.uid,
            profile.uid
        );

        setBlocked(true);
        } finally {
        setBlocking(false);
        }
    }

    /* ===========================================
                COMPUTED
    =========================================== */

    const fullLocation =
        useMemo(() => {
        return (
            profile?.location ||
            "Chưa cập nhật"
        );
        }, [profile]);

    const school =
        useMemo(() => {
        return (
            profile?.school ||
            "Chưa cập nhật"
        );
        }, [profile]);

    const website =
        useMemo(() => {
        return (
            profile?.website ||
            ""
        );
        }, [profile]);

    const bio =
        useMemo(() => {
        return (
            profile?.bio ||
            "Chưa có tiểu sử."
        );
        }, [profile]);

    /*
    =======================================================
            PHẦN 2 SẼ BẮT ĐẦU TỪ ĐÂY

            if (loading) ...

            return (
                <>
                    Cover
                    Avatar
                    Header
                    Stats
                    Buttons
                    ...
                </>
            )

    =======================================================
    */
    if (loading) {
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <Loader2
        size={42}
        className="animate-spin text-blue-600"
      />
    </div>
  );
}

return (
  <div className="min-h-screen bg-[#f0f2f5] pb-10">

    {/* ================= COVER ================= */}

    <div className="relative h-[320px] w-full overflow-hidden rounded-b-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600">

      {profile.cover && (
        <Image
          src={profile.cover}
          alt=""
          fill
          priority
          className="object-cover"
        />
      )}

      {/* Overlay */}

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

    </div>

    {/* ================= PROFILE ================= */}

    <div className="relative mx-auto -mt-28 max-w-6xl px-6">

      <div className="rounded-3xl bg-white shadow-xl border overflow-hidden">

        <div className="px-10 pb-10">

          {/* Avatar */}

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">

            <div className="flex flex-col lg:flex-row lg:items-end gap-6">

              <div className="relative">

                <Image
                  src={
                    profile.avatar ||
                    "/default-avatar.png"
                  }
                  alt=""
                  width={180}
                  height={180}
                  className="
                  h-44
                  w-44
                  rounded-full
                  border-[6px]
                  border-white
                  object-cover
                  shadow-xl
                  bg-white"
                />

                {online && (
                  <span
                    className="
                    absolute
                    bottom-4
                    right-4
                    h-7
                    w-7
                    rounded-full
                    border-4
                    border-white
                    bg-green-500"
                  />
                )}

              </div>

              {/* Name */}

              <div className="pb-4">

                <h1 className="text-4xl font-bold">

                  {profile.displayName}

                </h1>

                <p className="mt-2 text-lg text-gray-500">

                  @{profile.username}

                </p>

                <p className="mt-4 max-w-xl text-gray-600">

                  {bio}

                </p>

              </div>

            </div>

            {/* AI SCORE */}

            <div className="mt-8 lg:mt-0">

              <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg">

                <p className="text-sm opacity-90">
                  AI Match
                </p>

                <h2 className="mt-1 text-4xl font-bold">

                  {score}%

                </h2>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">

                  <div
                    className="h-full rounded-full bg-white transition-all duration-700"
                    style={{
                      width: `${score}%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* ================= STATS ================= */}

          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">

            <div className="rounded-2xl border bg-gray-50 p-6 text-center">

              <Users
                className="mx-auto text-blue-600"
                size={26}
              />

              <h3 className="mt-3 text-3xl font-bold">

                {friendCount}

              </h3>

              <p className="text-sm text-gray-500">

                Bạn bè

              </p>

            </div>

            <div className="rounded-2xl border bg-gray-50 p-6 text-center">

              <FileText
                className="mx-auto text-indigo-600"
                size={26}
              />

              <h3 className="mt-3 text-3xl font-bold">

                {postCount}

              </h3>

              <p className="text-sm text-gray-500">

                Bài viết

              </p>

            </div>

            <div className="rounded-2xl border bg-gray-50 p-6 text-center">

              <Users
                className="mx-auto text-cyan-600"
                size={26}
              />

              <h3 className="mt-3 text-3xl font-bold">

                {mutualFriends.length}

              </h3>

              <p className="text-sm text-gray-500">

                Bạn chung

              </p>

            </div>

            <div className="rounded-2xl border bg-gray-50 p-6 text-center">

              <Check
                className="mx-auto text-green-600"
                size={26}
              />

              <h3 className="mt-3 text-3xl font-bold">

                {online ? "Online" : "Offline"}

              </h3>

              <p className="text-sm text-gray-500">

                Trạng thái

              </p>

            </div>

          </div>
                    {/* ================= ACTION BUTTONS ================= */}

          <div className="mt-8 flex flex-wrap gap-4">

            {!blocked && !friend && (
              <button
                onClick={handleAddFriend}
                disabled={sending}
                className="
                flex items-center gap-3
                rounded-2xl
                bg-blue-600
                px-7
                py-4
                font-semibold
                text-white
                transition
                hover:bg-blue-700
                disabled:opacity-60"
              >
                {sending ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Kết bạn
                  </>
                )}
              </button>
            )}

            {!blocked && friend && (
              <>
                <button
                  onClick={handleMessage}
                  className="
                  flex items-center gap-3
                  rounded-2xl
                  bg-blue-600
                  px-7
                  py-4
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-700"
                >
                  <MessageCircle size={20} />
                  Nhắn tin
                </button>

                <button
                  onClick={handleRemoveFriend}
                  disabled={removing}
                  className="
                  flex items-center gap-3
                  rounded-2xl
                  border
                  bg-white
                  px-7
                  py-4
                  font-semibold
                  transition
                  hover:bg-red-50
                  hover:text-red-600
                  hover:border-red-500"
                >
                  {removing ? (
                    <>
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />
                      Đang xóa...
                    </>
                  ) : (
                    <>
                      <UserMinus size={20} />
                      Hủy kết bạn
                    </>
                  )}
                </button>
              </>
            )}

            <button
              onClick={handleBlock}
              disabled={blocking}
              className="
              flex items-center gap-3
              rounded-2xl
              border
              bg-white
              px-7
              py-4
              font-semibold
              transition
              hover:bg-gray-100"
            >
              {blocking ? (
                <>
                  <Loader2
                    size={20}
                    className="animate-spin"
                  />
                  Đang chặn...
                </>
              ) : (
                <>
                  <ShieldBan size={20} />
                  Chặn
                </>
              )}
            </button>

          </div>

          {/* ================= INFO ================= */}

          <div className="mt-10 grid gap-6 lg:grid-cols-3">

            <div className="rounded-2xl border bg-gray-50 p-6">

              <h2 className="mb-5 text-xl font-bold">

                Giới thiệu

              </h2>

              <div className="space-y-5">

                <div className="flex items-center gap-4">

                  <MapPin
                    className="text-blue-600"
                    size={20}
                  />

                  <span>

                    {fullLocation}

                  </span>

                </div>

                <div className="flex items-center gap-4">

                  <GraduationCap
                    className="text-indigo-600"
                    size={20}
                  />

                  <span>

                    {school}

                  </span>

                </div>

                {website && (
                  <div className="flex items-center gap-4">

                    <Globe
                      className="text-cyan-600"
                      size={20}
                    />

                    <a
                      href={website}
                      target="_blank"
                      rel="noreferrer"
                      className="
                      text-blue-600
                      hover:underline
                      break-all"
                    >
                      {website}
                    </a>

                  </div>
                )}

              </div>

            </div>
                        {/* ================= MUTUAL FRIENDS ================= */}

            <div className="rounded-2xl border bg-gray-50 p-6">

              <div className="flex items-center justify-between">

                <h2 className="text-xl font-bold">
                  Bạn chung
                </h2>

                <span className="text-sm text-blue-600 font-medium">
                  {mutualFriends.length} người
                </span>

              </div>

              {mutualFriends.length === 0 ? (

                <div className="mt-10 text-center text-gray-400">

                  <Users
                    size={40}
                    className="mx-auto mb-3"
                  />

                  <p>Chưa có bạn chung.</p>

                </div>

              ) : (

                <>

                  <div className="mt-6 flex -space-x-4">

                    {mutualFriends
                      .slice(0, 6)
                      .map((friend) => (

                        <Image
                          key={friend.uid}
                          src={
                            friend.avatar ||
                            "/default-avatar.png"
                          }
                          alt=""
                          width={58}
                          height={58}
                          onClick={() =>
                            router.push(
                              `/profile/${friend.uid}`
                            )
                          }
                          className="
                          h-14
                          w-14
                          rounded-full
                          border-4
                          border-white
                          object-cover
                          shadow
                          cursor-pointer
                          hover:scale-110
                          transition"
                        />

                      ))}

                  </div>

                  <div className="mt-6 space-y-3">

                    {mutualFriends
                      .slice(0, 4)
                      .map((friend) => (

                        <div
                          key={friend.uid}
                          onClick={() =>
                            router.push(
                              `/profile/${friend.uid}`
                            )
                          }
                          className="
                          flex
                          items-center
                          gap-4
                          rounded-xl
                          p-3
                          cursor-pointer
                          transition
                          hover:bg-white"
                        >

                          <Image
                            src={
                              friend.avatar ||
                              "/default-avatar.png"
                            }
                            alt=""
                            width={48}
                            height={48}
                            className="
                            h-12
                            w-12
                            rounded-full
                            object-cover"
                          />

                          <div className="flex-1">

                            <h3 className="font-semibold">

                              {friend.displayName}

                            </h3>

                            <p className="text-sm text-gray-500">

                              @{friend.username}

                            </p>

                          </div>

                        </div>

                      ))}

                  </div>

                </>

              )}

            </div>

            {/* ================= QUICK INFO ================= */}

            <div className="rounded-2xl border bg-gray-50 p-6">

              <h2 className="text-xl font-bold">
                Thông tin nhanh
              </h2>

              <div className="mt-6 space-y-5">

                <div>

                  <p className="text-gray-400 text-sm">
                    AI Match
                  </p>

                  <div className="mt-2 h-3 rounded-full bg-gray-200 overflow-hidden">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                      style={{
                        width: `${score}%`,
                      }}
                    />

                  </div>

                  <p className="mt-2 font-semibold">

                    {score}% phù hợp

                  </p>

                </div>

                <div>

                  <p className="text-gray-400 text-sm">
                    Trạng thái
                  </p>

                  <p className="mt-2 font-semibold">

                    {online
                      ? "🟢 Đang hoạt động"
                      : "⚪ Ngoại tuyến"}

                  </p>

                </div>

                <div>

                  <p className="text-gray-400 text-sm">
                    UID
                  </p>

                  <p className="mt-2 break-all text-sm">

                    {profile.uid}

                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ================= GALLERY ================= */}

          <div className="mt-10">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold">

                Ảnh

              </h2>

              <button
                className="
                rounded-xl
                bg-blue-50
                px-5
                py-2
                text-blue-600
                hover:bg-blue-100"
              >
                Xem tất cả
              </button>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

              {(profile.photos || [])
                .slice(0, 6)
                .map((photo, index) => (

                  <Image
                    key={index}
                    src={photo}
                    alt=""
                    width={220}
                    height={220}
                    className="
                    aspect-square
                    rounded-2xl
                    object-cover
                    cursor-pointer
                    hover:scale-105
                    transition"
                  />

                ))}

            </div>

          </div>
                    {/* ================= TIMELINE ================= */}

          <div className="mt-12">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold">
                Dòng thời gian
              </h2>

              <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                {postCount} bài viết
              </span>

            </div>

            <div className="mt-6 space-y-6">

              {(profile.posts || []).length === 0 ? (

                <div className="rounded-3xl border bg-white p-16 text-center shadow-sm">

                  <FileText
                    size={54}
                    className="mx-auto text-gray-300"
                  />

                  <h3 className="mt-5 text-xl font-semibold">
                    Chưa có bài viết
                  </h3>

                  <p className="mt-2 text-gray-500">
                    Người dùng này vẫn chưa chia sẻ điều gì.
                  </p>

                </div>

              ) : (

                profile.posts.map((post) => (

                  <div
                    key={post.id}
                    className="
                    overflow-hidden
                    rounded-3xl
                    border
                    bg-white
                    shadow-sm
                    transition
                    hover:shadow-lg"
                  >

                    {/* Header */}

                    <div className="flex items-center gap-4 p-6">

                      <Image
                        src={
                          profile.avatar ||
                          "/default-avatar.png"
                        }
                        alt=""
                        width={52}
                        height={52}
                        className="rounded-full object-cover"
                      />

                      <div className="flex-1">

                        <h3 className="font-semibold">

                          {profile.displayName}

                        </h3>

                        <p className="text-sm text-gray-500">

                          {post.createdAt
                            ? new Date(
                                post.createdAt
                              ).toLocaleString()
                            : "Vừa xong"}

                        </p>

                      </div>

                    </div>

                    {/* Content */}

                    <div className="px-6 pb-6">

                      <p className="leading-8 whitespace-pre-wrap">

                        {post.content}

                      </p>

                    </div>

                    {/* Image */}

                    {post.image && (

                      <Image
                        src={post.image}
                        alt=""
                        width={1200}
                        height={800}
                        className="
                        max-h-[650px]
                        w-full
                        object-cover"
                      />

                    )}

                    {/* Footer */}

                    <div className="flex items-center justify-between border-t p-5">

                      <div className="flex gap-6 text-gray-500">

                        <span>

                          ❤️ {post.likes || 0}

                        </span>

                        <span>

                          💬 {post.comments || 0}

                        </span>

                      </div>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

);
}