"use client";
import React, { useState, useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";
import Sidebar from "../components/Sidebar";
import ChattingList from "../components/chat/ChattingList";
import ChatRoom from "../chatroom/page";

export default function Chat() {
  const [selectedRoomId, setSelectedRoomId] = useState(0);
  const [latestMessage, setLatestMessage] = useState<{
    room_id: number;
    user_id: number;
    message: string;
  } | null>(null);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    // 소켓 연결 초기화
    socket.current = io(process.env.NEXT_PUBLIC_SERVER_URL as string, {
      path: "/socket.io",
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedRoomId !== 0 && socket.current) {
      socket.current.emit("join", { room_id: selectedRoomId });
      console.log("socket connect!!");
    }
  }, [selectedRoomId]);

  const updateLatestMessage = (message: {
    room_id: number;
    user_id: number;
    message: string;
  }) => {
    setLatestMessage(message);
  };

  return (
    <div className="flex w-full h-full">
      <Sidebar />
      <ChattingList
        onRoomSelect={setSelectedRoomId}
        latestMessage={latestMessage}
        socket={socket.current}
      />
      <ChatRoom
        roomId={selectedRoomId}
        socket={socket.current}
        updateLatestMessage={updateLatestMessage}
      />
    </div>
  );
}
