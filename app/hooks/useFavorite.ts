import axios, { Axios } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import { User } from "@/generated/prisma";

import useLoginModal from "./useLoginModal";
import { ListingCard } from "../components/listings/ListingCard";

interface IUseFavorite {
  listingId: string;
  currentUser?: User | null;
}

const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];

    return list.includes(listingId);
  }, [currentUser, listingId]);

  const toggleFavorite = useCallback(async (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();

    if (!currentUser) {
        return loginModal.onOpen();
    }

    try {
        let request;

        if (hasFavorited) {
            request = () => axios.delete(`/api/favorites/${listingId}`)
        } else {
            request = () => axios.post(`/api/favorites/${listingId}`)
        }

        await request();
        router.refresh();
        toast.success('Success');
    } catch (error) {
        toast.error('Someting went wrong.');
    }
  }, 
  [
    currentUser,
    hasFavorited,
    listingId,
    loginModal,
    router
  ]);

  return {
    hasFavorited,
    toggleFavorite
  }
};

export default useFavorite;