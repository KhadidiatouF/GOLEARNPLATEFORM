import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../contexts/AuthContext';
import './Login.css';

interface LoginErrors {
  loginInput?: string;
  password?: string;
  role?: string;
}

export default function Login() {
  const [loginInput, setLoginInput] = useState('');
  const [mdp, setMdp] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loginError, setLoginError] = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    // Validation des champs
    const newErrors: LoginErrors = {};
    
    if (!loginInput) {
      newErrors.loginInput = 'Le login est requis';
    }
    
    if (!mdp) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (mdp.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    setErrors(newErrors);
    
    // Si pas d'erreurs, soumettre le formulaire
    if (Object.keys(newErrors).length === 0) {
      // Passer un rôle par défaut, l'API retournera le vrai rôle
      const success = await authLogin(loginInput, mdp, 'apprenant');
      if (success) {
        setTimeout(() => {
          // Lire le rôle depuis localStorage (mis à jour par AuthContext)
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              const userRole = userData.role;
              switch (userRole) {
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
            } catch {
              // En cas d'erreur, redirection vers les formations
              navigate('/formations');
            }
          } else {
            navigate('/formations');
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

  const handleDemoLogin = (demoRole: UserRole, demoLogin: string) => {
    setLoginInput(demoLogin);
    setMdp(demoRole === 'admin' ? 'admin123' : demoRole === 'prof' ? '123456' : '123456');
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex">
      {/* Image à gauche - cachée sur mobile */}
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-purple-600">Connexion</h1>
          
          {loginError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-1">Login</label>
              <input
                type="text"
                id="login"
                value={loginInput}
                onChange={(e) => {
                  setLoginInput(e.target.value);
                  if (errors.loginInput) setErrors({ ...errors, loginInput: undefined });
                }}
                placeholder="Votre login"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.loginInput ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.loginInput && <p className="text-red-500 text-sm mt-1">{errors.loginInput}</p>}
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={mdp}
                onChange={(e) => {
                  setMdp(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                placeholder="Votre mot de passe"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
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
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('apprenant', 'student1')}
                className="bg-blue-100 text-blue-700 py-2 px-2 md:px-3 rounded-lg text-xs hover:bg-blue-200 transition-colors"
              >
                Apprenant
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('prof', 'prof1')}
                className="bg-green-100 text-green-700 py-2 px-2 md:px-3 rounded-lg text-xs hover:bg-green-200 transition-colors"
              >
                Prof
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin', 'admin')}
                className="bg-red-100 text-red-700 py-2 px-2 md:px-3 rounded-lg text-xs hover:bg-red-200 transition-colors"
              >
                Admin
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
