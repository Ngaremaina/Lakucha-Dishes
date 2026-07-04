import clsx from 'clsx';

const ORDER_STATUS_STYLES = {
  PENDING_PAYMENT: 'bg-amber-100 text-status-pending',
  PAID: 'bg-green-100 text-status-paid',
  PREPARING: 'bg-blue-100 text-status-preparing',
  OUT_FOR_DELIVERY: 'bg-violet-100 text-status-transit',
  DELIVERED: 'bg-green-100 text-status-delivered',
  CANCELLED: 'bg-red-100 text-status-cancelled',
};

const Badge = ({ status, children, className }) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
      ORDER_STATUS_STYLES[status] ?? 'bg-surface-muted text-ink-muted',
      className
    )}
  >
    {children ?? status?.replaceAll('_', ' ')}
  </span>
);

export default Badge;
