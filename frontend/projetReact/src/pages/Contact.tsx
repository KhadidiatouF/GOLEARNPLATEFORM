import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Headphones, Video } from 'lucide-react';
import Header from '../components/Header';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation d'envoi
    console.log('Formulaire soumis:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="w-screen bg-white font-sans text-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden mt-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="/contact.jpg" 
            className="w-full h-full object-cover object-center"
            alt="Contactez-nous"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="relative z-10 w-full px-6 md:px-[10%] text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-[1.1]">
              Contactez-Nous
            </h1>
            <p className="text-gray-100 mb-10 text-lg font-light leading-relaxed">
              Nous sommes là pour vous aider. N'hésitez pas à nous contacter pour toute question.
            </p>
          </div>
        </div>
      </section>

      {/* Section Coordonnées */}
      <section className="px-4 md:px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 md:mb-12">Nos Coordonnées</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: MapPin, 
                title: "Adresse", 
                desc: "Rue de la Formation, Dakar, Sénégal",
                detail: "Immeuble LearnHub, 2ème étage"
              },
              { 
                icon: Mail, 
                title: "Email", 
                desc: "contact@golearn.com",
                detail: "support@golearn.com"
              },
              { 
                icon: Phone, 
                title: "Téléphone", 
                desc: "+221 77 123 45 67",
                detail: "Lun-Ven: 8h-18h"
              },
              { 
                icon: Clock, 
                title: "Horaire", 
                desc: "Lundi - Vendredi",
                detail: "8h00 - 18h00"
              }
            ].map((info, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-[20px] text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-[#a855f7] rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <info.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{info.title}</h3>
                <p className="text-gray-600 text-sm mb-1">{info.desc}</p>
                <p className="text-gray-500 text-xs">{info.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Formulaire de Contact */}
      <section className="px-4 md:px-6 py-16 md:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 md:mb-12">Envoyez-nous un Message</h2>
          
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-[20px] p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Send size={24} />
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Message Envoyé !</h3>
              <p className="text-green-600">Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[20px] shadow-lg">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom Complet</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a855f7] focus:border-transparent outline-none transition"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a855f7] focus:border-transparent outline-none transition"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a855f7] focus:border-transparent outline-none transition"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="information">Demande d'information</option>
                  <option value="formation">Question sur une formation</option>
                  <option value="technique">Problème technique</option>
                  <option value="partenariat">Proposition de partenariat</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a855f7] focus:border-transparent outline-none transition resize-none"
                  placeholder="Décrivez votre demande..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#a855f7] text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Envoyer le Message
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Section Options de Support */}
      <section className="px-4 md:px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 md:mb-12">Autres Façons de Nous Contacter</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: MessageSquare, 
                title: "Chat en Direct", 
                desc: "Discutez avec notre équipe en temps réel",
                button: "Démarrer une Conversation",
                color: "bg-blue-500"
              },
              { 
                icon: Headphones, 
                title: "Support Téléphonique", 
                desc: "Appelez-nous pour une assistance immédiate",
                button: "Appeler Maintenant",
                color: "bg-green-500"
              },
              { 
                icon: Video, 
                title: "Visioconférence", 
                desc: "Planifiez un appel vidéo avec un conseiller",
                button: "Planifier un RDV",
                color: "bg-purple-500"
              }
            ].map((option, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-[20px] text-center hover:shadow-lg transition-shadow">
                <div className={`w-14 h-14 ${option.color} rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                  <option.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{option.desc}</p>
                <button className="px-6 py-2 bg-[#a855f7] text-white rounded-full text-sm font-medium hover:bg-purple-700 transition cursor-pointer">
                  {option.button}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section FAQ Rapide */}
      <section className="px-4 md:px-6 py-16 md:py-20 bg-[#a855f7]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-6">Questions Fréquentes</h2>
          <p className="text-white/80 mb-8">
            Vous avez une question ? Consultez notre FAQ pour trouver des réponses rapides.
          </p>
          <button className="px-8 py-3 bg-white text-[#a855f7] rounded-full font-bold hover:bg-gray-100 transition cursor-pointer">
            Consulter la FAQ
          </button>
        </div>
      </section>

      {/* Section Réseaux Sociaux */}
      <section className="px-4 md:px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 md:mb-12">Suivez-Nous</h2>
          
          <div className="flex justify-center gap-6">
            {[
              { name: "Facebook", color: "bg-blue-600" },
              { name: "Twitter", color: "bg-sky-500" },
              { name: "LinkedIn", color: "bg-blue-700" },
              { name: "Instagram", color: "bg-pink-600" },
              { name: "YouTube", color: "bg-red-600" }
            ].map((social, idx) => (
              <button key={idx} className={`${social.color} w-14 h-14 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform`}>
                <span className="text-xl font-bold">{social.name[0]}</span>
              </button>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-6">
            Rejoignez notre communauté sur les réseaux sociaux pour rester informé des dernières nouvelles et formations.
          </p>
        </div>
      </section>

      {/* Section Carte et Localisation */}
      <section className="px-4 md:px-6 py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 md:mb-12">Notre Localisation</h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-white p-6 rounded-[20px] shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Direction GOLEARN</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-[#a855f7] mt-1" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">Siège Social</p>
                    <p className="text-gray-600 text-sm">Rue de la Formation, Dakar, Sénégal</p>
                    <p className="text-gray-600 text-sm">Immeuble LearnHub, 2ème étage</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="text-[#a855f7] mt-1" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <p className="text-gray-600 text-sm">contact@golearn.com</p>
                    <p className="text-gray-600 text-sm">support@golearn.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="text-[#a855f7] mt-1" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">Téléphone</p>
                    <p className="text-gray-600 text-sm">+221 77 123 45 67</p>
                    <p className="text-gray-600 text-sm">+221 33 123 45 67</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 rounded-[20px] h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="text-[#a855f7] mx-auto mb-2" />
                <p className="text-gray-600">Carte interactive</p>
                <p className="text-gray-500 text-sm">(Dakar, Sénégal)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Horaires Détallés */}
      <section className="px-4 md:px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 md:mb-12">Nos Horaires</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-[20px]">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock size={20} className="text-[#a855f7]" />
                Accueil et Administration
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex justify-between"><span>Lundi - Vendredi</span><span className="font-medium">8h00 - 18h00</span></li>
                <li className="flex justify-between"><span>Samedi</span><span className="font-medium">9h00 - 14h00</span></li>
                <li className="flex justify-between"><span>Dimanche</span><span className="font-medium">Fermé</span></li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-[20px]">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Headphones size={20} className="text-[#a855f7]" />
                Support Client
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex justify-between"><span>Lundi - Vendredi</span><span className="font-medium">8h00 - 20h00</span></li>
                <li className="flex justify-between"><span>Samedi - Dimanche</span><span className="font-medium">10h00 - 18h00</span></li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-[20px]">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Video size={20} className="text-[#a855f7]" />
                Visio et Réunions
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex justify-between"><span>Lundi - Samedi</span><span className="font-medium">9h00 - 17h00</span></li>
                <li className="flex justify-between"><span>Dimanche</span><span className="font-medium">Sur rendez-vous</span></li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-[20px]">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MessageSquare size={20} className="text-[#a855f7]" />
                Chat en Direct
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex justify-between"><span>Lundi - Dimanche</span><span className="font-medium">8h00 - 22h00</span></li>
              </ul>
            </div>
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

export default Contact;