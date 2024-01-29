"use client";
import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import User from "../components/main/User";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";

export default function Main() {
  const router = useRouter();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    }
  }, [router]);
  return (
    <div className="flex w-full h-full">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-[#f3f0e9] scrollbarCustom">
        <User />
      </div>
    </div>
  );
}
