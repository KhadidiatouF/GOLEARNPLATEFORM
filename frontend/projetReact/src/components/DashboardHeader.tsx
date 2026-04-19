import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardPreferences, type ThemeColor } from '../utils/dashboardPreferences';

interface DashboardHeaderProps {
  color: ThemeColor;
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
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [themeColor, setThemeColor] = React.useState<ThemeColor>(color);
  const [profilePhoto, setProfilePhoto] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user?.role) {
      setThemeColor(color);
      setProfilePhoto(null);
      return;
    }

    const syncPreferences = () => {
      const preferences = getDashboardPreferences(user.role);
      setThemeColor(preferences.themeColor || color);
      setProfilePhoto(preferences.profilePhoto);
    };

    syncPreferences();
    window.addEventListener('dashboard-preferences-updated', syncPreferences);

    return () => {
      window.removeEventListener('dashboard-preferences-updated', syncPreferences);
    };
  }, [color, user?.role]);

  const colors = colorMap[themeColor];

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
        {/* Bouton menu burger pour mobile */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden lg:flex items-center gap-3">
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profil" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="font-semibold text-gray-700">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
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
          className="hidden lg:block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Déconnexion
        </button>

        {/* Menu burger déroulant mobile */}
        {menuOpen && (
          <div className="absolute top-full right-4 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 min-w-[240px] z-50">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-3">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profil" className="w-12 h-12 rounded-full object-cover border border-gray-200" />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-gray-700 text-lg">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
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
              className="w-full text-left px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
