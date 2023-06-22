import axios from "axios";
import { SafeUser } from "../types";
import { useRouter } from "next/navigation";
import useLoginModal from "./useLoginModal";
import React, { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

interface IUserFavorite {
  listingId: string;
  currentUser?: SafeUser | null;
}

const useFavorite = ({
  listingId,
  currentUser
}: IUserFavorite) => {
  const router = useRouter();
  const loginModel = useLoginModal();

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];

    return list.includes(listingId);
  }, [currentUser, listingId]);

  const toggleFavorite = useCallback(async (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();

    if (!currentUser) {
      return loginModel.onOpen();
    }

    try {
      let request;

      if (hasFavorited) {
        request = () => axios.delete(`api/favorites/${listingId}`);
      } else {
        request = () => axios.post(`api/favorites/${listingId}`);
      }

      await request();
      router.refresh();
      toast.success('Success');
    } catch (error) {
      toast.error('Something went wrong');
    }
  }, [currentUser, hasFavorited, listingId, loginModel, router]);

  return {
    hasFavorited,
    toggleFavorite
  }
}

export default useFavorite;

