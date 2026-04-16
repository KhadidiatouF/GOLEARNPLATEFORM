import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, GraduationCap, Users, Mail, AlertCircle } from 'lucide-react';

interface FormErrors {
  nom?: string;
  prenom?: string;
  domaineExpertise?: string;
  experience?: string;
  motivation?: string;
}

const DemandeFormateur: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    domaineExpertise: '',
    experience: '',
    motivation: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    } else if (formData.nom.trim().length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    } else if (formData.prenom.trim().length < 2) {
      newErrors.prenom = 'Le prénom doit contenir au moins 2 caractères';
    }

    if (!formData.domaineExpertise) {
      newErrors.domaineExpertise = 'Veuillez sélectionner un domaine';
    }

    if (!formData.experience) {
      newErrors.experience = 'Veuillez sélectionner vos années d\'expérience';
    }

    if (!formData.motivation.trim()) {
      newErrors.motivation = 'La motivation est requise';
    } else if (formData.motivation.trim().length < 10) {
      newErrors.motivation = 'La motivation doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Effacer l'erreur quand l'utilisateur commence à saisir
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const demandes = JSON.parse(localStorage.getItem('demandesFormateur') || '[]');
      demandes.push({
        id: Date.now(),
        utilisateurId: user?.id,
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: user?.email,
        domaineExpertise: formData.domaineExpertise,
        experience: formData.experience,
        motivation: formData.motivation.trim(),
        statut: 'en_attente',
        date: new Date().toISOString()
      });
      localStorage.setItem('demandesFormateur', JSON.stringify(demandes));
      
      setMessage('Votre demande a été soumise avec succès. Un administrateur va la traiter.');
      setTimeout(() => navigate('/'), 3000);
    } catch {
      setMessage('Erreur lors de la soumission. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen bg-gray-50 py-4 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#a855f7] hover:text-[#9333ea] mb-6"
        >
          <ArrowLeft size={20} />
          Retour
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#a855f7] rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Devenir Formateur</h1>
              <p className="text-gray-500 text-sm">Soumettez votre demande</p>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${message.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a855f7] focus:border-transparent ${errors.nom ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Votre nom"
              />
              {errors.nom && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.nom}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom *
              </label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a855f7] focus:border-transparent ${errors.prenom ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Votre prénom"
              />
              {errors.prenom && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.prenom}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domaine d'expertise *
              </label>
              <select
                name="domaineExpertise"
                value={formData.domaineExpertise}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a855f7] focus:border-transparent ${errors.domaineExpertise ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Sélectionnez un domaine</option>
                <option value="developpement_web">Développement Web</option>
                <option value="developpement_mobile">Développement Mobile</option>
                <option value="data_science">Data Science</option>
                <option value="machine_learning">Machine Learning</option>
                <option value="cybersecurite">Cybersécurité</option>
                <option value="design">Design UI/UX</option>
                <option value="marketing">Marketing Digital</option>
                <option value="gestion_projet">Gestion de Projet</option>
                <option value="langues">Langues</option>
                <option value="autre">Autre</option>
              </select>
              {errors.domaineExpertise && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.domaineExpertise}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Années d'expérience *
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a855f7] focus:border-transparent ${errors.experience ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Sélectionnez</option>
                <option value="1">1 an</option>
                <option value="2">2 ans</option>
                <option value="3">3 ans</option>
                <option value="5">5 ans</option>
                <option value="10">10 ans et plus</option>
              </select>
              {errors.experience && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.experience}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pourquoi voulez-vous rejoindre GOLEARN ? *
              </label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                rows={3}
                placeholder="Votre motivation en quelques mots..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a855f7] focus:border-transparent ${errors.motivation ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.motivation && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.motivation}
                </p>
              )}
            </div>

            <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>Compte : {user?.email || 'Non connecté'}</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#a855f7] text-white rounded-lg font-medium hover:bg-[#9333ea] transition-colors disabled:opacity-50"
              >
                {loading ? 'Envoi...' : 'Soumettre ma demande'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DemandeFormateur;