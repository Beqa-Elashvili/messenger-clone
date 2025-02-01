"use client";

import useConversation from "@/app/hooks/useConversation";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { HiPhoto, HiPaperAirplane } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary";
import { useState } from "react";
import { CircleLoader } from "react-spinners";

const Form = () => {
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      setValue("message", "", { shouldValidate: true });
      await axios.post("/api/messages", {
        ...data,
        conversationId,
      });
    } catch (error) {
      console.error("Something is wrong while send messages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (result: any) => {
    try {
      setIsLoading(true);
      await axios.post("/api/messages", {
        image: result?.info?.secure_url,
        conversationId,
      });
    } catch (error) {
      console.error("Something went wrong while send images");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-4 px-4 bg-white border-r flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={handleUpload}
        uploadPreset="hewauijf"
      >
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <div className="w-full relative flex items-center">
          <MessageInput
            id="message"
            register={register}
            errors={errors}
            required
            placeholder="Write a message"
          />
          <span className="absolute right-3 top-1">
            <CircleLoader loading={isLoading} size={34} color="#0284c7" />
          </span>
        </div>
        <button
          type="submit"
          className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
