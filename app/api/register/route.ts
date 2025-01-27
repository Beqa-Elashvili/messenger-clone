import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb"; // Ensure you import the Prisma client instance
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!name || !email || !password) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse("Invalid email format", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("REGISTRATION ERROR:", error);

    if (error.code === "P2002") {
      console.error("Unique constraint violation:", error);
      return new NextResponse("Email already in use", { status: 400 });
    } else {
      console.error("General error:", error.message);
      console.error("Full stack trace:", error.stack);
    }

    return new NextResponse("Internal Error", { status: 500 });
  }
}
