import { Module, ProjectStatus, statusLabels } from '@/types/project';
import { ProgressBar } from './ProgressBar';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModuleItemProps {
  module: Module;
  onUpdate: (updates: Partial<Module>) => void;
  onDelete: () => void;
}

export function ModuleItem({ module, onUpdate, onDelete }: ModuleItemProps) {
  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    let newStatus: ProjectStatus = module.status;
    
    if (newProgress === 100) {
      newStatus = 'completed';
    } else if (newProgress > 0 && module.status === 'todo') {
      newStatus = 'in-progress';
    } else if (newProgress === 0 && module.status === 'completed') {
      newStatus = 'in-progress';
    }
    
    onUpdate({ progress: newProgress, status: newStatus });
  };

  const handleStatusChange = (status: ProjectStatus) => {
    const updates: Partial<Module> = { status };
    if (status === 'completed') {
      updates.progress = 100;
    } else if (status === 'todo') {
      updates.progress = 0;
    }
    onUpdate(updates);
  };

  return (
    <div
      className={cn(
        'group flex items-center gap-4 rounded-lg border bg-card p-4',
        'transition-all duration-200 hover:shadow-sm hover:border-primary/20',
        'animate-slide-up'
      )}
    >
      <GripVertical className="h-5 w-5 text-muted-foreground/40 cursor-grab" />
      
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{module.name}</h4>
          <Select value={module.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(statusLabels) as ProjectStatus[]).map((status) => (
                <SelectItem key={status} value={status} className="text-xs">
                  {statusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-4">
          <Slider
            value={[module.progress]}
            onValueChange={handleProgressChange}
            max={100}
            step={5}
            className="flex-1"
          />
          <span className="min-w-[3rem] text-right text-sm font-medium text-muted-foreground">
            {module.progress}%
          </span>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
