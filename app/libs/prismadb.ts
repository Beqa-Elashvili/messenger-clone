import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();

async function testConnection() {
  try {
    await client.$connect();
    console.log("Prisma connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

testConnection();

if (process.env.NODE_ENV === "production") globalThis.prisma = client;

export default client;
