"use client";

import { useState } from "react";
import useRoutes from "@/app/hooks/useRoutes";
import DesktopItem from "./DesktopItem";

import { User } from "@prisma/client";

interface DesktopSidebarProps {
  currentUser: User;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ currentUser }) => {
  const routes = useRoutes();
  const [isOpen, setISOpen] = useState<boolean>(false);

  console.log({ currentUser });
  return (
    <div className="hidden lg:flex lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 lg:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex-col justify-between">
      <nav className="mt-4 flex flex-col justify-between">
        <ul role="list" className="flex flex-col items-center space-y-1">
          {routes.map((item) => (
            <DesktopItem
              key={item.label}
              href={item.href}
              label={item.label}
              Icon={item.icon}
              active={item.active}
              onClick={item.onClick ? item.onClick : () => {}}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default DesktopSidebar;
