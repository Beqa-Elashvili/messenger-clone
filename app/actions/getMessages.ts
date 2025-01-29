import prisma from "@/app/libs/prismadb";

const getMessages = async (conversationsId: string) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        converstionId: conversationsId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createAt: "asc",
      },
    });
    return messages;
  } catch (error: unknown) {
    return [];
  }
};

export default getMessages;
