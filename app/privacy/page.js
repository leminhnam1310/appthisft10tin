"use client";

import {
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  Mail,
} from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      icon: <Database size={20} />,
      title: "Thông tin chúng tôi thu thập",
      content:
        "Khi bạn sử dụng 11TIN, chúng tôi có thể lưu các thông tin như tên hiển thị, email, ảnh đại diện, UID tài khoản, danh sách bạn bè, bài viết, tin nhắn và các dữ liệu bạn tự nguyện cung cấp.",
    },
    {
      icon: <UserCheck size={20} />,
      title: "Mục đích sử dụng dữ liệu",
      content:
        "Thông tin được sử dụng để xác thực tài khoản, đồng bộ dữ liệu giữa các thiết bị, hiển thị hồ sơ, kết nối bạn bè, hỗ trợ trò chuyện và cải thiện trải nghiệm sử dụng.",
    },
    {
      icon: <Eye size={20} />,
      title: "Chia sẻ dữ liệu",
      content:
        "11TIN không bán hoặc cho thuê dữ liệu cá nhân của người dùng. Dữ liệu chỉ được chia sẻ khi có yêu cầu của pháp luật hoặc khi cần thiết để cung cấp dịch vụ.",
    },
    {
      icon: <Lock size={20} />,
      title: "Bảo mật",
      content:
        "Dữ liệu được lưu trữ trên nền tảng Firebase của Google với các cơ chế xác thực, phân quyền và mã hóa nhằm hạn chế truy cập trái phép.",
    },
    {
      icon: <Shield size={20} />,
      title: "Quyền của người dùng",
      content:
        "Bạn có quyền xem, chỉnh sửa hoặc yêu cầu xóa tài khoản và dữ liệu cá nhân của mình bất cứ lúc nào thông qua phần cài đặt hoặc liên hệ với chúng tôi.",
    },
    {
      icon: <Mail size={20} />,
      title: "Liên hệ",
      content:
        "Nếu có bất kỳ câu hỏi nào về quyền riêng tư hoặc dữ liệu cá nhân, vui lòng liên hệ với nhóm phát triển 11TIN để được hỗ trợ.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-950 py-12 px-5">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 p-10 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
              <Shield size={38} />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                Chính sách quyền riêng tư
              </h1>

              <p className="mt-2 text-blue-100">
                Cập nhật lần cuối: 02/07/2026
              </p>
            </div>
          </div>
        </div>

        {/* Intro */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            11TIN cam kết tôn trọng và bảo vệ quyền riêng tư của mọi người dùng.
            Chúng tôi chỉ thu thập những thông tin cần thiết để cung cấp dịch vụ,
            nâng cao trải nghiệm và đảm bảo an toàn cho hệ thống. Việc sử dụng
            11TIN đồng nghĩa với việc bạn đồng ý với chính sách này.
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
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
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

        {/* Footer */}
        <div className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-6 text-center dark:border-blue-800 dark:bg-blue-900/20">
          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
            Cam kết của 11TIN
          </h3>

          <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
            Chúng tôi luôn nỗ lực bảo vệ dữ liệu cá nhân theo các nguyên tắc
            bảo mật hiện đại và tuân thủ những quy định pháp luật hiện hành.
            Chính sách này có thể được cập nhật khi dịch vụ thay đổi, mọi phiên
            bản mới sẽ được thông báo trên website.
          </p>
        </div>

      </div>
    </main>
  );
}