"use client";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChattingList from "../components/chat/ChattingList";
import ChatRoom from "../chatroom/page";

export default function Chat() {
  const [selectedRoomId, setSelectedRoomId] = useState(0);
  return (
    <div className="flex w-full h-full">
      <Sidebar />
      <ChattingList onRoomSelect={setSelectedRoomId} />
      <ChatRoom roomId={selectedRoomId} />
    </div>
  );
}
