import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, Award, CheckCircle, PlayCircle, Star, Lock } from 'lucide-react';
import Header from '../components/Header';
import PaymentModal from '../components/PaymentModal';
import { useAuth } from '../contexts/AuthContext';
import { apiFormation } from '../api/apiFormation';

interface Session {
  id: number;
  dateDebut: string;
  dateFin: string;
  completed: boolean;
}

interface Cours {
  id: number;
  titre: string;
  description: string;
  typeCours: string;
  prix: number;
  estCertifiant: boolean;
  sessions: Session[];
}

const FormationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [cours, setCours] = useState<Cours | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [enrollmentMessage, setEnrollmentMessage] = useState<string | null>(null);

  // Gérer l'inscription à un cours gratuit
  const handleFreeEnrollment = () => {
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion
      navigate('/login', { state: { from: { pathname: `/formations/${id}` } } });
      return;
    }

    // Simuler l'inscription
    const inscription = {
      id: Math.random(),
      coursId: cours?.id,
      utilisateurId: user?.id,
      dateInscription: new Date().toISOString(),
      coursTitre: cours?.titre
    };

    console.log('Inscription créée (gratuit):', inscription);

    // Afficher le message de succès
    setEnrollmentMessage(`Inscription au cours "${cours?.titre}" réussie ! Vous pouvez maintenant accéder au contenu.`);

    // Rediriger vers le dashboard après 2 secondes
    setTimeout(() => {
      navigate('/apprenant');
    }, 2000);
  };

  // Gérer l'inscription à un cours payant
  const handlePaidEnrollment = () => {
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion
      navigate('/login', { state: { from: { pathname: `/formations/${id}` } } });
      return;
    }

    // Afficher le modal de paiement
    setShowPaymentModal(true);
  };

  // Gérer le succès du paiement
  const handlePaymentSuccess = (paymentMethod: string) => {
    if (!cours || !user) return;
    console.log('Paiement validé:', paymentMethod);

    // Afficher le message de succès
    setEnrollmentMessage(`Paiement validé pour "${cours.titre}". La formation est maintenant disponible dans votre espace apprenant.`);

    // Rediriger vers le dashboard après 2 secondes
    setTimeout(() => {
      navigate('/apprenant');
    }, 2000);
  };

  // Charger la formation depuis l'API
  useEffect(() => {
    const loadFormation = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        const courseId = parseInt(id);
        const response = await apiFormation.getOneFormation(courseId);
        
        if (response && response.data) {
          const formation = response.data;
          setCours({
            id: formation.id,
            titre: formation.titre,
            description: formation.description,
            typeCours: formation.typeCours,
            prix: formation.prix,
            estCertifiant: formation.statut === 'VALIDATED',
            sessions: formation.sessions || []
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la formation:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFormation();
  }, [id]);

  const isGratuit = cours?.prix === 0;
  const nombreSessions = cours?.sessions?.length || 0;

  // Compétences acquises à la fin de la formation
  const competences = [
    'Maîtriser HTML5 et CSS3',
    'Créer des sites web responsives',
    'Utiliser JavaScript ES6+',
    'Manipuler le DOM',
    'Intégrer des API REST',
    'Développer avec React.js',
    'Optimiser les performances',
    'Déployer une application web'
  ];

  // Compétences spécifiques pour Data Science
  const competencesDataScience = [
    'Maîtriser Python et Pandas',
    'Analyser de grands ensembles de données',
    'Créer des visualisations de données',
    'Construire des modèles prédictifs',
    'Utiliser Scikit-learn',
    'Effectuer du Machine Learning',
    'Nettoyer et préparer les données',
    'Présenter les résultats'
  ];

  // Compétences spécifiques pour UX/UI Design
  const competencesDesign = [
    'Maîtriser Figma',
    'Créer des wireframes',
    'Concevoir des prototypes',
    'Appliquer les principes UX',
    'Concevoir des interfaces responsives',
    'Créer des design systems',
    'Réaliser des tests utilisateurs',
    'Animer des prototypes'
  ];

  const getCompetences = () => {
    if (cours?.id === 2) return competencesDataScience;
    if (cours?.id === 3) return competencesDesign;
    return competences;
  };

  if (loading) {
    return (
      <div className="w-screen bg-gray-50 min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#a855f7]"></div>
        </div>
      </div>
    );
  }

  if (!cours) {
    return (
      <div className="w-screen bg-gray-50 min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Formation non trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen bg-gray-50 min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#a855f7] to-purple-700 py-16">
        <div className="px-4 md:px-16 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm mb-4">
                {cours.typeCours}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {cours.titre}
              </h1>
              <p className="text-white/90 text-lg mb-6">
                {cours.description}
              </p>
              <div className="flex flex-wrap gap-4 text-white">
                <div className="flex items-center gap-2">
                  <Clock size={20} />
                  <span>{nombreSessions} sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={20} />
                  <span>Tous niveaux</span>
                </div>
                {cours.estCertifiant && (
                  <div className="flex items-center gap-2">
                    <Award size={20} />
                    <span>Certification incluse</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Card Prix */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
              <div className="text-center">
                <p className="text-gray-500 mb-2">Prix de la formation</p>
                <div className="text-4xl md:text-5xl font-bold text-[#a855f7] mb-4">
                  {isGratuit ? 'Gratuit' : `${cours.prix} CFA`}
                </div>
                {!isGratuit && (
                  <p className="text-gray-400 text-sm mb-6">
                    Paiement unique
                  </p>
                )}
                <button 
                  onClick={() => isGratuit ? handleFreeEnrollment() : handlePaidEnrollment()}
                  className="w-full py-4 bg-[#a855f7] text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition shadow-lg"
                >
                  {isGratuit ? 'Commencer maintenant' : "S'inscrire"}
                </button>
                <p className="text-gray-400 text-sm mt-4">
                  {isGratuit 
                    ? 'Accédez immédiatement au contenu' 
                    : 'Garantie satisfait ou remboursé sous 30 jours'}
                </p>
              </div>
              
              <div className="border-t border-gray-200 mt-6 pt-6">
                <h4 className="font-bold text-gray-800 mb-4">Cette formation inclut :</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-600">
                    <PlayCircle className="text-[#a855f7]" size={20} />
                    <span>{nombreSessions} sessions vidéo</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <Award className="text-[#a855f7]" size={20} />
                    <span>Certification reconnue</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <Users className="text-[#a855f7]" size={20} />
                    <span>Accès communauté</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <Clock className="text-[#a855f7]" size={20} />
                    <span>Accès à vie</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compétences à acquérir */}
      <section className="py-16 px-4 md:px-16 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            En 12 semaines, vous serez capable de :
          </h2>
          <p className="text-gray-500 mb-8">
            À la fin de cette formation, vous maîtriserez toutes les compétences nécessaires pour travailler en tant que professionnel.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {getCompetences().map((competence, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100"
              >
                <CheckCircle className="text-[#a855f7] shrink-0" size={24} />
                <span className="text-gray-700 font-medium">{competence}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programme / Sessions */}
      <section className="py-16 px-4 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
            Programme de la formation
          </h2>
          
          <div className="space-y-4">
            {cours.sessions.map((session, index) => {
              // ✅ VÉRIFICATION ACCÈS SESSION
              const isFirstSession = index === 0;
              const previousSessionCompleted = index > 0 ? cours.sessions[index - 1].completed === true : true;
              const sessionAccessible = isFirstSession || previousSessionCompleted;

              return (
              <div 
                key={session.id}
                className={`border rounded-xl p-4 transition ${
                  sessionAccessible 
                    ? "border-gray-200 hover:border-[#a855f7] cursor-pointer" 
                    : "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
                }`}
                onClick={() => sessionAccessible && console.log('Ouvrir session', session.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 text-white rounded-full flex items-center justify-center font-bold ${
                      sessionAccessible ? "bg-[#a855f7]" : "bg-gray-300"
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className={`font-bold ${sessionAccessible ? "text-gray-800" : "text-gray-400"}`}>
                        Semaine {index + 1}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        {new Date(session.dateDebut).toLocaleDateString('fr-FR')} - {new Date(session.dateFin).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  {sessionAccessible ? (
                    <PlayCircle className="text-gray-400 hover:text-[#a855f7]" size={24} />
                  ) : (
                    <Lock className="text-gray-300" size={24} />
                  )}
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 px-4 md:px-16 bg-purple-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
            Ce que disent nos apprenants
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Marie D.",
                role: "Développeuse Front-End",
                text: "Cette formation m'a permis de décrocher mon premier emploi en seulement 3 mois !",
                rating: 5
              },
              {
                name: "Jean M.",
                role: "Freelance",
                text: "Le contenu est très bien structuré et les projets pratiques sont parfaits.",
                rating: 5
              },
              {
                name: "Sophie L.",
                role: "UX Designer",
                text: "Je recommande cette formation à tous ceux qui veulent se lancer.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-4 md:px-16 bg-gradient-to-r from-[#a855f7] to-purple-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Prêt à commencer votre transformation ?
          </h2>
          <p className="text-white/90 mb-8">
            Rejoignez des milliers d'apprenants et lancez-vous dès aujourd'hui !
          </p>
          <button 
            onClick={() => isGratuit ? handleFreeEnrollment() : handlePaidEnrollment()}
            className="px-8 py-4 bg-white text-[#a855f7] rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-xl"
          >
            {isGratuit ? 'Commencer maintenant' : "S'inscrire maintenant"}
          </button>
        </div>
      </section>

      {/* Message de succès d'inscription */}
      {enrollmentMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Inscription réussie !</h3>
            <p className="text-gray-600">{enrollmentMessage}</p>
          </div>
        </div>
      )}

      {/* Modal de paiement */}
      {cours && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          formationId={cours.id}
          courseName={cours.titre}
          amount={cours.prix}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default FormationDetail;
