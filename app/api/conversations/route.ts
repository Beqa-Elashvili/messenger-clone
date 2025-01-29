import getCurrentUser from "@/app/actions/getCurrentUser";

import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userId, isGroup, members, name } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Ivalid data", { status: 400 });
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

      return NextResponse.json(newConversations);
    }

    const exisitingConservations = await prisma.converstion.findMany({
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
    const singleConservations = exisitingConservations[0];

    if (singleConservations) {
      return NextResponse.json(singleConservations);
    }

    const newConservations = await prisma.converstion.create({
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

    return NextResponse.json(newConservations);
  } catch (error: any) {
    return new NextResponse("internal Error", { status: 500 });
  }
}
