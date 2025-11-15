import { Prisma } from "@/generated/prisma";
import prisma from "../lib/prisma";

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export type ReservationWithListing = {
  id: string;
  createdAt: Date;
  userId: string;
  listingId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  listing: {
    id: string;
    createdAt: Date;
    userId: string;
    title: string;
    description: string;
    imageSrc: string;
    category: string;
    roomCount: number;
    bathroomCount: number;
    guestCount: number;
    locationValue: string;
    price: number;
  };
};

export default async function getReservations(params: IParams): Promise<ReservationWithListing[]> {
  try {
    const { listingId, userId, authorId } = await params;

    const query: Prisma.ReservationWhereInput = {};

    if (listingId) {
      query.listingId = listingId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.listing = { userId: authorId };
    }

    const reservations = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reservations;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Une erreur inconnue est survenue");
    }
  }
}
