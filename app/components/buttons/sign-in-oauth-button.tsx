"use client";

import { authClient } from "@/app/lib/auth-client";
import React, { useState } from "react";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../Button";
import toast from "react-hot-toast";

interface SignInOauthButtonProps {
  provider: "google" | "github";
  signUp?: boolean;
}

export const SignInOauthButton = ({
  provider,
  signUp,
}: SignInOauthButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    await authClient.signIn.social({
      provider,
      callbackURL: "/profile",
      errorCallbackURL: "/auth/sign-in/error",
      fetchOptions: {
        onRequest: () => {
          setIsLoading(true);
        },
        onResponse: () => {
          setIsLoading(false);
        },
        onError: (ctx) => {
          toast.error("Something went wrong during identification");
        },
      },
    });
  }

  const action = signUp ? "Up" : "In";
  const providerName = provider === "google" ? "Google" : "Github";

  return (
    <Button
      outline
      label={providerName}
      icon={provider === "google" ? FcGoogle : AiFillGithub}
      onClick={handleClick}
    />
  );
};
