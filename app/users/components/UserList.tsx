"use client";

import { User } from "@prisma/client";
import UserBox from "./UserBox";
import Avatar from "@/app/components/Avatar";
import SettingsModal from "@/app/components/sidebar/SettingModal";
import { useState } from "react";

interface UserListPorps {
  items: User[];
  currentUser: User;
}

const UserList: React.FC<UserListPorps> = ({ items, currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <>
      <SettingsModal
        isOpen={isModalOpen}
        currentUser={currentUser}
        onClose={() => setIsModalOpen(false)}
      />
      <aside className="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:block lg:w-80 overflow-y-auto border-r border-gray-200 block w-full left-0">
        <div className="px-5 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-neutral-800 py-4">
              people
            </div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer block lg:hidden hover:opacity-75 transition"
            >
              <Avatar user={currentUser} />
            </div>
          </div>
          {items.map((item) => (
            <UserBox key={item.id} data={item} />
          ))}
        </div>
      </aside>
    </>
  );
};

export default UserList;
