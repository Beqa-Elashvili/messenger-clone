import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversationById = async (conversationsId: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.email) {
      return null;
    }
    const conversation = await prisma.converstion.findUnique({
      where: {
        id: conversationsId,
      },
      include: {
        users: true,
      },
    });

    return conversation;
  } catch (error: unknown) {
    return null;
  }
};
export default getConversationById;
