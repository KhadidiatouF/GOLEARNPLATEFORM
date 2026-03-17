import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiFormation } from '../api/apiFormation';

interface Formation {
  id: number;
  titre: string;
  description: string;
  prix: number;
  categorie: string;
  niveau: string;
  typeCours: string;
  image?: string;
}

interface FormationData {
  id: number;
  titre: string;
  description: string;
  prix: number;
  categorie: string;
  niveau: string;
  typeCours: string;
}

// Données par défaut pour l'affichage (utilisé seulement si l'API échoue)
const defaultFormations: Formation[] = [];

// Features par défaut
const defaultFeatures: Record<number, string[]> = {};

const Formations: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [formations, setFormations] = useState<Formation[]>(defaultFormations);
  const [loading, setLoading] = useState(false);

  // Charger les formations depuis l'API
  useEffect(() => {
    const loadFormations = async () => {
      try {
        setLoading(true);
        const response = await apiFormation.getFormations();
        if (response && response.data) {
          // Transformer les données de l'API
          const formattedFormations: Formation[] = response.data.map((f: FormationData) => ({
            id: f.id,
            titre: f.titre,
            description: f.description,
            prix: f.prix,
            categorie: f.categorie,
            niveau: f.niveau,
            typeCours: f.typeCours,
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'
          }));
          setFormations(formattedFormations);
        }
      } catch {
        console.log('Utilisation des données par défaut');
      } finally {
        setLoading(false);
      }
    };

    loadFormations();
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-purple-600 text-xl">Chargement des formations...</div>
      </div>
    );
  }

  // Vérifier si une formation est gratuite
  const isFormationFree = (formation: Formation): boolean => {
    return formation.typeCours === 'GRATUIT' || formation.prix === 0;
  };

  // Gérer l'ouverture du modal de paiement
  const handleOpenPayment = (formation: Formation) => {
    if (!isAuthenticated || !user) {
      navigate('/login', { state: { from: { pathname: '/formations' } } });
      return;
    }
    // Stocker la formation sélectionnée pour la page de paiement
    localStorage.setItem('selectedFormation', JSON.stringify(formation));
    navigate('/paiement', { state: { formation } });
  };

  // Gérer l'inscription à une formation gratuite
  const handleFreeEnrollment = (formation: Formation): void => {
    if (!isAuthenticated || !user) {
      navigate('/login', { state: { from: { pathname: '/formations' }, formationId: formation.id } });
      return;
    }

    // Vérifier si déjà inscrit
    const inscriptions = JSON.parse(localStorage.getItem('inscriptions') || '[]');
    const dejaInscrit = inscriptions.some(
      (inscription: { coursId: number; utilisateurId: number }) => 
        inscription.coursId === formation.id && inscription.utilisateurId === user.id
    );

    if (dejaInscrit) {
      navigate('/apprenant');
      return;
    }

    // Sauvegarder l'inscription
    const inscription = {
      id: `${formation.id}-${user.id}`,
      coursId: formation.id,
      utilisateurId: user.id,
      dateInscription: new Date().toISOString(),
      coursTitre: formation.titre
    };
    inscriptions.push(inscription);
    localStorage.setItem('inscriptions', JSON.stringify(inscriptions));

    console.log('Inscription créée (gratuit):', inscription);
    navigate('/apprenant');
  };

  const freeFormations = formations.filter(f => isFormationFree(f));
  const paidFormations = formations.filter(f => !isFormationFree(f));

  const getFeatures = (formationId: number): string[] => {
    return defaultFeatures[formationId] || ['Formation professionnelle', 'Certification incluse', 'Support adapté'];
  };

  return (
    <div className="w-screen h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-4/5 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/groupe.jpg" 
            className="w-full h-full object-cover object-center"
            alt="Hero background"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 w-full px-6 md:px-[10%]">
          <div className="max-w-xl text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-[1.1]">
              Découvrez l'ensemble de nos formations de qualité et 100% pratique !
            </h1>
            <p className="text-gray-100 mb-10 text-lg font-light leading-relaxed max-w-md">
              Apprenez, évoluez et surtout pratiquez.
            </p>
          </div>
        </div>
      </section>

      {/* Formations Gratuites */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-1 flex-1 bg-green-500 rounded"></div>
            <h2 className="text-3xl font-bold text-gray-800">Formations Gratuites</h2>
            <div className="h-1 flex-1 bg-green-500 rounded"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {freeFormations.map((formation) => (
              <div key={formation.id} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
                <div className="relative h-56">
                  <img 
                    src={formation.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'} 
                    alt={formation.titre}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                    Gratuit
                  </div>
                </div>
                <div className="p-7">
                  <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
                    <span className="bg-green-50 px-2 py-1 rounded-md">{formation.niveau}</span>
                    <span>•</span>
                    <span className="text-purple-600 font-medium">{formation.categorie}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{formation.titre}</h3>
                  <p className="text-gray-600 mb-5 line-clamp-2">{formation.description}</p>
                  <ul className="space-y-2 mb-6">
                    {getFeatures(formation.id).slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center">
                          <Check className="w-3 h-3 text-green-500" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => handleFreeEnrollment(formation)}
                    className="w-full bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition cursor-pointer shadow-lg hover:shadow-xl"
                  >
                    Commencer la formation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formations Payantes */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-1 flex-1 bg-purple-600 rounded"></div>
            <h2 className="text-3xl font-bold text-gray-800">Formations Premium</h2>
            <div className="h-1 flex-1 bg-purple-600 rounded"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paidFormations.map((formation) => (
              <div key={formation.id} className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-purple-100 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-56">
                  <img 
                    src={formation.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'} 
                    alt={formation.titre}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                    {formation.prix.toLocaleString()} CFA
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-purple-700 px-3 py-1 rounded-md text-sm font-medium">
                      {formation.categorie}
                    </span>
                  </div>
                </div>
                <div className="p-7">
                  <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
                    <span className="bg-purple-50 px-2 py-1 rounded-md text-purple-600 font-medium">{formation.niveau}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{formation.titre}</h3>
                  <p className="text-gray-600 mb-5 line-clamp-2">{formation.description}</p>
                  <ul className="space-y-2 mb-6">
                    {getFeatures(formation.id).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-5 h-5 rounded-full bg-purple-50 flex items-center justify-center">
                          <Check className="w-3 h-3 text-purple-600" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Prix et bouton payer */}
                  <div className="mb-4">
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{formation.prix.toLocaleString()} CFA</div>
                  </div>
                  
                  <button 
                    onClick={() => handleOpenPayment(formation)}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    Payer maintenant
                  </button>
                  
                  <button 
                    onClick={() => navigate(`/formation/${formation.id}`)}
                    className="w-full mt-3 border-2 border-purple-200 text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition cursor-pointer"
                  >
                    Voir les détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">© 2026 GoLearn. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Formations;
