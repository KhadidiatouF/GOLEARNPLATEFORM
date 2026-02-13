import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../contexts/AuthContext';
import './Login.css';

interface LoginErrors {
  email?: string;
  password?: string;
  role?: string;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('apprenant');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loginError, setLoginError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    // Validation des champs
    const newErrors: LoginErrors = {};
    
    if (!email) {
      newErrors.email = "L'email est requis";
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
      const success = login(email, password, role);
      if (success) {
        setTimeout(() => {
          // Redirection selon le profil
          switch (role) {
            case 'admin':
              navigate('/admin');
              break;
            case 'prof':
              navigate('/prof');
              break;
            case 'apprenant':
            default:
              navigate('/formations');
              break;
          }
        }, 300);
      } else {
        setLoginError('Identifiants incorrects');
      }
    }
  };

  const handleVisitClick = () => {
    setTimeout(() => {
      navigate('/');
    }, 300);
  };

  const handleDemoLogin = (demoRole: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword(demoRole === 'admin' ? 'admin123' : demoRole === 'prof' ? 'prof123' : 'apprenant123');
    setRole(demoRole);
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
          
          {loginError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {loginError}
            </div>
          )}
          
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

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Profil</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('apprenant')}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    role === 'apprenant' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Apprenant
                </button>
                <button
                  type="button"
                  onClick={() => setRole('prof')}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    role === 'prof' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Professeur
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    role === 'admin' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Se connecter
            </button>
          </form>

          {/* Accès rapide pour les démos */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center mb-3">Accès rapide (démonstration)</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('apprenant', 'apprenant@example.com')}
                className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-xs hover:bg-blue-200 transition-colors"
              >
                Demo Apprenant
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('prof', 'prof@example.com')}
                className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg text-xs hover:bg-green-200 transition-colors"
              >
                Demo Prof
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin', 'admin@example.com')}
                className="flex-1 bg-red-100 text-red-700 py-2 px-3 rounded-lg text-xs hover:bg-red-200 transition-colors"
              >
                Demo Admin
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-purple-600 hover:text-purple-700 font-medium">
              S'inscrire
            </Link>
          </p>

          <button
            type="button"
            onClick={handleVisitClick}
            className="w-full mt-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
          >
            Visiter en tant que visiteur
          </button>
        </div>
      </div>
    </div>
  );
}
