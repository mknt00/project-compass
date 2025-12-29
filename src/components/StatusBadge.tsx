import { ProjectStatus, statusLabels } from '@/types/project';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md';
}

const statusStyles: Record<ProjectStatus, string> = {
  'todo': 'bg-muted text-muted-foreground',
  'in-progress': 'bg-primary/10 text-primary',
  'completed': 'bg-status-completed/10 text-status-completed',
  'on-hold': 'bg-status-on-hold/10 text-status-on-hold',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        statusStyles[status],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      <span
        className={cn(
          'mr-1.5 h-1.5 w-1.5 rounded-full',
          status === 'todo' && 'bg-muted-foreground',
          status === 'in-progress' && 'bg-primary',
          status === 'completed' && 'bg-status-completed',
          status === 'on-hold' && 'bg-status-on-hold'
        )}
      />
      {statusLabels[status]}
    </span>
  );
}
