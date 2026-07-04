import { forwardRef } from 'react';
import clsx from 'clsx';

const VARIANTS = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-600',
  secondary: 'bg-surface-muted text-ink border border-border hover:bg-border/60 focus-visible:outline-ink-muted',
  ghost: 'bg-transparent text-ink hover:bg-surface-muted focus-visible:outline-ink-muted',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
};

const Button = forwardRef(
  ({ variant = 'primary', loading = false, disabled, className, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-(--radius-control) px-4 py-2.5',
        'text-sm font-semibold tracking-wide transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
);
Button.displayName = 'Button';

export default Button;
