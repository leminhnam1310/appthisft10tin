"use client";

export default function Hero() {
  return (
    <div className="bg-[#dcefdc] rounded-3xl overflow-hidden">

      <div className="grid md:grid-cols-2">

        <div className="p-10 flex flex-col justify-center">

          <h1 className="text-5xl font-bold text-black">
            Chào mừng bạn đến với
            <br />
            11TIN ₍^. .^₎⟆
          </h1>

          <p className="mt-5 text-gray-700 text-xl">
            Nơi tâm hồn thư thái
            <br />
            Thư giãn - Kết nối - Thấu hiểu
          </p>

        </div>

        <img
          src="https://anhdephd.vn/wp-content/uploads/2022/06/hinh-anh-dong-de-thuong.gif"
          className="w-full h-full object-cover"
        />

      </div>

    </div>
  );
}