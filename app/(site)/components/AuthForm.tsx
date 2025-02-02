"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { ClipLoader } from "react-spinners";

const AuthForm = () => {
  type variants = "LOGIN" | "REGISTER";

  const [variant, setVariant] = useState<variants>("LOGIN");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const toggleVariants = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === "REGISTER") {
      axios
        .post("/api/register", data)
        .then((response) => {
          console.log(response);
          toast.success(response.data.message || "Registration successful!");
          signIn("credentials", data);
        })
        .catch((error) =>
          toast.error(error.response?.data || "Something went wrong")
        )
        .finally(() => setIsLoading(false));
    }
    if (variant === "LOGIN") {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error(callback?.error || "Invalid credentials");
          }
          if (callback?.ok && !callback?.error) {
            toast.success("Logged in!");
            router.push("/users");
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error(callback?.error || "Invalid credentials");
        }
        if (callback?.ok && !callback.error) {
          toast.success(callback?.ok || "Logged in!");
          router.push("/users");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="mt-8 sm:mx-auto px-4 sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              disabled={isLoading}
              id="name"
              label="Name"
              register={register}
              errors={errors}
            />
          )}
          <Input
            id="email"
            label="email address"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div className="relative flex items-center">
            <div className="w-full">
              <Input
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                register={register}
                errors={errors}
                disabled={isLoading}
              />
            </div>
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 absolute translate-y-4 translate-x-0 right-2 cursor-pointer"
            >
              {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
            </span>
          </div>
          <div className="relative flex items-center">
            <Button disabled={isLoading} fullwidth type="submit">
              {variant === "LOGIN" ? "Sign in" : "REGISTER"}
            </Button>
            <ClipLoader
              loading={isLoading}
              color="#3d41b154"
              className="absolute right-2"
            />
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500 ">
          <div>
            {variant === "LOGIN"
              ? "New to Messenger ?"
              : "Already have an account"}
          </div>
          <div onClick={toggleVariants} className="underline cursor-pointer">
            {variant === "LOGIN" ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthForm;
