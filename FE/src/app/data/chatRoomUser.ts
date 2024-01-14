import axios from "axios";

export const ChatRoomUserData = async (
  room_id: number,
  accessToken: string
) => {
  try {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/room/${room_id}/user`
    );
    const userdata = response.data;
    console.log("프로필을 성공적으로 가져왔습니다.");
    return userdata;
  } catch (error) {
    console.error("프로필을 가져오는데 실패하였습니다.", error);
    return null;
  }
};
