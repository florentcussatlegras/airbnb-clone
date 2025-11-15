import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

interface IParams {
  listingId?: string;
}

export type ListingWithUser = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  category: string;
  locationValue: string;
  price: number;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
};

export default async function getListingById(
  params: IParams
): Promise<ListingWithUser | null> {
  try {
    const { listingId } = await params;

    // const listing = await prisma.listing.findUnique({
    //   where: {
    //     id: listingId,
    //   },
    //   include: {
    //     user: true,
    //   },
    // });

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: {
        id: true,
        title: true,
        description: true,
        imageSrc: true,
        category: true,
        locationValue: true,
        price: true,
        roomCount: true,
        bathroomCount: true,
        guestCount: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!listing) {
      return null;
    }

    return listing;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Une erreur inconnue est survenue");
    }
  }
}
