"use client";

import { useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import { useCookies } from "next-client-cookies";
import FriendList from "./FriendList";
import axios from "axios";
import Topbar from "./Topbar";
import Recommend from "./Recommend";
import { UserData } from "../data/user";

export default function User() {
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  const [friendsData, setFriendsData] = useState<any>([]);
  const [searchedFriends, setSearchedFriends] = useState<any>([]);
  const [triggerRender, setTriggerRender] = useState(false);

  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/me`)
      .then((response) => {
        setUserData(response.data.data);
      })
      .catch((error) => {
        console.error("사용자 정보를 불러오는 중 에러가 발생했습니다.", error);
      });

    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/friend/me`)
      .then((response) => {
        setFriendsData(response.data.data.rows);
      })
      .catch((error) => {
        console.error("친구 목록을 불러오는 중 에러가 발생했습니다.", error);
      });
  }, [accessToken, triggerRender]);

  const handleSearch = (query: string) => {
    const filteredFriends = friendsData.filter((friend: any) =>
      friend.friend_name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedFriends(filteredFriends);
  };

  const handleFriendAdded = () => {
    setTriggerRender((prev) => !prev);
  };

  console.log(userData);

  return (
    <div className="bg-gray-200 p-4 shadow-md w-full h-full pl-8">
      <Topbar onSearch={handleSearch} onFriendAdded={handleFriendAdded} />
      <div className="flex items-center mb-2">
        <div className="bg-blue-300 w-12 h-12 rounded-full mr-2 flex justify-center items-center text-xl">
          <FaUserAlt />
        </div>
        <div className="ml-4">
          <p className="font-semibold">{userData?.username}</p>
          <p className="text-gray-500">{userData?.email}</p>
        </div>
      </div>
      <Recommend />
      {searchedFriends.length > 0 ? (
        <FriendList key={triggerRender} friends={searchedFriends} />
      ) : (
        <FriendList key={triggerRender} friends={friendsData} />
      )}
    </div>
  );
}
