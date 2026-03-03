import { createContext, useContext, useState, type ReactNode } from 'react';

export type UserRole = 'admin' | 'prof' | 'apprenant';

interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users pour la simulation
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@example.com': {
    password: 'admin123',
    user: { id: 1, email: 'admin@example.com', name: 'Administrateur', role: 'admin' }
  },
  'prof@example.com': {
    password: 'prof123',
    user: { id: 2, email: 'prof@example.com', name: 'Professeur Dupont', role: 'prof' }
  },
  'apprenant@example.com': {
    password: 'apprenant123',
    user: { id: 3, email: 'apprenant@example.com', name: 'Jean Martin', role: 'apprenant' }
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialisation lazy : lecture synchrone de localStorage au montage initial
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser) as User;
      } catch {
        // Si le parsing échoue, retourner null
        return null;
      }
    }
    return null;
  });
  const loading = false;

  const login = (_email: string, _password: string, role: UserRole): boolean => {
    // Simulation de connexion - on utilise l'email pour trouver le mock user
    const email = _email.toLowerCase();
    const mockUser = MOCK_USERS[email];
    
    if (mockUser && mockUser.password === _password) {
      setUser(mockUser.user);
      localStorage.setItem('user', JSON.stringify(mockUser.user));
      return true;
    }
    
    // Si pas dans mock, créer un utilisateur temporaire basé sur le rôle
    const tempUser: User = {
      id: Date.now(),
      email: _email,
      name: _email.split('@')[0],
      role
    };
    setUser(tempUser);
    localStorage.setItem('user', JSON.stringify(tempUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
