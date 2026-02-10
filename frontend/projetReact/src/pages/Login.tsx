import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LoginErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des champs
    const newErrors: LoginErrors = {};
    
    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Veuillez entrer un email valide';
    }
    
    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    setErrors(newErrors);
    
    // Si pas d'erreurs, soumettre le formulaire
    if (Object.keys(newErrors).length === 0) {
      console.log('Connexion avec:', email, password);
      navigate('/');
    }
  };

  const handleVisitClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate('/');
    }, 300);
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex">
      {/* Image à gauche */}
      <div className="hidden lg:block w-1/2 relative">
        <img 
          src="/Mobile1.png" 
          alt="Image de connexion" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
           
        </div>
      </div>
      
      {/* Formulaire à droite */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-purple-600">Connexion</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder="Votre email"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                placeholder="Votre mot de passe"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#9333ea] text-white py-2 rounded-lg font-bold hover:bg-purple-700 transition cursor-pointer"
            >
              Se connecter
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Pas encore de compte ? <Link to="/register" className="text-purple-600 hover:underline">S'inscrire</Link>
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
