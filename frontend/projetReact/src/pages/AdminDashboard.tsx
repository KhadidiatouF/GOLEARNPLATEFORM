import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiUsers } from '../api/apiUsers';
import { apiFormation } from '../api/apiFormation';
import { apiAdministrateur } from '../api/apiAdministrateur';
import { apiProfesseur } from '../api/apiProfesseur';
import DashboardHeader from '../components/DashboardHeader';
import { Clock, Calendar, BarChart3, TrendingDown, PieChart, Activity, Plus, Trash2, Edit2, CheckCircle, XCircle, AlertCircle, Users, BookOpen, GraduationCap, Download, FileSpreadsheet, FileJson, FileText, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import NotificationDialog from '../components/NotificationDialog';
import DashboardSettingsPanel from '../components/DashboardSettingsPanel';
import { Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip, Legend, ArcElement, PointElement, LineElement, RadialLinearScale, Filler} from 'chart.js';
import { Bar, Doughnut, Line, PolarArea } from 'react-chartjs-2';

type TabType = 'overview' | 'users' | 'formations' | 'stats' | 'revenus' | 'demandes' | 'settings';

interface MenuItem {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    id: 'overview',
    label: 'Vue d\'ensemble',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    id: 'users',
    label: 'Utilisateurs',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    id: 'formations',
    label: 'Formations',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    id: 'stats',
    label: 'Statistiques',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    id: 'revenus',
    label: 'Total Revenu',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 'demandes',
    label: 'Demandes Formateur',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Gestion des formations en attente de validation
  const [pendingCourses, setPendingCourses] = useState<Formation[]>([]);
  const [validatedCourses, setValidatedCourses] = useState<Formation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUserDeleteDialogOpen, setIsUserDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  
  // Interface pour les formations
  interface Formation {
    id: number;
    titre?: string;
    title?: string;
    image?: string;
    professeur?: string | {
      utilisateur?: {
        nom?: string;
        prenom?: string;
        professeur?: {
          nom?: string;
          prenom?: string;
        }
      }
    };
    professor?: string;
    description?: string;
    modules?: number;
    type?: string;
    statut?: string;
    students?: number;
    submittedAt?: string;
  }

  // Type pour les utilisateurs
  interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    login: string;
    role: string;
    specialite?: string;
    bio?: string;
    niveau?: string;
    apprenant?: { niveau?: string };
    professeur?: { specialite?: string; bio?: string };
  }

  interface DemandeProfesseur {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    domaineExpertise: string;
    experience: string;
    motivation: string;
    specialite?: string;
    bio?: string;
    statut: 'EN_ATTENTE' | 'APPROUVEE' | 'REJETEE';
    dateCreation: string;
    dateTraitement?: string | null;
    loginGenere?: string | null;
  }

  // Gestion des utilisateurs
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<{ id: number | undefined; nom: string; prenom: string; email: string; login: string; mdp?: string; role: string; specialite?: string; bio?: string; niveau?: string } | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [teacherRequests, setTeacherRequests] = useState<DemandeProfesseur[]>([]);
  const [teacherRequestsLoading, setTeacherRequestsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'success' | 'info' | 'warning';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showNotification = (
    title: string,
    message: string,
    type: 'error' | 'success' | 'info' | 'warning' = 'info'
  ) => {
    setNotification({
      isOpen: true,
      title,
      message,
      type
    });
  };

  // États pour la pagination et filtration des formations
  const [formationSearch, setFormationSearch] = useState('');
  const [formationFilterProf, setFormationFilterProf] = useState('');
  const [formationPage, setFormationPage] = useState(1);
  const formationsPerPage = 3;

  // États pour la pagination et filtration des utilisateurs
  const [userSearch, setUserSearch] = useState('');
  const [userFilterRole, setUserFilterRole] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 5;

  // États pour les statistiques dynamiques
  interface ChartItem {
    mois?: string;
    nombre?: number;
    titre?: string;
    inscrits?: number;
    nom?: string;
  }

  interface Statistics {
    general: {
      users: number;
      formations: number;
      professors: number;
      sessions: number;
    };
    charts: {
      inscriptionsParMois: ChartItem[];
      formationsPopulaires: ChartItem[];
      evolutionUtilisateurs: ChartItem[];
      repartitionCategorie: ChartItem[];
    }
  }

  const [statistics, setStatistics] = useState<Statistics>({
    general: {
      users: 0,
      formations: 0,
      professors: 0,
      sessions: 0
    },
    charts: {
      inscriptionsParMois: [],
      formationsPopulaires: [],
      evolutionUtilisateurs: [],
      repartitionCategorie: []
    }
  });
  const [statisticsLoading, setStatisticsLoading] = useState(true);
  const totalDemandesCount = teacherRequests.length;

  // Données complètes à exporter (toutes les statistiques des graphiques)
  const exportData = {
    // Statistiques générales
    general: statistics.general,
    // Inscriptions par mois
    inscriptionsParMois: {
      labels: statistics.charts.inscriptionsParMois.map(i => i.mois || ''),
      data: statistics.charts.inscriptionsParMois.map(i => i.nombre || 0),
    },
    // Formations populaires
    formationsPopulaires: {
      labels: statistics.charts.formationsPopulaires.map(f => f.titre || ''),
      data: statistics.charts.formationsPopulaires.map(f => f.inscrits || 0),
    },
    // Evolution des utilisateurs
    evolutionUtilisateurs: {
      labels: statistics.charts.evolutionUtilisateurs.map(e => e.mois || ''),
      data: statistics.charts.evolutionUtilisateurs.map(e => e.nombre || 0),
    },
    // Repartition par catégorie
    repartitionCategorie: {
      labels: statistics.charts.repartitionCategorie.map(c => c.nom || ''),
      data: statistics.charts.repartitionCategorie.map(c => c.nombre || 0),
    },
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'statistiques.json';
    link.click();
    URL.revokeObjectURL(url);
    setExportMenuOpen(false);
  };

  const exportToCSV = () => {
    const rows: string[][] = [];
    
    // Section: Statistiques générales
    rows.push(['Statistiques générales']);
    rows.push(['Métrique', 'Valeur']);
    rows.push(['Utilisateurs', exportData.general.users.toString()]);
    rows.push(['Formations actives', exportData.general.formations.toString()]);
    rows.push(['Professeurs', exportData.general.professors.toString()]);
    rows.push(['Total demandes', totalDemandesCount.toString()]);
    rows.push(['']);
    
    // Section: Inscriptions par mois
    rows.push(['Inscriptions par mois']);
    rows.push(['Mois', 'Inscriptions']);
    exportData.inscriptionsParMois.labels.forEach((month, index) => {
      rows.push([month, exportData.inscriptionsParMois.data[index].toString()]);
    });
    rows.push(['']);
    
    // Section: Formations populaires
    rows.push(['Formations populaires']);
    rows.push(['Formation', 'Inscrits']);
    exportData.formationsPopulaires.labels.forEach((formation, index) => {
      rows.push([formation, exportData.formationsPopulaires.data[index].toString()]);
    });
    rows.push(['']);
    
    // Section: Evolution des utilisateurs
    rows.push(['Évolution des utilisateurs']);
    rows.push(['Mois', 'Utilisateurs']);
    exportData.evolutionUtilisateurs.labels.forEach((month, index) => {
      rows.push([month, exportData.evolutionUtilisateurs.data[index].toString()]);
    });
    rows.push(['']);
    
    // Section: Répartition par catégorie
    rows.push(['Répartition par catégorie']);
    rows.push(['Catégorie', 'Nombre']);
    exportData.repartitionCategorie.labels.forEach((categorie, index) => {
      rows.push([categorie, exportData.repartitionCategorie.data[index].toString()]);
    });
    
    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'statistiques.csv';
    link.click();
    URL.revokeObjectURL(url);
    setExportMenuOpen(false);
  };

  const exportToExcel = () => {
    const rows: string[][] = [];
    
    // Section: Statistiques générales
    rows.push(['Statistiques générales']);
    rows.push(['Métrique', 'Valeur']);
    rows.push(['Utilisateurs', exportData.general.users.toString()]);
    rows.push(['Formations actives', exportData.general.formations.toString()]);
    rows.push(['Professeurs', exportData.general.professors.toString()]);
    rows.push(['Total demandes', totalDemandesCount.toString()]);
    rows.push(['']);
    
    // Section: Inscriptions par mois
    rows.push(['Inscriptions par mois']);
    rows.push(['Mois', 'Inscriptions']);
    exportData.inscriptionsParMois.labels.forEach((month, index) => {
      rows.push([month, exportData.inscriptionsParMois.data[index].toString()]);
    });
    rows.push(['']);
    
    // Section: Formations populaires
    rows.push(['Formations populaires']);
    rows.push(['Formation', 'Inscrits']);
    exportData.formationsPopulaires.labels.forEach((formation, index) => {
      rows.push([formation, exportData.formationsPopulaires.data[index].toString()]);
    });
    rows.push(['']);
    
    // Section: Evolution des utilisateurs
    rows.push(['Évolution des utilisateurs']);
    rows.push(['Mois', 'Utilisateurs']);
    exportData.evolutionUtilisateurs.labels.forEach((month, index) => {
      rows.push([month, exportData.evolutionUtilisateurs.data[index].toString()]);
    });
    rows.push(['']);
    
    // Section: Répartition par catégorie
    rows.push(['Répartition par catégorie']);
    rows.push(['Catégorie', 'Nombre']);
    exportData.repartitionCategorie.labels.forEach((categorie, index) => {
      rows.push([categorie, exportData.repartitionCategorie.data[index].toString()]);
    });
    
    const excelContent = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body>' +
      '<table border="1" style="border-collapse: collapse;">' +
      rows.map(row => '<tr><td style="padding: 8px;">' + row.join('</td><td style="padding: 8px;">') + '</td></tr>').join('') +
      '</table></body></html>';
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'statistiques.xls';
    link.click();
    URL.revokeObjectURL(url);
    setExportMenuOpen(false);
  };

  const handleValidateCourse = async (id: number) => {
    await handleValiderFormation(id);
  };

  const handleRejectCourse = async (id: number) => {
    await handleRejeterFormation(id);
  };

  const confirmDelete = (id: number) => {
    setCourseToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Handlers pour la gestion des utilisateurs
  const handleAddUser = () => {
    setEditingUser({ id: undefined, nom: '', prenom: '', email: '', login: '', mdp: '', role: 'APPRENANT', specialite: '', bio: '', niveau: '' });
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: { id: number; nom: string; prenom: string; email: string; login: string; mdp?: string; role: string; specialite?: string; bio?: string; niveau?: string }) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (id: number) => {
    setUserToDelete(id);
    setIsUserDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        const accessToken = localStorage.getItem('accessToken');
        console.log('Token:', accessToken);
        console.log('Suppression utilisateur ID:', userToDelete);
        
        await apiUsers.deleteUser(userToDelete);
        console.log('Suppression réussie');
        
        setUsers(users.filter(u => u.id !== userToDelete));
        setUserToDelete(null);
        setIsUserDeleteDialogOpen(false);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showNotification('Suppression impossible', 'Erreur lors de la suppression.', 'error');
      }
    }
  };

  // Confirmer suppression formation
  const confirmDeleteFormation = async () => {
    if (courseToDelete) {
      try {
        await apiFormation.deleteFormation(courseToDelete);
        await fetchFormations();
        setCourseToDelete(null);
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error('Erreur lors de la suppression de la formation:', error);
        showNotification('Suppression impossible', 'Erreur lors de la suppression de la formation.', 'error');
      }
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      try {
        if (editingUser.id) {
          // Modifier un utilisateur existant
          const userData: Record<string, unknown> = {
            nom: editingUser.nom,
            prenom: editingUser.prenom,
            email: editingUser.email,
            login: editingUser.login,
            role: editingUser.role
          };
          
          // Ajouter les champs optionnels seulement s'ils ont une valeur
          if (editingUser.role === 'PROF' && editingUser.specialite) {
            userData.specialite = editingUser.specialite;
          }
          if (editingUser.role === 'PROF' && editingUser.bio) {
            userData.bio = editingUser.bio;
          }
          if (editingUser.role === 'APPRENANT' && editingUser.niveau) {
            userData.niveau = editingUser.niveau;
          }
          // N'envoyer le mot de passe SEULEMENT si il a été modifié
          if (editingUser.mdp && editingUser.mdp.trim() !== '') {
            userData.mdp = editingUser.mdp;
          }
          
          await apiUsers.updateUser(editingUser.id, userData);
          setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userData, id: editingUser.id } : u));
        } else {
          // Ajouter un nouvel utilisateur (sans id pour la création)
          // Ne pas envoyer les champs optionnels s'ils sont null ou undefined
          const userData: Record<string, unknown> = { 
            nom: editingUser.nom, 
            prenom: editingUser.prenom, 
            email: editingUser.email, 
            login: editingUser.login, 
            mdp: editingUser.mdp, 
            role: editingUser.role
          };
          
          // Ajouter les champs optionnels seulement s'ils ont une valeur
          if (editingUser.role === 'PROF' && editingUser.specialite) {
            userData.specialite = editingUser.specialite;
          }
          if (editingUser.role === 'PROF' && editingUser.bio) {
            userData.bio = editingUser.bio;
          }
          if (editingUser.role === 'APPRENANT' && editingUser.niveau) {
            userData.niveau = editingUser.niveau;
          }
          
          await apiUsers.createUsers(userData);
          // Recharger les utilisateurs pour obtenir l'id généré
          fetchUsers(userPage);
        }
        setIsUserModalOpen(false);
        setEditingUser(null);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        showNotification('Enregistrement impossible', 'Erreur lors de la sauvegarde.', 'error');
      }
    }
  };

  // Horloge en temps réel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Charger les utilisateurs depuis l'API
  const fetchUsers = async (page: number = 1, search: string = '', role: string = '') => {
    setUsersLoading(true);
    try {
      const usersData = await apiUsers.getUsers(page, usersPerPage, search, role);
      console.log('Données reçues:', usersData);
      if (usersData && usersData.users && Array.isArray(usersData.users)) {
        const usersWithExtraFields = usersData.users.map((user: User) => ({
          ...user,
          niveau: user.apprenant?.niveau || '',
          specialite: user.professeur?.specialite || '',
          bio: user.professeur?.bio || ''
        }));
        setUsers(usersWithExtraFields);
        setTotalUsers(usersData.pagination?.total || usersWithExtraFields.length);
      } else {
        console.log('Format de données inattendu:', usersData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  // Charger les statistiques
  const fetchStatistics = async () => {
    setStatisticsLoading(true);
    try {
      const data = await apiAdministrateur.getStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setStatisticsLoading(false);
    }
  };

  const fetchTeacherRequests = async () => {
    setTeacherRequestsLoading(true);
    try {
      const response = await apiProfesseur.getDemandes();
      setTeacherRequests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des demandes professeur:', error);
      setTeacherRequests([]);
    } finally {
      setTeacherRequestsLoading(false);
    }
  };

  // Charger les formations depuis l'API
  const fetchFormations = async () => {
    try {
      const response = await apiFormation.getFormations();
      // L'API retourne un objet avec la propriété data contenant le tableau
      const data = response.data || response;

      if (Array.isArray(data)) {
        // Mapper les champs pour adapter le format de la base de données au format attendu par le frontend
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedFormations = data.map((f: any) => ({
          ...f,
          // Mapper le titre : base de données utilise 'titre', frontend utilise 'title'
          title: f.titre || f.title || '',
          // Mapper le nom et prénom complet du professeur
          professor: typeof f.professeur === 'object' 
            ? `${f.professeur?.utilisateur?.prenom || ''} ${f.professeur?.utilisateur?.nom || ''}`.trim() 
              || `${f.professeur?.utilisateur?.professeur?.prenom || ''} ${f.professeur?.utilisateur?.professeur?.nom || ''}`.trim()
              || 'Professeur inconnu'
            : f.professor || f.professeur || 'Professeur inconnu'
        }));

        // Séparer les formations validées et en attente
        const pending = mappedFormations.filter((f: Formation) => f.statut && f.statut.toUpperCase() === 'EN_ATTENTE');
        const validated = mappedFormations.filter((f: Formation) => !f.statut || f.statut.toUpperCase() === 'VALIDEE');

        setPendingCourses(pending);
        setValidatedCourses(validated);
      } else {
        setPendingCourses([]);
        setValidatedCourses([]);
      }
    } catch (error) {
      console.error(' Erreur lors du chargement des formations:', error);
      setPendingCourses([]);
      setValidatedCourses([]);
    }
  };

  // Valider une formation
  const handleValiderFormation = async (formationId: number) => {
    try {
      await apiFormation.validerFormation(formationId);
      // Recharger la liste des formations après validation
      await fetchFormations();
    } catch (error) {
      console.error('Erreur lors de la validation de la formation:', error);
    }
  };

  // Rejeter une formation
  const handleRejeterFormation = async (formationId: number) => {
    try {
      await apiFormation.rejeterFormation(formationId);
      // Recharger la liste des formations après rejet
      await fetchFormations();
    } catch (error) {
      console.error('Erreur lors du rejet de la formation:', error);
    }
  };



  // Charger les utilisateurs et statistiques au montage du composant
  useEffect(() => {
    fetchUsers(userPage, userSearch, userFilterRole);
    fetchStatistics();
    fetchFormations();
    fetchTeacherRequests();

    // Rafraichir automatiquement les statistiques toutes les 30 secondes
    const interval = setInterval(() => {
      fetchStatistics();
      fetchFormations();
      fetchTeacherRequests();
    }, 30000);

    return () => clearInterval(interval);
  }, [userPage, userSearch, userFilterRole]);


  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
);

const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Carte principale avec texte et image */}
            <div className="w-full rounded-xl shadow-lg bg-purple-600 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                {/* Texte à gauche */}
                <div className="text-white mb-4 md:mb-0">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    Bienvenue, {user?.name || 'Admin'} !
                  </h2>
                  <p className="text-purple-100 text-sm md:text-base">
                    Voici un aperçu de votre plateforme d'apprentissage
                  </p>
                </div>
                {/* Image à droite */}
                <div className="hidden md:block">
                  <img 
                    src="/Admin-pana.png" 
                    alt="Dashboard" 
                    className="rounded-lg shadow-md w-80 h-40 object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Les 4 cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-center items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-purple-700">{statisticsLoading ? '...' : statistics.general.users}</h3>
                <p className="text-purple-600 font-medium">Utilisateurs total</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-center items-center gap-4 mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-purple-700">{statisticsLoading ? '...' : statistics.general.formations}</h3>
                <p className="text-purple-600 font-medium">Formations actives</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-center items-center gap-4 mb-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <GraduationCap className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-purple-700">{statisticsLoading ? '...' : statistics.general.professors}</h3>
                <p className="text-purple-600 font-medium">Professeurs</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-center items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-purple-700">{teacherRequestsLoading ? '...' : totalDemandesCount.toLocaleString()}</h3>
                <p className="text-purple-600 font-medium">Total demandes</p>
              </div>
            </div>

            {/* Horloge, Reminders et Calendrier */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Horloge et Reminders à gauche */}
              <div className="space-y-6">
                {/* Horloge en temps réel */}
                {/* Horloge analogique */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Heure actuelle</h3>
                  </div>
                  
                  {/* Horloge analogique ronde */}
                  <div className="relative w-48 h-48 mx-auto mb-4">
                    {/* Cadran de l'horloge */}
                    <div className="absolute inset-0 rounded-full border-4 border-purple-600 bg-white">
                      {/* Marquer les heures */}
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-full h-full"
                          style={{ transform: `rotate(${i * 30}deg)` }}
                        >
                          <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-gray-800 ${i % 3 === 0 ? 'bg-purple-600 h-4 w-1.5' : ''}`} />
                        </div>
                      ))}
                      
                      {/* Aiguille des heures */}
                      <div
                        className="absolute bottom-1/2 left-1/2 w-1.5 h-12 bg-gray-800 origin-bottom rounded-full"
                        style={{
                          transform: `translateX(-50%) rotate(${((currentTime.getHours() % 12) + currentTime.getMinutes() / 60) * 30}deg)`
                        }}
                      />
                      
                      {/* Aiguille des minutes */}
                      <div
                        className="absolute bottom-1/2 left-1/2 w-1 h-16 bg-gray-600 origin-bottom rounded-full"
                        style={{
                          transform: `translateX(-50%) rotate(${currentTime.getMinutes() * 6}deg)`
                        }}
                      />
                      
                      {/* Aiguille des secondes */}
                      <div
                        className="absolute bottom-1/2 left-1/2 w-0.5 h-17.5 bg-red-500 origin-bottom rounded-full"
                        style={{
                          transform: `translateX(-50%) rotate(${currentTime.getSeconds() * 6}deg)`
                        }}
                      />
                      
                      {/* Centre de l'horloge */}
                      <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-purple-600 rounded-full -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  
                  <p className="text-gray-500 text-center font-semibold text-lg">
                    {formatTime(currentTime)}
                  </p>
                  <p className="text-gray-400 text-center text-sm">
                    {formatDate(currentTime)}
                  </p>
                </div>

            
              </div>

              {/* Calendrier à droite */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Calendrier</h3>
                </div>
                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-gray-800">
                    {currentTime.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
                    <div key={day} className="text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
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
                          isToday 
                            ? 'bg-purple-600 text-white font-bold' 
                            : 'text-gray-700 hover:bg-purple-100'
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
      
      case 'users':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gestion des Utilisateurs</h2>
              <button 
                onClick={handleAddUser}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Ajouter un utilisateur
              </button>
            </div>
            
            {/* Filtres de recherche */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou email..."
                    value={userSearch}
                    onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="min-w-[150px]">
                <select
                  value={userFilterRole}
                  onChange={(e) => { setUserFilterRole(e.target.value); setUserPage(1); }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                >
                  <option value="">Tous les rôles</option>
                  <option value="PROF">Professeur</option>
                  <option value="APPRENANT">Apprenant</option>
                </select>
              </div>
            </div>

             {/* Utilisateurs filtrés */}
            {(() => {
               // ✅ Le filtre et la recherche sont appliqués COTE SERVEUR avant pagination
               const filteredUsers = users;
               const totalPages = Math.ceil(totalUsers / usersPerPage);
               const paginatedUsers = filteredUsers;
              
              return (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prénom</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {usersLoading ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                              Chargement des utilisateurs...
                            </td>
                          </tr>
                        ) : paginatedUsers.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                              Aucun utilisateur trouvé
                            </td>
                          </tr>
                        ) : (
                          paginatedUsers.map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-3 whitespace-nowrap text-left ">{user.nom}</td>
                              <td className="px-6 py-3 whitespace-nowrap text-left ">{user.prenom}</td>
                              <td className="px-6 py-3 whitespace-nowrap text-left ">{user.email}</td>
                              <td className="px-6 py-3 whitespace-nowrap text-left ">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  user.role === 'APPRENANT' ? 'bg-blue-100 text-blue-700' : user.role === 'PROF' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                                }`}>
                                  {user.role === 'APPRENANT' ? 'Apprenant' : user.role === 'PROF' ? 'Professeur' : 'Admin'}
                                </span>
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap text-left ">
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                                  title="Modifier"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 p-4 border-t border-gray-200">
                      <button
                        onClick={() => setUserPage(p => Math.max(1, p - 1))}
                        disabled={userPage === 1}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {userPage} sur {totalPages}
                      </span>
                      <button
                        onClick={() => setUserPage(p => Math.min(totalPages, p + 1))}
                        disabled={userPage === totalPages}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  
                  {filteredUsers.length === 0 && (
                    <p className="text-center text-gray-500 py-8">Aucun utilisateur trouvé</p>
                  )}
                </>
              );
            })()}
          </div>
        );
      
      case 'formations':
        return (
          <div className="space-y-6">
            {pendingCourses.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-2 h-8 bg-yellow-500 rounded-full"></span>
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                  Formations en attente de validation
                  <span className="ml-auto bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    {pendingCourses.length} en attente
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingCourses.map((course) => (
                    <div key={course.id} className="border-2 border-yellow-200 rounded-xl p-5 hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-orange-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{course.title}</h3>
                          <p className="text-sm text-gray-500">{course.professor}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${course.type === 'payant' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                          {course.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{course.modules} modules</span>
                        <span>Soumis le {course.submittedAt}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleValidateCourse(course.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Valider
                        </button>
                        <button
                          onClick={() => handleRejectCourse(course.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Rejeter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formations validées avec recherche et pagination */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  Formations validées
                </h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Créer une formation
                </button>
              </div>
              
              {/* Filtres de recherche */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom de formation..."
                      value={formationSearch}
                      onChange={(e) => { setFormationSearch(e.target.value); setFormationPage(1); }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div className="min-w-[200px]">
                  <select
                    value={formationFilterProf}
                    onChange={(e) => { setFormationFilterProf(e.target.value); setFormationPage(1); }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Tous les professeurs</option>
                    {/* Extraire dynamiquement les professeurs depuis les formations */}
                    {[...new Set(validatedCourses.map(f => f.professor))]
                      .filter(name => name && name !== 'Professeur inconnu')
                      .map(professorName => (
                        <option key={professorName} value={professorName}>
                          {professorName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Formations filtrées */}
              {(() => {
                const filteredCourses = validatedCourses.filter(course => {
                  const courseTitle = course.titre || course.title || '';
                  const matchesSearch = courseTitle.toLowerCase().includes(formationSearch.toLowerCase());
                  const matchesProf = !formationFilterProf || course.professor === formationFilterProf;
                  return matchesSearch && matchesProf;
                });
                const totalPages = Math.ceil(filteredCourses.length / formationsPerPage);
                const paginatedCourses = filteredCourses.slice(
                  (formationPage - 1) * formationsPerPage,
                  formationPage * formationsPerPage
                );
                
                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {paginatedCourses.map((course) => (
                        <div key={course.id} className="border rounded-xl p-4 hover:shadow-lg transition-shadow">
                          <div className="h-32 rounded-lg mb-4 overflow-hidden bg-gray-100">
                            {course.image ? (
                              <img 
                                src={course.image} 
                                alt={course.title} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="h-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                                <BookOpen className="w-12 h-12 text-white/50" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-semibold mb-1">{course.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">{course.professor}</p>
                          <p className="text-sm text-gray-600 mb-3">{course.students} apprenants • {course.modules} modules</p>
                          <div className="flex gap-2">
                            <button className="flex-1 flex items-center justify-center gap-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                              <Edit2 className="w-4 h-4" />
                              Modifier
                            </button>
                            <button 
                              onClick={() => confirmDelete(course.id)}
                              className="flex-1 flex items-center justify-center gap-1 bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Supprimer
                            </button>
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

            {/* Modal de création de formation */}
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Créer une formation"
              size="lg"
            >
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la formation</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Ex: React Avancé" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" rows={3} placeholder="Décrivez votre formation..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de modules</label>
                    <input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" min="1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                      <option>Gratuit</option>
                      <option>Payant</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">Annuler</button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">Créer</button>
                </div>
              </form>
            </Modal>

          </div>
        );
      
      case 'stats': {
        // ===== 1. Données pour Diagramme en Bande (Barres) =====
        const barData = {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
          datasets: [
            {
              label: 'Inscriptions',
              data: [45, 78, 62, 91, 85, 120, 95, 110, 145, 132, 98, 75],
              backgroundColor: [
                'rgba(139, 92, 246, 0.8)',   // violet
                'rgba(99, 102, 241, 0.8)',   // indigo
                'rgba(59, 130, 246, 0.8)',   // blue
                'rgba(6, 182, 212, 0.8)',    // cyan
                'rgba(20, 184, 166, 0.8)',   // teal
                'rgba(34, 197, 94, 0.8)',    // green
                'rgba(132, 204, 22, 0.8)',   // lime
                'rgba(234, 179, 8, 0.8)',    // yellow
                'rgba(249, 115, 22, 0.8)',   // orange
                'rgba(239, 68, 68, 0.8)',    // red
                'rgba(236, 72, 153, 0.8)',   // pink
                'rgba(168, 85, 247, 0.8)',   // purple
              ],
              borderColor: [
                'rgb(139, 92, 246)',
                'rgb(99, 102, 241)',
                'rgb(59, 130, 246)',
                'rgb(6, 182, 212)',
                'rgb(20, 184, 166)',
                'rgb(34, 197, 94)',
                'rgb(132, 204, 22)',
                'rgb(234, 179, 8)',
                'rgb(249, 115, 22)',
                'rgb(239, 68, 68)',
                'rgb(236, 72, 153)',
                'rgb(168, 85, 247)',
              ],
              borderWidth: 2,
              borderRadius: 8,
            },
          ],
        };

        const barOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top' as const,
              labels: { color: 'rgb(75, 85, 99)', padding: 15 },
            },
            title: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
            },
            x: {
              grid: { display: false },
            },
          },
        };

        // ===== 2. Données pour Diagramme Circulaire (Doughnut) =====
        const doughnutData = {
          labels: ['React Avancé', 'JavaScript ES6+', 'TypeScript', 'Node.js', 'Python', 'CSS Avancé'],
          datasets: [
            {
              data: [156, 142, 128, 98, 87, 65],
              backgroundColor: [
                'rgba(59, 130, 246, 0.9)',   // blue
                'rgba(234, 179, 8, 0.9)',    // yellow
                'rgba(139, 92, 246, 0.9)',   // purple
                'rgba(34, 197, 94, 0.9)',    // green
                'rgba(236, 72, 153, 0.9)',   // pink
                'rgba(249, 115, 22, 0.9)',   // orange
              ],
              borderColor: 'rgb(255, 255, 255)',
              borderWidth: 3,
            },
          ],
        };

        const doughnutOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right' as const,
              labels: { 
                color: 'rgb(75, 85, 99)', 
                padding: 15,
                usePointStyle: true,
                pointStyle: 'circle',
              },
            },
          },
          cutout: '55%',
        };

        // ===== 3. Données pour Courbe d'évolution (Line) =====
        const lineData = {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
          datasets: [
            {
              label: 'Utilisateurs actifs',
              data: [120, 145, 168, 195, 220, 258, 280, 310, 345, 380, 410, 445],
              borderColor: 'rgb(147, 51, 234)',
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: 'rgb(147, 51, 234)',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
            },
            {
              label: 'Formations actives',
              data: [15, 22, 28, 35, 42, 48, 52, 58, 65, 72, 78, 85],
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: 'rgb(34, 197, 94)',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        };

        const lineOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top' as const,
              labels: { color: 'rgb(75, 85, 99)', padding: 15 },
            },
          },
          scales: {
            y: {
              beginAtZero: false,
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
            },
            x: {
              grid: { display: false },
            },
          },
        };

        // ===== 4. Données pour Graphique Polaire (Polar Area) =====
        const polarData = {
          labels: ['Frontend', 'Backend', 'Mobile', 'Data Science', 'DevOps', 'Design'],
          datasets: [
            {
              data: [320, 245, 180, 156, 132, 98],
              backgroundColor: [
                'rgba(59, 130, 246, 0.7)',   // blue
                'rgba(34, 197, 94, 0.7)',     // green
                'rgba(249, 115, 22, 0.7)',    // orange
                'rgba(139, 92, 246, 0.7)',    // purple
                'rgba(236, 72, 153, 0.7)',    // pink
                'rgba(234, 179, 8, 0.7)',     // yellow
              ],
              borderColor: 'rgb(255, 255, 255)',
              borderWidth: 2,
            },
          ],
        };

        const polarOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right' as const,
              labels: { 
                color: 'rgb(75, 85, 99)', 
                padding: 15,
                usePointStyle: true,
                pointStyle: 'circle',
              },
            },
          },
          scales: {
            r: {
              grid: { color: 'rgba(0, 0, 0, 0.1)' },
              ticks: { display: false },
            },
          },
        };
        
        return (
          <div className="space-y-6">
            {/* Titre de la section */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <BarChart3 className="w-8 h-8" />
                Statistiques
              </h2>
              <p className="opacity-90">Visualisation des données de la plateforme</p>
            </div>

            {/* Bouton Export avec menu déroulant */}
            <div className="flex justify-end">
              <div className="relative">
                <button
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Exporter
                </button>
                {/* Menu déroulant */}
                {exportMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                    <button
                      onClick={exportToExcel}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-center gap-2"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-green-600" /> Excel
                    </button>
                    <button
                      onClick={exportToJSON}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-center gap-2"
                    >
                      <FileJson className="w-4 h-4 text-yellow-600" /> JSON
                    </button>
                    <button
                      onClick={exportToCSV}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-blue-600" /> CSV
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 4 cartes en 2x2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ===== 1. Diagramme en Bande ===== */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Inscriptions par mois
                </h3>
                <div className="h-72">
                  <Bar data={barData} options={barOptions} />
                </div>
              </div>

              {/* ===== 2. Diagramme Circulaire ===== */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-yellow-500" />
                  Formations populaires
                </h3>
                <div className="h-72">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
              </div>

              {/* ===== 3. Courbe d'évolution ===== */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-purple-500" />
                  Évolution des utilisateurs
                </h3>
                <div className="h-72">
                  <Line data={lineData} options={lineOptions} />
                </div>
              </div>

              {/* ===== 4. Graphique Polaire ===== */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  Répartition par catégorie
                </h3>
                <div className="h-72">
                  <PolarArea data={polarData} options={polarOptions} />
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'revenus':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Revenu Plateforme</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">
                      { (user?.solde || 0).toFixed(2) } FCFA
                    </h3>
                    <p className="text-purple-600 text-sm mt-1">30% sur toutes les ventes</p>
                  </div>
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">💰</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Réversé Professeurs</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">
                      { ((user?.solde || 0) * 70 / 30).toFixed(2) } FCFA
                    </h3>
                    <p className="text-blue-600 text-sm mt-1">70% part des créateurs</p>
                  </div>
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">👨🏫</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Chiffre d'affaire Total Brut</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">
                      { ((user?.solde || 0) * 100 / 30).toFixed(2) } FCFA
                    </h3>
                    <p className="text-purple-600 text-sm mt-1">Somme de toutes les transactions</p>
                  </div>
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">📊</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Comment ça marche ?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-4xl font-bold text-green-600">30%</div>
                  <p className="text-gray-600 mt-2">Commission plateforme sur chaque formation vendue</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-4xl font-bold text-blue-600">70%</div>
                  <p className="text-gray-600 mt-2">Revenu reversé automatiquement au professeur créateur</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-4xl font-bold text-gray-700">100%</div>
                  <p className="text-gray-600 mt-2">Prix payé par l'apprenant</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Paramètres du système</h2>
            <div className="space-y-6">
              <DashboardSettingsPanel
                role="admin"
                roleLabel="Administrateur"
                stats={[
                  { label: 'Utilisateurs', value: totalUsers.toString() },
                  { label: 'Formations', value: statistics.general.formations.toString() },
                  { label: 'Total demandes', value: totalDemandesCount.toString() },
                ]}
                securityText="Cet espace contrôle l’administration de la plateforme. Gardez vos notifications critiques actives et utilisez une identité visuelle claire pour distinguer rapidement votre interface de supervision."
              />
              <div>
                <h3 className="font-medium mb-2">Général</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>Notifications email</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>Inscription publique</span>
                  </label>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Sécurité</h3>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  Changer le mot de passe admin
                </button>
              </div>
            </div>
          </div>
        );

      case 'demandes':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Demandes de formateurs</h2>
                  <p className="text-gray-500 text-sm">Gérez les demandes d'inscription</p>
                </div>
              </div>
            </div>
            {(() => {
              const pendingDemandes = teacherRequests.filter((d) => d.statut === 'EN_ATTENTE');
              const approvedDemandes = teacherRequests.filter((d) => d.statut === 'APPROUVEE');
              const rejectedDemandes = teacherRequests.filter((d) => d.statut === 'REJETEE');

              const domaineLabels: Record<string, string> = {
                developpement_web: 'Développement Web',
                developpement_mobile: 'Développement Mobile',
                data_science: 'Data Science',
                machine_learning: 'Machine Learning',
                cybersecurite: 'Cybersécurité',
                design: 'Design UI/UX',
                marketing: 'Marketing Digital',
                gestion_projet: 'Gestion de Projet',
                langues: 'Langues',
                autre: 'Autre'
              };

              const handleValide = async (id: number) => {
                try {
                  await apiProfesseur.validerDemande(id);
                  await fetchTeacherRequests();
                  showNotification('Demande approuvée', 'Le compte professeur a été créé et les identifiants ont été envoyés par email.', 'success');
                } catch (error) {
                  showNotification(
                    'Validation impossible',
                    error instanceof Error ? error.message : 'Erreur lors de la validation de la demande',
                    'error'
                  );
                }
              };

              const handleReject = async (id: number) => {
                try {
                  await apiProfesseur.rejeterDemande(id);
                  await fetchTeacherRequests();
                  showNotification('Demande rejetée', 'La demande de formateur a été rejetée.', 'info');
                } catch (error) {
                  showNotification(
                    'Rejet impossible',
                    error instanceof Error ? error.message : 'Erreur lors du rejet de la demande',
                    'error'
                  );
                }
              };

              if (teacherRequestsLoading) {
                return <p className="text-sm text-gray-500">Chargement des demandes...</p>;
              }

              return (
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{pendingDemandes.length}</span>
                      </div>
                      <h3 className="font-semibold text-lg text-orange-800">Demandes en attente</h3>
                    </div>
                    {pendingDemandes.length === 0 ? (
                      <div className="text-center py-8 text-orange-600">
                        <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>Aucune demande en attente</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pendingDemandes.map((demande) => (
                          <div key={demande.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                  {demande.nom?.charAt(0).toUpperCase()}{demande.prenom?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-800">{demande.nom} {demande.prenom}</h4>
                                  <p className="text-xs text-gray-500">{demande.email}</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                  {domaineLabels[demande.domaineExpertise] || demande.domaineExpertise}
                                </span>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-600">{demande.experience} ans</span>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">{demande.motivation}</p>
                              <p className="text-xs text-gray-400">{new Date(demande.dateCreation).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => void handleValide(demande.id)} className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center justify-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Valider
                              </button>
                              <button onClick={() => void handleReject(demande.id)} className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center justify-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Rejeter
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{approvedDemandes.length}</span>
                      </div>
                      <h3 className="font-semibold text-lg text-green-800">Demandes approuvées</h3>
                    </div>
                    {approvedDemandes.length === 0 ? (
                      <p className="text-green-600 text-center py-4">Aucune demande approuvée</p>
                    ) : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {approvedDemandes.map((demande) => (
                          <div key={demande.id} className="bg-white rounded-lg shadow-sm p-3 flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 truncate">{demande.nom} {demande.prenom}</p>
                              <p className="text-xs text-gray-500 truncate">{demande.email}</p>
                              {demande.loginGenere && (
                                <p className="text-xs text-green-700 truncate mt-1">Login envoyé : {demande.loginGenere}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-5 border border-red-200">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{rejectedDemandes.length}</span>
                      </div>
                      <h3 className="font-semibold text-lg text-red-800">Demandes rejetées</h3>
                    </div>
                    {rejectedDemandes.length === 0 ? (
                      <p className="text-red-600 text-center py-4">Aucune demande rejetée</p>
                    ) : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {rejectedDemandes.map((demande) => (
                          <div key={demande.id} className="bg-white rounded-lg shadow-sm p-3 flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 truncate">{demande.nom} {demande.prenom}</p>
                              <p className="text-xs text-gray-500 truncate">{demande.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        );
    }
  };

  // Modals placed outside switch so they work from any tab
  const renderModals = () => (
    <>
      {/* Modal d'ajout/modification d'utilisateur */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => { setIsUserModalOpen(false); setEditingUser(null); }}
        title={editingUser?.id ? 'Modifier un utilisateur' : 'Ajouter un utilisateur'}
        size="md"
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={editingUser?.nom || ''}
                onChange={(e) => setEditingUser(editingUser ? { ...editingUser, nom: e.target.value } : null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Nom"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                type="text"
                value={editingUser?.prenom || ''}
                onChange={(e) => setEditingUser(editingUser ? { ...editingUser, prenom: e.target.value } : null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Prénom"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={editingUser?.email || ''}
              onChange={(e) => setEditingUser(editingUser ? { ...editingUser, email: e.target.value } : null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ex: jean@example.com"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
              <select
                value={editingUser?.role || 'APPRENANT'}
                onChange={(e) => setEditingUser(editingUser ? { ...editingUser, role: e.target.value } : null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="APPRENANT">Apprenant</option>
                <option value="PROF">Professeur</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Login</label>
              <input
                type="text"
                value={editingUser?.login || ''}
                onChange={(e) => setEditingUser(editingUser ? { ...editingUser, login: e.target.value } : null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Login utilisateur"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={editingUser?.mdp || ''}
              onChange={(e) => setEditingUser(editingUser ? { ...editingUser, mdp: e.target.value } : null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={editingUser?.id ? 'Laissez vide pour garder l\'actuel' : 'Mot de passe'}
              required={!editingUser?.id}
            />
          </div>
          {/* Champs spécifiques au professeur - affichés seulement si rôle est PROF */}
          {editingUser?.role === 'PROF' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                <input
                  type="text"
                  value={editingUser?.specialite || ''}
                  onChange={(e) => setEditingUser(editingUser ? { ...editingUser, specialite: e.target.value } : null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Développement Web, Mathématiques..."
                  required={editingUser?.role === 'PROF'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <input
                  type="text"
                  value={editingUser?.bio || ''}
                  onChange={(e) => setEditingUser(editingUser ? { ...editingUser, bio: e.target.value } : null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Présentez-vous en quelques mots..."
                  required={editingUser?.role === 'PROF'}
                />
              </div>
            </div>
          )}
          {/* Champ spécifique à l'apprenant - affiché seulement si rôle est APPRENANT */}
          {editingUser?.role === 'APPRENANT' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <select
                value={editingUser?.niveau || ''}
                onChange={(e) => setEditingUser(editingUser ? { ...editingUser, niveau: e.target.value } : null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Sélectionner un niveau</option>
                <option value="debutant">Débutant</option>
                <option value="intermediare">Intermédiaire</option>
                <option value="avance">Avancé</option>
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsUserModalOpen(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">Annuler</button>
            <button type="submit" className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">{editingUser?.id ? 'Modifier' : 'Ajouter'}</button>
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
        onConfirm={confirmDeleteFormation}
        onCancel={() => setIsDeleteDialogOpen(false)}
        type="danger"
      />
      {/* Dialog de confirmation de suppression utilisateur */}
      <ConfirmDialog
        isOpen={isUserDeleteDialogOpen}
        title="Supprimer l'utilisateur"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDeleteUser}
        onCancel={() => setIsUserDeleteDialogOpen(false)}
        type="danger"
      />
      <NotificationDialog
        isOpen={notification.isOpen}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
      />
    </>
  );

  return (
    <div className="w-screen h-screen bg-gray-100">
      <DashboardHeader color="purple" />
      {renderModals()}
      
      {/* Sidebar - Desktop à gauche, Mobile en bas */}
      {/* Desktop sidebar */}
      <aside className={`hidden lg:fixed left-0 top-16 h-screen bg-white shadow-lg z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} lg:block`}>
        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-6 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-purple-700 transition-colors"
        >
          <svg className={`w-4 h-4 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Logo area */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            {sidebarOpen && (
              <span className="font-bold text-xl text-purple-600">Admin</span>
            )}
          </div>
        </div>

        {/* Menu items */}
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

        {/* User info at bottom */}
        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="font-medium text-gray-600">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40 overflow-x-auto">
        <div className="flex items-center py-2 px-2 gap-1 min-w-max">
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

        {/* Main content */}
        <main className={`lg:flex-1 transition-all duration-300 lg:ml-64 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} pb-20 lg:pb-0`}>
          <div className="p-8 mt-12">
            {/* Content */}
            {renderContent()}
          </div>
        </main>
    </div>
  );
}
