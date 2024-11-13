import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "../utils";
import { XyzTransition } from "@animxyz/react";

type ModalProps = {
  class?: string;
  isOpen?: boolean;
  onClose?: () => void;
  showClose?: boolean;
  children?: React.ReactNode;
};

export default function Modal(props: ModalProps): JSX.Element | null {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [props.onClose, handleClose]);

  const isOpen = props.isOpen ?? true;

  function handleClose() {
    return props.onClose ? props.onClose() : null;
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className='fixed inset-0 flex justify-center items-center z-[100] visible bg-black bg-opacity-50'
      onClick={handleClose}
    >
      <div
        className={cn(
          `flex flex-col p-4 rounded-lg  max-w-full max-h-full sm:bg-slate-50  ${
            isOpen ? `animate-scrollOpen` : `animate-scrollClose`
          }`,
          props.class
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {props.showClose && (
          <div
            className='h-[19px] w-full sm:flex justify-end'
            onClick={handleClose}
          >
            <X className=' text-black hover:text-customOrange' size={24} />
          </div>
        )}

        <>{props.children}</>
      </div>
    </div>
  );
}
