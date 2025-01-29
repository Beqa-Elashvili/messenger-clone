import { Converstion, Message, User } from "@prisma/client";

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type FullConversationsType = Converstion & {
  users: User[];
  messages: FullMessageType[];
};
