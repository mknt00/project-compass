import { useState } from 'react';
import { Project, ProjectStatus, statusLabels } from '@/types/project';
import { useProjectStore } from '@/store/projectStore';
import { ModuleItem } from './ModuleItem';
import { ProgressBar } from './ProgressBar';
import { StatusBadge } from './StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface ProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDialog({ project, open, onOpenChange }: ProjectDialogProps) {
  const [newModuleName, setNewModuleName] = useState('');
  const { updateProject, deleteProject, addModule, updateModule, deleteModule, addDocument, deleteDocument, getProjectProgress } =
    useProjectStore();

  if (!project) return null;

  const progress = getProjectProgress(project.id);

  const handleAddModule = () => {
    if (!newModuleName.trim()) return;
    addModule(project.id, {
      name: newModuleName.trim(),
      progress: 0,
      status: 'todo'
    });
    setNewModuleName('');
  };

  const handleDeleteProject = () => {
    deleteProject(project.id);
    onOpenChange(false);
  };

  const handleStatusChange = (status: ProjectStatus) => {
    updateProject(project.id, { status });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-xl">{project.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Select value={project.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(statusLabels) as ProjectStatus[]).map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabels[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {project.deadline && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                截止日期: {format(project.deadline, 'yyyy年MM月dd日', { locale: zhCN })}
              </span>
            )}
          </div>

          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">整体进度</span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <ProgressBar value={progress} size="lg" />
          </div>

          {/* Modules */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">项目模块</h3>
              <span className="text-sm text-muted-foreground">
                {project.modules.length} 个模块
              </span>
            </div>

            <div className="space-y-2">
              {project.modules.map((module) => (
                <ModuleItem
                  key={module.id}
                  module={module}
                  onUpdate={(updates) => updateModule(project.id, module.id, updates)}
                  onDelete={() => deleteModule(project.id, module.id)}
                  onUploadDocument={(file) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                      const base64 = (reader.result as string).split(',')[1];
                      addDocument(project.id, module.id, {
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        content: base64
                      });
                    };
                    reader.readAsDataURL(file);
                  }}
                  onDeleteDocument={(docId) => deleteDocument(project.id, module.id, docId)}
                />
              ))}
            </div>

            {/* Add Module */}
            <div className="flex gap-2">
              <Input
                placeholder="输入新模块名称..."
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddModule()}
              />
              <Button onClick={handleAddModule} disabled={!newModuleName.trim()}>
                <Plus className="h-4 w-4 mr-1" />
                添加
              </Button>
            </div>
          </div>

          {/* Delete Project */}
          <div className="pt-4 border-t">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDeleteProject}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              删除项目
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
