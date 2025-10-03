"use client";

import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useLoginModal from "../../hooks/useLoginModal";
import { Modal } from "./Modal";
import { Heading } from "../Heading";
import { Input } from "../inputs/Input";
import toast from "react-hot-toast";
import { Button } from "../Button";
import { useRouter } from "next/navigation";
import signInEmailAction from "@/app/actions/sign-in-email.action";
import { SignInOauthButton } from "../buttons/sign-in-oauth-button";

export const LoginModal = () => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data): Promise<void> {
    setIsLoading(true);

    const { error } = await signInEmailAction(data);

    if (error) {
      toast.error(error);
      setIsLoading(false);
    } else {
      toast.success("Welcome, happy to see you again");
      loginModal.onClose();
      router.push("/profile");
      router.refresh();
    }
  }

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome back" subtitle="Log to your account!" />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        type="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      {/* <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => {}}
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => {}}
      /> */}
      <SignInOauthButton provider="google" />
      <SignInOauthButton provider="github" />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="justify-center flex flex-row items-center gap-2">
          <div>Doesn't have an account?</div>
          <div
            onClick={loginModal.onClose}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            Sign Up
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};
