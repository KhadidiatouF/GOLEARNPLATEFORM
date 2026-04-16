import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { apiFormation } from '../api/apiFormation';
import { apiProgression } from '../api/apiProgression';
import { apiUsers } from '../api/apiUsers';
import { BookOpen, Users, Calendar, Plus, Trash2, Edit2, Clock, CheckCircle, XCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';

// Types pour la création complète de formation


interface Chapitre {
  titre: string;
  contenu: string;
  duree: string;
  typeContenu: 'VIDEO' | 'PDF' | 'TEXTE';
}

interface Reponse {
  contenu: string;
  estCorrecte: boolean;
}

interface Question {
  contenu: string;
  reponses: Reponse[];
}

interface Quiz {
  questions: Question[];
}

interface Session {
  titre: string;
  contenu?: string;
  duree?: string;
  chapitres: Chapitre[];
  quiz?: Quiz;
}

interface ApprenantData {
  apprenant?: {
    id: number;
    name: string;
    email?: string;
  };
  formation?: {
    id: number;
    titre: string;
  } | string;
  progression?: {
    percentage: number;
  };
  name?: string;
  progress?: number;
  status?: string;
}

interface Course {
  id: number;
  titre: string;
  description: string;
  prix: number;
  categorie: string;
  niveau: string;
  image?: string;
  typeCours: 'PAYANT' | 'GRATUIT';
  students: number;
  modules: number;
  status: 'EN_ATTENTE' | 'VALIDEE' | 'REJETEE';
  color: string;
  professeurId: number;
}

// Interface pour les données de formation reçues de l'API
interface FormationFromAPI {
  id: number;
  titre: string;
  description: string;
  prix: number;
  categorie: string;
  niveau: string;
  image?: string | null;
  typeCours: 'PAYANT' | 'GRATUIT';
  status?: 'EN_ATTENTE' | 'VALIDEE' | 'REJETEE';
  // Le champ "statut" peut aussi être envoyé par l'API
  statut?: 'EN_ATTENTE' | 'VALIDEE' | 'REJETEE';
  professeurId: number;
  sessions?: { id: number }[];
  apprenants?: { id: number }[];
}

type TabType = 'dashboard' | 'formations' | 'apprenants' | 'solde' | 'parametres';

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
    id: 'solde',
    label: 'Solde',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [solde, setSolde] = useState<number>(0);
  const [newCourse, setNewCourse] = useState({
    titre: '',
    description: '',
    prix: 0,
    categorie: '',
    niveau: '',
    typeCours: 'GRATUIT' as 'PAYANT' | 'GRATUIT',
    image: '',
    sessions: [{ titre: '', chapitres: [], quiz: undefined } as Session]
  });
  
  // Gestion des erreurs du formulaire
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

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

  // État pour les apprenants inscrits (dynamique)
  const [enrolledApprenants, setEnrolledApprenants] = useState<ApprenantData[]>([]);
  const [apprenantsLoading, setApprenantsLoading] = useState(true);



  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!newCourse.titre.trim()) {
      errors.titre = 'Le titre est requis';
    } else if (newCourse.titre.trim().length < 2) {
      errors.titre = 'Le titre doit contenir au moins 2 caractères';
    }
    
    if (!newCourse.description.trim()) {
      errors.description = 'La description est requise';
    } else if (newCourse.description.trim().length < 10) {
      errors.description = 'La description doit contenir au moins 10 caractères';
    }
    
    if (!newCourse.categorie) {
      errors.categorie = 'La catégorie est requise';
    }
    
    if (!newCourse.niveau) {
      errors.niveau = 'Le niveau est requis';
    }
    
    // Prix requis uniquement pour les formations payantes
    if (newCourse.typeCours === 'PAYANT' && (!newCourse.prix || newCourse.prix <= 0)) {
      errors.prix = 'Le prix est requis pour une formation payante';
    }
    
    // Validation des sessions (au moins une session requise)
    if (!newCourse.sessions || newCourse.sessions.length === 0) {
      errors.sessions = 'Au moins une session est requise';
    } else {
      newCourse.sessions.forEach((session, index) => {
        if (!session.titre.trim()) {
          errors[`session_${index}`] = `Le titre de la session ${index + 1} est requis`;
        }
      });
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCourse = async () => {
    // Réinitialiser les erreurs et le statut
    setFormErrors({});
    setSubmitStatus({ type: null, message: '' });
    
    // Valider le formulaire
    if (!validateForm()) {
      return;
    }
    
    try {
      // Récupérer le professeurId depuis le contexte d'authentification
      const professeurId = user?.professeurId || user?.id;
      
      if (!professeurId) {
        setSubmitStatus({ type: 'error', message: 'Erreur: Impossible de récupérer votre identifiant de professeur' });
        return;
      }

      // Préparer les données conformes au backend (création complète avec sessions)
      const formationData = {
        titre: newCourse.titre.trim(),
        description: newCourse.description.trim(),
        prix: newCourse.typeCours === 'GRATUIT' ? 0 : (Number(newCourse.prix) || 0),
        categorie: newCourse.categorie,
        niveau: newCourse.niveau,
        typeCours: newCourse.typeCours,
        image: newCourse.image?.trim() || undefined,
        professeurId: Number(professeurId),
        sessions: newCourse.sessions.filter(s => s.titre.trim()).map(session => ({
          titre: session.titre,
          contenu: session.contenu || '',
          duree: session.duree || '',
          chapitres: session.chapitres.filter(c => c.titre.trim()).map(c => ({
            titre: c.titre,
            contenu: c.contenu,
            duree: c.duree,
            typeContenu: c.typeContenu || 'VIDEO'
          })),
          quiz: session.quiz && session.quiz.questions.length > 0 ? {
            questions: session.quiz.questions.filter(q => q.contenu.trim()).map(q => ({
              contenu: q.contenu,
              reponses: q.reponses.filter(r => r.contenu.trim())
            }))
          } : undefined
        }))
      };

      // Appeler l'API backend pour création complète
      const response = await apiFormation.createCompleteFormation(formationData);
      
      if (response.status === 201 || response.success) {
        // Ajouter la formation à l'état local après création réussie
        const course: Course = {
          id: response.data?.id || Date.now(),
          titre: newCourse.titre,
          description: newCourse.description,
          prix: formationData.prix,
          categorie: newCourse.categorie,
          niveau: newCourse.niveau,
          typeCours: newCourse.typeCours,
          image: newCourse.image,
          students: 0,
          modules: 0,
          status: 'EN_ATTENTE',
          color: 'from-indigo-500 to-indigo-700',
          professeurId: professeurId
        };
        setCourses([course, ...courses]);
        setIsModalOpen(false);
        setNewCourse({
          titre: '',
          description: '',
          prix: 0,
          categorie: '',
          niveau: '',
          typeCours: 'GRATUIT',
          image: '',
          sessions: [{ titre: '', chapitres: [], quiz: undefined }]
        });
        setSubmitStatus({ type: 'success', message: 'Formation créée avec succès! En attente de validation.' });
      }
    } catch (error) {
      console.error('Erreur lors de la création de la formation:', error);
      setSubmitStatus({ type: 'error', message: 'Erreur lors de la création de la formation. Veuillez réessayer.' });
    }
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

  // Charger les apprenants inscrits pour le professeur
  useEffect(() => {
    const fetchEnrolledApprenants = async () => {
      try {
        setApprenantsLoading(true);
        const response = await apiProgression.getProgressionByProfesseur();
        if (response && response.data) {
          console.log('Apprenants chargés:', response.data);
          setEnrolledApprenants(response.data);
          
          // On ne met plus à jour les courses depuis les apprenants (déjà chargé par l'effet formations)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des apprenants:', error);
      } finally {
        setApprenantsLoading(false);
      }
    };

    fetchEnrolledApprenants();
  }, []);

  // Charger les formations du professeur connecté
  useEffect(() => {
    const fetchProfessorFormations = async () => {
      try {
        console.log('Chargement des formations pour le professeur...');
        const response = await apiFormation.getFormations();
        
        if (response && response.data) {
          console.log('Formations reçues:', response.data);
          // Debug: vérifier le statut de chaque formation
          response.data.forEach((formation: { titre: string; status?: string }) => {
            console.log(`Formation "${formation.titre}" - status: "${formation.status}"`);
          });
          // Transformer les données de l'API vers le format Course
          const formattedCourses: Course[] = response.data.map((formation: FormationFromAPI) => ({
            id: formation.id,
            titre: formation.titre,
            description: formation.description,
            prix: formation.prix,
            categorie: formation.categorie,
            niveau: formation.niveau,
            image: formation.image || undefined,
            typeCours: formation.typeCours,
            students: formation.apprenants?.length || 0,
            modules: formation.sessions?.length || 0,
            status: formation.statut || 'EN_ATTENTE',
            color: 'from-indigo-500 to-indigo-700',
            professeurId: formation.professeurId
          }));
          console.log('Formations formatées:', formattedCourses);
          setCourses(formattedCourses);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des formations:', error);
      }
    };

    // Charger au montage et quand user?.id change
    fetchProfessorFormations();
  }, [user?.id]);
  
  // Charger les apprenants pour le dashboard (indépendamment de l'onglet actif)
  useEffect(() => {
    const fetchEnrolledApprenants = async () => {
      try {
        setApprenantsLoading(true);
        const response = await apiProgression.getProgressionByProfesseur();
        if (response && response.data) {
          console.log('Apprenants reçus:', response.data);
          setEnrolledApprenants(response.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des apprenants:', error);
      } finally {
        setApprenantsLoading(false);
      }
    };

    fetchEnrolledApprenants();
  }, []);

  // Charger le profil pour récupérer le solde
  useEffect(() => {
    const fetchSolde = async () => {
      try {
        const response = await apiUsers.getMonProfil();
        if (response && response.data) {
          console.log('Profil chargé - solde:', response.data.solde);
          setSolde(response.data.solde || 0);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      }
    };

    fetchSolde();
  }, []);


  // ── Variables calculées pour les statistiques dynamiques du professeur ──
  // Formation active = toute formation qui appartient au professeur (peu importe le statut)
  const activeFormationsCount = courses.length;
  // Le nombre d'apprenants inscrits = soit depuis les apprenants chargés, soit depuis les formations
  const totalStudentsCount = enrolledApprenants.length > 0 
    ? enrolledApprenants.length 
    : courses.reduce((sum, c) => sum + c.students, 0);
  // Travaux en attente = formations avec statut 'EN_ATTENTE' ou 'REJETEE'
  const pendingWorksCount = courses.filter(c => c.status === 'EN_ATTENTE' || c.status === 'REJETEE').length;
  // Formations validées = formations avec statut 'VALIDEE' (statut différent de 'EN_ATTENTE' et 'REJETEE')
  const validatedFormationsCount = courses.filter(c => c.status !== 'EN_ATTENTE' && c.status !== 'REJETEE').length;

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
            <div className="w-full rounded-xl shadow-lg bg-purple-600  p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                {/* Texte à gauche */}
                <div className="text-white mb-4 md:mb-0">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    Bienvenue, {user?.name || 'Professeur'} !
                  </h2>
                  <p className="text-purple-100 text-sm md:text-base">
                    Gérez vos formations et apprenants
                  </p>
                </div>
                {/* Image à droite */}
                <div className="hidden md:block">
                  <img 
                    src="/prof1.png" 
                    alt="Professeur" 
                    className="rounded-lg shadow-md w-80 h-35  object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Les 4 cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-center items-center gap-4 mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-green-700">{activeFormationsCount}</h3>
                <p className="text-green-600 font-medium">Formations actives</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-center items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-blue-700">{totalStudentsCount}</h3>
                <p className="text-blue-600 font-medium">Apprenants inscrits</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-center items-center gap-4 mb-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-orange-700">{pendingWorksCount}</h3>
                <p className="text-orange-600 font-medium">Travaux en attente</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-center items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-purple-700">{validatedFormationsCount}</h3>
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
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" 
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
                  <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
                  Mes Formations
                </h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter une formation
                </button>
              </div>
              
              {/* Filtres de recherche */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom..."
                      value={formationSearch}
                      onChange={(e) => { setFormationSearch(e.target.value); setFormationPage(1); }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div className="min-w-[150px]">
                  <select
                    value={formationFilterStatus}
                    onChange={(e) => { setFormationFilterStatus(e.target.value); setFormationPage(1); }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  >
                    <option value="">Tous les statuts</option>
                    {[...new Set(courses.map(c => c.status as string | null | undefined))].filter(s => s).map((statut, idx) => (
                      <option key={idx} value={String(statut).toLowerCase()}>
                        {String(statut).toUpperCase() === 'VALIDEE' ? 'Validée' 
                        : String(statut).toUpperCase() === 'EN_ATTENTE' ? 'En attente' 
                        : String(statut).toUpperCase() === 'REJETEE' ? 'Rejetée' 
                        : String(statut)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Formations filtrées */}
              {(() => {
                 const filteredCourses = courses.filter(course => {
                   const matchesSearch = course.titre.toLowerCase().includes(formationSearch.toLowerCase());
                   const matchesStatus = !formationFilterStatus || String(course.status).toLowerCase() === formationFilterStatus;
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
                        <div key={course.id} className={`relative overflow-hidden rounded-xl p-5 bg-gradient-to-r ${course.color} text-white shadow-md hover:shadow-lg transition-shadow`}>
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                          
                          {/* Status badge et boutons */}
                          <div className="flex justify-between items-start mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                              course.status === 'VALIDEE' ? 'bg-green-400 text-green-900' :
                              course.status === 'EN_ATTENTE' ? 'bg-yellow-400 text-yellow-900' :
                              'bg-red-400 text-red-900'
                            }`}>
                              {course.status === 'VALIDEE' ? <><CheckCircle className="w-3 h-3" /> Validée</> :
                               course.status === 'EN_ATTENTE' ? <><Clock className="w-3 h-3" /> En attente</> :
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
                          
                          <h3 className="font-bold text-lg mb-1">{course.titre}</h3>
                          <p className="text-white/80 text-sm mb-3">{course.description}</p>
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-1 bg-white/20 rounded text-xs">{course.students} apprenants</span>
                            <span className="px-2 py-1 bg-white/20 rounded text-xs">{course.modules} modules</span>
                            <span className={`px-2 py-1 rounded text-xs ${course.typeCours === 'PAYANT' ? 'bg-yellow-400 text-yellow-900' : 'bg-green-400 text-green-900'}`}>
                              {course.typeCours === 'PAYANT' ? 'Payant' : 'Gratuit'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la formation *</label>
                  <input
                    type="text"
                    value={newCourse.titre}
                    onChange={(e) => {
                      setNewCourse({ ...newCourse, titre: e.target.value });
                      if (formErrors.titre) setFormErrors({ ...formErrors, titre: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${formErrors.titre ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Ex: React Avancé"
                  />
                  {formErrors.titre && <p className="text-red-500 text-sm mt-1">{formErrors.titre}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => {
                      setNewCourse({ ...newCourse, description: e.target.value });
                      if (formErrors.description) setFormErrors({ ...formErrors, description: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${formErrors.description ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Décrivez votre formation..."
                    rows={3}
                  />
                  {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix (FCFA) {newCourse.typeCours === 'GRATUIT' ? '(Gratuit)' : '*'}
                    </label>
                    <input
                      type="number"
                      value={newCourse.prix || ''}
                      onChange={(e) => {
                        setNewCourse({ ...newCourse, prix: parseFloat(e.target.value) || 0 });
                        if (formErrors.prix) setFormErrors({ ...formErrors, prix: '' });
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${formErrors.prix ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder={newCourse.typeCours === 'GRATUIT' ? 'Non requis' : 'Ex: 25000'}
                      min="0"
                      step="100"
                      disabled={newCourse.typeCours === 'GRATUIT'}
                    />
                    {formErrors.prix && <p className="text-red-500 text-sm mt-1">{formErrors.prix}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                    <select
                      value={newCourse.categorie}
                      onChange={(e) => {
                        setNewCourse({ ...newCourse, categorie: e.target.value });
                        if (formErrors.categorie) setFormErrors({ ...formErrors, categorie: '' });
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${formErrors.categorie ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option value="Développement Web">Développement Web</option>
                      <option value="Développement Mobile">Développement Mobile</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Intelligence Artificielle">Intelligence Artificielle</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Business">Business</option>
                      <option value="Langues">Langues</option>
                      <option value="Autre">Autre</option>
                    </select>
                    {formErrors.categorie && <p className="text-red-500 text-sm mt-1">{formErrors.categorie}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Niveau *</label>
                    <select
                      value={newCourse.niveau}
                      onChange={(e) => {
                        setNewCourse({ ...newCourse, niveau: e.target.value });
                        if (formErrors.niveau) setFormErrors({ ...formErrors, niveau: '' });
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${formErrors.niveau ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Sélectionner un niveau</option>
                      <option value="Débutant">Débutant</option>
                      <option value="Intermédiaire">Intermédiaire</option>
                      <option value="Avancé">Avancé</option>
                      <option value="Tous niveaux">Tous niveaux</option>
                    </select>
                    {formErrors.niveau && <p className="text-red-500 text-sm mt-1">{formErrors.niveau}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type de formation *</label>
                    <select
                      value={newCourse.typeCours}
                      onChange={(e) => setNewCourse({ ...newCourse, typeCours: e.target.value as 'PAYANT' | 'GRATUIT' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="GRATUIT">Gratuit</option>
                      <option value="PAYANT">Payant</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image (optionnel)</label>
                  <input
                    type="url"
                    value={newCourse.image}
                    onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://exemple.com/image.jpg"
                  />
                </div>
                
                {/* Sections Sessions et Chapitres */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">Sessions / Modules *</label>
                    <button
                      type="button"
                      onClick={() => setNewCourse({ ...newCourse, sessions: [...newCourse.sessions, { titre: '', chapitres: [], quiz: undefined }] })}
                      className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Ajouter une session
                    </button>
                  </div>
                  
                  {formErrors.sessions && <p className="text-red-500 text-sm mb-2">{formErrors.sessions}</p>}
                  
                  {newCourse.sessions.map((session, sessionIndex) => (
                    <div key={sessionIndex} className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Session {sessionIndex + 1}</span>
                        {newCourse.sessions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updatedSessions = newCourse.sessions.filter((_, i) => i !== sessionIndex);
                              setNewCourse({ ...newCourse, sessions: updatedSessions });
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={session.titre}
                        onChange={(e) => {
                          const updatedSessions = [...newCourse.sessions];
                          updatedSessions[sessionIndex].titre = e.target.value;
                          setNewCourse({ ...newCourse, sessions: updatedSessions });
                        }}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 mb-3 ${formErrors[`session_${sessionIndex}`] ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Titre de la session (ex: Introduction, Bases...)"
                      />
                      {formErrors[`session_${sessionIndex}`] && <p className="text-red-500 text-sm mb-2">{formErrors[`session_${sessionIndex}`]}</p>}
                      
                      {/* Chapitres de la session */}
                      <div className="ml-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">Chapitres</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedSessions = [...newCourse.sessions];
                              updatedSessions[sessionIndex].chapitres.push({ titre: '', contenu: '', duree: '', typeContenu: 'VIDEO' });
                              setNewCourse({ ...newCourse, sessions: updatedSessions });
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Ajouter un chapitre
                          </button>
                        </div>
                        
                        {session.chapitres.map((chapitre, chapitreIndex) => (
                          <div key={chapitreIndex} className="bg-white rounded border p-3 mb-2">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-gray-600">Chapitre {chapitreIndex + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedSessions = [...newCourse.sessions];
                                  updatedSessions[sessionIndex].chapitres.splice(chapitreIndex, 1);
                                  setNewCourse({ ...newCourse, sessions: updatedSessions });
                                }}
                                className="text-red-400 hover:text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={chapitre.titre}
                              onChange={(e) => {
                                const updatedSessions = [...newCourse.sessions];
                                updatedSessions[sessionIndex].chapitres[chapitreIndex].titre = e.target.value;
                                setNewCourse({ ...newCourse, sessions: updatedSessions });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                              placeholder="Titre du chapitre"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={chapitre.contenu}
                                onChange={(e) => {
                                  const updatedSessions = [...newCourse.sessions];
                                  updatedSessions[sessionIndex].chapitres[chapitreIndex].contenu = e.target.value;
                                  setNewCourse({ ...newCourse, sessions: updatedSessions });
                                }}
                                className="px-3 py-2 border border-gray-300 rounded text-sm"
                                placeholder="Contenu/Description"
                              />
                              <input
                                type="text"
                                value={chapitre.duree}
                                onChange={(e) => {
                                  const updatedSessions = [...newCourse.sessions];
                                  updatedSessions[sessionIndex].chapitres[chapitreIndex].duree = e.target.value;
                                  setNewCourse({ ...newCourse, sessions: updatedSessions });
                                }}
                                className="px-3 py-2 border border-gray-300 rounded text-sm"
                                placeholder="Durée (ex: 10min)"
                              />
                            </div>
                            <select
                              value={chapitre.typeContenu}
                              onChange={(e) => {
                                const updatedSessions = [...newCourse.sessions];
                                updatedSessions[sessionIndex].chapitres[chapitreIndex].typeContenu = e.target.value as 'VIDEO' | 'PDF' | 'TEXTE';
                                setNewCourse({ ...newCourse, sessions: updatedSessions });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm mt-2"
                            >
                              <option value="VIDEO">Vidéo</option>
                              <option value="PDF">PDF</option>
                              <option value="TEXTE">Texte</option>
                            </select>
                          </div>
                        ))}

                        {/* Section Quiz pour la session */}
                        <div className="mt-4 border-t pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-600 font-medium">Quiz de la session</span>
                            {!session.quiz || !session.quiz.questions || session.quiz.questions.length === 0 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedSessions = [...newCourse.sessions];
                                  updatedSessions[sessionIndex].quiz = { questions: [{ contenu: '', reponses: [{ contenu: '', estCorrecte: false }] }] };
                                  setNewCourse({ ...newCourse, sessions: updatedSessions });
                                }}
                                className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" /> Ajouter un quiz
                              </button>
                            ) : null}
                          </div>

                          {session.quiz && session.quiz.questions && session.quiz.questions.length > 0 && (
                            <div className="bg-green-50 rounded border border-green-200 p-3">
                              {session.quiz.questions.map((question, questionIndex) => (
                                <div key={questionIndex} className="bg-white rounded border p-2 mb-2">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-gray-600">Question {questionIndex + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedSessions = [...newCourse.sessions];
                                        updatedSessions[sessionIndex].quiz?.questions.splice(questionIndex, 1);
                                        if (updatedSessions[sessionIndex].quiz?.questions.length === 0) {
                                          updatedSessions[sessionIndex].quiz = undefined;
                                        }
                                        setNewCourse({ ...newCourse, sessions: updatedSessions });
                                      }}
                                      className="text-red-400 hover:text-red-600"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    value={question.contenu}
                                    onChange={(e) => {
                                      const updatedSessions = [...newCourse.sessions];
                                      updatedSessions[sessionIndex].quiz!.questions[questionIndex].contenu = e.target.value;
                                      setNewCourse({ ...newCourse, sessions: updatedSessions });
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                                    placeholder="Contenu de la question"
                                  />
                                  
                                  {/* Réponses */}
                                  <div className="ml-2">
                                    <span className="text-xs text-gray-500">Réponses (cochez la bonne réponse):</span>
                                    {question.reponses.map((reponse, reponseIndex) => (
                                      <div key={reponseIndex} className="flex items-center gap-2 mt-1">
                                        <input
                                          type="checkbox"
                                          checked={reponse.estCorrecte}
                                          onChange={(e) => {
                                            const updatedSessions = [...newCourse.sessions];
                                            updatedSessions[sessionIndex].quiz!.questions[questionIndex].reponses[reponseIndex].estCorrecte = e.target.checked;
                                            setNewCourse({ ...newCourse, sessions: updatedSessions });
                                          }}
                                          className="w-4 h-4"
                                        />
                                        <input
                                          type="text"
                                          value={reponse.contenu}
                                          onChange={(e) => {
                                            const updatedSessions = [...newCourse.sessions];
                                            updatedSessions[sessionIndex].quiz!.questions[questionIndex].reponses[reponseIndex].contenu = e.target.value;
                                            setNewCourse({ ...newCourse, sessions: updatedSessions });
                                          }}
                                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                          placeholder="Réponse"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updatedSessions = [...newCourse.sessions];
                                            updatedSessions[sessionIndex].quiz!.questions[questionIndex].reponses.splice(reponseIndex, 1);
                                            setNewCourse({ ...newCourse, sessions: updatedSessions });
                                          }}
                                          className="text-red-400 hover:text-red-600"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedSessions = [...newCourse.sessions];
                                        updatedSessions[sessionIndex].quiz!.questions[questionIndex].reponses.push({ contenu: '', estCorrecte: false });
                                        setNewCourse({ ...newCourse, sessions: updatedSessions });
                                      }}
                                      className="text-xs text-blue-600 hover:text-blue-700 mt-1 flex items-center gap-1"
                                    >
                                      <Plus className="w-3 h-3" /> Ajouter une réponse
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedSessions = [...newCourse.sessions];
                                  updatedSessions[sessionIndex].quiz!.questions.push({ contenu: '', reponses: [{ contenu: '', estCorrecte: false }] });
                                  setNewCourse({ ...newCourse, sessions: updatedSessions });
                                }}
                                className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" /> Ajouter une question
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Cette formation sera soumise à validation par l'administrateur avant d'être visible publiquement.
                  </p>
                </div>
                {submitStatus.message && (
                  <div className={`p-4 rounded-lg ${submitStatus.type === 'success' ? 'bg-purple-50 border border-green-200 text-purple-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    <p className="text-sm">{submitStatus.message}</p>
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setFormErrors({});
                      setSubmitStatus({ type: null, message: '' });
                    }}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
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
      case 'apprenants': {
        // Computed filtered data before return
        const allApprenantsData = enrolledApprenants;
        const filteredApprenantsData = allApprenantsData.filter((apprenant) => {
          const name = apprenant.apprenant?.name || apprenant.name || '';
          const formation = typeof apprenant.formation === 'object' ? apprenant.formation?.titre : apprenant.formation;
          const formationStr = formation || '';
          return name.toLowerCase().includes(apprenantSearch.toLowerCase()) && 
            (!apprenantFilterCourse || formationStr === apprenantFilterCourse);
        });
        const totalApprenantPages = Math.ceil(filteredApprenantsData.length / apprenantsPerPage);
        const paginatedApprenantsData = filteredApprenantsData.slice(
          (apprenantPage - 1) * apprenantsPerPage,
          apprenantPage * apprenantsPerPage
        );
        
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
                  {courses.map((course) => (
                    <option key={course.id} value={course.titre}>{course.titre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Apprenants filtrés */}
            {apprenantsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-3 text-gray-600">Chargement des apprenants...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Formation</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Progression</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedApprenantsData.map((student: ApprenantData, idx: number) => (
                      <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                              {(student.apprenant?.name ?? student.name ?? '').charAt(0)}
                            </div>
                            <span className="font-medium text-gray-800">{student.apprenant?.name ?? student.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {typeof student.formation === 'object' ? student.formation?.titre : student.formation}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${(student.progression?.percentage ?? student.progress ?? 0) >= 75 ? 'bg-green-500' : (student.progression?.percentage ?? student.progress ?? 0) >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                style={{ width: `${student.progression?.percentage ?? student.progress ?? 0}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{student.progression?.percentage ?? student.progress ?? 0}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            (student.progression?.percentage ?? student.progress ?? 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {(student.progression?.percentage ?? student.progress ?? 0) > 0 ? '✅ Actif' : '⏸️ En attente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Pagination */}
                {totalApprenantPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                      onClick={() => setApprenantPage(p => Math.max(1, p - 1))}
                      disabled={apprenantPage === 1}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {apprenantPage} sur {totalApprenantPages}
                    </span>
                    <button
                      onClick={() => setApprenantPage(p => Math.min(totalApprenantPages, p + 1))}
                      disabled={apprenantPage === totalApprenantPages}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
                
                {filteredApprenantsData.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Aucun apprenant trouvé</p>
                )}
              </div>
            )}
          </div>
        );
      }
      case 'solde':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
              Mon Solde
            </h2>
            <div className="space-y-6">
              {/* Solde actuel */}
              <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white">
                <p className="text-sm opacity-90 mb-1">Solde disponible</p>
                <p className="text-4xl font-bold">{solde.toLocaleString()} XOF</p>
              </div>
              {/* Historique des revenus */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Historique des revenus</h3>
                <div className="space-y-3">
                <p className="text-center text-gray-500 py-6">Historique des revenus bientôt disponible</p>
                {/* TODO: Remplacer par les vrais paiements depuis l'API filtré par professeurId */}
                </div>
              </div>
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
