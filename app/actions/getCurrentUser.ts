import { headers } from "next/headers";
import { auth } from "../lib/auth";
import prisma from "../lib/prisma";

export default async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(), // you need to pass the headers object.
    });

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error: unknown) {
    return null;
  }
}
