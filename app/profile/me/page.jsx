"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase";

export default function MyProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace(`/profile/${user.uid}`);
      }
    });

    return () => unsub();
  }, []);

  return <div>Đang chuyển hướng...</div>;
}