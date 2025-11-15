"use client";

import React, { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { Avatar } from "../Avatar";
import { MenuItem } from "./MenuItem";

import useRegisterModal from "../../hooks/useRegisterModal";
import useLoginModal from "../../hooks/useLoginModal";
import useRentModal from "@/app/hooks/useRentModal";

import { User } from "@/types/prisma";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import useSearchModal from "@/app/hooks/useSearch";

interface UserMenuProps {
  currentUser?: User | null;
}

export const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const rentModal = useRentModal();
  const searchModal = useSearchModal();

  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const onRent = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    rentModal.onOpen();
  }, [currentUser, loginModal, rentModal]);

  function onOpenRentModal() {
    setIsOpen(false);
    rentModal.onOpen();
  }

  function onOpenLoginModal() {
    setIsOpen(false);
    loginModal.onOpen();
  }

  function onOpenRegisterModal() {
    setIsOpen(false);
    registerModal.onOpen();
  }

  async function onSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsOpen(false);
          router.push("/");
          router.refresh();
        },
      },
    });
  }

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onRent}
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
        >
          Airbnb your home
        </div>
        <div
          onClick={toggleOpen}
          className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItem onClick={() => router.push('/trips')} label="My trips" />
                <MenuItem onClick={() => router.push('/favorites')} label="My favorites" />
                <MenuItem onClick={() => router.push('/reservations')} label="My reservations" />
                <MenuItem onClick={() => router.push('/properties')} label="My properties" />
                <MenuItem onClick={onOpenRentModal} label="Airbnb my home" />
                <hr />
                <MenuItem onClick={onSignOut} label="Logout" />
              </>
            ) : (
              <>
                <MenuItem onClick={onOpenLoginModal} label="Login" />
                <MenuItem onClick={onOpenRegisterModal} label="Sign up" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
