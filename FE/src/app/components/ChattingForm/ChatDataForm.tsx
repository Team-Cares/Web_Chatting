"use client";
import { UserData } from "@/app/data/user";
import React from "react";
import { FaUserAlt } from "react-icons/fa";

type Props = {
  data: [
    {
      chat_id: number;
      createdAt: string;
      message: string;
      npt_read_userCnt: number;
      user_id: number;
    }
  ];
  userdata: [
    { user_id: number; username: string; profileImgUrl: string | null }
  ];
};

export default function ChatDataForm({ data, userdata }: Props) {
  const { payload } = UserData();
  const login_user_id = payload ? payload.user_id : null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-3 space-y-2">
        {data.map((messageData, index) => (
          <div
            key={index}
            className={`flex ${
              messageData.user_id === login_user_id
                ? "justify-end"
                : "items-center"
            } p-2`}
          >
            {messageData.user_id !== login_user_id && (
              <div className="flex items-center mr-2">
                <div className="flex flex-col mr-2 items-center">
                  {userdata && Array.isArray(userdata) ? (
                    userdata.find(
                      (user) => user.user_id === messageData.user_id
                    )?.profileImgUrl ? (
                      //   <img
                      //     src={
                      //       userdata.find(
                      //         (user) => user.user_id === messageData.user_id
                      //       )?.profileImgUrl
                      //     }
                      //     alt="프로필"
                      //     className="rounded-full w-12 h-12 object-cover"
                      //   />
                      <div className="bg-[#ffeaa7] rounded-full flex justify-center items-center text-xl w-12 h-12">
                        사진있을때
                      </div>
                    ) : (
                      <div className="bg-[#ffeaa7] rounded-full flex justify-center items-center text-xl w-12 h-12">
                        <FaUserAlt />
                      </div>
                    )
                  ) : (
                    "로딩 중..."
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    {userdata && Array.isArray(userdata)
                      ? userdata.find(
                          (user) => user.user_id === messageData.user_id
                        )?.username || "알 수 없음"
                      : "로딩 중..."}
                  </div>
                </div>
                <div className={`rounded-lg px-4 py-2 text-sm ${"bg-white"}`}>
                  {messageData.message}
                </div>
              </div>
            )}
            {messageData.user_id === login_user_id && (
              <div
                className={`rounded-lg px-4 py-2 text-sm bg-[#4b7bec] text-white`}
              >
                {messageData.message}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex p-3 border-t border-gray-200">
        <input
          type="text"
          placeholder="메시지 입력..."
          className="flex-grow rounded-full border-gray-300 px-4 py-2 mr-2 focus:outline-none"
        />
        <button className="bg-blue-500 text-white rounded-full px-6 py-2">
          보내기
        </button>
      </div>
    </div>
  );
}
