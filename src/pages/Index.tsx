import { useState, useMemo } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { useAuthStore } from '@/store/authStore';
import { Project, ProjectStatus, statusLabels } from '@/types/project';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectDialog } from '@/components/ProjectDialog';
import { CreateProjectDialog } from '@/components/CreateProjectDialog';
import { LoginDialog } from '@/components/LoginDialog';
import { UserManagement } from '@/components/UserManagement';
import { StatsCard } from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FolderKanban,
  Plus,
  Search,
  LayoutDashboard,
  CheckCircle2,
  Clock,
  PauseCircle,
  User,
  LogIn,
  LogOut,
  Users,
  Shield,
} from 'lucide-react';

export default function Index() {
  const projects = useProjectStore((state) => state.projects);
  const getProjectProgress = useProjectStore((state) => state.getProjectProgress);
  const { currentUser, isAdmin, logout } = useAuthStore();
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = projects.length;
    const completed = projects.filter((p) => p.status === 'completed').length;
    const inProgress = projects.filter((p) => p.status === 'in-progress').length;
    const avgProgress = projects.length > 0
      ? Math.round(projects.reduce((acc, p) => acc + getProjectProgress(p.id), 0) / projects.length)
      : 0;
    return { total, completed, inProgress, avgProgress };
  }, [projects, getProjectProgress]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">项目管理中心</h1>
              <p className="text-xs text-muted-foreground">团队协作 · 进度追踪</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {currentUser.username}
                    {isAdmin() && <Shield className="h-3 w-3 ml-1 text-primary" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAdmin() && (
                    <>
                      <DropdownMenuItem onClick={() => setIsUserManagementOpen(true)}>
                        <Users className="h-4 w-4 mr-2" />
                        用户管理
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsLoginDialogOpen(true)}>
                <LogIn className="h-4 w-4 mr-2" />
                登录
              </Button>
            )}
            
            {isAdmin() && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                新建项目
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Stats */}
        <section className="grid gap-4 md:grid-cols-4">
          <StatsCard
            title="全部项目"
            value={stats.total}
            icon={LayoutDashboard}
          />
          <StatsCard
            title="进行中"
            value={stats.inProgress}
            icon={Clock}
          />
          <StatsCard
            title="已完成"
            value={stats.completed}
            icon={CheckCircle2}
          />
          <StatsCard
            title="平均进度"
            value={`${stats.avgProgress}%`}
            icon={PauseCircle}
          />
        </section>

        {/* Filters */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索项目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ProjectStatus | 'all')}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="筛选状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              {(Object.keys(statusLabels) as ProjectStatus[]).map((status) => (
                <SelectItem key={status} value={status}>
                  {statusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        {/* Projects Grid */}
        <section>
          {filteredProjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <FolderKanban className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">暂无项目</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all'
                  ? '没有找到匹配的项目'
                  : '点击上方按钮创建第一个项目'}
              </p>
              {!searchQuery && statusFilter === 'all' && isAdmin() && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  创建项目
                </Button>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Dialogs */}
      <ProjectDialog
        project={selectedProject}
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      />
      <CreateProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      <LoginDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
      />
      <UserManagement
        open={isUserManagementOpen}
        onOpenChange={setIsUserManagementOpen}
      />
    </div>
  );
}
