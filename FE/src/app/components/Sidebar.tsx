"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaUserAlt } from "react-icons/fa";
import { IoChatbubble } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function Sidebar() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      cookies.remove("accessToken");
      cookies.remove("refreshToken");
      if (response.status === 200) {
        router.push("/login");
        console.log("로그아웃 성공");
      } else {
        console.error("로그아웃 실패 - 서버 응답이 200이 아님");
      }
    } catch (error) {
      console.error("로그아웃 실패", error);
      alert("서버에러");
    }
  };
  return (
    <div className="inline-flex flex-col justify-between items-center w-16 bg-gray-400">
      <ul className="mt-8">
        <div>
          <FaUserAlt className="mb-8 text-2xl hover:text-gray-700" />
        </div>
        <div>
          <IoChatbubble className="text-2xl hover:text-gray-700" />
        </div>
      </ul>
      <div className="mb-8 text-2xl hover:text-gray-700" onClick={handleLogout}>
        <LuLogOut />
      </div>
    </div>
  );
}