  import React, { useState } from 'react';
import './Header.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="fixed top-0 w-full flex justify-between items-center px-4 md:px-16 py-4 bg-white/95 backdrop-blur-md z-1000 border-b border-gray-100">
      <div 
        className="text-xl font-black tracking-tight text-black cursor-pointer" 
        onClick={() => navigate('/')}
      >
        GOLEARN
      </div>
      
      {/* Menu burger pour mobile */}
      <button 
        className="md:hidden p-2 text-gray-600"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation desktop */}
      <nav className="hidden md:flex gap-8">
        <Link to="/" className="text-sm font-medium hover:text-purple-600 transition-colors">Accueil</Link>
        <Link to="/formations" className="text-sm font-medium hover:text-purple-600 transition-colors">Formations</Link>
        <Link to="/a-propos" className="text-sm font-medium hover:text-purple-600 transition-colors">A propos</Link>
        <Link to="/contact" className="text-sm font-medium hover:text-purple-600 transition-colors">Contact</Link>
      </nav>

      {isAuthenticated && user ? (
        <div className="hidden md:flex gap-3 items-center">
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
        <div className="hidden md:flex gap-3">
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

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden">
          <div className="flex flex-col p-4 gap-4">
            <Link to="/" className="text-sm font-medium hover:text-purple-600" onClick={() => setMobileMenuOpen(false)}>Accueil</Link>
            <Link to="/formations" className="text-sm font-medium hover:text-purple-600" onClick={() => setMobileMenuOpen(false)}>Formations</Link>
            <Link to="/a-propos" className="text-sm font-medium hover:text-purple-600" onClick={() => setMobileMenuOpen(false)}>A propos</Link>
            <Link to="/contact" className="text-sm font-medium hover:text-purple-600" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <hr className="my-2" />
            {isAuthenticated && user ? (
              <>
                <Link 
                  to={getDashboardLink()}
                  className="px-4 py-2 text-purple-600 text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mon Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-xs font-bold"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="px-6 py-2 bg-[#9333ea] text-white rounded-full text-xs font-bold"
                >
                  Se connecter
                </button>
                <button 
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                  className="px-6 py-2 bg-[#9333ea] text-white rounded-full text-xs font-bold"
                >
                  S'inscrire
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
