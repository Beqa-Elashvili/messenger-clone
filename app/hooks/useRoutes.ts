import { useMemo } from "react";
import { useParams, usePathname } from "next/navigation";
import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";

import { signOut } from "next-auth/react";
import useConservation from "./useConversation";

const useRoutes = () => {
  const pathname = usePathname();
  const { conservationId } = useConservation();

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: "/conservations",
        icon: HiChat,
        active: pathname === "/conservation" || !!conservationId,
      },
      {
        label: "Users",
        href: "/users",
        icon: HiUsers,
        active: pathname === "/users",
      },
      {
        label: "logout",
        href: "#",
        onClick: () => signOut(),
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathname, conservationId]
  );
  return routes;
};

export default useRoutes;
