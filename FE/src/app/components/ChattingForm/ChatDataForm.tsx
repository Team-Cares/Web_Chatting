"use client";
import { UserData } from "@/app/data/user";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

type Props = {
  data: [
    {
      chat_id: number;
      createdAt: string;
      message: string;
      not_read_userCnt: number;
      user_id: number;
    }
  ];
  userdata: [
    { user_id: number; username: string; profileImgUrl: string | null }
  ];
  roomId: number | null | undefined;
  socket: Socket | null;
  updateLatestMessage: (message: {
    room_id: number;
    user_id: number;
    message: string;
  }) => void;
};

interface IMessage {
  chat_id: number;
  room_id?: number;
  user_id: number;
  message: string;
  not_read_userCnt: number;
  createdAt: string; // 필드 이름 수정
}

interface readChat {
  last_chat_id: string;
  recent_chat_id: string;
}

export default function ChatDataForm({
  data,
  userdata,
  roomId,
  socket,
  updateLatestMessage,
}: Props) {
  const { payload } = UserData();
  const login_user_id = payload ? payload.user_id : null;
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<IMessage>();
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [readCnt, setReadCnt] = useState<readChat>();
  const [combinedMessages, setCombinedMessages] = useState<IMessage[]>([]);

  const onReadChat = (receivedReadChatID: readChat) => {
    console.log("readchat", receivedReadChatID);
    setReadCnt(receivedReadChatID);
  };

  useEffect(() => {
    setMessages(undefined);
    setCombinedMessages([]);
  }, [roomId]);

  useEffect(() => {
    const readData = {
      room_id: roomId,
      user_id: login_user_id,
      recent_chat_id: data.at(-1)?.chat_id,
    };
    socket?.emit("read", readData);

    socket?.on("readchat", onReadChat);

    console.log("현재 룸아이디", roomId);

    return () => {
      socket?.off("readchat", onReadChat);
      // socket?.off("read", readData);
    };
  }, [combinedMessages]);

  useEffect(() => {
    const onMessageReceived = (receivedMessage: IMessage) => {
      if (receivedMessage.room_id === roomId) {
        setMessages(receivedMessage);
        setCombinedMessages((prevMessages) => [
          ...prevMessages,
          receivedMessage,
        ]);
        const readData = {
          room_id: roomId,
          user_id: login_user_id,
          recent_chat_id: receivedMessage.chat_id,
        };
        socket?.emit("read", readData);
      }
    };

    socket?.on("send", onMessageReceived);

    return () => {
      socket?.off("send", onMessageReceived);
    };
  }, [socket]);

  useEffect(() => {
    if (readCnt) {
      const updatedMessages = combinedMessages.map((message) => {
        if (
          message.chat_id > parseInt(readCnt.last_chat_id) &&
          message.chat_id <= parseInt(readCnt.recent_chat_id)
        ) {
          return {
            ...message,
            not_read_userCnt: Math.max(0, message.not_read_userCnt - 1),
          };
        }
        return message;
      });
      setCombinedMessages(updatedMessages);
    }
  }, [readCnt]);

  useEffect(() => {
    const sortedData = data.sort((a, b) => a.chat_id - b.chat_id); // 데이터 chat_id순으로 정렬
    setCombinedMessages([...sortedData]); // combinedMessages 업데이트
  }, [data]);

  useEffect(() => {
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    // setMessages([]);
  }, [roomId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (
      inputMessage &&
      socket &&
      roomId !== null &&
      roomId !== undefined &&
      login_user_id !== null
    ) {
      const newMessage = {
        room_id: roomId,
        user_id: login_user_id,
        message: inputMessage,
      };
      socket?.emit("message", newMessage);
      updateLatestMessage(newMessage);
      setInputMessage("");
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  dayjs.locale("ko");
  const isSameDay = (date1: string, date2: string) => {
    return (
      dayjs(date1).format("YYYY-MM-DD") === dayjs(date2).format("YYYY-MM-DD")
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-3 space-y-2 scrollbarCustom">
        {combinedMessages.map((messageData, index) => {
          const showDateLine =
            index === 0 ||
            !isSameDay(
              messageData.createdAt,
              combinedMessages[index - 1]?.createdAt
            );

          return (
            <React.Fragment key={index}>
              {showDateLine && (
                <div className="flex items-center justify-center my-2">
                  <div className="flex-1 border-t border-gray-400"></div>
                  <p className="mx-2 text-center sm:text-xs">
                    {dayjs(messageData.createdAt).format(
                      "YYYY년 MM월 DD일 dddd"
                    )}
                  </p>
                  <div className="flex-1 border-t border-gray-400"></div>
                </div>
              )}
              <div
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
                          <div className="bg-[#a6c0a4] rounded-full flex justify-center items-center text-xl w-12 h-12">
                            사진있을때
                          </div>
                        ) : (
                          <div className="flex justify-center items-center">
                            <img
                              src="/Friend_profile2.png"
                              className="w-12 h-12 rounded-full sm:w-10 sm:h-10"
                            />
                          </div>
                        )
                      ) : (
                        "로딩 중..."
                      )}
                      <div className="text-xs text-gray-500 mt-2 sm:text-[10px]">
                        {userdata && Array.isArray(userdata)
                          ? userdata.find(
                              (user) => user.user_id === messageData.user_id
                            )?.username || "알 수 없음"
                          : "로딩 중..."}
                      </div>
                    </div>
                    <div
                      className={`rounded-lg px-4 py-2 text-sm ${"bg-white"} sm:text-xs`}
                    >
                      {messageData.message}
                    </div>
                    <div className="flex-col items-center">
                      {messageData.not_read_userCnt === 0 ? (
                        ""
                      ) : (
                        <div className="text-yellow-400 font-bold text-sm ml-1">
                          {messageData.not_read_userCnt}
                        </div>
                      )}
                      <div>
                        <p className="text-gray-500 ml-2 text-[13px] sm:text-xs">
                          {dayjs(messageData.createdAt)
                            .format("A HH:mm")
                            .replace("AM", "오전")
                            .replace("PM", "오후")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {messageData.user_id === login_user_id && (
                  <div className="flex items-center">
                    <div className="flex-col items-center">
                      <div className="text-yellow-400 font-bold text-sm text-right mr-1">
                        {messageData.not_read_userCnt === 0 ? (
                          ""
                        ) : (
                          <div className="text-yellow-400 font-bold text-sm mr-1 text-right">
                            {messageData.not_read_userCnt}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-gray-500 ml-2 text-[13px] mr-2 sm:text-xs">
                          {dayjs(messageData.createdAt)
                            .format("A HH:mm")
                            .replace("AM", "오전")
                            .replace("PM", "오후")}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div
                        className={`rounded-lg px-4 py-2 text-sm bg-[#4b7bec] text-white sm:text-xs`}
                      >
                        {messageData.message}
                      </div>
                      <div ref={messageEndRef}></div>
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div className="flex p-3 border-t border-gray-200 sm:h-16">
        <input
          type="text"
          placeholder="메시지 입력..."
          value={inputMessage}
          onChange={handleMessageChange}
          className="flex-grow rounded-full border-gray-300 px-4 py-2 mr-2 focus:outline-none"
        />
        <button
          className="bg-blue-500 text-white rounded-full px-6 py-2 sm:text-[10px] sm:px-2"
          onClick={handleSendMessage}
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
