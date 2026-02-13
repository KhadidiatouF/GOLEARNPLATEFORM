import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardHeader from '../components/DashboardHeader';

type TabType = 'dashboard' | 'formations' | 'apprenants' | 'travaux' | 'messages';

interface MenuItem {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Tableau de bord',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    id: 'formations',
    label: 'Mes Formations',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    id: 'apprenants',
    label: 'Mes Apprenants',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    id: 'travaux',
    label: 'Travaux à corriger',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    )
  }
];

export default function ProfDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-linear-to-br from-green-500 to-green-700 rounded-xl p-6 text-white">
              <h3 className="text-3xl font-bold">12</h3>
              <p className="opacity-90">Formations actives</p>
            </div>
            <div className="bg-linear-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white">
              <h3 className="text-3xl font-bold">89</h3>
              <p className="opacity-90">Apprenants inscrits</p>
            </div>
            <div className="bg-linear-to-br from-orange-500 to-orange-700 rounded-xl p-6 text-white">
              <h3 className="text-3xl font-bold">23</h3>
              <p className="opacity-90">Travaux en attente</p>
            </div>
          </div>
        );
      case 'formations':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Mes Formations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold">Introduction à React</h3>
                <p className="text-sm text-gray-600">45 apprenants • 12 modules</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold">JavaScript Avancé</h3>
                <p className="text-sm text-gray-600">32 apprenants • 8 modules</p>
              </div>
            </div>
          </div>
        );
      case 'apprenants':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Mes Apprenants</h2>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Nom</th>
                  <th className="px-4 py-2 text-left">Formation</th>
                  <th className="px-4 py-2 text-left">Progression</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">Jean Martin</td>
                  <td className="px-4 py-2">React</td>
                  <td className="px-4 py-2">75%</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Marie Dupont</td>
                  <td className="px-4 py-2">JavaScript</td>
                  <td className="px-4 py-2">50%</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 'travaux':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Travaux à corriger</h2>
            <div className="space-y-3">
              <div className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">Projet React - Jean Martin</p>
                  <p className="text-sm text-gray-500">Soumis il y a 2 jours</p>
                </div>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                  Corriger
                </button>
              </div>
              <div className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">TP JavaScript - Marie Dupont</p>
                  <p className="text-sm text-gray-500">Soumis il y a 1 jour</p>
                </div>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                  Corriger
                </button>
              </div>
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Messages</h2>
            <p className="text-gray-500">Aucun message</p>
          </div>
        );
    }
  };

  return (
    <div className=" w-screen h-screen bg-gray-100">
      <DashboardHeader color="green" />
      
      <div className="flex pt-16">
        <aside className={`fixed left-0 top-16 h-screen bg-white shadow-lg z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-6 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-green-700 transition-colors"
          >
            <svg className={`w-4 h-4 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              {sidebarOpen && (
                <span className="font-bold text-xl text-green-600">Professeur</span>
              )}
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-green-100 text-green-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {sidebarOpen && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="font-medium text-gray-600">
                    {user?.name?.charAt(0).toUpperCase() || 'P'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Déconnexion
              </button>
            </div>
          )}
        </aside>

        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {menuItems.find(item => item.id === activeTab)?.label}
              </h1>
              <p className="text-gray-600">Dashboard professeur • {user?.name}</p>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
