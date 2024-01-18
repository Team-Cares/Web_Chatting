import React from "react";
import Sidebar from "../components/Sidebar";
import FriendList from "../components/main/FriendList";
import User from "../components/main/User";

export default function Main() {
  return (
    <div className="flex w-full h-full">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-[#EEE7DA]">
        <User />
      </div>
    </div>
  );
}
