"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handlelRouter = () => {
    router.push("/login");
  };
  return (
    <div className="w-full h-full">
      <div className="flex justify-center items-center w-full h-full">
        <div className="inline-flex flex-col justify-center items-center">
          <div>
            <img src="/mainlogo4.png" className="w-[400px] h-[450px]" />
          </div>
          <div className="font-bold text-3xl my-6">모의 실시간 채팅 서비스</div>
          <button
            className="bg-[#f7f1e8] text-xl text-gray-700 font-bold w-72 h-12 rounded-md p-2 hover:bg-[#f2ece2]"
            onClick={handlelRouter}
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    </div>
  );
}
