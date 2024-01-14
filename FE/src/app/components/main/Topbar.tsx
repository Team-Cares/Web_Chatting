"use client";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoPersonAdd } from "react-icons/io5";
import AddFriend from "./AddFriend";

interface TopbarProps {
  onSearch: (query: string) => void;
  onFriendAdded: any;
}

export default function Topbar({ onSearch, onFriendAdded }: TopbarProps) {
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = () => {
    onSearch(query);
  };

  const handleSearchBar = () => {
    setSearch((search) => !search);
  };

  const handleNotSearch = () => {
    setQuery("");
    onSearch("");
    setSearch(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFriendAdded = (newFriend: any) => {
    onFriendAdded(newFriend);
  };

  return (
    <div>
      <div className="w-full flex justify-between items-center">
        <div className="text-lg font-semibold mb-4">친구</div>
        <ul className="flex gap-4">
          <div>
            <IoSearchOutline
              className="text-3xl hover:text-orange-400"
              onClick={handleSearchBar}
            />
          </div>
          <div>
            <IoPersonAdd
              className="text-3xl hover:text-orange-400"
              onClick={handleOpenModal}
            />
          </div>
        </ul>
      </div>
      {search && (
        <div className="flex items-center mt-4 mb-6">
          <input
            type="text"
            placeholder="친구 검색..."
            className="flex-grow p-2 border border-gray-300 rounded-md mr-4"
            value={query}
            onChange={handleChange}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            검색
          </button>
          <button
            className="text-red-500 px-4 py-2 font-bold"
            onClick={handleNotSearch}
          >
            X
          </button>
        </div>
      )}
      {isModalOpen && (
        <AddFriend
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onFriendAdded={handleFriendAdded}
        />
      )}
    </div>
  );
}
