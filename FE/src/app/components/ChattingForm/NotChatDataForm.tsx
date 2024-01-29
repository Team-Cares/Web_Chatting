import React from "react";

export default function NotChatDataForm() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="text-center p-10 bg-white rounded-lg shadow-xl sm:w-64 md:w-96">
        <p className="font-bold text-3xl mb-4 sm:text-lg md:text-2xl">
          채팅 데이터가 존재하지 않습니다 😅
        </p>
        <img
          src="/notdata2.png"
          alt="Chat Icon"
          className="mx-auto w-24 h-24 mb-4"
        />
        <p className="text-gray-600">채팅방을 선택하세요</p>
      </div>
    </div>
  );
}
