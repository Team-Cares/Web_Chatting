import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { recommendFriendData } from "../../data/recommend";

type data = {
  introduce: string | null;
  profileImgUrl: string | null;
  user_id: number;
  username: string;
};

interface RecommendProps {
  onRefreshFriendsList: () => void;
}

export default function Recommend({ onRefreshFriendsList }: RecommendProps) {
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

  const handleRecommendFriendData = async (data: data) => {
    const userId = data.user_id;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/friend/${userId}`
      );
      console.log("id로 추천친구추가 성공", response.data);
      //추천친구 추가후 배열 필터링후 추가한 친구 제거 로직
      setRecommendFriendsData((currentFriends) =>
        currentFriends.filter((friend) => friend.user_id !== userId)
      );
      onRefreshFriendsList();
    } catch (error) {
      console.error("id로 추천친구추가 실패", error);
    }
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
            <div
              key={friend.user_id}
              className="flex items-center justify-between mb-6"
            >
              <div className="flex items-center">
                {friend.profileImgUrl === null ? (
                  <div className="mr-2 flex justify-center items-center">
                    <img
                      src="/Recommend_profile.png"
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                ) : (
                  <div className="bg-blue-200 w-12 h-12 rounded-full mr-2 flex justify-center items-center text-sm">
                    사진
                  </div>
                )}
                <div className="ml-4">
                  <p className="font-semibold">{friend.username}</p>
                  <p className="text-gray-500">{friend.introduce}</p>
                </div>
              </div>
              <div>
                <button onClick={(frined) => handleRecommendFriendData(friend)}>
                  <MdOutlineAddCircleOutline className="text-3xl hover:text-[#88AB8E]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
