"use client";

import React from "react";
import { Container } from "../Container";
import { Logo } from "./Logo";
import { Search } from "./Search";
import { UserMenu } from "./UserMenu";
import { User } from "@/generated/prisma";

interface NavbarProps {
  currentUser?: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser
}) => {
  console.log(currentUser);
  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-4 border-b-[1px] border-gray-200">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <Logo />
            <Search />
            <UserMenu currentUser={currentUser} />
          </div>
        </Container>
      </div>
    </div>
  );
};
