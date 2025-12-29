export type ProjectStatus = 'todo' | 'in-progress' | 'completed' | 'on-hold';

export interface Module {
  id: string;
  name: string;
  progress: number; // 0-100
  status: ProjectStatus;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  modules: Module[];
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
}

export const statusLabels: Record<ProjectStatus, string> = {
  'todo': '待开始',
  'in-progress': '进行中',
  'completed': '已完成',
  'on-hold': '已暂停',
};

export const statusColors: Record<ProjectStatus, string> = {
  'todo': 'bg-status-todo',
  'in-progress': 'bg-status-in-progress',
  'completed': 'bg-status-completed',
  'on-hold': 'bg-status-on-hold',
};
