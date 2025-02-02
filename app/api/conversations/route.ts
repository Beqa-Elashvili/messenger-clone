import getCurrentUser from "@/app/actions/getCurrentUser";

import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userId, isGroup, members, name } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse(
        JSON.stringify({
          message:
            "Group members should be at least 2, and a group name is required",
        }),
        {
          status: 400,
        }
      );
    }

    if (isGroup) {
      const newConversations = await prisma.converstion.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });
      newConversations.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(
            user.email,
            "conversation:new",
            newConversations
          );
        }
      });

      return NextResponse.json(newConversations);
    }

    const exisitingConversations = await prisma.converstion.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });
    const singleConversations = exisitingConversations[0];

    if (singleConversations) {
      return NextResponse.json(singleConversations);
    }

    const newConversations = await prisma.converstion.create({
      data: {
        users: {
          connect: [
            { id: currentUser.id },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    newConversations.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:new", newConversations);
      }
    });

    return NextResponse.json(newConversations);
  } catch (error: any) {
    return new NextResponse("internal Error", { status: 500 });
  }
}
