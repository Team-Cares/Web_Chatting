"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { FaUserAlt } from "react-icons/fa";
import dayjs from "dayjs";
import ChatTopbar from "./ChatTopbar";
import { ChatList } from "../../data/chatlist";

type Props = {
  onRoomSelect: (roomId: number) => void;
};

type chatData = {
  room_id: any;
  room_title?: string | null;
  not_read_messageCnt?: number | null;
  last_read_messageId?: string | null;
  updatedAt?: string;
  Room?: {
    room_id: number;
    title: string;
    last_message: string | null;
    Participants: [{ user_id: number; User: { profileImgUrl: string | null } }];
  };
};

export default function ChattingList({ onRoomSelect }: Props) {
  const [chattingListData, setChattingListData] = useState<ChatList[]>([]);
  const [chattingListLength, setChattingListLength] = useState<number>();
  const [searchedChat, setSearchedChat] = useState<any>([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/room/all/me?page=0&size=10 `
      )
      .then((response) => {
        setChattingListData(response.data.data.rows);
        setChattingListLength(response.data.data.count);
      })
      .catch((error) => {
        console.error("채팅방 정보를 불러오는 중 에러가 발생했습니다.", error);
      });
  }, [accessToken]);

  const handleChatroomCreated = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/room/all/me?page=0&size=10 `
      )
      .then((response) => {
        setChattingListData(response.data.data.rows);
        setChattingListLength(response.data.data.count);
      })
      .catch((error) => {
        console.error("채팅방 정보를 불러오는 중 에러가 발생했습니다.", error);
      });
  };

  const handleSearch = (query: string) => {
    const filteredChat = chattingListData.filter((chat: any) =>
      chat.room_title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedChat(filteredChat);
  };

  //room_id를 보내는 함수
  const handleChatItemClick = (chatdata: chatData) => {
    onRoomSelect(chatdata.room_id);
    setSelectedRoomId(chatdata.room_id);
  };

  return (
    <div className="bg-[#FFF8E3] p-4 shadow-md w-[40%] h-full pl-8">
      <ChatTopbar
        onSearch={handleSearch}
        onChatroomCreated={handleChatroomCreated}
      />
      <h2 className="text-md font-semibold mb-4 text-gray-500">{`채팅 ${chattingListLength}`}</h2>
      {searchedChat.length > 0 ? (
        <div>
          {searchedChat?.map((chatdata: any) => (
            <div
              key={chatdata.room_id}
              className={`flex items-center mb-6 ${
                selectedRoomId === chatdata.room_id ? "bg-[#AED6F1]" : ""
              }`}
              onClick={() => handleChatItemClick(chatdata)}
            >
              {chatdata.Room.Participants[0].User?.profileImgUrl === null ||
              undefined ? (
                <div className="bg-[#ffeaa7] w-12 h-12 rounded-full mr-2 flex justify-center items-center text-xl">
                  <FaUserAlt />
                </div>
              ) : (
                <div className="bg-[#ffeaa7] w-12 h-12 rounded-full mr-2 flex justify-center items-center text-sm">
                  사진
                </div>
              )}
              <div className="ml-4 flex-col justify-between w-full">
                <ul className="flex justify-between items-center">
                  <p className="font-semibold">{chatdata.room_title}</p>
                  <p className="text-gray-500">
                    {dayjs(chatdata.updatedAt).isSame(dayjs(), "day")
                      ? dayjs(chatdata.updatedAt).format("HH:mm")
                      : dayjs(chatdata.updatedAt).format("YYYY-MM-DD")}
                  </p>
                </ul>
                <ul className="flex justify-between items-center">
                  <p className="text-gray-500">{chatdata.Room.last_message}</p>
                  {chatdata.not_read_messageCnt === 0 ? (
                    ""
                  ) : (
                    <p className="bg-red-600 text-white font-bold rounded-full w-5 h-5 flex justify-center items-center">
                      {chatdata.not_read_messageCnt}
                    </p>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {chattingListData?.map((chatdata) => (
            <div
              key={chatdata.room_id}
              className={`flex items-center mb-6 ${
                selectedRoomId === chatdata.room_id ? "bg-blue-100" : ""
              }`}
              onClick={() => handleChatItemClick(chatdata)}
            >
              {chatdata.Room.Participants[0].User?.profileImgUrl === null ||
              undefined ? (
                <div className="bg-[#ffeaa7] w-12 h-12 rounded-full mr-2 flex justify-center items-center text-xl">
                  <FaUserAlt />
                </div>
              ) : (
                <div className="bg-[#ffeaa7] w-12 h-12 rounded-full mr-2 flex justify-center items-center text-sm">
                  사진
                </div>
              )}
              <div className="ml-4 flex-col justify-between w-full">
                <ul className="flex justify-between items-center">
                  <p className="font-semibold">{chatdata.room_title}</p>
                  <p className="text-gray-500">
                    {dayjs(chatdata.updatedAt).isSame(dayjs(), "day")
                      ? dayjs(chatdata.updatedAt).format("HH:mm")
                      : dayjs(chatdata.updatedAt).format("YYYY-MM-DD")}
                  </p>
                </ul>
                <ul className="flex justify-between items-center">
                  <p className="text-gray-500">{chatdata.Room.last_message}</p>
                  {chatdata.not_read_messageCnt === 0 ? (
                    ""
                  ) : (
                    <p className="bg-red-600 text-white font-bold rounded-full w-5 h-5 flex justify-center items-center">
                      {chatdata.not_read_messageCnt}
                    </p>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
