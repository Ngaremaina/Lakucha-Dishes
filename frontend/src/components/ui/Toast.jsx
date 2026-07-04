import { createContext, useCallback, useContext, useState } from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import clsx from 'clsx';

const ToastContext = createContext(null);

let nextId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(({ title, description, variant = 'default' }) => {
    const id = nextId++;
    setToasts((current) => [...current, { id, title, description, variant }]);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      <RadixToast.Provider swipeDirection="right">
        {children}
        {toasts.map(({ id, title, description, variant }) => (
          <RadixToast.Root
            key={id}
            duration={4000}
            onOpenChange={(open) => !open && dismiss(id)}
            className={clsx(
              'rounded-(--radius-card) border bg-surface px-4 py-3 shadow-(--shadow-elevated)',
              variant === 'error' ? 'border-red-300' : 'border-border'
            )}
          >
            {title && <RadixToast.Title className="text-sm font-semibold text-ink">{title}</RadixToast.Title>}
            {description && (
              <RadixToast.Description className="text-sm text-ink-muted">{description}</RadixToast.Description>
            )}
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className="fixed bottom-4 right-4 z-50 flex w-96 max-w-[90vw] flex-col gap-2" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error('useToast must be used within a ToastProvider');
  return toast;
};
