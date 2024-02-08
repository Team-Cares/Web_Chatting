import React from "react";
import { FriendModalData } from "../../data/frienddata";

export default function FriendModal({ friend, onClose }: FriendModalData) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md w-96">
        <div className="flex flex-col items-center">
          {friend.User.profileImgUrl ? (
            <img
              src={friend.User.profileImgUrl}
              alt={friend.friend_name}
              className="w-20 h-20 rounded-full mb-4"
            />
          ) : (
            <div className="mb-4 flex justify-center items-center">
              <img
                src="/Friend_profile2.png"
                className="w-20 h-20 rounded-full"
              />
            </div>
          )}

          <h2 className="text-lg font-semibold mb-2">{friend.friend_name}</h2>

          <p className="text-gray-500">{friend.User.email}</p>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
