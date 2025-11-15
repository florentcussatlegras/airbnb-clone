import type { Prisma } from "@prisma/client";

export type User = Prisma.UserGetPayload<true>;
export type Listing = Prisma.ListingGetPayload<true>;
export type Reservation = Prisma.ReservationGetPayload<true>;
