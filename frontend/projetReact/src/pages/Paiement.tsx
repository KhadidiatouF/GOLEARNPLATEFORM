import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Clock, BookOpen, Infinity as InfinityIcon, Award, CheckCircle, Loader, Star, GraduationCap, Video, CreditCard } from 'lucide-react';
import Header from '../components/Header';
import { apiPaiement } from '../api/apiPaiement';
import { apiFormation } from '../api/apiFormation';

interface Formation {
  id: number;
  titre: string;
  description: string;
  prix: number;
  niveau: string;
  categorie: string;
  duree?: string;
  nombreLecons?: number;
  nombreEtudiants?: number;
  note?: number;
  instructeur?: string;
  isFree?: boolean;
}

const Paiement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const formation: Formation | null =
    location.state?.formation ||
    JSON.parse(localStorage.getItem('selectedFormation') || 'null');

  const [selectedMethod, setSelectedMethod] = useState<'wave' | 'orange_money' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showMethods, setShowMethods] = useState(false);

  if (!formation) {
    return (
      <div className="w-screen h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Aucune formation sélectionnée</p>
            <button onClick={() => navigate('/formations')} className="text-purple-600 hover:underline">
              Retour aux formations
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    navigate('/login', { state: { from: { pathname: '/paiement', formation } } });
    return null;
  }

  const isFree = formation.isFree || formation.prix === 0;
  const duree = formation.duree || '5h';
  const nombreLecons = formation.nombreLecons || 20;
  const nombreEtudiants = formation.nombreEtudiants || 184;
  const note = formation.note || 4.7;
  const instructeur = formation.instructeur || 'Équipe Golearn';

  const handleFreeEnroll = async () => {
    setIsProcessing(true);
    setPaymentStatus('idle');
    setErrorMessage('');

    try {
      await apiFormation.inscriptionFormation(formation.id);
      setPaymentStatus('success');
      setTimeout(() => navigate('/apprenant'), 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de l'inscription";
      if (message.toLowerCase().includes('déjà inscrit')) {
        setPaymentStatus('success');
        setTimeout(() => navigate('/apprenant'), 2000);
        return;
      }
      setPaymentStatus('error');
      setErrorMessage(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod) return;
    setIsProcessing(true);
    setPaymentStatus('idle');
    setErrorMessage('');

    try {
      const moyenPaiement = selectedMethod === 'wave' ? 'WAVE' : 'OM';
      await apiPaiement.createPaiement({
        formationId: formation.id,
        moyenPaiement,
      });

      setPaymentStatus('success');
      setTimeout(() => navigate('/apprenant'), 2000);
    } catch (error) {
      setPaymentStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'La transaction a échoué. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
      />
    ));
  };

  /* ── objectifs apprenants ── */
  const objectifs = [
    'Maîtriser les fondamentaux de ' + formation.titre,
    'Mettre en pratique vos acquis sur des cas concrets',
    'Développer des compétences recherchées sur le marché',
    'Construire un projet valorisable dans votre portfolio',
    'Structurer une méthode de travail professionnelle',
    'Gagner en autonomie pour progresser rapidement',
  ];

  /* ── sections du cours (démo) ── */
  const sections = [
    { titre: 'Introduction & premier projet', lecons: 5, duree: '75 min' },
    { titre: 'Données avec PostgreSQL & TypeORM', lecons: 5, duree: '75 min' },
    { titre: "Sécurisation avec l'authentification JWT", lecons: 5, duree: '75 min' },
    { titre: 'Validation, tests & déploiement', lecons: 5, duree: '75 min' },
  ];

  /* ── avis étudiants (démo) ── */
  const avis = [
    { initiales: 'MS', nom: 'Malick Siguy Ndiaye', date: 'Il y a 16 jours', commentaire: '' },
    { initiales: 'HG', nom: 'Hawa Gaye', date: 'Il y a 13 jours', commentaire: '' },
    { initiales: 'DW', nom: 'Dj Weuze', date: 'Il y a 3 jours', commentaire: "J'ai beaucoup aimé le cours. Merci Golearn." },
  ];

  return (
    <div className="w-screen min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-purple-600 mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux formations
        </button>

        {paymentStatus === 'success' ? (
          /* ── Écran succès ── */
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-purple-100 p-10 text-center shadow-lg">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-semibold text-purple-700 mb-3">
              {isFree ? 'Inscription confirmée !' : 'Paiement confirmé !'}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              {isFree
                ? `Vous avez accès au cours "${formation.titre}". Bonne formation !`
                : `Votre paiement pour "${formation.titre}" a été validé. La formation est déjà ajoutée à votre espace apprenant.`}
            </p>
            <p className="text-gray-400 text-xs">Redirection vers votre espace apprenant...</p>
          </div>
        ) : (
          /* ── Layout principal ── */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

            {/* ═══ Colonne gauche ═══ */}
            <div className="space-y-6">

              {/* En-tête du cours - Version améliorée avec dégradé violet */}
              <div className="bg-purple-700 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-8">
                  {/* Badge type */}
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-4 py-1.5 rounded-full mb-5 ${
                    isFree
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-white/20 text-white/90 backdrop-blur-sm'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isFree ? 'bg-green-400' : 'bg-white'}`} />
                    {isFree ? 'Gratuit' : 'Premium'}
                  </span>

                  <h1 className="text-white text-2xl font-bold leading-snug mb-4">
                    {formation.titre}
                  </h1>

                  {/* Note */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-0.5">{renderStars(note)}</div>
                    <span className="text-amber-400 text-base font-semibold">{note}</span>
                    <span className="text-white/50 text-sm">({3} notes) · {nombreEtudiants}+ étudiants</span>
                  </div>

                  {/* Méta */}
                  <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{duree} de vidéo</span>
                    <span className="text-white/30">·</span>
                    <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" />{nombreLecons} leçons</span>
                    <span className="text-white/30">·</span>
                    <span className="flex items-center gap-2"><Award className="w-4 h-4" />Certificat inclus</span>
                  </div>

                  <p className="text-white/50 text-sm mt-4">
                    Créé par <span className="text-white/80 font-medium">{instructeur}</span> · Dernière mise à jour : Février 2026
                  </p>
                </div>
              </div>

              {/* Ce que vous allez apprendre */}
              <div className="bg-white rounded-2xl border border-purple-100 p-7 shadow-sm">
                <h2 className="text-base font-semibold text-purple-700 mb-5 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Ce que vous allez apprendre
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {objectifs.map((obj, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-purple-600" />
                      </div>
                      {obj}
                    </div>
                  ))}
                </div>
              </div>

              {/* Ce cours comprend */}
              <div className="bg-white rounded-2xl border border-purple-100 p-7 shadow-sm">
                <h2 className="text-base font-semibold text-purple-700 mb-5 flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Ce cours comprend
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: <Clock className="w-5 h-5 text-purple-500" />, label: `${duree} de vidéo à la demande` },
                    { icon: <BookOpen className="w-5 h-5 text-purple-500" />, label: `${nombreLecons} leçons` },
                    { icon: <InfinityIcon className="w-5 h-5 text-purple-500" />, label: 'Accès illimité à vie' },
                    { icon: <Award className="w-5 h-5 text-purple-500" />, label: 'Certificat de fin de formation' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contenu du cours */}
              <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-sm">
                <div className="px-7 py-5 border-b border-purple-50 bg-gradient-to-r from-purple-50/50 to-transparent">
                  <h2 className="text-base font-semibold text-purple-700">
                    Contenu du cours
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {sections.length} sections · {nombreLecons} leçons · {duree} de contenu total
                  </p>
                </div>
                {sections.map((section, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-7 py-4 border-b border-gray-50 hover:bg-purple-50/30 transition-colors cursor-pointer last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-semibold text-purple-600 flex-shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{section.titre}</span>
                    </div>
                    <span className="text-sm text-gray-400 whitespace-nowrap ml-4">
                      {section.lecons} leçons · {section.duree}
                    </span>
                  </div>
                ))}
              </div>

              {/* Avis étudiants */}
              <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-sm">
                <div className="px-7 py-5 border-b border-purple-50 bg-purple-50">
                  <h2 className="text-base font-semibold text-purple-700">
                    Avis des étudiants
                  </h2>
                </div>
                <div className="px-7 py-5 border-b border-purple-50 flex items-center gap-8">
                  <div>
                    <div className="text-5xl font-bold text-purple-700">{note}</div>
                    <div className="flex items-center gap-0.5 mt-2">{renderStars(note)}</div>
                    <div className="text-sm text-gray-400 mt-1">Note du cours</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[67, 33, 0, 0, 0].map((pct, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-sm text-gray-400 w-8 text-right">{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-7 py-5 space-y-5">
                  {avis.map((a, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-sm font-semibold text-purple-600 flex-shrink-0">
                        {a.initiales}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{a.nom}</p>
                        <p className="text-xs text-gray-400">{a.date}</p>
                        {a.commentaire && (
                          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{a.commentaire}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══ Sidebar droite - AMÉLIORÉE ═══ */}
            <div className="lg:sticky lg:top-6">
              <div className="bg-white rounded-3xl border border-purple-100 overflow-hidden shadow-2xl">

                {/* En-tête avec dégradé */}
                <div className="bg-purple-600 p-6 text-center">
                  <h3 className="text-white text-lg font-semibold mb-1">Formation</h3>
                  <p className="text-white/80 text-sm">{formation.titre}</p>
                </div>

                {/* Prix */}
                <div className="p-7 border-b border-purple-100">
                  {isFree ? (
                    <>
                      <div className="text-center mb-4">
                        <span className="text-4xl font-bold text-green-600">Gratuit</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-6">
                        {formation.prix > 0 && (
                          <>
                            <span className="text-lg text-gray-400 line-through">
                              {formation.prix.toLocaleString()} F CFA
                            </span>
                            <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-100 text-green-700">
                              100% OFF
                            </span>
                          </>
                        )}
                      </div>
                      <button
                        onClick={handleFreeEnroll}
                        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-base font-semibold transition-colors shadow-lg hover:shadow-xl"
                      >
                        Commencer maintenant — C'est gratuit
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-center mb-6">
                        <span className="text-5xl font-bold text-gray-900">
                          {formation.prix.toLocaleString()}
                        </span>
                        <span className="text-xl text-gray-500 ml-1">F CFA</span>
                      </div>

                      {!showMethods ? (
                        <button
                          onClick={() => setShowMethods(true)}
                          className="w-full py-4 bg-purple-600  hover:from-purple-700 hover:to-purple-700 text-white rounded-xl text-base font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                          Payer maintenant
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Moyen de paiement
                          </p>

                          {errorMessage && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
                              {errorMessage}
                            </div>
                          )}

                          {/* Wave */}
                          <button
                            onClick={() => setSelectedMethod('wave')}
                            disabled={isProcessing}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all ${
                              selectedMethod === 'wave'
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-lg">
                              <img 
                                src="/wave.png" 
                                alt="Wave" 
                                className="w-10 h-10 object-contain"
                              />
                            </div>
                            <div className="text-left flex-1">
                              <div className="text-base font-semibold text-gray-800">Wave</div>
                              <div className="text-sm text-gray-500">Paiement instantané via mobile</div>
                            </div>
                            {selectedMethod === 'wave' && (
                              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </button>

                          {/* Orange Money */}
                          <button
                            onClick={() => setSelectedMethod('orange_money')}
                            disabled={isProcessing}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all ${
                              selectedMethod === 'orange_money'
                                ? 'border-orange-500 bg-orange-50 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden">
                              <img 
                                src="/OM.png" 
                                alt="Orange Money" 
                                className="w-10 h-10 object-contain"
                              />
                            </div>
                            <div className="text-left flex-1">
                              <div className="text-base font-semibold text-gray-800">Orange Money</div>
                              <div className="text-sm text-gray-500">Paiement mobile Orange</div>
                            </div>
                            {selectedMethod === 'orange_money' && (
                              <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </button>

                          <button
                            onClick={handlePayment}
                            disabled={!selectedMethod || isProcessing}
                            className={`w-full py-4 rounded-xl text-base font-semibold transition-all shadow-lg ${
                              selectedMethod && !isProcessing
                                ? 'bg-purple-600 text-white hover:from-purple-700 hover:to-purple-700 hover:shadow-xl'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {isProcessing ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader className="w-5 h-5 animate-spin" />
                                Traitement en cours...
                              </span>
                            ) : (
                              `Payer ${formation.prix.toLocaleString()} F CFA`
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Ce cours comprend (sidebar) */}
                <div className="p-6 bg-gray-50/50">
                  <p className="text-sm font-semibold text-purple-700 mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Ce cours comprend
                  </p>
                  <div className="space-y-3">
                    {[
                      { icon: <Clock className="w-4 h-4" />, label: `${duree} de vidéo à la demande` },
                      { icon: <BookOpen className="w-4 h-4" />, label: `${nombreLecons} leçons` },
                      { icon: <InfinityIcon className="w-4 h-4" />, label: 'Accès à vie' },
                      { icon: <Award className="w-4 h-4" />, label: 'Certificat de fin' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 text-purple-500">
                          {item.icon}
                        </div>
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Garantie */}
                <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-t border-purple-100">
                  <p className="text-xs text-center text-gray-500">
                    🔒 Paiement sécurisé · Garantie 30 jours satisfait ou remboursé
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Paiement;
