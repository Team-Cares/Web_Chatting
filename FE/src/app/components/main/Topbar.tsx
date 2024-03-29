"use client";
import { useCallback, useState } from "react";
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

  const handleSearch = useCallback(() => {
    onSearch(query);
  }, [query, onSearch]);

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
      <div className="w-full flex justify-between items-center px-2 sm:px-4">
        <div className="text-lg font-semibold mb-4">친구</div>
        <ul className="flex gap-4">
          <div>
            <IoSearchOutline
              className="text-3xl hover:text-[#88AB8E]"
              onClick={handleSearchBar}
            />
          </div>
          <div>
            <IoPersonAdd
              className="text-3xl hover:text-[#88AB8E]"
              onClick={handleOpenModal}
            />
          </div>
        </ul>
      </div>
      {search && (
        <div className="flex flex-wrap items-center mt-4 mb-6 sm:justify-end">
          <input
            type="text"
            placeholder="친구 검색..."
            className="flex-grow p-2 border border-gray-300 rounded-md mr-2 sm:mr-4 sm:mb-2"
            value={query}
            onChange={handleChange}
          />
          <button
            onClick={handleSearch}
            className="bg-[#83A2FF] text-white px-4 py-2 sm:px-4 sm:py-2 rounded-md hover:bg-[#7b9af8]"
          >
            검색
          </button>
          <button
            className="text-[#BF3131] px-2 py-1 sm:px-4 sm:py-2 font-bold"
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
