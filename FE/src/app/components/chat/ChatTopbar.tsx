"use client";

import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { BiSolidMessageRoundedAdd } from "react-icons/bi";
import ChatRoomInviteModal from "./ChatRoomInviteModal";

type Props = {
  onSearch: (query: string) => void;
  onChatroomCreated: () => void;
};

export default function ChatTopbar({ onSearch, onChatroomCreated }: Props) {
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const handleSearch = () => {
    onSearch(query);
  };

  const handleNotSearch = () => {
    setQuery("");
    onSearch("");
    setSearch(false);
  };

  const handleSearchBar = () => {
    setSearch((search) => !search);
  };

  const handleCreateChat = () => {
    setCreateModalOpen(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };
  return (
    <div>
      <div className="w-full flex justify-between items-center">
        <div className="text-lg font-semibold mb-4">채팅</div>
        <ul className="flex gap-4">
          <div>
            <IoSearchOutline
              className="text-3xl hover:text-[#88AB8E]"
              onClick={handleSearchBar}
            />
          </div>
          <div>
            <BiSolidMessageRoundedAdd
              className="text-3xl hover:text-[#88AB8E]"
              onClick={handleCreateChat}
            />
          </div>
        </ul>
      </div>
      {search && (
        <div className="flex items-center mt-4 mb-6">
          <input
            type="text"
            placeholder="채팅방 제목 검색..."
            className="flex-grow p-2 border border-gray-300 rounded-md mr-4"
            value={query}
            onChange={handleChange}
          />
          <button
            className="bg-[#83A2FF] text-white px-4 py-2 rounded-md hover:bg-[#7b9af8] md:w-20 md:h-8 md:px-0 md:py-0"
            onClick={handleSearch}
          >
            검색
          </button>
          <button
            className="text-[#BF3131] px-4 py-2 font-bold"
            onClick={handleNotSearch}
          >
            X
          </button>
        </div>
      )}
      {isCreateModalOpen && (
        <ChatRoomInviteModal
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onChatroomCreated={onChatroomCreated}
        />
      )}
    </div>
  );
}
