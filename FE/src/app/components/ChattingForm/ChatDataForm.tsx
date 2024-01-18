"use client";
import { UserData } from "@/app/data/user";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { Socket, io } from "socket.io-client";

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
  roomId: number | null | undefined;
};

interface IMessage {
  chat_id: number;
  room_id: number;
  user_id: number;
  message: string;
  not_read_userCnt: number;
  createAt: string;
}

interface readChat {
  last_chat_id: string;
  recent_chat_id: string;
}

export default function ChatDataForm({ data, userdata, roomId }: Props) {
  const { payload } = UserData();
  const login_user_id = payload ? payload.user_id : null;
  const socket = useRef<Socket | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const messageContainerRef = useRef<HTMLDivElement | null>(null); //화면 하단 고정을 위한 변수
  const [test, setTest] = useState<readChat>();

  useEffect(() => {
    if (messageContainerRef.current) {
      //화면 하단 고정 함수
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
    socket.current = io(process.env.NEXT_PUBLIC_SERVER_URL as string, {
      path: "/socket.io",
    });

    socket.current.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.current?.id);
      socket.current?.emit("join", { room_id: roomId });

      const onMessageReceived = (receivedMessage: IMessage) => {
        console.log("Received message:", receivedMessage);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      };
      socket.current?.on("send", onMessageReceived);

      const readData = {
        room_id: roomId,
        user_id: userdata[0]?.user_id,
        recent_chat_id: combinedMessages.at(-1)?.chat_id, // 가장 최근 메시지 chat_id
      };

      socket.current?.emit("read", readData);

      socket.current?.on("readchat", (receivedReadChatID: any) => {
        console.log(receivedReadChatID);
      });
    });

    return () => {
      socket.current?.off("send", onMessageReceived);
      socket.current?.disconnect();
    };
  }, [roomId]);

  const sortedData = data.sort((a, b) => a.chat_id - b.chat_id); //데이터 chat_id순으로 정렬
  const combinedMessages = [...sortedData, ...messages];

  const handleSendMessage = () => {
    if (inputMessage && socket.current) {
      socket.current.emit("message", {
        room_id: roomId,
        user_id: login_user_id,
        message: inputMessage,
      });
      setInputMessage("");
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-grow overflow-y-auto p-3 space-y-2"
        ref={messageContainerRef}
      >
        {combinedMessages.map((messageData, index) => (
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
                <div>
                  <p className="text-gray-500 ml-2 text-[13px]">
                    {dayjs(messageData.createdAt)
                      .format("A HH:mm")
                      .replace("AM", "오전")
                      .replace("PM", "오후")}
                  </p>
                </div>
              </div>
            )}
            {messageData.user_id === login_user_id && (
              <div className="flex items-center">
                <div>
                  <p className="text-gray-500 ml-2 text-[13px] mr-2">
                    {dayjs(messageData.createdAt)
                      .format("A HH:mm")
                      .replace("AM", "오전")
                      .replace("PM", "오후")}
                  </p>
                </div>
                <div
                  className={`rounded-lg px-4 py-2 text-sm bg-[#4b7bec] text-white`}
                >
                  {messageData.message}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex p-3 border-t border-gray-200">
        <input
          type="text"
          placeholder="메시지 입력..."
          value={inputMessage}
          onChange={handleMessageChange}
          className="flex-grow rounded-full border-gray-300 px-4 py-2 mr-2 focus:outline-none"
        />
        <button
          className="bg-blue-500 text-white rounded-full px-6 py-2"
          onClick={handleSendMessage} // 추가됨
        >
          보내기
        </button>
      </div>
    </div>
  );
}
function onMessageReceived(...args: any[]): void {
  throw new Error("Function not implemented.");
}
