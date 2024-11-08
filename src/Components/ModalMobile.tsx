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
        className={cn("relative flex flex-col rounded-lg h-dvh ", props.class)}
        onClick={(e) => e.stopPropagation()}
      >
        <>{props.children}</>
      </div>
    </div>
  );
}
