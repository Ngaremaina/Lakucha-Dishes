import { forwardRef } from 'react';
import clsx from 'clsx';

export const Label = ({ className, ...props }) => (
  <label className={clsx('block text-sm font-medium text-ink mb-1', className)} {...props} />
);

const Input = forwardRef(({ className, error, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      'w-full rounded-(--radius-control) border bg-surface px-3.5 py-2.5 text-sm text-ink',
      'placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500',
      error ? 'border-red-400' : 'border-border',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export const FieldError = ({ children }) =>
  children ? <p className="mt-1 text-sm text-red-600">{children}</p> : null;

export default Input;
