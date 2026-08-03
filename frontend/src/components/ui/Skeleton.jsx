import { cn } from '../../lib/utils';

export default function Skeleton({ className = '' }) {
  return <div className={cn('animate-pulse rounded-md bg-slate-200 dark:bg-slate-700', className)} aria-hidden="true" />;
}