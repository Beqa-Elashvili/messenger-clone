"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Modal from "@/app/components/Modal";
import { FiAlertTriangle } from "react-icons/fi";
import { Dialog } from "@headlessui/react";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onDelete = useCallback(() => {
    setIsLoading(true);
    axios
      .delete(`/api/conversation/${conversationId}`)
      .then(() => {
        onClose(), router.push("/conversations"), router.refresh();
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsLoading(false));
  }, [conversationId, router, onClose]);

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="sm:flex sm:items-center">
          <div className="mx-auto flex justify-center h-12 w-12 flex-shrink-0 items-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <FiAlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <Dialog.Title
              as="h3"
              className="text-base font-semibold leading-3 text-gray-900"
            >
              Delete conversation
            </Dialog.Title>
            <div className="mt-2">
              <p>Are you sure you want to delete this conversation? This</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmModal;
