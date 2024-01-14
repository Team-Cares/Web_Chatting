import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { FaUserAlt } from "react-icons/fa";
import { recommendFriendData } from "../../data/recommend";

export default function Recommend() {
  const [recommendFriendsData, setRecommendFriendsData] = useState<
    recommendFriendData[]
  >([]);
  const [recommendFriendsDataView, setRecommendFriendsDataView] =
    useState<boolean>(false);
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/friend/recommend`)
      .then((response) => {
        setRecommendFriendsData(response.data.data.rows);
      })
      .catch((error) => {
        console.error("데이터를 불러오는 중 에러가 발생했습니다.", error);
      });
  }, [accessToken]);

  const handleRecommendFriendView = () => {
    setRecommendFriendsDataView((view) => !view);
  };

  return (
    <div className="mt-4">
      <div
        className="text-md font-semibold mb-4 text-gray-500"
        onClick={handleRecommendFriendView}
      >{`추천 친구 ${recommendFriendsData.length}`}</div>
      {recommendFriendsDataView && (
        <div>
          {recommendFriendsData.map((friend: recommendFriendData) => (
            <div key={friend.user_id} className="flex items-center mb-6">
              {friend.profileImgUrl === null ? (
                <div className="bg-blue-300 w-12 h-12 rounded-full mr-2 flex justify-center items-center text-xl">
                  <FaUserAlt />
                </div>
              ) : (
                <div className="bg-blue-500 w-12 h-12 rounded-full mr-2 flex justify-center items-center text-sm">
                  사진
                </div>
              )}
              <div className="ml-4">
                <p className="font-semibold">{friend.username}</p>
                <p className="text-gray-500">{friend.introduce}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
