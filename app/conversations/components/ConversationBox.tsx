"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Converstion, Message, User } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { FullConversationsType } from "@/app/types";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";

interface ConversationBoxProps {
  data: FullConversationsType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleOnClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  const lastmessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return session?.data?.user?.email;
  }, [session.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastmessage) {
      return false;
    }
    const seenArray = lastmessage.seen || [];

    if (!userEmail) {
      return false;
    }
    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastmessage]);

  const lastMessageText = useMemo(() => {
    if (lastmessage?.image) {
      return "Sent an image";
    }
    if (lastmessage?.body) {
      return lastmessage.body;
    }
    return "Started a conversations";
  }, [lastmessage]);

  return (
    <div
      onClick={handleOnClick}
      className={clsx(
        " w-full relative flex items-center  space-x-3 hover:bg-neutral-100 rounded-lg p-2 transition cursor-pointer",
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900">
              {data.name || otherUser.name}
            </p>
            {lastmessage?.createAt && (
              <p className="text-xs text-gray-400 font-light">
                {format(new Date(lastmessage.createAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              " truncate text-sm",
              hasSeen ? "text-gray-500" : "text-black font-medium"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
