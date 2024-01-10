"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "next-client-cookies";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFriendAdded: any;
}

export default function RecommendFriend({
  isOpen,
  onClose,
  onFriendAdded,
}: ModalProps) {
  const [search, setSearch] = useState<string>("ID");
  const [email, setEmail] = useState<string>("");
  const [id, setId] = useState<string>("");
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }, [accessToken]);

  const friendIdAdd = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/friend/${id}`
      );
      const newFriend = response.data;
      console.log("id로 친구추가 성공", response.data);
      onFriendAdded(newFriend);
    } catch (error) {
      console.error("id로 친구추가 실패", error);
    }
    onClose();
  };

  const friendEmailAdd = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/friend`,
        {
          email,
        }
      );
      const newFriend = response.data;
      console.log("이메일로 친구추가 성공", response.data);
      onFriendAdded(newFriend);
    } catch (error) {
      console.error("이메일로 친구추가 실패", error);
    }
    onClose();
  };

  const handleSearchId = () => {
    setSearch("ID");
  };

  const handleSearchUsername = () => {
    setSearch("Email");
  };

  const handleId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className={`fixed inset-0 ${isOpen ? "" : "hidden"}`}>
      <div
        className="fixed inset-0 bg-black opacity-30"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex justify-center items-center">
        <div className="bg-white w-[500px] p-6 rounded-md">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-lg font-semibold">친구 추가</h2>
            <button className="text-red-500 text-2xl" onClick={onClose}>
              &times;
            </button>
          </div>
          {search === "ID" ? (
            <div className="flex items-center justify-around border-b pb-4 mb-4">
              <div
                className="font-bold bg-gray-200 py-2 px-4"
                onClick={handleSearchId}
              >
                ID로 검색
              </div>
              <div
                className="font-bold py-2 px-4"
                onClick={handleSearchUsername}
              >
                이메일로 검색
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-around border-b pb-4 mb-4">
              <div className="font-bold py-2 px-4" onClick={handleSearchId}>
                ID로 검색
              </div>
              <div
                className="font-bold bg-gray-200 py-2 px-4"
                onClick={handleSearchUsername}
              >
                이메일로 검색
              </div>
            </div>
          )}

          <div className="mb-4">
            {search === "ID" ? (
              <div className="form-group mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  ID
                </label>
                <input
                  type="email"
                  value={id}
                  className="mt-1 p-2 w-full border rounded-md"
                  onChange={handleId}
                />
              </div>
            ) : (
              <div className="form-group mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  className="mt-1 p-2 w-full border rounded-md"
                  onChange={handleEmail}
                />
              </div>
            )}

            <div className="flex justify-end">
              {search === "ID" && (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  onClick={friendIdAdd}
                >
                  친구추가
                </button>
              )}
              {search === "Email" && (
                <button
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  onClick={friendEmailAdd}
                >
                  친구추가
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
