"use client";
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useCookies } from "next-client-cookies";
import ChatFriendList from "./ChatFriendList";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onChatroomCreated: () => void;
};

export default function ChatRoomInviteModal({
  isOpen,
  onClose,
  onChatroomCreated,
}: ModalProps) {
  const [friendsData, setFriendsData] = useState<any>([]);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/friend/me`)
      .then((response) => {
        setFriendsData(response.data.data.rows);
      })
      .catch((error) => {
        console.error("친구 목록을 불러오는 중 에러가 발생했습니다.", error);
      });
  }, [accessToken]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <div className="flex justify-end w-full">
          <button className="font-bold" onClick={onClose}>
            X
          </button>
        </div>

        <div className="font-bold text-gray-400">대화상대 선택</div>
        <ChatFriendList
          friends={friendsData}
          onClose={onClose}
          onChatroomCreated={onChatroomCreated}
        />
      </div>
    </div>
  );
}
