import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const sizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export default function Spinner({ size = 'md', className = '' }) {
  return <Loader2 className={cn(sizes[size], 'animate-spin', className)} aria-hidden="true" />;
}