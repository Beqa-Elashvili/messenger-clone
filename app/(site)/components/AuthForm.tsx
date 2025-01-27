"use client";

import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "@/app/components/inputs/Input";

const AuthForm = () => {
  type variants = "LOGIN" | "REGISTER";
  const [variant, setVariant] = useState<variants>("LOGIN");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toggleVatiants = useCallback(() => {
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

  const onSubmit: SubmitHandler<FieldValues> = (date) => {
    setIsLoading(true);
    if (variant === "LOGIN") {
      // next login
    }
    if (variant === "REGISTER") {
      // next register
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    //nextauth social sign in
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form action="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              id="email"
              label="Email"
              register={register}
              errors={errors}
            />
          )}
          <Input
            id="email"
            label="email address"
            register={register}
            errors={errors}
          />
          <Input
            id="password"
            label="Password"
            register={register}
            errors={errors}
          />
        </form>
      </div>
    </div>
  );
};
export default AuthForm;
