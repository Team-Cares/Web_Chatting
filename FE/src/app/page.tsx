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
            <img src="/mainlogo.png" className="w-[350px] h-[400px]" />
          </div>
          <div className="font-bold text-3xl my-6">
            AI와 함께하는 모의 실시간 채팅 서비스
          </div>
          <button
            className="bg-orange-400 text-xl text-white w-72 h-12 rounded-md p-2 hover:bg-orange-500"
            onClick={handlelRouter}
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    </div>
  );
}
