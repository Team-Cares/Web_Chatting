"use client";
import React, { useEffect, useState } from "react";
import { useChatRoomData } from "../data/useChatRoomData";
import ChatDataForm from "../components/ChattingForm/ChatDataForm";
import NotChatDataForm from "../components/ChattingForm/NotChatDataForm";
import { ChatRoomUserData } from "../data/chatRoomUser";
import { useCookies } from "next-client-cookies";
import { Socket } from "socket.io-client";

type ChatRoomProps = {
  roomId: number | undefined;
  socket: Socket | null;
  updateLatestMessage: (message: {
    room_id: number;
    user_id: number;
    message: string;
  }) => void;
  className: string;
};
const ChatRoom = ({
  roomId,
  socket,
  updateLatestMessage,
  className,
}: ChatRoomProps) => {
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  const { data, setRoomId } = useChatRoomData(roomId);
  const [userdata, setUserdata] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (roomId) {
        setRoomId(roomId);
        try {
          if (accessToken) {
            const userinfo = await ChatRoomUserData(roomId, accessToken);
            setUserdata(userinfo.data);
          }
        } catch (error) {
          console.error(
            "사용자 데이터를 가져오는 중 에러가 발생했습니다:",
            error
          );
        }
      }
    };

    fetchUserData();
  }, [roomId, setRoomId, accessToken]);

  useEffect(() => {
    if (roomId && socket) {
      const onMessageReceived = (receivedMessage: any) => {
        if (receivedMessage.room_id === roomId) {
        }
      };
      socket.on("message", onMessageReceived);

      return () => {
        socket.off("message", onMessageReceived);
      };
    }
  }, [roomId, socket]);

  return (
    <div className={`bg-[#f7f5ed] w-[60%] h-full ${className} sm:bg-[#f3f7ed]`}>
      {data && userdata ? (
        <ChatDataForm
          data={data}
          userdata={userdata}
          roomId={roomId}
          socket={socket}
          updateLatestMessage={updateLatestMessage}
        />
      ) : (
        <NotChatDataForm />
      )}
    </div>
  );
};

export default ChatRoom;
