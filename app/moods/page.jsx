import Link from "next/link";
import MoodCard from "@/components/MoodCard";

export default function MoodPage() {
  return (
    <main className="min-h-screen w-full p-10">
      {/* Nút về trang chủ */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-block px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
        >
          ← Về trang chủ
        </Link>
      </div>

      <MoodCard />
    </main>
  );
}