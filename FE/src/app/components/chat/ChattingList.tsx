"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import dayjs from "dayjs";
import ChatTopbar from "./ChatTopbar";
import { ChatList } from "../../data/chatlist";
import { Socket } from "socket.io-client";
import ContextMenu from "../chat/ContextMenu";

type Props = {
  onRoomSelect: (roomId: number) => void;
  latestMessage: {
    room_id: number;
    user_id: number;
    message: string;
  } | null;
  socket: Socket | null;
  latestNewMessage: {
    room_id: number;
    user_id: number;
    message: string;
  } | null;
  loginUserId: number | null;
  className: string;
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

type contextMenu = {
  mouseX: number;
  mouseY: number;
  roomId: number;
};

export default function ChattingList({
  onRoomSelect,
  latestMessage,
  socket,
  latestNewMessage,
  loginUserId,
  className,
}: Props) {
  const [chattingListData, setChattingListData] = useState<ChatList[]>([]);
  const [chattingListLength, setChattingListLength] = useState<number>();
  const [searchedChat, setSearchedChat] = useState<any>([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [contextMenu, setContextMenu] = useState<contextMenu | null>(null);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  //chattingListData의 값을 받아오는 useEffect
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

  useEffect(() => {
    if (latestMessage && latestMessage.room_id) {
      setChattingListData((prevData) =>
        prevData.map((chat) =>
          chat.room_id === latestMessage.room_id
            ? {
                ...chat,
                Room: { ...chat.Room, last_message: latestMessage.message },
              }
            : chat
        )
      );
    }
  }, [latestMessage]);

  // 현재 활성화된 채팅방의 not_read_messageCnt를 0으로 설정
  useEffect(() => {
    if (selectedRoomId !== null) {
      setChattingListData((prevData) =>
        prevData.map((chat) =>
          chat.room_id === selectedRoomId
            ? { ...chat, not_read_messageCnt: 0 }
            : chat
        )
      );
    }
  }, [selectedRoomId]);

  // 상대방 메시지 채팅방 목록 즉각 적용
  useEffect(() => {
    if (latestNewMessage) {
      setChattingListData((prevChattingListData) =>
        prevChattingListData.map((chat) =>
          chat.room_id === latestNewMessage.room_id
            ? {
                ...chat,
                Room: {
                  ...chat.Room,
                  last_message: latestNewMessage.message,
                },
                not_read_messageCnt:
                  selectedRoomId !== latestNewMessage.room_id &&
                  latestNewMessage.user_id !== loginUserId
                    ? (chat.not_read_messageCnt || 0) + 1
                    : chat.not_read_messageCnt,
              }
            : chat
        )
      );
    }
  }, [latestNewMessage]);
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
    if (selectedRoomId !== chatdata.room_id && selectedRoomId !== 0) {
      socket?.emit("leave", { room_id: selectedRoomId });
    }
    setSelectedRoomId(chatdata.room_id);

    setChattingListData((prevData) =>
      prevData.map((chat) =>
        chat.room_id === chatdata.room_id
          ? { ...chat, not_read_messageCnt: 0 }
          : chat
      )
    );
  };

  // 채팅방 나가기
  const handleChattingRoomLeave = async (roomId: number) => {
    if (roomId) {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/room/${selectedRoomId}`
        );
        console.log("채팅방 떠나기 성공", response);
        //삭제된 채팅방 필터링 함수
        setChattingListData((prevData) =>
          prevData.filter((chat) => chat.room_id !== selectedRoomId)
        );
      } catch (error) {
        console.error("채팅방 떠나기 실패", error);
      }
    }
  };

  // 컨텍스트 메뉴를 닫는 함수
  const closeContextMenu = () => {
    setContextMenu(null);
  };

  //우클릭 함수
  const handleRightClick = (event: React.MouseEvent, roomId: number) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            roomId,
          }
        : null
    );
  };

  console.log(chattingListData);
  return (
    <div
      className={`bg-[#f3f0e9] p-4 shadow-md w-[40%] h-full pl-8 ${className} overflow-auto`}
    >
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
                selectedRoomId === chatdata.room_id ? "bg-[#ebe7dc]" : ""
              }`}
              onClick={() => handleChatItemClick(chatdata)}
            >
              {chatdata.Room?.Participants[0]?.User?.profileImgUrl === null ||
              undefined ? (
                <div className="mr-2 flex justify-center items-center">
                  <img
                    src="/Friend_profile2.png"
                    className="w-12 h-12 rounded-full sm:w-10 sm:h-10"
                  />
                </div>
              ) : (
                <div className="bg-[#a6c0a4] w-12 h-12 rounded-full mr-2 flex justify-center items-center text-sm">
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
                    <p className="bg-red-600 text-white font-bold rounded-full w-6 h-6 flex justify-center items-center">
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
                selectedRoomId === chatdata.room_id ? "bg-[#ebe7dc]" : ""
              }`}
              onClick={() => {
                handleChatItemClick(chatdata);
              }}
              onContextMenu={(e) => handleRightClick(e, chatdata.room_id)}
            >
              {chatdata.Room.Participants[0].User?.profileImgUrl === null ||
              undefined ? (
                <div className="mr-2 flex justify-center items-center">
                  <img
                    src="/Friend_profile2.png"
                    className="w-12 h-12 rounded-full sm:w-10 sm:h-10"
                  />
                </div>
              ) : (
                <div className="bg-[#a6c0a4] w-12 h-12 rounded-full mr-2 flex justify-center items-center text-sm">
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
                  {chatdata.not_read_messageCnt &&
                  chatdata.not_read_messageCnt > 0 ? (
                    <p className="bg-red-600 text-white font-bold rounded-full w-6 h-6 flex justify-center items-center">
                      {chatdata.not_read_messageCnt}
                    </p>
                  ) : (
                    ""
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
      <ContextMenu
        contextMenu={contextMenu}
        onClose={closeContextMenu}
        onLeaveRoom={handleChattingRoomLeave}
      />
    </div>
  );
}
