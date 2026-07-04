import clsx from 'clsx';

const Skeleton = ({ className }) => (
  <div className={clsx('animate-pulse rounded-(--radius-control) bg-surface-muted', className)} />
);

export default Skeleton;
