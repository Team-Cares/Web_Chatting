"use client";

import { useCallback, useState } from "react";
import FriendModal from "./FriendModal";
import { FriendData } from "../../data/frienddata";

export default function FriendList(friends: any) {
  const [selectedFriend, setSelectedFriend] = useState<FriendData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const data = friends.friends;

  const handleFriendClick = useCallback((friend: FriendData) => {
    setSelectedFriend(friend);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedFriend(null);
    setIsModalOpen(false);
  }, []);

  return (
    <div className="mt-8">
      <div>
        <h2 className="text-md font-semibold mb-4 text-gray-500">{`친구 ${data.length}`}</h2>
      </div>
      {data?.map((friend: FriendData) => (
        <div
          key={friend.friend_id}
          className="flex items-center mb-6"
          onClick={() => {
            handleFriendClick(friend);
          }}
        >
          {friend?.User.profileImgUrl === null ? (
            <div className="rounded-full mr-2 flex justify-center items-center">
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
          <div className="ml-4">
            <p className="font-semibold">{friend.friend_name}</p>
            <p className="text-gray-500">{friend.User.email}</p>
          </div>
        </div>
      ))}
      {isModalOpen && selectedFriend && (
        <FriendModal friend={selectedFriend} onClose={handleModalClose} />
      )}
    </div>
  );
}
