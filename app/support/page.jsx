"use client";

import {
  LifeBuoy,
  Mail,
  ShieldAlert,
  Bug,
  MessageCircleQuestion,
  Clock3,
} from "lucide-react";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-950 py-12 px-5">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 text-white p-10 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/20 p-4">
              <LifeBuoy size={38} />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                Trung tâm hỗ trợ
              </h1>

              <p className="mt-2 text-cyan-100">
                Chúng tôi luôn sẵn sàng hỗ trợ và lắng nghe ý kiến của bạn.
              </p>
            </div>
          </div>
        </div>

        {/* Nội dung */}
        <div className="mt-8 grid gap-6">

          <div className="rounded-3xl border bg-white dark:bg-slate-900 dark:border-slate-800 p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <Bug className="text-red-500" />
              <h2 className="text-xl font-bold">
                Báo lỗi hệ thống
              </h2>
            </div>

            <p className="mt-4 text-slate-600 dark:text-slate-300 leading-7">
              Nếu bạn phát hiện lỗi, vui lòng gửi mô tả chi tiết, ảnh chụp màn
              hình (nếu có) và các bước để tái hiện lỗi.
            </p>
          </div>

          <div className="rounded-3xl border bg-white dark:bg-slate-900 dark:border-slate-800 p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-orange-500" />
              <h2 className="text-xl font-bold">
                Báo cáo vi phạm
              </h2>
            </div>

            <p className="mt-4 text-slate-600 dark:text-slate-300 leading-7">
              Bạn có thể báo cáo tài khoản, bài viết, bình luận hoặc bất kỳ nội
              dung nào vi phạm Điều khoản sử dụng để đội ngũ quản trị xem xét và
              xử lý.
            </p>
          </div>

          <div className="rounded-3xl border bg-white dark:bg-slate-900 dark:border-slate-800 p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <MessageCircleQuestion className="text-blue-500" />
              <h2 className="text-xl font-bold">
                Góp ý & liên hệ
              </h2>
            </div>

            <p className="mt-4 text-slate-600 dark:text-slate-300 leading-7">
              Mọi góp ý để cải thiện 11TIN đều được chào đón. Chúng tôi luôn cố
              gắng phản hồi trong thời gian sớm nhất.
            </p>
          </div>

          {/* Email */}
          <div className="rounded-3xl bg-blue-600 text-white p-8 shadow-xl">
            <div className="flex items-center gap-3">
              <Mail size={28} />
              <h2 className="text-2xl font-bold">
                Email hỗ trợ
              </h2>
            </div>

            <p className="mt-5 text-blue-100 leading-7">
              Vui lòng gửi mọi yêu cầu hỗ trợ, báo lỗi hoặc báo cáo vi phạm đến:
            </p>

            <a
              href="mailto:minhnamle13102010@gmail.com"
              className="mt-4 inline-block text-2xl font-bold underline underline-offset-4 hover:text-cyan-200 transition"
            >
              minhnamle13102010@gmail.com
            </a>

            <div className="mt-6 flex items-center gap-2 text-blue-100">
              <Clock3 size={18} />
              <span>
                Thời gian phản hồi dự kiến: 24 - 72 giờ làm việc.
              </span>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}