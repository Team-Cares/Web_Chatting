"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isDisabled = !email.includes("@") || password.length < 4;
  const btnState = isDisabled ? "white" : "orange";
  const router = useRouter();

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEmail(event.currentTarget.value);
  };

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPassword(event.currentTarget.value);
  };

  const handleSignin = async (): Promise<void> => {
    if (!email.includes("@") || password.length < 4) {
    }
    try {
      const response = await axios.post("url", {
        email,
        password,
      });

      const accessToken = response.data.accessToken;
      localStorage.setItem("accessToken", accessToken);

      router.push("/");
      console.log("로그인성공");
    } catch (error) {
      alert("이메일 혹은 비밀번호가 다릅니다.");
    }
    return;
  };
  return (
    <main className="w-full h-full">
      <div className="w-full h-full inline-flex flex-col justify-center items-center">
        <div className="text-3xl font-bold p-4 mb-12">LOGIN</div>
        <div className="inline-flex flex-col w-[400px] mb-12">
          <div className="flex justify-between p-4">
            <label className="text-xl font-semibold">ID</label>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="flex justify-between p-4">
            <label className="text-xl font-semibold">Password</label>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={handleSignin}
              className="bg-orange-400 w-full font-bold"
            >
              로그인
            </button>
          </div>
          <div className="flex justify-end mt-4">
            <p className="font-bold text-gray-500">회원가입</p>
          </div>
        </div>
      </div>
    </main>
  );
}
