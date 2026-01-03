import { useState } from 'react';
import { useAuthStore, User } from '@/store/authStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, UserPlus } from 'lucide-react';

interface UserManagementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserManagement({ open, onOpenChange }: UserManagementProps) {
  const { users, currentUser, addUser, deleteUser } = useAuthStore();
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'viewer'>('viewer');
  const [error, setError] = useState('');

  const handleAddUser = () => {
    setError('');
    
    if (!newUsername.trim()) {
      setError('请输入用户名');
      return;
    }
    if (!newPassword.trim()) {
      setError('请输入密码');
      return;
    }
    if (newPassword.length < 6) {
      setError('密码长度至少6位');
      return;
    }
    
    const success = addUser(newUsername.trim(), newPassword, newRole);
    if (success) {
      setNewUsername('');
      setNewPassword('');
      setNewRole('viewer');
    } else {
      setError('用户名已存在');
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      setError('不能删除当前登录用户');
      return;
    }
    deleteUser(userId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>用户管理</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Add new user */}
          <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <h3 className="font-medium flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              添加新用户
            </h3>
            
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <Label>用户名</Label>
                <Input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="用户名"
                />
              </div>
              <div className="space-y-2">
                <Label>密码</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="密码"
                />
              </div>
              <div className="space-y-2">
                <Label>角色</Label>
                <Select value={newRole} onValueChange={(v) => setNewRole(v as 'admin' | 'viewer')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">管理员</SelectItem>
                    <SelectItem value="viewer">访客</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddUser} className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  添加
                </Button>
              </div>
            </div>
          </div>
          
          {/* User list */}
          <div className="space-y-2">
            <h3 className="font-medium">用户列表</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户名</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.username}
                      {user.id === currentUser?.id && (
                        <Badge variant="outline" className="ml-2">当前用户</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? '管理员' : '访客'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={user.id === currentUser?.id}
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
