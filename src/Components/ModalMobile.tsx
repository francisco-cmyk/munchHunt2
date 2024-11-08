import { useEffect } from "react";
import { cn } from "../utils";

type ModalProps = {
  class?: string;
  isOpen?: boolean;
  onClose?: () => void;
  showClose?: boolean;
  children?: React.ReactNode;
};

export default function ModalMobile(props: ModalProps): JSX.Element | null {
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
        className={cn("relative flex flex-col rounded-lg ", props.class)}
        onClick={(e) => e.stopPropagation()}
      >
        <>{props.children}</>
      </div>
    </div>
  );
}
