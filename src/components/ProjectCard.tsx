import { Project } from '@/types/project';
import { useProjectStore } from '@/store/projectStore';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronRight, Layers } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const getProjectProgress = useProjectStore((state) => state.getProjectProgress);
  const progress = getProjectProgress(project.id);

  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all duration-300',
        'hover:shadow-lg hover:border-primary/20',
        'animate-fade-in'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          </div>
          <StatusBadge status={project.status} size="sm" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProgressBar value={progress} showLabel />
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              {project.modules.length} 个模块
            </span>
            {project.deadline && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {format(project.deadline, 'MM月dd日', { locale: zhCN })}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            查看详情
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
