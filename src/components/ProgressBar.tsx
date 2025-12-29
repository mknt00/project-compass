import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ value, size = 'md', showLabel = false, className }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  
  const getProgressColor = () => {
    if (clampedValue === 100) return 'bg-status-completed';
    if (clampedValue >= 50) return 'bg-primary';
    if (clampedValue > 0) return 'bg-status-on-hold';
    return 'bg-muted-foreground';
  };

  const heightClass = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('flex-1 overflow-hidden rounded-full bg-muted', heightClass[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            getProgressColor()
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="min-w-[3rem] text-right text-sm font-medium text-muted-foreground">
          {clampedValue}%
        </span>
      )}
    </div>
  );
}
