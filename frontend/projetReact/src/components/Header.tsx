  import React from 'react';
import './Header.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'prof':
        return '/prof';
      case 'apprenant':
        return '/apprenant';
      default:
        return '/formations';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'prof':
        return 'Professeur';
      case 'apprenant':
        return 'Apprenant';
      default:
        return 'Utilisateur';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'prof':
        return 'bg-green-100 text-green-700';
      case 'apprenant':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return null;
  }

  return (
    <header className="fixed top-0 w-full flex justify-between items-center px-16 py-4 bg-white/95 backdrop-blur-md z-1000 border-b border-gray-100">
      <div 
        className="text-xl font-black tracking-tight text-black cursor-pointer" 
        onClick={() => navigate('/')}
      >
        GOLEARN
      </div>
      
      <nav className="hidden md:flex gap-8">
        <Link to="/" className="text-sm font-medium hover:text-purple-600 transition-colors">Accueil</Link>
        <Link to="/formations" className="text-sm font-medium hover:text-purple-600 transition-colors">Formations</Link>
        <a href="#" className="text-sm font-medium hover:text-purple-600 transition-colors">A propos</a>
        <a href="#" className="text-sm font-medium hover:text-purple-600 transition-colors">Contact</a>
      </nav>

      {isAuthenticated && user ? (
        <div className="flex gap-3 items-center">
          <Link 
            to={getDashboardLink()}
            className="px-4 py-2 text-purple-600 text-sm font-medium hover:bg-purple-50 rounded-full transition-colors"
          >
            Mon Dashboard
          </Link>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
            {getRoleLabel(user.role)}
          </div>
          <span className="text-sm text-gray-600 hidden lg:block">
            {user.name}
          </span>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-xs font-bold hover:bg-gray-300 transition cursor-pointer"
          >
            Déconnexion
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-[#9333ea] text-white rounded-full text-xs font-bold hover:bg-purple-700 transition cursor-pointer"
          >
            Se connecter
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="px-6 py-2 bg-[#9333ea] text-white rounded-full text-xs font-bold hover:bg-purple-700 transition cursor-pointer"
          >
            S'inscrire
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
