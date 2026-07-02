"use client";

import {
  FileText,
  ShieldCheck,
  Ban,
  UserCheck,
  RefreshCw,
  Scale,
} from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      icon: <UserCheck size={20} />,
      title: "1. Chấp nhận điều khoản",
      content:
        "Khi truy cập hoặc sử dụng nền tảng 11TIN, bạn xác nhận đã đọc, hiểu và đồng ý tuân thủ các điều khoản sử dụng được quy định trên trang này.",
    },
    {
      icon: <Ban size={20} />,
      title: "2. Quy định dành cho người dùng",
      content:
        "Người dùng không được đăng tải, chia sẻ hoặc phát tán nội dung vi phạm pháp luật, thông tin sai sự thật, nội dung xúc phạm cá nhân, kích động bạo lực, thù ghét hoặc gây ảnh hưởng đến cộng đồng. Mọi hành vi sử dụng hệ thống nhằm mục đích phá hoại đều bị nghiêm cấm.",
    },
    {
      icon: <ShieldCheck size={20} />,
      title: "3. Quản lý tài khoản",
      content:
        "Bạn chịu trách nhiệm bảo mật tài khoản của mình và mọi hoạt động phát sinh từ tài khoản đó. Nếu phát hiện truy cập trái phép, hãy thay đổi thông tin đăng nhập và liên hệ với chúng tôi ngay.",
    },
    {
      icon: <Scale size={20} />,
      title: "4. Quyền của 11TIN",
      content:
        "Chúng tôi có quyền từ chối, chỉnh sửa, ẩn hoặc xóa bất kỳ nội dung hoặc tài khoản nào vi phạm điều khoản sử dụng hoặc ảnh hưởng đến sự an toàn và ổn định của hệ thống mà không cần thông báo trước.",
    },
    {
      icon: <RefreshCw size={20} />,
      title: "5. Thay đổi điều khoản",
      content:
        "Điều khoản sử dụng có thể được cập nhật theo thời gian nhằm phù hợp với sự phát triển của nền tảng và quy định pháp luật hiện hành. Phiên bản mới sẽ được công bố trên website.",
    },
    {
      icon: <FileText size={20} />,
      title: "6. Hiệu lực",
      content:
        "Các điều khoản này có hiệu lực kể từ thời điểm bạn bắt đầu sử dụng dịch vụ. Nếu bạn không đồng ý với bất kỳ nội dung nào, vui lòng ngừng sử dụng nền tảng.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-950 py-12 px-5">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-10 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
              <FileText size={38} />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                Điều khoản sử dụng
              </h1>

              <p className="mt-2 text-indigo-100">
                Cập nhật lần cuối: 02/07/2026
              </p>
            </div>
          </div>
        </div>

        {/* Intro */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            Chào mừng bạn đến với <strong>11TIN</strong>. Điều khoản sử dụng này
            quy định quyền, nghĩa vụ và trách nhiệm của người dùng khi truy cập
            hoặc sử dụng các dịch vụ trên nền tảng. Việc tiếp tục sử dụng đồng
            nghĩa với việc bạn đồng ý tuân thủ các quy định dưới đây.
          </p>
        </div>

        {/* Sections */}
        <div className="mt-8 space-y-6">
          {sections.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                  {item.icon}
                </div>

                <h2 className="text-xl font-bold">
                  {item.title}
                </h2>
              </div>

              <p className="mt-5 leading-8 text-slate-600 dark:text-slate-300">
                {item.content}
              </p>
            </div>
          ))}
        </div>

        {/* Notice */}
        <div className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-700 dark:bg-amber-900/20">
          <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-300">
            Lưu ý
          </h3>

          <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
            Nếu phát hiện hành vi vi phạm điều khoản hoặc có thắc mắc về việc sử
            dụng dịch vụ, vui lòng liên hệ đội ngũ quản trị để được hỗ trợ. Mục
            tiêu của 11TIN là xây dựng một môi trường trực tuyến an toàn, văn
            minh và tôn trọng mọi người dùng.
          </p>
        </div>

      </div>
    </main>
  );
}