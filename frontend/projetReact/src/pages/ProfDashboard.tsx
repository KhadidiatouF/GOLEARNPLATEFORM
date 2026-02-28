import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { BookOpen, Users, Calendar, Plus, Trash2, Edit2, Clock, CheckCircle, XCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  students: number;
  modules: number;
  type: 'payant' | 'gratuit';
  status: 'pending' | 'validated' | 'rejected';
  color: string;
}

type TabType = 'dashboard' | 'formations' | 'apprenants' | 'travaux' | 'parametres';

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
    id: 'parametres',
    label: 'Paramètres',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

export default function ProfDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, title: 'Introduction à React', description: 'Apprenez les bases de React', students: 45, modules: 12, type: 'payant', status: 'validated', color: 'from-blue-500 to-blue-700' },
    { id: 2, title: 'JavaScript Avancé', description: 'Maîtrisez JavaScript', students: 32, modules: 8, type: 'gratuit', status: 'validated', color: 'from-green-500 to-green-700' },
    { id: 3, title: 'TypeScript Fundamentals', description: 'Introduction à TypeScript', students: 28, modules: 10, type: 'payant', status: 'pending', color: 'from-purple-500 to-purple-700' },
    { id: 4, title: 'Node.js Backend', description: 'Créez des API avec Node.js', students: 20, modules: 15, type: 'gratuit', status: 'pending', color: 'from-orange-500 to-orange-700' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', modules: 0, type: 'gratuit' as 'payant' | 'gratuit' });

  // Pagination et filtration pour les formations
  const [formationSearch, setFormationSearch] = useState('');
  const [formationFilterStatus, setFormationFilterStatus] = useState('');
  const [formationPage, setFormationPage] = useState(1);
  const formationsPerPage = 4;

  // Pagination et filtration pour les apprenants
  const [apprenantSearch, setApprenantSearch] = useState('');
  const [apprenantFilterCourse, setApprenantFilterCourse] = useState('');
  const [apprenantPage, setApprenantPage] = useState(1);
  const apprenantsPerPage = 10;

  const handleAddCourse = () => {
    const course: Course = {
      id: Date.now(),
      title: newCourse.title,
      description: newCourse.description,
      students: 0,
      modules: newCourse.modules,
      type: newCourse.type,
      status: 'pending', // En attente de validation admin
      color: 'from-indigo-500 to-indigo-700',
    };
    setCourses([course, ...courses]);
    setIsModalOpen(false);
    setNewCourse({ title: '', description: '', modules: 0, type: 'gratuit' });
  };

  const handleDeleteCourse = () => {
    if (courseToDelete) {
      setCourses(courses.filter(c => c.id !== courseToDelete));
      setCourseToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const confirmDelete = (id: number) => {
    setCourseToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Horloge en temps réel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Carte de bienvenue avec image */}
            <div className="w-full rounded-xl shadow-lg bg-linear-to-r from-green-600 to-green-700 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                {/* Texte à gauche */}
                <div className="text-white mb-4 md:mb-0">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    Bienvenue, {user?.name || 'Professeur'} !
                  </h2>
                  <p className="text-green-100 text-sm md:text-base">
                    Gérez vos formations et apprenants
                  </p>
                </div>
                {/* Image à droite */}
                <div className="hidden md:block">
                  <img 
                    src="/prof.png" 
                    alt="Professeur" 
                    className="rounded-lg shadow-md w-80 h-35  object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Les 4 cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-green-700">12</h3>
                <p className="text-green-600 font-medium">Formations actives</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-blue-700">89</h3>
                <p className="text-blue-600 font-medium">Apprenants inscrits</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-orange-700">23</h3>
                <p className="text-orange-600 font-medium">Travaux en attente</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-purple-700">156</h3>
                <p className="text-purple-600 font-medium">Formations validées</p>
              </div>
            </div>

            {/* Progression des apprenants (en haut) et 3 derniers cours (en dessous) + Calendrier à droite */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne de gauche - Progression + Cours */}
              <div className="lg:col-span-2 space-y-6">
                {/* Statistiques de progression */}
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-800">Progression des apprenants</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Marie Dupont', course: 'React Avancé', progress: 85 },
                      { name: 'Jean Martin', course: 'JavaScript ES6+', progress: 72 },
                    ].map((student, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">{student.name}</span>
                          <span className="text-xs text-gray-500">{student.course}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-linear-to-r from-green-500 to-green-600 h-2 rounded-full" 
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cours ajoutés récemment */}
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <BookOpen className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-800">Cours ajoutés récemment</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: 'React Avancé', date: '15 Feb 2026', type: 'payant', description: 'Maîtrisez les concepts avancés de React' },
                      { title: 'JavaScript ES6+', date: '10 Feb 2026', type: 'gratuit', description: 'Apprenez les nouvelles fonctionnalités JavaScript' },
                    ].map((course, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-gray-800">{course.title}</h4>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${course.type === 'payant' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            {course.type === 'payant' ? 'Payant' : 'Gratuit'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">{course.description}</p>
                        <p className="text-xs text-gray-400">Créé le {course.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Colonne de droite - Calendrier vertical */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Calendrier</h3>
                </div>
                <div className="text-center mb-4">
                  <span className="text-xl font-bold text-gray-800">
                    {currentTime.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
                    <div key={day} className="text-xs font-medium text-gray-500 py-2">{day}</div>
                  ))}
                  {Array.from({ length: getFirstDayOfMonth(currentTime.getFullYear(), currentTime.getMonth()) }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="p-2" />
                  ))}
                  {Array.from({ length: getDaysInMonth(currentTime.getFullYear(), currentTime.getMonth()) }).map((_, idx) => {
                    const day = idx + 1;
                    const isToday = day === currentTime.getDate();
                    return (
                      <div 
                        key={day} 
                        className={`p-2 text-sm rounded-full cursor-pointer transition-colors ${
                          isToday ? 'bg-green-600 text-white font-bold' : 'text-gray-700 hover:bg-green-100'
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      case 'formations':
        return (
          <div className="space-y-6 mt-12">
            {/* En-tête avec bouton d'ajout */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-2 h-8 bg-green-600 rounded-full"></span>
                  Mes Formations
                </h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter une formation
                </button>
              </div>
              
              {/* Filtres de recherche */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom..."
                      value={formationSearch}
                      onChange={(e) => { setFormationSearch(e.target.value); setFormationPage(1); }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <div className="min-w-[150px]">
                  <select
                    value={formationFilterStatus}
                    onChange={(e) => { setFormationFilterStatus(e.target.value); setFormationPage(1); }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="validated">Validée</option>
                    <option value="pending">En attente</option>
                    <option value="rejected">Rejetée</option>
                  </select>
                </div>
              </div>

              {/* Formations filtrées */}
              {(() => {
                const filteredCourses = courses.filter(course => {
                  const matchesSearch = course.title.toLowerCase().includes(formationSearch.toLowerCase());
                  const matchesStatus = !formationFilterStatus || course.status === formationFilterStatus;
                  return matchesSearch && matchesStatus;
                });
                const totalPages = Math.ceil(filteredCourses.length / formationsPerPage);
                const paginatedCourses = filteredCourses.slice(
                  (formationPage - 1) * formationsPerPage,
                  formationPage * formationsPerPage
                );
                
                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paginatedCourses.map((course) => (
                        <div key={course.id} className={`relative overflow-hidden rounded-xl p-5 bg-linear-to-r ${course.color} text-white shadow-md hover:shadow-lg transition-shadow`}>
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                          
                          {/* Status badge et boutons */}
                          <div className="flex justify-between items-start mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                              course.status === 'validated' ? 'bg-green-400 text-green-900' :
                              course.status === 'pending' ? 'bg-yellow-400 text-yellow-900' :
                              'bg-red-400 text-red-900'
                            }`}>
                              {course.status === 'validated' ? <><CheckCircle className="w-3 h-3" /> Validée</> :
                               course.status === 'pending' ? <><Clock className="w-3 h-3" /> En attente</> :
                               <><XCircle className="w-3 h-3" /> Rejetée</>}
                            </span>
                            <div className="flex gap-2">
                              <button className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => confirmDelete(course.id)}
                                className="p-1.5 bg-white/20 rounded-lg hover:bg-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                          <p className="text-white/80 text-sm mb-3">{course.description}</p>
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-1 bg-white/20 rounded text-xs">{course.students} apprenants</span>
                            <span className="px-2 py-1 bg-white/20 rounded text-xs">{course.modules} modules</span>
                            <span className={`px-2 py-1 rounded text-xs ${course.type === 'payant' ? 'bg-yellow-400 text-yellow-900' : 'bg-green-400 text-green-900'}`}>
                              {course.type === 'payant' ? 'Payant' : 'Gratuit'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-6">
                        <button
                          onClick={() => setFormationPage(p => Math.max(1, p - 1))}
                          disabled={formationPage === 1}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-600">
                          Page {formationPage} sur {totalPages}
                        </span>
                        <button
                          onClick={() => setFormationPage(p => Math.min(totalPages, p + 1))}
                          disabled={formationPage === totalPages}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    
                    {filteredCourses.length === 0 && (
                      <p className="text-center text-gray-500 py-8">Aucune formation trouvée</p>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Modal d'ajout de formation */}
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Ajouter une formation"
              size="lg"
            >
              <form onSubmit={(e) => { e.preventDefault(); handleAddCourse(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la formation</label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: React Avancé"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Décrivez votre formation..."
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de modules</label>
                  <input
                    type="number"
                    value={newCourse.modules}
                    onChange={(e) => setNewCourse({ ...newCourse, modules: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de formation</label>
                  <select
                    value={newCourse.type}
                    onChange={(e) => setNewCourse({ ...newCourse, type: e.target.value as 'payant' | 'gratuit' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="gratuit">Gratuit</option>
                    <option value="payant">Payant</option>
                  </select>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Cette formation sera soumise à validation par l'administrateur avant d'être visible publiquement.
                  </p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Soumettre pour validation
                  </button>
                </div>
              </form>
            </Modal>

            {/* Dialog de confirmation de suppression */}
            <ConfirmDialog
              isOpen={isDeleteDialogOpen}
              title="Supprimer la formation"
              message="Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible."
              confirmText="Supprimer"
              cancelText="Annuler"
              onConfirm={handleDeleteCourse}
              onCancel={() => setIsDeleteDialogOpen(false)}
              type="danger"
            />
          </div>
        );
      case 'apprenants':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
              Mes Apprenants
            </h2>
            
            {/* Filtres de recherche */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom..."
                    value={apprenantSearch}
                    onChange={(e) => { setApprenantSearch(e.target.value); setApprenantPage(1); }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="min-w-[180px]">
                <select
                  value={apprenantFilterCourse}
                  onChange={(e) => { setApprenantFilterCourse(e.target.value); setApprenantPage(1); }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Toutes les formations</option>
                  <option value="React Avancé">React Avancé</option>
                  <option value="JavaScript ES6+">JavaScript ES6+</option>
                  <option value="TypeScript">TypeScript</option>
                </select>
              </div>
            </div>

            {/* Apprenants filtrés */}
            {(() => {
              const allApprenants = [
                { name: 'Jean Martin', formation: 'React Avancé', progress: 75, status: 'actif' },
                { name: 'Marie Dupont', formation: 'JavaScript ES6+', progress: 50, status: 'actif' },
                { name: 'Sophie Leroy', formation: 'TypeScript', progress: 85, status: 'actif' },
                { name: 'Pierre Durant', formation: 'React Avancé', progress: 30, status: 'en pause' },
              ];
              const filteredApprenants = allApprenants.filter(apprenant => {
                const matchesSearch = apprenant.name.toLowerCase().includes(apprenantSearch.toLowerCase());
                const matchesCourse = !apprenantFilterCourse || apprenant.formation === apprenantFilterCourse;
                return matchesSearch && matchesCourse;
              });
              const totalPages = Math.ceil(filteredApprenants.length / apprenantsPerPage);
              const paginatedApprenants = filteredApprenants.slice(
                (apprenantPage - 1) * apprenantsPerPage,
                apprenantPage * apprenantsPerPage
              );
              
              return (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-linear-to-r from-blue-50 to-indigo-50">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Formation</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Progression</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedApprenants.map((student, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                                  {student.name.charAt(0)}
                                </div>
                                <span className="font-medium text-gray-800">{student.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{student.formation}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${student.progress >= 75 ? 'bg-green-500' : student.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                    style={{ width: `${student.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{student.progress}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                student.status === 'actif' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {student.status === 'actif' ? '✅ Actif' : '⏸️ En pause'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <button
                        onClick={() => setApprenantPage(p => Math.max(1, p - 1))}
                        disabled={apprenantPage === 1}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {apprenantPage} sur {totalPages}
                      </span>
                      <button
                        onClick={() => setApprenantPage(p => Math.min(totalPages, p + 1))}
                        disabled={apprenantPage === totalPages}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  
                  {filteredApprenants.length === 0 && (
                    <p className="text-center text-gray-500 py-8">Aucun apprenant trouvé</p>
                  )}
                </>
              );
            })()}
          </div>
        );
      case 'travaux':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-orange-600 rounded-full"></span>
              Travaux à corriger
            </h2>
            <div className="space-y-4">
              {[
                { title: 'Projet React - Application Dashboard', student: 'Jean Martin', date: 'il y a 2 jours', type: 'projet', priority: 'haute' },
                { title: 'TP JavaScript - Manipulation du DOM', student: 'Marie Dupont', date: 'il y a 1 jour', type: 'tp', priority: 'moyenne' },
                { title: 'Examen TypeScript - Types avancés', student: 'Sophie Leroy', date: 'il y a 3 jours', type: 'examen', priority: 'basse' },
              ].map((work, idx) => (
                <div key={idx} className="relative overflow-hidden bg-linear-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-orange-400 to-orange-600"></div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          work.type === 'projet' ? 'bg-purple-100 text-purple-700' :
                          work.type === 'tp' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {work.type === 'projet' ? '📁 Projet' : work.type === 'tp' ? '📝 TP' : '📋 Examen'}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          work.priority === 'haute' ? 'bg-red-100 text-red-700' :
                          work.priority === 'moyenne' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {work.priority === 'haute' ? '🔴 Haute' : work.priority === 'moyenne' ? '🟡 Moyenne' : '🟢 Basse'}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-1">{work.title}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <span>👤 {work.student}</span>
                        <span className="mx-2">•</span>
                        <span>📅 {work.date}</span>
                      </p>
                    </div>
                    <button className="ml-4 bg-linear-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-md flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Corriger
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'parametres':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-gray-600 rounded-full"></span>
              Paramètres
            </h2>
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Profil</h3>
                <p className="text-sm text-gray-600">Gérez vos informations personnelles</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Notifications</h3>
                <p className="text-sm text-gray-600">Configurez vos préférences de notification</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Sécurité</h3>
                <p className="text-sm text-gray-600">Modifiez votre mot de passe</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className=" w-screen h-screen bg-gray-100">
      <DashboardHeader color="purple" />
      
      {/* Desktop sidebar */}
      <aside className={`hidden lg:fixed left-0 top-16 h-screen bg-white shadow-lg z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} lg:block`}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-6 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-purple-700 transition-colors"
        >
          <svg className={`w-4 h-4 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            {sidebarOpen && (
              <span className="font-bold text-xl text-purple-600">Professeur</span>
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
                  ? 'bg-purple-100 text-purple-600'
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

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40">
        <div className="flex justify-around items-center py-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'text-purple-600'
                  : 'text-gray-500'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

        <main className={`lg:flex-1 transition-all duration-300 lg:ml-64 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} pb-20 lg:pb-0`}>
          <div className="p-4 md:p-6 lg:p-8 mt-12">
            {renderContent()}
          </div>
        </main>
    </div>
  );
}
