"use client";
import { useCookies } from "next-client-cookies";
import { jwtDecode } from "jwt-decode";

export type UserData = {
  backgroundImgUrl: string | null;
  createdAt: string;
  deletedAt: string | null;
  email: string;
  introduce: string | null;
  profileImgUrl: string | null;
  updatedAt: string;
  user_id: number;
  username: string;
};

interface CustomJwtPayload {
  user_id: number;
  iat: number;
  exp: number;
  iss: string;
}

export const UserData = (): {
  payload: CustomJwtPayload | null;
} => {
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  // 유효한 토큰이 있는 경우에만 jwtDecode를 호출
  const payload = accessToken ? jwtDecode<CustomJwtPayload>(accessToken) : null;

  // 반환 타입을 CustomJwtPayload | null | undefined로 강제
  return { payload: payload || null };
};
