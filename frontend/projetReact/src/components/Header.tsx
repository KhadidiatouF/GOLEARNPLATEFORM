import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 w-full flex justify-between items-center px-16 py-4 bg-white/95 backdrop-blur-md z-[1000] border-b border-gray-100">
      <div className="text-xl font-black tracking-tight text-black">
        GOLEARN
      </div>
      <nav className="hidden md:flex gap-8">
        <a href="/" className="text-sm font-medium hover:text-purple-600 transition-colors">Accueil</a>
        <a href="/formations" className="text-sm font-medium hover:text-purple-600 transition-colors">Formations</a>
        <a href="#" className="text-sm font-medium hover:text-purple-600 transition-colors">A propos</a>
        <a href="#" className="text-sm font-medium hover:text-purple-600 transition-colors">Contact</a>
      </nav>
      <div className="flex gap-3">
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-[#9333ea] text-white rounded-full text-xs font-bold hover:bg-purple-700 transition cursor-pointer"
        >
          Se connecter
        </button>
        <button 
          onClick={() => navigate('/register')}
          className="px-6 py-2 bg-[#9333ea] text-white rounded-full text-xs font-bold hover:bg-purple-700 transition cursor-pointer"
        >
          S'inscrire
        </button>
      </div>
    </header>
  );
};

export default Header;
