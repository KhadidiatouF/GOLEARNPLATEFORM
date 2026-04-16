import { createContext, useContext, useState, type ReactNode } from 'react';
import { apiAuth } from '../api/apiAuth';

export type UserRole = 'admin' | 'prof' | 'apprenant';

interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  professeurId?: number;
  solde?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (login: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  const [loading, setLoading] = useState(false);

  const login = async (loginInput: string, password: string, _role: UserRole): Promise<boolean> => {
    // Note: le rôle n'est plus nécessaire car l'API le retourne avec l'utilisateur
    void _role; // Empêche l'erreur ESLint si le paramètre doit être utilisé ailleurs
    setLoading(true);
    try {
      // Appel à l'API backend pour l'authentification
      const result = await apiAuth.login(loginInput, password);
      
      if (result.success && result.data?.tokens?.user) {
        const userData = result.data.tokens.user;
        // Convertir le rôle API vers le type UserRole
        const userRole: UserRole = userData.role === 'ADMIN' ? 'admin' : userData.role === 'PROF' ? 'prof' : 'apprenant';
        
        const authenticatedUser: User = {
          id: userData.id,
          email: userData.email,
          name: `${userData.prenom} ${userData.nom}`,
          role: userRole,
          professeurId: userData.professeurId,
          solde: userData.solde
        };
        
        setUser(authenticatedUser);
        localStorage.setItem('user', JSON.stringify(authenticatedUser));
        setLoading(false);
        return true;
      } else {
        // Échec de l'authentification
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
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
