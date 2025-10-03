import { getSession } from "../lib/auth-client";
import prisma from "../lib/prisma";

export default async function getCurrentUser() {
  try {
    const { data: session } = await getSession();

    console.log(session);

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
  } catch (error: any) {
    return null;
  }
}
