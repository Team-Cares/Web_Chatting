"use client";

import { useState, useEffect } from "react";
import { useCookies } from "next-client-cookies";
import { FaUserAlt } from "react-icons/fa";
import { FriendData } from "../../data/frienddata";
import axios from "axios";

type Props = {
  friends: any;
  onClose: () => void;
  onChatroomCreated: () => void;
};

export default function ChatFriendList({
  friends,
  onClose,
  onChatroomCreated,
}: Props) {
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  const [selectedFriends, setSelectedFriends] = useState<FriendData[]>([]);
  const [title, setTitle] = useState<string>("");
  const data = friends;

  const handleInviteButtonClick = () => {
    const selectedFriendsData = {
      title,
      members: selectedFriends.map((friend) => ({
        friend_id: friend.friend_id,
        friend_name: friend.friend_name,
      })),
    };

    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/room`,
        selectedFriendsData
      )
      .then((response) => {
        console.log("채팅방 초대 완료");
        onChatroomCreated();
        onClose();
      })
      .catch((error) => {
        console.error("채팅방 초대 중 에러가 발생했습니다.", error);
      });
  };

  const handleFriendClick = (friend: FriendData) => {
    // 친구 선택/해제 토글
    setSelectedFriends((prevSelectedFriends) => {
      const friendIndex = prevSelectedFriends.findIndex(
        (selectedFriend) => selectedFriend.friend_id === friend.friend_id
      );

      if (friendIndex === -1) {
        // 선택되지 않은 경우 선택 목록에 추가
        return [...prevSelectedFriends, friend];
      } else {
        // 이미 선택된 경우 선택 목록에서 제거
        const updatedSelectedFriends = [...prevSelectedFriends];
        updatedSelectedFriends.splice(friendIndex, 1);
        return updatedSelectedFriends;
      }
    });
  };

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <div className="p-2">
      <h2 className="text-md font-semibold mb-4 text-gray-500">{`친구 ${data.length}`}</h2>
      {data?.map((friend: FriendData) => (
        <div
          key={friend.friend_id}
          className="flex items-center mb-6 justify-between"
          onClick={() => handleFriendClick(friend)}
        >
          <div className="flex">
            {friend?.User.profileImgUrl === null ? (
              <div className="mr-2 flex justify-center items-center">
                <img
                  src="/Friend_profile2.png"
                  className="w-12 h-12 rounded-full"
                />
              </div>
            ) : (
              <div className="bg-blue-500 w-12 h-12 rounded-full mr-2 flex justify-center items-center text-sm">
                사진
              </div>
            )}
            <div className="ml-4">
              <p className="font-semibold">{friend.friend_name}</p>
              <p className="text-gray-500">{friend.User.email}</p>
            </div>
          </div>
          <button
            className={`border-2 border-solid border-black rounded-full w-3 h-3 hover:bg-emerald-400 ${
              selectedFriends.some(
                (selectedFriend) =>
                  selectedFriend.friend_id === friend.friend_id
              )
                ? "bg-emerald-400"
                : ""
            }`}
            onClick={(e) => {
              handleFriendClick(friend);
              e.stopPropagation();
            }}
          ></button>
        </div>
      ))}
      {selectedFriends.length > 1 && (
        <div className="flex justify-center w-full">
          <input
            type="text"
            placeholder="채팅방 제목을 입력해주세요..."
            className="border-2 border-solid border-dark-200 w-[300px] p-2"
            value={title}
            onChange={handleTitle}
          />
        </div>
      )}

      <div className="flex justify-end">
        <button
          className="bg-[#83A2FF] text-white font-bold p-2 rounded-lg hover:bg-[#7b9af8]"
          onClick={handleInviteButtonClick}
        >
          초대
        </button>
      </div>
    </div>
  );
}
