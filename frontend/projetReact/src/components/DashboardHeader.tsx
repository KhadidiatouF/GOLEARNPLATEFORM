import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface DashboardHeaderProps {
  color: 'purple' | 'green' | 'blue';
}

const colorMap = {
  purple: {
    bg: 'bg-purple-600',
    text: 'text-purple-600',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700'
  },
  green: {
    bg: 'bg-green-600',
    text: 'text-green-600',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-700'
  },
  blue: {
    bg: 'bg-blue-600',
    text: 'text-blue-600',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700'
  }
};

const roleLabels = {
  admin: 'Admin',
  prof: 'Professeur',
  apprenant: 'Apprenant'
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ color }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const colors = colorMap[color];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 w-full flex justify-between items-center px-8 py-4 bg-white/95 backdrop-blur-md z-1000 border-b border-gray-100">
      <div 
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
          <span className="text-white font-bold text-lg">G</span>
        </div>
        <span className={`text-xl font-black tracking-tight ${colors.text}`}>
          GOLEARN
        </span>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="font-semibold text-gray-700">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">
              {user?.name}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium inline-block w-fit ${colors.badge}`}>
              {user?.role ? roleLabels[user.role] : 'Utilisateur'}
            </span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
