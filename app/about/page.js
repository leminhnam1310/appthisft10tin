"use client";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border rounded-2xl p-8">

        <h1 className="text-3xl font-bold mb-6">
          ℹ️ Thông tin website
        </h1>

        <div className="space-y-4 leading-relaxed text-sm">
          <p>
            Đây là một nền tảng mạng xã hội học đường hỗ trợ kết nối, trò chuyện và chia sẻ cảm xúc.
          </p>

          <p>
            🧠 Tính năng chính:
          </p>

          <ul className="list-disc pl-5 space-y-2">
            <li>Kết bạn và gợi ý bạn bè thông minh</li>
            <li>Trò chuyện realtime</li>
            <li>Đăng bài viết & nhật ký cảm xúc</li>
            <li>Hệ thống mood tracking</li>
          </ul>

          <p>
            🔧 Công nghệ:
            Next.js + Firebase + TailwindCSS
          </p>

          <p>
            📌 Mục tiêu: tạo môi trường an toàn, tích cực cho học sinh.
          </p>
        </div>
      </div>
    </main>
  );
}