import * as Dialog from '@radix-ui/react-dialog';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Modal = ({ open, onOpenChange, title, children }) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in" />
      <Dialog.Content
        className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2
          rounded-(--radius-card) bg-surface p-6 shadow-(--shadow-elevated) focus:outline-none"
      >
        <div className="mb-4 flex items-center justify-between">
          {title && <Dialog.Title className="text-lg font-semibold text-ink">{title}</Dialog.Title>}
          <Dialog.Close asChild>
            <button aria-label="Close" className="text-ink-muted hover:text-ink">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default Modal;
