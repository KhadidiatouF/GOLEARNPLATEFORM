import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiCertif } from '../api/apiCertif';
import { apiApprenant } from '../api/apiApprenant';
import DashboardHeader from '../components/DashboardHeader';
import Certificate from '../components/Certificate';
import CourseViewer from '../components/Courseviewer';
import { BookOpen, Clock, Calendar, PlayCircle, Search, ChevronLeft, ChevronRight, TrendingUp, Award } from 'lucide-react';

type TabType = 'dashboard' | 'formations' | 'progression' | 'certificats' | 'messages';

interface MenuItem {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

interface CertificateData {
  id: number;
  apprenantId: number;
  formationId: number;
  dateObtention: string;
  formation?: {
    titre?: string;
    professorName?: string;
    professor?: string | {
      name?: string;
    };
    professeur?: string | {
      nom?: string;
      prenom?: string;
      utilisateur?: {
        nom?: string;
        prenom?: string;
      };
    };
  };
}

// Type pour les formations inscription (utilisé par le dashboard)
interface EnrolledFormation {
  id: number;
  title: string;
  professor: string;
  duration: string;
  image: string | null;
  dateInscription: string;
  progress: number;
  price: number;
  typeCours: string;
}

// Les données d formations seront chargées depuis localStorage (inscriptions)
// const _formationsData = [];

const menuItems: MenuItem[] = [
  {
    id: 'dashboard', label: 'Tableau de bord',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  },
  {
    id: 'formations', label: 'Mes Formations',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
  },
  {
    id: 'progression', label: 'Ma Progression',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
  },
  {
    id: 'certificats', label: 'Mes Certificats',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
  },
  {
    id: 'messages', label: 'Messages',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
  }
];

// Les certifications seront chargées depuis localStorage

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function extractProfessorName(source: unknown): string {
  if (!source) return '';
  if (typeof source === 'string') return source.trim();
  if (typeof source !== 'object') return '';

  const data = source as Record<string, unknown>;
  const directName =
    readString(data.professorName) ||
    readString(data.name) ||
    readString(data.professor);

  if (directName) return directName;

  const nestedProfessor = extractProfessorName(data.professeur);
  if (nestedProfessor) return nestedProfessor;

  const nestedUser = data.utilisateur as Record<string, unknown> | undefined;
  if (nestedUser) {
    const fullName = `${readString(nestedUser.prenom)} ${readString(nestedUser.nom)}`.trim();
    if (fullName) return fullName;
    const userName = readString(nestedUser.name);
    if (userName) return userName;
  }

  return `${readString(data.prenom)} ${readString(data.nom)}`.trim();
}

export default function ApprenantDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null);

  // ── ÉTAT pour la formation sélectionnée ──
  const [selectedFormation, setSelectedFormation] = useState<number | null>(null);
  
  // State pour les formations réelses de l'apprenant
  const [enrolledFormations, setEnrolledFormations] = useState<EnrolledFormation[]>([]);
  const [loadingFormations, setLoadingFormations] = useState(true);

  // Charger les formations depuis l'API
  useEffect(() => {
    const loadFormations = async () => {
      try {
        setLoadingFormations(true);
        if (user?.id) {
          const response = await apiApprenant.getFormationsWithProgress(user.id);
          console.log('✅ Réponse formations:', response);
          // ✅ Corriger l'accès aux données
          if (response && Array.isArray(response)) {
            setEnrolledFormations(response);
          } else if (response && response.data) {
            setEnrolledFormations(response.data);
          }
        }
      } catch (error) {
        console.error('Erreur chargement formations:', error);
      } finally {
        setLoadingFormations(false);
      }
    };
    
    loadFormations();
  }, [user?.id]);

  const [formationSearch, setFormationSearch] = useState('');
  const [formationFilterProf, setFormationFilterProf] = useState('');
  const [formationPage, setFormationPage] = useState(1);
  const formationsPerPage = 4;

  const [certificatSearch, setCertificatSearch] = useState('');
  const [certificatPage, setCertificatPage] = useState(1);
  const certificatsPerPage = 6;
  const [autoDownload, setAutoDownload] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // État pour les certifications depuis l'API
  const [certifications, setCertifications] = useState<CertificateData[]>([]);
  const [certificationsLoading, setCertificationsLoading] = useState(true);

  const loadCertifications = async () => {
    try {
      setCertificationsLoading(true);
      const response = await apiCertif.getCertifications();
      if (response && response.data && response.data.data) {
        setCertifications(response.data.data);
        setCertificationsLoading(false);
        return;
      }
    } catch (error) {
      console.error('Erreur chargement certifications:', error);
    }

    const storedCerts = JSON.parse(localStorage.getItem('certifications') || '[]');
    setCertifications(storedCerts);
    setCertificationsLoading(false);
  };
  
  // Charger les certifications depuis l'API
  useEffect(() => {
    loadCertifications();
  }, []);

  // ── Variables calculées pour les statistiques dynamiques ──
  const totalFormations = enrolledFormations.length;
  const averageProgress = totalFormations > 0 
    ? Math.round(enrolledFormations.reduce((sum, f) => sum + (f.progress || 0), 0) / totalFormations)
    : 0;
  const totalCertificates = certifications.length;
  const totalHours = enrolledFormations.reduce((sum, f) => {
    // Extraire le nombre d'heures de la durée (ex: "2h" -> 2, "1h 30min" -> 1.5)
    const match = f.duration?.match(/(\d+(?:\.\d+)?)/);
    return sum + (match ? parseFloat(match[1]) : 0);
  }, 0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDownloadCertificate = (cert: CertificateData, directDownload = false) => {
    setSelectedCertificate(cert);
    setAutoDownload(directDownload);
  };

  const handleCloseCertificate = () => {
    setSelectedCertificate(null);
    setAutoDownload(false);
  };

  const getCertificateProfessorName = (cert: CertificateData | null): string => {
    if (!cert) return '';

    const professorFromCertificate = extractProfessorName(cert.formation);
    if (professorFromCertificate) return professorFromCertificate;

    const courseTitle = cert.formation?.titre?.trim().toLowerCase();
    if (!courseTitle) return '';

    const matchingFormation = enrolledFormations.find(
      (formation) => formation.title.trim().toLowerCase() === courseTitle
    );

    return matchingFormation?.professor || '';
  };

  // ── Ouvrir une formation : on bascule aussi sur l'onglet formations ──
  const openFormation = (id: number) => {
    setSelectedFormation(id);
    setActiveTab('formations');
  };

  const renderContent = () => {
    // ── Si une formation est sélectionnée, on affiche CourseViewer ──
    // Il s'affiche ici, DANS le <main>, donc le header et la sidebar restent visibles
    if (selectedFormation !== null) {
      return (
        <CourseViewer
          onBack={() => setSelectedFormation(null)}
          formationId={selectedFormation}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="w-full rounded-xl shadow-lg bg-gradient-to-r from-purple-600 to-purple-700 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-white mb-4 md:mb-0">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Bienvenue, {user?.name || 'Apprenant'} !</h2>
                  <p className="text-blue-100 text-sm md:text-base">Continuez votre parcours d'apprentissage</p>
                </div>
                <div className="hidden md:block">
                  <img src="/Online learning-pana.png" alt="Apprenant" className="rounded-lg shadow-md w-80 h-35 object-cover" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-center items-center gap-4 mb-4"><div className="p-3 bg-blue-100 rounded-full"><BookOpen className="w-6 h-6 text-blue-600" /></div></div>
                <h3 className="text-3xl font-bold text-blue-700">{totalFormations}</h3>
                <p className="text-blue-600 font-medium">Formations inscrites</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-center items-center gap-4 mb-4"><div className="p-3 bg-green-100 rounded-full"><TrendingUp className="w-6 h-6 text-green-600" /></div></div>
                <h3 className="text-3xl font-bold text-green-700">{averageProgress}%</h3>
                <p className="text-green-600 font-medium">Progression moyenne</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-center items-center gap-4 mb-4"><div className="p-3 bg-purple-100 rounded-full"><Award className="w-6 h-6 text-purple-600" /></div></div>
                <h3 className="text-3xl font-bold text-purple-700">{totalCertificates}</h3>
                <p className="text-purple-600 font-medium">Certificats obtenus</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-center items-center gap-4 mb-4"><div className="p-3 bg-orange-100 rounded-full"><Clock className="w-6 h-6 text-orange-600" /></div></div>
                <h3 className="text-3xl font-bold text-orange-700">{totalHours}h</h3>
                <p className="text-orange-600 font-medium">Heures de formation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {loadingFormations ? (
                  <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                    <p className="text-gray-500">Chargement des formations...</p>
                  </div>
                ) : enrolledFormations.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                    <p className="text-gray-500">Vous n'êtes inscrit à aucune formation</p>
                  </div>
                ) : (
                  // Afficher seulement les 2 dernières formations consultées
                  enrolledFormations.slice(-2).map((course, idx) => {
                    const colorClass = course.typeCours === 'GRATUIT' ? 'text-purple-600' : 'text-green-600';
                    return (
                    <div key={idx} className="bg-white rounded-xl shadow-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-base font-semibold text-gray-800 mb-1">{course.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${course.price === 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {course.price === 0 ? 'Gratuit' : `${course.price} CFA`}
                          </span>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-full">
                          <PlayCircle className={`w-4 h-4 ${colorClass}`} />
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">Progression</span>
                          <span className="font-medium text-gray-800">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`bg-purple-400 h-2 rounded-full`} style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1"><Clock className="w-3 h-3 text-gray-400" /><span>{course.duration}</span></div>
                        <div className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-gray-400" /><span>Professeur: {course.professor}</span></div>
                      </div>
                      <button
                        onClick={() => openFormation(course.id)}
                        className={`w-full mt-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition`}
                      >
                        Continuer
                      </button>
                    </div>
                  );
                  })
                )}
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-indigo-100 rounded-full"><Calendar className="w-6 h-6 text-indigo-600" /></div>
                  <h3 className="text-lg font-semibold text-gray-800">Calendrier</h3>
                </div>
                <div className="text-center mb-4">
                  <span className="text-xl font-bold text-gray-800">{currentTime.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
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
                      <div key={day} className={`p-2 text-sm rounded-full cursor-pointer transition-colors ${isToday ? 'bg-blue-600 text-white font-bold' : 'text-gray-700 hover:bg-blue-100'}`}>
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
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Mes Formations</h2>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Rechercher par nom..." value={formationSearch}
                    onChange={(e) => { setFormationSearch(e.target.value); setFormationPage(1); }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div className="min-w-37.5">
                <select value={formationFilterProf} onChange={(e) => { setFormationFilterProf(e.target.value); setFormationPage(1); }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Tous les profs</option>
                  {[...new Set(enrolledFormations.map(f => f.professor))].map((prof, idx) => (
                    <option key={idx} value={prof}>{prof}</option>
                  ))}
                </select>
              </div>
            </div>
            {(() => {
              // ✅ UTILISER LES DONNÉES DE L'API PAS LE LOCALSTORAGE !
              const filteredFormations = enrolledFormations.filter((formation: EnrolledFormation) => {
                const matchesSearch = formation.title.toLowerCase().includes(formationSearch.toLowerCase());
                const matchesProf = !formationFilterProf || formation.professor.toLowerCase().includes(formationFilterProf.toLowerCase());
                return matchesSearch && matchesProf;
              });
              const totalPages = Math.ceil(filteredFormations.length / formationsPerPage);
              const paginatedFormations = filteredFormations.slice((formationPage - 1) * formationsPerPage, formationPage * formationsPerPage);
              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paginatedFormations.map((formation: EnrolledFormation) => (
                      <div key={formation.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold">{formation.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{formation.professor}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2 mb-1">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${formation.progress}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-600">{formation.progress}% complété</p>
                        {/* ── Bouton : appelle openFormation ── */}
                        <button
                          onClick={() => openFormation(formation.id)}
                          className="mt-3 w-full py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Continuer la formation
                        </button>
                      </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <button onClick={() => setFormationPage(p => Math.max(1, p - 1))} disabled={formationPage === 1} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft className="w-5 h-5" /></button>
                      <span className="text-sm text-gray-600">Page {formationPage} sur {totalPages}</span>
                      <button onClick={() => setFormationPage(p => Math.min(totalPages, p + 1))} disabled={formationPage === totalPages} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                  )}
                  {filteredFormations.length === 0 && <p className="text-center text-gray-500 py-8">Aucune formation trouvée</p>}
                </>
              );
            })()}
          </div>
        );

      case 'progression':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-green-500 rounded-full"></span>Ma Progression
            </h2>
            {loadingFormations ? (
              <p className="text-gray-500">Chargement...</p>
            ) : enrolledFormations.length === 0 ? (
              <p className="text-gray-500">Aucune formation en cours</p>
            ) : (
            <div className="space-y-6">
              {enrolledFormations.map((course, idx) => {
                const color = course.progress >= 75 ? 'from-green-500 to-green-700' : course.progress >= 50 ? 'from-yellow-500 to-orange-500' : 'from-red-500 to-red-700';
                return (
                <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-800">{course.title}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${course.progress >= 75 ? 'bg-green-100 text-green-700' : course.progress >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className={`bg-gradient-to-r ${color} h-3 rounded-full transition-all duration-500`} style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>0%</span><span>50%</span><span>100%</span>
                  </div>
                </div>
                )})}
            </div>
            )}
          </div>
        );

      case 'certificats':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-yellow-500 rounded-full"></span>Mes Certificats
            </h2>
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Rechercher par nom de certificat..." value={certificatSearch}
                  onChange={(e) => { setCertificatSearch(e.target.value); setCertificatPage(1); }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500" />
              </div>
            </div>
            {(() => {
              // Utiliser les certifications depuis l'API (afficher toutes pour le moment)
              // Afficher un indicateur de chargement si nécessaire
              if (certificationsLoading) {
                return (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                );
              }
              
               const filteredCerts = Array.isArray(certifications) ? certifications.filter((cert) => cert.formation?.titre && cert.formation?.titre.toLowerCase().includes(certificatSearch.toLowerCase())) : [];
              const totalPages = Math.ceil(filteredCerts.length / certificatsPerPage);
              const paginatedCerts = filteredCerts.slice((certificatPage - 1) * certificatsPerPage, certificatPage * certificatsPerPage);
              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paginatedCerts.map((cert: CertificateData) => (
                      <div key={cert.id} className="relative overflow-hidden bg-linear-to-br from-yellow-50 to-amber-100 rounded-xl p-5 border border-yellow-200 hover:shadow-lg transition-shadow">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-200 rounded-full -mr-8 -mt-8 opacity-50"></div>
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-md">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-800">{cert.formation?.titre || 'Certification'}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              {cert.dateObtention ? new Date(cert.dateObtention).toLocaleDateString('fr-FR') : ''}
                            </p>
                          </div>
                        </div>
                        <button onClick={() => handleDownloadCertificate(cert, true)}
                          className="w-full mt-4 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          Telecharger PDF
                        </button>
                      </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <button onClick={() => setCertificatPage(p => Math.max(1, p - 1))} disabled={certificatPage === 1} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft className="w-5 h-5" /></button>
                      <span className="text-sm text-gray-600">Page {certificatPage} sur {totalPages}</span>
                      <button onClick={() => setCertificatPage(p => Math.min(totalPages, p + 1))} disabled={certificatPage === totalPages} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                  )}
                  {filteredCerts.length === 0 && <p className="text-center text-gray-500 py-8">Aucun certificat trouvé</p>}
                </>
              );
            })()}
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
    <div className="w-screen h-screen bg-gray-100">
      <DashboardHeader color="purple" />

      {/* Desktop sidebar */}
      <aside className={`hidden lg:fixed left-0 top-16 h-screen bg-white shadow-lg z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} lg:block`}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-6 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-purple-700 transition-colors">
          <svg className={`w-4 h-4 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            {sidebarOpen && <span className="font-bold text-xl text-purple-600">Apprenant</span>}
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button key={item.id}
              onClick={() => {
                // Si on clique sur un menu pendant qu'une formation est ouverte,
                // on ferme la formation et on navigue vers l'onglet
                setSelectedFormation(null);
                setActiveTab(item.id);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                // Surligner "Mes Formations" quand une formation est ouverte
                (selectedFormation !== null && item.id === 'formations') || (selectedFormation === null && activeTab === item.id)
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
                <span className="font-medium text-gray-600">{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Déconnexion
            </button>
          </div>
        )}
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40">
        <div className="flex justify-around items-center py-2">
          {menuItems.map((item) => (
            <button key={item.id}
              onClick={() => { setSelectedFormation(null); setActiveTab(item.id); }}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${activeTab === item.id ? 'text-purple-600' : 'text-gray-500'}`}>
              <span className="shrink-0">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── MAIN : CourseViewer s'affiche ici, le header et la sidebar restent visibles ── */}
      <main className={`lg:flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} pb-20 lg:pb-0`}>
        {selectedFormation !== null ? (
          // CourseViewer prend toute la hauteur disponible sous le header
          <div className="h-[calc(100vh-64px)] overflow-hidden">
            <CourseViewer
              onBack={() => setSelectedFormation(null)}
              formationId={selectedFormation}
              onCertificationEarned={() => {
                loadCertifications();
              }}
              onOpenCertificates={() => {
                loadCertifications();
                setSelectedFormation(null);
                setActiveTab('certificats');
              }}
            />
          </div>
        ) : (
          <div className="p-8 mt-12">
            {renderContent()}
          </div>
        )}
      </main>

      {selectedCertificate && (
        <Certificate
          courseName={selectedCertificate?.formation?.titre || ''}
          completionDate={selectedCertificate?.dateObtention ? new Date(selectedCertificate.dateObtention).toLocaleDateString('fr-FR') : ''}
          instructor="Golearn"
          courseInstructorName={getCertificateProfessorName(selectedCertificate)}
          onClose={handleCloseCertificate}
          autoDownload={autoDownload}
        />
      )}
    </div>
  );
}
