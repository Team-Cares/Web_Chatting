"use client";
import React from "react";
import { useCookies } from "next-client-cookies";
import { jwtDecode } from "jwt-decode";
import { UserData } from "../data/user";

export default function Test() {
  const { payload } = UserData();
  return <div>병근이의 테스트 페이지</div>;
}
