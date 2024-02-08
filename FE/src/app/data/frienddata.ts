export type FriendData = {
  User: {
    backgroundImgUrl: string | null;
    email: string;
    introduce: string | null;
    profileImgUrl: string | null;
  };
  friend_id: number;
  friend_name: string;
};

export type FriendModalData = {
  friend: {
    User: {
      backgroundImgUrl: string | null;
      email: string;
      introduce: string | null;
      profileImgUrl: string | null;
    };
    friend_id: number;
    friend_name: string;
  };

  onClose: () => void;
};
