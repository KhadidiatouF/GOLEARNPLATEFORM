import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiUsers } from '../api/apiUsers';

interface RegisterErrors {
  nom?: string;
  prenom?: string;
  email?: string;
  login?: string;
  mdp?: string;
  confirmMdp?: string;
  role?: string;
}

export default function Register() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    login: '',
    mdp: '',
    confirmMdp: '',
    role: 'APPRENANT' as 'ADMIN' | 'PROF' | 'APPRENANT'
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Effacer l'erreur quand l'utilisateur corrige le champ
    if (errors[name as keyof RegisterErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des champs
    const newErrors: RegisterErrors = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    } else if (formData.nom.length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }
    
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    } else if (formData.prenom.length < 2) {
      newErrors.prenom = 'Le prénom doit contenir au moins 2 caractères';
    }
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Veuillez entrer un email valide';
    }
    
    if (!formData.login) {
      newErrors.login = 'Le login est requis';
    } else if (formData.login.length < 3) {
      newErrors.login = 'Le login doit contenir au moins 3 caractères';
    } else if (formData.login.length > 20) {
      newErrors.login = 'Le login doit comporter au maximum 20 caractères';
    }
    
    if (!formData.mdp) {
      newErrors.mdp = 'Le mot de passe est requis';
    } else if (formData.mdp.length < 6) {
      newErrors.mdp = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (!formData.confirmMdp) {
      newErrors.confirmMdp = 'La confirmation du mot de passe est requise';
    } else if (formData.mdp !== formData.confirmMdp) {
      newErrors.confirmMdp = 'Les mots de passe ne correspondent pas';
    }
    
    if (!formData.role) {
      newErrors.role = 'Le rôle est requis';
    }
    
    setErrors(newErrors);
    
    // Si pas d'erreurs, soumettre le formulaire
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      try {
        // Préparer les données pour le backend
        const userData = {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          login: formData.login,
          mdp: formData.mdp,
          role: formData.role,
          solde: 0 // Valeur par défaut
        };

        const result = await apiUsers.createUsers(userData);
        
        if (result.success) {
          // Rediriger vers la page de connexion après inscription réussie
          navigate('/login');
        } else {
          // Afficher l'erreur
          setErrors({ email: result.error || 'Erreur lors de l\'inscription' });
        }
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        setErrors({ email: 'Une erreur est survenue lors de l\'inscription' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVisitClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate('/');
    }, 300);
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex">
      {/* Image à gauche - cachée sur mobile */}
      <div className="hidden lg:block w-1/2 relative">
        <img 
          src="/Sign up-pana.png" 
          alt="Image d'inscription" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
          
        </div>
      </div>
      
      {/* Formulaire à droite */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-purple-600">Inscription</h1>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.nom ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
              </div>
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Votre prénom"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.prenom ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Votre email"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-1">Login</label>
              <input
                type="text"
                id="login"
                name="login"
                value={formData.login}
                onChange={handleChange}
                placeholder="Votre login (3-20 caractères)"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.login ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.login && <p className="text-red-500 text-sm mt-1">{errors.login}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="APPRENANT">Apprenant</option>
                <option value="PROF">Professeur</option>
                <option value="ADMIN">Administrateur</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="mdp" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                id="mdp"
                name="mdp"
                value={formData.mdp}
                onChange={handleChange}
                placeholder="Votre mot de passe"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.mdp ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.mdp && <p className="text-red-500 text-sm mt-1">{errors.mdp}</p>}
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmMdp" className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmMdp"
                name="confirmMdp"
                value={formData.confirmMdp}
                onChange={handleChange}
                placeholder="Confirmer votre mot de passe"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.confirmMdp ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.confirmMdp && <p className="text-red-500 text-sm mt-1">{errors.confirmMdp}</p>}
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#9333ea] text-white py-2 rounded-lg font-bold hover:bg-purple-700 transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Déjà un compte ? <Link to="/login" className="text-purple-600 hover:underline">Se connecter</Link>
          </p>
          
          {/* Bouton visiteur avec animation */}
          <button
            onClick={handleVisitClick}
            className={`mt-6 w-full bg-transparent border-2 border-purple-600 text-purple-600 py-2 rounded-lg font-bold hover:bg-purple-600 hover:text-white transition cursor-pointer ${isAnimating ? 'scale-95' : ''}`}
          >
            Visiter sans connexion
          </button>
        </div>
      </div>
    </div>
  );
}
