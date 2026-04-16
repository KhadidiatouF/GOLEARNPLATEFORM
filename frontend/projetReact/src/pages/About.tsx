import React from 'react';
import { Users, Award, CheckCircle, BookOpen, Clock, Target, Globe } from 'lucide-react';
import Header from '../components/Header';

const About: React.FC = () => {
  return (
    <div className="w-screen bg-white font-sans text-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[75vh] flex items-center overflow-hidden mt-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="/apropo.jpg" 
            className="w-full h-full object-cover object-center"
            alt="À propos de nous"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="relative z-10 w-full px-6 md:px-[10%] text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-[1.1]">
              À propos de GOLEARN
            </h1>
            <p className="text-gray-100 mb-10 text-lg font-light leading-relaxed">
              Nous croyons que l'éducation est la clé pour libérer votre potentiel. Découvrez notre mission et nos valeurs.
            </p>
          </div>
        </div>
      </section>

      {/* Section Notre Mission */}
      <section className="px-4 md:px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 md:mb-12">Notre Mission</h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600" 
                alt="Mission" 
                className="rounded-[30px] shadow-lg w-full h-80 object-cover"
              />
            </div>
            <div className="space-y-6">
              <p className="text-gray-600 text-lg leading-relaxed">
                GOLEARN est une plateforme d'apprentissage en ligne innovante, dédiée à fournir une éducation de qualité accessible à tous. Notre mission est de démocratiser l'accès au savoir et de permettre à chaque apprenant de développer les compétences nécessaires pour réussir dans le monde numérique d'aujourd'hui.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Nous nous engageons à offrir des formations pratiques, certifiantes et adaptées aux besoins du marché du travail. Chaque cours est conçu par des experts reconnus dans leur domaine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Nos Valeurs */}
      <section className="px-4 md:px-6 py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 md:mb-12">Nos Valeurs</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: "Excellence", desc: "Des contenus de qualité supérieure" },
              { icon: Clock, title: "Flexibilité", desc: "Apprenez à votre rythme" },
              { icon: Users, title: "Communauté", desc: "Un soutien constant" },
              { icon: Award, title: "Innovation", desc: "Des méthodes pédagogiques modernes" }
            ].map((value, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[20px] shadow-lg text-center hover:-translate-y-2 transition-transform">
                <div className="w-16 h-16 bg-[#a855f7] rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <value.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Notre Équipe */}
      <section className="px-4 md:px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 md:mb-12">Notre Équipe</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: "https://images.unsplash.com/photo-1560250097-0b93528c311e?w=400",
                name: "Mamadou Diallo",
                role: "Directeur Général",
                desc: "Expert en éducation numérique avec 15 ans d'expérience"
              },
              {
                img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400",
                name: "Fatou Sall",
                role: "Directrice Pédagogique",
                desc: "Docteure en sciences de l'éducation"
              },
              {
                img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
                name: "Ousmane Mbaye",
                role: "Responsable Technique",
                desc: "Ingénieur logiciel passionné par l'e-learning"
              }
            ].map((member, idx) => (
              <div key={idx} className="bg-white rounded-[20px] shadow-lg overflow-hidden">
                <img src={member.img} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-[#a855f7] font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="px-4 md:px-6 py-16 md:py-20 bg-[#a855f7]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { number: "5000+", label: "Apprenants" },
              { number: "50+", label: "Formations" },
              { number: "30+", label: "Professeurs Experts" },
              { number: "95%", label: "Taux de Satisfaction" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/10 p-6 rounded-[20px]">
                <h3 className="text-4xl font-bold text-white mb-2">{stat.number}</h3>
                <p className="text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Pourquoi Nous Choisir */}
      <section className="px-4 md:px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 md:mb-12">Pourquoi Nous Choisir</h2>
          
          <div className="space-y-6">
            {[
              {
                icon: Target,
                title: "Approche Pratique",
                desc: "Nos formations sont conçues pour être directement applicables dans votre vie professionnelle. Chaque cours inclut des projets concrets."
              },
              {
                icon: Globe,
                title: "Accessibilité",
                desc: "Apprenez de n'importe où, à tout moment. Nos contenus sont accessibles sur tous vos appareils."
              },
              {
                icon: CheckCircle,
                title: "Certification Reconnue",
                desc: "Obtenez des certificats validés par des institutions reconnues, valorisables sur votre CV."
              }
            ].map((reason, idx) => (
              <div key={idx} className="flex items-start gap-6 p-6 bg-gray-50 rounded-[20px]">
                <div className="w-14 h-14 bg-[#a855f7] rounded-full flex items-center justify-center text-white shrink-0">
                  <reason.icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{reason.title}</h3>
                  <p className="text-gray-600">{reason.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Notre Histoire */}
      <section className="px-4 md:px-6 py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 md:mb-12">Notre Histoire</h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <p className="text-gray-600 text-lg leading-relaxed">
                Fondée en 2023 à Dakar, GOLEARN est née d'une vision simple : rendre l'éducation de qualité accessible à tous, partout en Afrique et dans le monde. Notre fondateur, Mamadou Diallo, a identifié un besoin crucial de formations pratiques qui répondent aux réalités du marché du travail africain.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                En seulement deux ans, nous avons accompagné plus de 5000 apprenants dans leur parcours de formation, avec un taux de satisfaction de 95%. Notre plateforme propose aujourd'hui plus de 50 formations dans des domaines variés tels que la programmation, le marketing digital, la gestion de projets et bien d'autres.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Nous collaborons avec des universités et des entreprises partenaires pour offrir des formations reconnues et des opportunités d'emploi à nos apprenants. Notre engagement envers l'excellence nous pousse à constantly améliorer nos contenus et nos méthodes pédagogiques.
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600" 
                alt="Notre histoire" 
                className="rounded-[30px] shadow-lg w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section Nos Partenaires */}
      <section className="px-4 md:px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 md:mb-12">Nos Partenaires</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Université Cheikh Anta Diop", logo: "UCAD" },
              { name: "Institut Supérieur de Technologie", logo: "IST" },
              { name: "Ecole Supérieure Polytechnique", logo: "ESP" },
              { name: "Microsoft", logo: "MSFT" }
            ].map((partner, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[20px] shadow-lg text-center hover:-translate-y-2 transition-transform border border-gray-100">
                <div className="h-16 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-gray-300">{partner.logo}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-700">{partner.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="px-4 md:px-6 py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 md:mb-12">Témoignages de nos Apprenants</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
                name: "Amadou Sow",
                role: "Développeur Web",
                desc: "GOLEARN a changé ma vie. En 6 mois, j'ai appris à coder et j'ai trouvé un emploi dans une entreprise de tech à Dakar. Les formateurs sont excellents et le soutien est incroyable."
              },
              {
                img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
                name: "Mariama Diallo",
                role: "Chef de Projet",
                desc: "La formation en gestion de projet m'a donné les compétences nécessaires pour gérer des équipes de 10 personnes. Je recommande GOLEARN à tous ceux qui veulent évoluer professionnellement."
              },
              {
                img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
                name: "Ibrahima Fall",
                role: "Expert Marketing Digital",
                desc: "Gracias a GOLEARN, he podido crear mi propia agencia de marketing. Los cursos son prácticos y el certificado me ha ayudado a ganar confianza con mis clientes."
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[20px] shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <img src={testimonial.img} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{testimonial.name}</h3>
                    <p className="text-[#a855f7] text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm italic">"{testimonial.desc}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Nos Objectifs */}
      <section className="px-4 md:px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 md:mb-12">Nos Objectifs pour 2026</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { number: "10 000", label: "Apprenants formés d'ici fin 2026", icon: Users },
              { number: "100", label: "Nouvelles formations certifiantes", icon: BookOpen },
              { number: "50", label: "Partenaires stratégiques en Afrique", icon: Globe }
            ].map((goal, idx) => (
              <div key={idx} className="bg-[#a855f7] p-8 rounded-[20px] text-center text-white">
                <goal.icon size={40} className="mx-auto mb-4 opacity-80" />
                <h3 className="text-4xl font-bold mb-2">{goal.number}</h3>
                <p className="text-white/80">{goal.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="px-6 md:px-16 text-center">
          <div className="text-2xl font-black tracking-tight text-white mb-4">GOLEARN</div>
          <p className="text-gray-400 mb-4">Développez vos compétences dans un nouveau et unique chemin !</p>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 GOLEARN. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;