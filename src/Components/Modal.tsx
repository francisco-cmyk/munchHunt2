import { Button } from "./Button";
import { X } from "lucide-react";
import { SquareX } from "lucide-react";
import { useEffect } from "react";

type ModalProps = {
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
      className={`fixed inset-0 flex justify-center items-center z-[100] ${
        isOpen ? "visible bg-black bg-opacity-50" : "invisible"
      }`}
      onClick={handleClose}
    >
      <div
        className='relative p-4 rounded-lg  max-w-full max-h-full flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        {props.showClose && (
          <div className='absolute right-5' onClick={handleClose}>
            <X className=' text-black hover:text-customOrange' size={30} />
          </div>
        )}

        {props.children}
      </div>
    </div>
  );
}
