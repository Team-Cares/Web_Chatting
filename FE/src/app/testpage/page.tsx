"use client";
import React from "react";
import { useCookies } from "next-client-cookies";
import { jwtDecode } from "jwt-decode";
import { UserData } from "../data/user";

export default function Test() {
  const { payload } = UserData();
  return (
    <div className="w-full h-full flex">
      <div className="w-[20%] h-full bg-[#F3D7CA]">z</div>
      <div className="w-[35%] h-full bg-[#FFF8E3]">z</div>
      <div className="w-[45%] h-full bg-[#F5EEE6]">z</div>
    </div>
  );
}
