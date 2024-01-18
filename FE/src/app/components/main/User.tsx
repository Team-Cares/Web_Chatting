"use client";

import { useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import { useCookies } from "next-client-cookies";
import FriendList from "./FriendList";
import axios from "axios";
import Topbar from "./Topbar";
import Recommend from "./Recommend";
import { UserData } from "../../data/user";

const dummy = [
  {
    friend_id: 2,
    friend_name: "변경 테스트2",
    User: {
      email: "test1@test.com",
      profileImgUrl: null,
      backgroundImgUrl: null,
      introduce: null,
    },
  },
  {
    friend_id: 3,
    friend_name: "테스트2",
    User: {
      email: "test2@test.com",
      profileImgUrl: null,
      backgroundImgUrl: null,
      introduce: null,
    },
  },
  {
    friend_id: 4,
    friend_name: "테스트2",
    User: {
      email: "test2@test.com",
      profileImgUrl: null,
      backgroundImgUrl: null,
      introduce: null,
    },
  },
  {
    friend_id: 5,
    friend_name: "테스트2",
    User: {
      email: "test2@test.com",
      profileImgUrl: null,
      backgroundImgUrl: null,
      introduce: null,
    },
  },
  {
    friend_id: 6,
    friend_name: "테스트2",
    User: {
      email: "test2@test.com",
      profileImgUrl: null,
      backgroundImgUrl: null,
      introduce: null,
    },
  },
  {
    friend_id: 7,
    friend_name: "테스트2",
    User: {
      email: "test2@test.com",
      profileImgUrl: null,
      backgroundImgUrl: null,
      introduce: null,
    },
  },
  {
    friend_id: 8,
    friend_name: "테스트2",
    User: {
      email: "test2@test.com",
      profileImgUrl: null,
      backgroundImgUrl: null,
      introduce: null,
    },
  },
  {
    friend_id: 9,
    friend_name: "테스트2",
    User: {
      email: "test2@test.com",
      profileImgUrl: null,
      backgroundImgUrl: null,
      introduce: null,
    },
  },
  {
    friend_id: 10,
    friend_name: "테스트2",
    User: {
      email: "test2@test.com",
      profileImgUrl: null,
      backgroundImgUrl: null,
      introduce: null,
    },
  },
  {
    friend_id: 11,
    friend_name: "테스트2",
    User: {
      email: "test2@test.com",
      profileImgUrl: null,
      backgroundImgUrl: null,
      introduce: null,
    },
  },
  {
    friend_id: 12,
    friend_name: "테스트2",
    User: {
      email: "test2@test.com",
      profileImgUrl: null,
      backgroundImgUrl: null,
      introduce: null,
    },
  },
  {
    friend_id: 13,
    friend_name: "테스트2",
    User: {
      email: "test2@test.com",
      profileImgUrl: null,
      backgroundImgUrl: null,
      introduce: null,
    },
  },
  {
    friend_id: 14,
    friend_name: "테스트2",
    User: {
      email: "test2@test.com",
      profileImgUrl: null,
      backgroundImgUrl: null,
      introduce: null,
    },
  },
];

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

  return (
    <div className="bg-[#EEE7DA] p-4 w-full h-full pl-8">
      <Topbar onSearch={handleSearch} onFriendAdded={handleFriendAdded} />
      <div className="flex items-center mb-2">
        <div className="bg-[#AFC8AD] w-12 h-12 rounded-full mr-2 flex justify-center items-center text-xl">
          <FaUserAlt />
        </div>
        <div className="ml-4">
          <p className="font-semibold">{userData?.username}</p>
          <p className="text-gray-500">{userData?.email}</p>
        </div>
      </div>
      <Recommend />
      <div className="bg-[#EEE7DA] max-h-[600px] scrollbarHide">
        {searchedFriends.length > 0 ? (
          <FriendList key={triggerRender} friends={searchedFriends} />
        ) : (
          <FriendList key={triggerRender} friends={dummy} />
        )}
      </div>
    </div>
  );
}
