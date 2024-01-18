"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setCookie } from "nookies";
import SignUpModal from "../components/login/SignUpModal";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const isDisabled = !email.includes("@") || password.length < 4;
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSignin = async () => {
    if (!email.includes("@")) {
      alert("이메일을 다시 확인해주세요.");
      return;
    }
    if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/g.test(password)) {
      alert("비밀번호가 틀립니다.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        const tokens = response.data.data;

        setCookie(null, "accessToken", tokens.accessToken, {
          path: "/",
        });

        setCookie(null, "refreshToken", tokens.refreshToken, {
          path: "/",
        });

        router.push("/main");
        console.log("로그인 성공");
      } else {
        console.error("로그인 실패 - 서버 응답이 200이 아님");
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("로그인 실패", error);
      alert("서버와의 연결에 실패하였습니다.");
    }
  };
  return (
    <main className="w-full h-full flex justify-center items-center">
      <div className="w-[50%] h-[60%] inline-flex flex-col justify-center items-center">
        <div className="text-3xl font-bold p-4 mb-12">LOGIN</div>
        <div className="inline-flex flex-col w-[400px] mb-12">
          <div className="flex justify-between p-4">
            <label className="text-xl font-semibold">ID</label>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="flex justify-between p-4">
            <label className="text-xl font-semibold">Password</label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={handleSignin}
              className="bg-[#88AB8E] w-full font-bold h-[30px] rounded-md hover:bg-[#81a888]"
            >
              Submit
            </button>
          </div>
          <div className="flex justify-end mt-4">
            <p
              className="font-bold text-gray-500 hover:text-gray-600 hover:cursor-pointer"
              onClick={handleOpenModal}
            >
              회원가입
            </p>
          </div>
          {isModalOpen && (
            <SignUpModal isOpen={isModalOpen} onClose={handleCloseModal} />
          )}
        </div>
      </div>
    </main>
  );
}
