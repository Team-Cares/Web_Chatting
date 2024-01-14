export type ChatList = {
  room_id: number;
  room_title: string | null;
  not_read_messageCnt: number | null;
  last_read_messageId: string | null;
  updatedAt: string;
  Room: {
    room_id: number;
    title: string;
    last_message: string | null;
    Participants: [
      {
        user_id: number;
        User: {
          profileImgUrl: string | null;
        };
      }
    ];
  };
};
