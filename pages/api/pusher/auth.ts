import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { pusherServer } from "@/app/libs/pusher";
import { authOptions } from "@/app/libs/authOptions";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const session = await getServerSession(request, response, authOptions);
  if (!session?.user?.email) {
    return response.status(401).json({ error: "Unauthorized" });
  }
  const { socket_id, channel_name } = request.body;

  if (!socket_id || !channel_name) {
    return response
      .status(400)
      .json({ error: "Missing socket_id or channel_name" });
  }

  const data = {
    user_id: session.user.email,
  };

  try {
    const authResponse = pusherServer.authorizeChannel(
      socket_id,
      channel_name,
      data
    );
    return response.send(authResponse);
  } catch (error) {
    return response
      .status(500)
      .json({ error: "Pusher authorization failed", details: error });
  }
}
