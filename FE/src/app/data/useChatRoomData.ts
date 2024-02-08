"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export const useChatRoomData = (initialRoomId: number | undefined) => {
  const [data, setData] = useState(null);
  const [roomId, setRoomId] = useState(initialRoomId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (roomId) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/room/${roomId}?page=0&size=40`
          );
          setData(response.data.data);
          console.log("채팅방 기록을 불러오는데 성공했습니다.");
        }
      } catch (error) {
        console.error("채팅방 기록을 불러오는 중 에러가 발생했습니다.", error);
      }
    };

    fetchData();
  }, [roomId]);

  return { data, setRoomId };
};
