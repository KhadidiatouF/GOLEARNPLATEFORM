import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Clock, Award, FileCheck, GraduationCap, Users, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen bg-white font-sans text-gray-900">
      <Header />

      {/* Hero Section - CORRIGÉE */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="../src/assets/femme.jpg" 
            className="w-full h-full object-cover object-center"
            alt="Hero background"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 w-full px-6 md:px-[10%]">
          <div className="max-w-xl text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-[1.1]">
              Développez vos compétences dans un nouveau et unique chemin !
            </h1>
            <p className="text-gray-100 mb-10 text-lg font-light leading-relaxed max-w-md">
              Transformez l'apprentissage en une expérience structurée, mesurable et certifiante.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/formations')}
                className="px-6 py-3 bg-[#a855f7] text-white rounded-md text-l font-bold hover:bg-purple-600 transition shadow-lg cursor-pointer"
              >
                Découvrir les formations
              </button>
              <button className="px-6 py-3 bg-[#a855f7] text-white rounded-md text-l font-bold hover:bg-purple-700 transition shadow-lg cursor-pointer">
                Commencer maintenant
              </button>
            </div>
          </div>
        </div>
        
        {/* Optionnel : L'élément graphique violet sur le laptop si vous l'avez en image */}
        <div className="absolute bottom-20 right-20 hidden lg:block opacity-80">
            {/* Insérez ici l'image de l'engrenage violet si disponible */}
        </div>
      </section>

      {/* Section Formations - Design fidèle à la capture */}
      <section className="px-6 py-20">
        <h2 className="text-3xl font-serif font-bold text-center mb-12">Nos Formations</h2>
        
        {/* Barre de recherche arrondie */}
        <div className="max-w-2xl mx-auto mb-20">
          <div className="flex items-center p-1 border border-gray-300 rounded-full bg-white shadow-sm overflow-hidden">
            <div className="flex items-center flex-1 px-5">
              <Search className="text-gray-400 w-5 h-5 mr-3" />
              <input 
                type="text" 
                placeholder="Recherchez une formation"
                className="w-full outline-none text-gray-700 text-sm py-2"
              />
            </div>
            <button className="px-8 py-3 bg-[#a855f7] text-white rounded-full font-bold text-sm hover:bg-purple-700 transition cursor-pointer">
              Rechercher
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Grille d'images avec bordure violette en pointillé */}
          <div className="relative p-6 border-4 border-dashed border-[#a855f7] w-200 rounded-[40px] ml-50">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400" className="rounded-tl-[80px] rounded-2xl w-full h-44 object-cover" alt="Student 1" />
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400" className="rounded-tr-2xl rounded-2xl w-full h-44 object-cover" alt="Student 2" />
              <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400" className="rounded-2xl w-full h-44 object-cover" alt="Student 3" />
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400" className="rounded-br-[80px] rounded-2xl w-full h-44 object-cover" alt="Student 4" />
            </div>
          </div>

          {/* Liste des avantages avec icônes violettes circulaires */}
          <div className="space-y-10">
            <h3 className="text-3xl font-serif leading-tight mr-60">
              <span className="text-[#a855f7] italic ">Bénéficiez</span> de nos cours en ligne
            </h3>
            
            <div className="space-y-8 ml-40">
              {[
                { icon: BookOpen, title: "Des cours pratiques", desc: "Avec de réels projets." },
                { icon: Clock, title: "Apprentissage à votre rythme", desc: "Jusqu'à ce que vous maîtrisez réellement." },
                { icon: Award, title: "Avec des coachs certifiés", desc: "Qui vous montreront la voie." },
                { icon: FileCheck, title: "Apprenez et obtenez votre certification", desc: "Une certification reconnue partout." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-[#a855f7] rounded-full flex items-center justify-center text-white shrink-0 shadow-lg">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg leading-tight">{item.title}</h4>
                    <p className="text-gray-500 text-sm mt-1 font-serif italic">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
     
     

      {/* Footer Purple */}
      <section className="bg-[#a855f7] py-20">
        <div className="px-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
                name: "Développement Web",
                desc: "Apprenez HTML, CSS et JavaScript pour créer des sites web modernes.",
                hours: "20h",
                price: "Gratuit"
              },
              {
                img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
                name: "Data Science",
                desc: "Maîtrisez Python, Pandas et l'analyse de données.",
                hours: "30h",
                price: "50€"
              },
              {
                img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
                name: "UX/UI Design",
                desc: "Concevez des interfaces utilisateur intuitives et attrayantes.",
                hours: "25h",
                price: "40€"
              }
            ].map((course, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[30px] shadow-xl transition-transform hover:-translate-y-2">
                <img src={course.img} alt={course.name} className="w-full h-48 object-cover rounded-[20px] mb-4" />
                <h4 className="text-xl font-bold text-gray-800 mb-2">{course.name}</h4>
                <p className="text-gray-600 text-sm mb-3">{course.desc}</p>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-gray-500">{course.hours}</span>
                  <span className="font-semibold text-[#a855f7]">{course.price}</span>
                </div>
                <button className="w-full bg-[#a855f7] text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition cursor-pointer">
                  Découvrir le programme
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
<section className="bg-[#ffffff] py-20">
  <div className="px-6 md:px-16">
    <div className="grid md:grid-cols-2 gap-16 items-center">
      <div>
        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-6">Nos Professeurs Experts</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          Nos professeurs sont des experts reconnus dans leur domaine, sélectionnés pour leur expérience et leur passion pour l'enseignement.
        </p>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Prérequis pour enseigner :</h3>
        <div className="space-y-4">
          {[
            { icon: GraduationCap, text: "Diplôme universitaire dans le domaine concerné" },
            { icon: Users, text: "Au moins 3 ans d'expérience professionnelle" },
            { icon: Award, text: "Certification pédagogique ou expérience d'enseignement" },
            { icon: CheckCircle, text: "Engagement envers la qualité et l'innovation" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#a855f7] rounded-full flex items-center justify-center text-white shrink-0">
                <item.icon size={20} />
              </div>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-600 mt-6">
          Cette rigueur nous permet d'offrir des formations de qualité supérieure, adaptées aux besoins du marché.
        </p>
      </div>
      <div>
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600"
          alt="Professeurs"
          className="w-full h-96 object-cover rounded-[30px] shadow-lg"
        />
      </div>
    </div>
  </div>
</section>

    <section className="bg-[#a855f7]  py-20">
      <div className="px-6 md:px-16">
        <h2 className="text-3xl font-serif font-bold text-center text-white mb-12">Ils nous ont fait confiance</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote: "Grâce à GOLEARN, j'ai pu acquérir de nouvelles compétences en développement web qui m'ont permis de décrocher un emploi incroyable.",
              name: "Marie Dupont",
              role: "Développeuse Front-End",
              img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
            },
            {
              quote: "Les cours sont de qualité exceptionnelle et les professeurs sont très compétents. Une expérience d'apprentissage unique.",
              name: "Jean Martin",
              role: "Data Scientist",
              img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
            },
            {
              quote: "GOLEARN m'a aidé à me reconvertir professionnellement. Les formations sont pratiques et directement applicables.",
              name: "Sophie Leroy",
              role: "UX Designer",
              img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
            }
          ].map((testimonial, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[20px] shadow-lg text-center">
              <img src={testimonial.img} alt={testimonial.name} className="w-16 h-16 rounded-full mx-auto mb-4 object-cover" />
              <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
              <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

      <section className="bg-white py-20">
        <div className="px-6 md:px-16 text-center">
          <h2 className="text-4xl font-serif font-bold text-fuchsia-500 mb-6">Démarrez maintenant</h2>
          <p className="text-black text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'apprenants et commencez votre voyage vers de nouvelles compétences. Inscrivez-vous dès aujourd'hui !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-[#a855f7] text-white rounded-full font-bold hover:bg-[#a855f7] transition cursor-pointer">
              S'inscrire gratuitement
            </button>
            <button 
              onClick={() => navigate('/formations')}
              className="px-8 py-3 bg-transparent border-2 border-white text-[#a855f7] rounded-full font-bold hover:bg-[#a855f7] hover:text-white transition cursor-pointer"
            >
              Découvrir les formations
            </button>
          </div>
        </div>
      </section>
     
      <footer className="bg-gray-900 text-white py-16">
        <div className="px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-black tracking-tight text-white mb-4">GOLEARN</div>
              <p className="text-gray-400 mb-4">Développez vos compétences dans un nouveau et unique chemin !</p>
              <div className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-white text-xl transition-colors">
                    <FontAwesomeIcon icon={faFacebook} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white text-xl transition-colors">
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white text-xl transition-colors">
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white text-xl transition-colors">
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Formations</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Développement Web</a></li>
                <li><a href="#" className="hover:text-white">Data Science</a></li>
                <li><a href="#" className="hover:text-white">UX/UI Design</a></li>
                <li><a href="#" className="hover:text-white">Toutes les formations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">À propos</a></li>
                <li><a href="#" className="hover:text-white">Carrières</a></li>
                <li><a href="#" className="hover:text-white">Partenaires</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Communauté</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2026 GOLEARN. Tous droits réservés. Design by Jameeh</p>
            <div className="flex flex-wrap justify-center gap-6 mt-4">
              <a href="#" className="hover:text-white">Politique de confidentialité</a>
              <a href="#" className="hover:text-white">Conditions d'utilisation</a>
              <a href="#" className="hover:text-white">Mentions légales</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
