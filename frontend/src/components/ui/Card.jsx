import clsx from 'clsx';

const Card = ({ className, children, ...props }) => (
  <div
    className={clsx(
      'rounded-(--radius-card) border border-border bg-surface shadow-(--shadow-card)',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export default Card;
