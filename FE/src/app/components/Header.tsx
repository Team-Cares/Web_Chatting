"use client";

const logout = () => {
  let accessToken = localStorage.getItem("accessToken");
  localStorage.removeItem("accessToken");
  window.location.reload();
};
