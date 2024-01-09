import axios from "axios";
import React, { useState, ChangeEvent } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ isOpen, onClose }: ModalProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUserName] = useState<string>("");

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  const handleUserNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.currentTarget.value);
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/signup`,
        {
          email,
          password,
          username,
        }
      );
      console.log(response);

      if (response.status === 200) {
        console.log("회원가입 성공");
        onClose();
      } else {
        console.error("회원 실패 - 서버 응답이 200이 아님");
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원가입 실패", error);
      alert("서버에러");
    }
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
            <h2 className="text-lg font-semibold">회원가입</h2>
            <button className="text-red-500 text-2xl" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="mb-4">
            <div className="form-group mb-4">
              <label className="block text-sm font-medium text-gray-600">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
            <div className="form-group mb-4">
              <label className="block text-sm font-medium text-gray-600">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
          </div>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-600">
              이름
            </label>
            <input
              value={username}
              onChange={handleUserNameChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSignup}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
