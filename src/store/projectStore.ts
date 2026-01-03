import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, Module, ProjectStatus, Document } from '@/types/project';

interface ProjectStore {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addModule: (projectId: string, module: Omit<Module, 'id' | 'documents'>) => void;
  updateModule: (projectId: string, moduleId: string, updates: Partial<Module>) => void;
  deleteModule: (projectId: string, moduleId: string) => void;
  addDocument: (projectId: string, moduleId: string, document: Omit<Document, 'id' | 'uploadedAt'>) => void;
  deleteDocument: (projectId: string, moduleId: string, documentId: string) => void;
  getProjectProgress: (projectId: string) => number;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

// Sample data
const sampleProjects: Project[] = [
  {
    id: generateId(),
    name: '电商平台重构',
    description: '对现有电商系统进行全面升级，提升用户体验和性能',
    status: 'in-progress',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    deadline: new Date('2024-06-30'),
    modules: [
      { id: generateId(), name: '用户系统', progress: 100, status: 'completed', documents: [] },
      { id: generateId(), name: '商品管理', progress: 75, status: 'in-progress', documents: [] },
      { id: generateId(), name: '订单系统', progress: 40, status: 'in-progress', documents: [] },
      { id: generateId(), name: '支付集成', progress: 0, status: 'todo', documents: [] },
    ],
  },
  {
    id: generateId(),
    name: '移动端 App 开发',
    description: '开发 iOS 和 Android 双平台应用',
    status: 'in-progress',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
    deadline: new Date('2024-08-15'),
    modules: [
      { id: generateId(), name: 'UI/UX 设计', progress: 100, status: 'completed', documents: [] },
      { id: generateId(), name: '核心功能开发', progress: 60, status: 'in-progress', documents: [] },
      { id: generateId(), name: 'API 对接', progress: 30, status: 'in-progress', documents: [] },
      { id: generateId(), name: '测试与上线', progress: 0, status: 'todo', documents: [] },
    ],
  },
  {
    id: generateId(),
    name: '数据分析平台',
    description: '构建企业级数据分析和可视化平台',
    status: 'todo',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date(),
    modules: [
      { id: generateId(), name: '需求分析', progress: 0, status: 'todo', documents: [] },
      { id: generateId(), name: '架构设计', progress: 0, status: 'todo', documents: [] },
      { id: generateId(), name: '数据采集', progress: 0, status: 'todo', documents: [] },
    ],
  },
];

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: sampleProjects,

      addProject: (project) => {
        const newProject: Project = {
          ...project,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ projects: [...state.projects, newProject] }));
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },

      addModule: (projectId, module) => {
        const newModule: Module = { ...module, id: generateId(), documents: [] };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, modules: [...p.modules, newModule], updatedAt: new Date() }
              : p
          ),
        }));
      },

      addDocument: (projectId, moduleId, document) => {
        const newDocument: Document = { 
          ...document, 
          id: generateId(), 
          uploadedAt: new Date() 
        };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  modules: p.modules.map((m) =>
                    m.id === moduleId
                      ? { ...m, documents: [...m.documents, newDocument] }
                      : m
                  ),
                  updatedAt: new Date(),
                }
              : p
          ),
        }));
      },

      deleteDocument: (projectId, moduleId, documentId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  modules: p.modules.map((m) =>
                    m.id === moduleId
                      ? { ...m, documents: m.documents.filter((d) => d.id !== documentId) }
                      : m
                  ),
                  updatedAt: new Date(),
                }
              : p
          ),
        }));
      },

      updateModule: (projectId, moduleId, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  modules: p.modules.map((m) =>
                    m.id === moduleId ? { ...m, ...updates } : m
                  ),
                  updatedAt: new Date(),
                }
              : p
          ),
        }));
      },

      deleteModule: (projectId, moduleId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  modules: p.modules.filter((m) => m.id !== moduleId),
                  updatedAt: new Date(),
                }
              : p
          ),
        }));
      },

      getProjectProgress: (projectId) => {
        const project = get().projects.find((p) => p.id === projectId);
        if (!project || project.modules.length === 0) return 0;
        const total = project.modules.reduce((acc, m) => acc + m.progress, 0);
        return Math.round(total / project.modules.length);
      },
    }),
    {
      name: 'project-storage',
    }
  )
);
