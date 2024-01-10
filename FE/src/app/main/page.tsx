import React from "react";
import Sidebar from "../components/Sidebar";
import FriendList from "../components/FriendList";
import User from "../components/User";

export default function Main() {
  return (
    <div className="flex w-full h-full">
      <Sidebar />
      <User />
    </div>
  );
}
