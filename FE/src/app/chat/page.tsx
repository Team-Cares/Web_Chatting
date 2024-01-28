"use client";
import React, { useState, useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";
import Sidebar from "../components/Sidebar";
import ChattingList from "../components/chat/ChattingList";
import ChatRoom from "../chatroom/page";
import { UserData } from "../data/user";

interface newMessage {
  room_id: number;
  user_id: number;
  message: string;
}

export default function Chat() {
  const { payload } = UserData();
  const login_user_id = payload ? payload.user_id : null;
  const [selectedRoomId, setSelectedRoomId] = useState(0);
  const [newMessage, setNewMessage] = useState<newMessage | null>(null);
  const [latestMessage, setLatestMessage] = useState<{
    room_id: number;
    user_id: number;
    message: string;
  } | null>(null);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_SERVER_URL as string, {
      path: "/socket.io",
    });

    if (socket.current) {
      socket.current.emit("socketId", { user_id: login_user_id });
    }

    return () => {
      if (socket.current) {
        console.log("연결이 끊겼습니다.");
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

  useEffect(() => {
    const onMessageReceived = (receivedMessage: {
      room_id: number;
      user_id: number;
      message: string;
    }) => setNewMessage(receivedMessage);

    socket.current?.on("newAlarm", onMessageReceived);

    return () => {
      socket.current?.off("newAlarm", onMessageReceived);
    };
  }, [socket.current]);

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
        loginUserId={login_user_id}
        latestNewMessage={newMessage}
      />
      <ChatRoom
        roomId={selectedRoomId}
        socket={socket.current}
        updateLatestMessage={updateLatestMessage}
      />
    </div>
  );
}
