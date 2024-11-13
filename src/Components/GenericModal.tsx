import { cn } from "../utils";

type ModalProps = {
  class?: string;
  isOpen?: boolean;
  onClose?: () => void;
  showClose?: boolean;
  children: React.ReactNode;
};

export default function GenericModal(props: ModalProps) {
  function handleClose() {
    return props.onClose ? props.onClose() : null;
  }

  const isOpen = props.isOpen ?? true;

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
        <>{props.children}</>
      </div>
    </div>
  );
}
