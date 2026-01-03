import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'viewer';
}

interface AuthStore {
  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (username: string, password: string, role: 'admin' | 'viewer') => boolean;
  updateUser: (id: string, updates: Partial<Omit<User, 'id'>>) => void;
  deleteUser: (id: string) => void;
  isAdmin: () => boolean;
}

// Store passwords separately (in real app, use proper hashing)
interface UserCredentials {
  [userId: string]: string;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

// Default admin user
const defaultUsers: User[] = [
  { id: 'admin-001', username: 'admin', role: 'admin' },
  { id: 'viewer-001', username: 'viewer', role: 'viewer' },
];

const defaultCredentials: UserCredentials = {
  'admin-001': 'admin123',
  'viewer-001': 'viewer123',
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: defaultUsers,
      
      login: (username: string, password: string) => {
        const state = get();
        const user = state.users.find(u => u.username === username);
        
        if (!user) return false;
        
        // Get credentials from localStorage
        const credentialsStr = localStorage.getItem('user-credentials');
        const credentials: UserCredentials = credentialsStr 
          ? JSON.parse(credentialsStr) 
          : defaultCredentials;
        
        if (credentials[user.id] === password) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ currentUser: null });
      },
      
      addUser: (username: string, password: string, role: 'admin' | 'viewer') => {
        const state = get();
        if (state.users.some(u => u.username === username)) {
          return false;
        }
        
        const newUser: User = {
          id: generateId(),
          username,
          role,
        };
        
        // Store password in localStorage
        const credentialsStr = localStorage.getItem('user-credentials');
        const credentials: UserCredentials = credentialsStr 
          ? JSON.parse(credentialsStr) 
          : defaultCredentials;
        credentials[newUser.id] = password;
        localStorage.setItem('user-credentials', JSON.stringify(credentials));
        
        set({ users: [...state.users, newUser] });
        return true;
      },
      
      updateUser: (id: string, updates: Partial<Omit<User, 'id'>>) => {
        set((state) => ({
          users: state.users.map(u => 
            u.id === id ? { ...u, ...updates } : u
          ),
        }));
      },
      
      deleteUser: (id: string) => {
        set((state) => ({
          users: state.users.filter(u => u.id !== id),
        }));
        
        // Remove credentials
        const credentialsStr = localStorage.getItem('user-credentials');
        if (credentialsStr) {
          const credentials: UserCredentials = JSON.parse(credentialsStr);
          delete credentials[id];
          localStorage.setItem('user-credentials', JSON.stringify(credentials));
        }
      },
      
      isAdmin: () => {
        return get().currentUser?.role === 'admin';
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
