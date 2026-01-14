import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import { User } from "@/types/prisma";

import useLoginModal from "./useLoginModal";

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
        let message;

        if (hasFavorited) {
            request = () => axios.delete(`/api/favorites/${listingId}`);
            message = 'Le logement a bien été supprimé de vos favoris.';
        } else {
            request = () => axios.post(`/api/favorites/${listingId}`);
            message = 'Le logement a bien été ajoutée à vos favoris.'
        }

        await request();
        router.refresh();
        toast.success(message);
    } catch (error) {
        toast.error("Une erreur s'est produite.");
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