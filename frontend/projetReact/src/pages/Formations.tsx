import React from 'react';
import Header from '../components/Header';
import { Check } from 'lucide-react';

interface Formation {
  id: number;
  title: string;
  description: string;
  price: string;
  duration: string;
  level: string;
  image: string;
  features: string[];
  isFree: boolean;
}

const formationsData: Formation[] = [
  {
    id: 1,
    title: "Développement Web Complet",
    description: "Apprenez HTML, CSS, JavaScript, React et Node.js pour devenir développeur web full-stack.",
    price: "Gratuit",
    duration: "12 semaines",
    level: "Débutant",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
    features: ["HTML5 & CSS3", "JavaScript ES6+", "React.js", "Node.js & Express", "Base de données SQL", "Projet final"],
    isFree: true
  },
  {
    id: 2,
    title: "Introduction à la Programmation",
    description: "Apprenez les bases de la programmation avec Python, idéal pour les débutants.",
    price: "Gratuit",
    duration: "6 semaines",
    level: "Débutant",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600",
    features: ["Logique de programmation", "Variables et types", "Boucles et conditions", "Fonctions", "Structures de données", "Petits projets"],
    isFree: true
  },
  {
    id: 2,
    title: "Data Science avec Python",
    description: "Maîtrisez Python, Pandas, NumPy et Machine Learning pour analyser des données.",
    price: "49€",
    duration: "10 semaines",
    level: "Intermédiaire",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
    features: ["Python avancé", "Pandas & NumPy", "Visualisation de données", "Machine Learning", "Deep Learning", "Certification"],
    isFree: false
  },
  {
    id: 3,
    title: "UX/UI Design Professionnel",
    description: "Apprenez à concevoir des interfaces utilisateur modernes et ergonomiques.",
    price: "39€",
    duration: "8 semaines",
    level: "Débutant",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600",
    features: ["Figma", "Design Thinking", "Wireframing", "Prototypage", "Tests utilisateurs", "Portfolio"],
    isFree: false
  },
  {
    id: 4,
    title: "Marketing Digital",
    description: "Devenez expert en marketing digital et en stratégies de croissance.",
    price: "Gratuit",
    duration: "6 semaines",
    level: "Débutant",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
    features: ["SEO", "Google Ads", "Réseaux sociaux", "Email marketing", "Analytics", "Projet pratique"],
    isFree: true
  },
  {
    id: 5,
    title: "Cybersécurité",
    description: "Apprenez à protéger les systèmes et les données contre les cybermenaces.",
    price: "79€",
    duration: "14 semaines",
    level: "Avancé",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600",
    features: ["Ethical Hacking", "Sécurité réseau", "Cryptographie", "Pentesting", "Compliance", "Certification"],
    isFree: false
  },
  {
    id: 6,
    title: "Intelligence Artificielle",
    description: "Explorez les concepts avancés de l'IA et du Deep Learning.",
    price: "89€",
    duration: "16 semaines",
    level: "Avancé",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600",
    features: ["Neural Networks", "TensorFlow", "NLP", "Computer Vision", "Reinforcement Learning", "Projet IA"],
    isFree: false
  }
];

const Formations: React.FC = () => {
  const freeFormations = formationsData.filter(f => f.isFree);
  const paidFormations = formationsData.filter(f => !f.isFree);

  return (
    <div className="w-screen h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
     <section className="relative h-4/5 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="../src/assets/groupe.jpg" 
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
            <div className="flex flex-wrap gap-4">
             
            </div>
          </div>
        </div>
        
        {/* Optionnel : L'élément graphique violet sur le laptop si vous l'avez en image */}
        <div className="absolute bottom-20 right-20 hidden lg:block opacity-80">
            {/* Insérez ici l'image de l'engrenage violet si disponible */}
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
              <div key={formation.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <img 
                    src={formation.image} 
                    alt={formation.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Gratuit
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                    <span>{formation.duration}</span>
                    <span>•</span>
                    <span>{formation.level}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{formation.title}</h3>
                  <p className="text-gray-600 mb-4">{formation.description}</p>
                  <ul className="space-y-2 mb-6">
                    {formation.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition">
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
              <div key={formation.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-colors">
                <div className="relative h-48">
                  <img 
                    src={formation.image} 
                    alt={formation.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {formation.price}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                    <span>{formation.duration}</span>
                    <span>•</span>
                    <span>{formation.level}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{formation.title}</h3>
                  <p className="text-gray-600 mb-4">{formation.description}</p>
                  <ul className="space-y-2 mb-6">
                    {formation.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-purple-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                    S'inscrire maintenant
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
          <p className="text-gray-400">
            © 2024 GOLEARN. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Formations;
