import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

async function main() {
  console.log("✅ Connexion réussie");

  console.log("🌱 Hachage des mots de passe...");
  
  // Hasher les mots de passe avec bcrypt
  const hashedPassword = await bcrypt.hash("123456", 10);

  console.log("🌱 Création des utilisateurs...");

  // ==================== ADMIN ====================
  const admin = await prisma.utilisateur.upsert({
    where: { login: "admin" },
    update: { mdp: hashedPassword },
    create: {
      nom: "Admin", prenom: "System", email: "admin@golearn.com",
      login: "admin", mdp: hashedPassword, role: "ADMIN", solde: 0,
    },
  });

  // Créer l'admin si pas encore créé
  const existingAdmin = await prisma.administrateur.findFirst({
    where: { utilisateurId: admin.id }
  });
  if (!existingAdmin) {
    await prisma.administrateur.create({
      data: { utilisateurId: admin.id }
    });
  }
  console.log("✅ Admin créé");

  // ==================== PROFESSEURS ====================
  // Professor 1
  const prof1 = await prisma.utilisateur.upsert({
    where: { login: "prof_khadidiatou" },
    update: { mdp: hashedPassword },
    create: {
      nom: "Fall", prenom: "Khadidiatou", email: "khadidiatou@golearn.com",
      login: "prof_khadidiatou", mdp: hashedPassword, role: "PROF", solde: 50000,
    },
  });
  const existingProf1 = await prisma.professeur.findFirst({ where: { utilisateurId: prof1.id } });
  if (!existingProf1) {
    await prisma.professeur.create({
      data: {
        utilisateurId: prof1.id,
        specialite: "Développement Web Full Stack",
        bio: "Experte en React, Node.js et TypeScript avec 8 ans d'expérience",
      },
    });
  }
  console.log("✅Professeur 1 créé");

  // Professor 2
  const prof2 = await prisma.utilisateur.upsert({
    where: { login: "prof_mamadou" },
    update: { mdp: hashedPassword },
    create: {
      nom: "Sy", prenom: "Mamadou", email: "mamadou@golearn.com",
      login: "prof_mamadou", mdp: hashedPassword, role: "PROF", solde: 45000,
    },
  });
  const existingProf2 = await prisma.professeur.findFirst({ where: { utilisateurId: prof2.id } });
  if (!existingProf2) {
    await prisma.professeur.create({
      data: {
        utilisateurId: prof2.id,
        specialite: "Data Science & Intelligence Artificielle",
        bio: "Spécialiste en Python, Machine Learning et Deep Learning",
      },
    });
  }
  console.log("✅Professeur 2 créé");

  // Professor 3
  const prof3 = await prisma.utilisateur.upsert({
    where: { login: "prof_omar" },
    update: { mdp: hashedPassword },
    create: {
      nom: "Diallo", prenom: "Omar", email: "omar@golearn.com",
      login: "prof_omar", mdp: hashedPassword, role: "PROF",solde: 40000,
    },
  });
  const existingProf3 = await prisma.professeur.findFirst({ where: { utilisateurId: prof3.id } });
  if (!existingProf3) {
    await prisma.professeur.create({
      data: {
        utilisateurId: prof3.id,
        specialite: "Design UI/UX",
        bio: "Designer professionnel spécialisé en Figma et Adobe XD",
      },
    });
  }
  console.log("✅Professeur 3 créé");

  // ==================== APPRENANTS ====================
  // Apprenant 1
  const apprenant1 = await prisma.utilisateur.upsert({
    where: { login: "apprenant_aminata" },
    update: { mdp: hashedPassword },
    create: {
      nom: "Diallo", prenom: "Aminata", email: "aminata@golearn.com",
      login: "apprenant_aminata", mdp: hashedPassword, role: "APPRENANT", solde: 10000,
    },
  });
  const existingApprenant1 = await prisma.apprenant.findFirst({ where: { utilisateurId: apprenant1.id } });
  if (!existingApprenant1) {
    await prisma.apprenant.create({
      data: { utilisateurId: apprenant1.id, niveau: "Débutant" },
    });
  }
  console.log("✅Apprenant 1 créé");

  // Apprenant 2
  const apprenant2 = await prisma.utilisateur.upsert({
    where: { login: "apprenant_malick" },
    update: { mdp: hashedPassword },
    create: {
      nom: "Ndiaye", prenom: "Malick", email: "malick@golearn.com",
      login: "apprenant_malick", mdp: hashedPassword, role: "APPRENANT",solde: 5000,
    },
  });
  const existingApprenant2 = await prisma.apprenant.findFirst({ where: { utilisateurId: apprenant2.id } });
  if (!existingApprenant2) {
    await prisma.apprenant.create({
      data: { utilisateurId: apprenant2.id, niveau: "Intermédiaire" },
    });
  }
  console.log("✅Apprenant 2 créé");

  // Apprenant 3
  const apprenant3 = await prisma.utilisateur.upsert({
    where: { login: "apprenant_fatou" },
    update: { mdp: hashedPassword },
    create: {
      nom: "Sarr", prenom: "Fatou", email: "fatou@golearn.com",
      login: "apprenant_fatou", mdp: hashedPassword, role: "APPRENANT",solde: 0,
    },
  });
  const existingApprenant3 = await prisma.apprenant.findFirst({ where: { utilisateurId: apprenant3.id } });
  if (!existingApprenant3) {
    await prisma.apprenant.create({
      data: { utilisateurId: apprenant3.id, niveau: "Avancé" },
    });
  }
  console.log("✅Apprenant 3 créé");

  // ==================== FORMATIONS ====================
  console.log("📚 Création des formations...");

  const professor1 = await prisma.professeur.findFirst({ where: { utilisateurId: prof1.id } });
  const professor2 = await prisma.professeur.findFirst({ where: { utilisateurId: prof2.id } });
  const professor3 = await prisma.professeur.findFirst({ where: { utilisateurId: prof3.id } });

  // Formation 1 - React
  const formation1 = await prisma.formation.upsert({
    where: { id: 1 },
    update: {},
    create: {
      titre: "React de A a Z",
      description: "Maitrisez React de A a Z avec ce cours complet. Apprenez les bases, les hooks, Redux et Next.js.",
      prix: 0, categorie: "Developpement Web", niveau: "Debutant",
      typeCours: "GRATUIT", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600",
      professeurId: professor1?.id || 1,
      statut: "VALIDEE",
    },
  });
  console.log("✅Formation 1 créée");

  // Formation 2 - Node.js
  const formation2 = await prisma.formation.upsert({
    where: { id: 2 },
    update: {},
    create: {
      titre: "Node.js Backend Masterclass",
      description: "Construisez des APIs robustes avec Node.js, Express et MongoDB.",
      prix: 0, categorie: "Développement Web", niveau: "Intermédiaire",
      typeCours: "GRATUIT", image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600",
      professeurId: professor1?.id || 1,
      statut: "VALIDEE",
    },
  });
  console.log("✅Formation 2 créée");

  // Formation 3 - Data Science
  const formation3 = await prisma.formation.upsert({
    where: { id: 3 },
    update: {},
    create: {
      titre: "Data Science avec Python",
      description: "Apprenez Python, Pandas, NumPy et Machine Learning pour analyser des données.",
      prix: 100, categorie: "Data Science", niveau: "Intermédiaire",
      typeCours: "PAYANT", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
      professeurId: professor2?.id || 2,
      statut: "VALIDEE",
    },
  });
  console.log("✅Formation 3 créée");

  // Formation 4 - Intelligence Artificielle
  const formation4 = await prisma.formation.upsert({
    where: { id: 4 },
    update: {},
    create: {
      titre: "Intelligence Artificielle",
      description: "Explorez les concepts avancés de l'IA et du Deep Learning avec TensorFlow.",
      prix: 85000, categorie: "IA", niveau: "Avancé",
      typeCours: "PAYANT", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600",
      professeurId: professor2?.id || 2,
      statut: "VALIDEE",
    },
  });
  console.log("✅Formation 4 créée");

  // Formation 5 - UI/UX Design
  const formation5 = await prisma.formation.upsert({
    where: { id: 5 },
    update: {},
    create: {
      titre: "UI/UX Design Professionnel",
      description: "Apprenez à concevoir des interfaces utilisateur modernes avec Figma.",
      prix: 45000, categorie: "Design", niveau: "Débutant",
      typeCours: "PAYANT", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600",
      professeurId: professor3?.id || 3,
      statut: "VALIDEE",
    },
  });
  console.log("✅Formation 5 créée");

  // Formation 6 - JavaScript Gratuit
  const formation6 = await prisma.formation.upsert({
    where: { id: 6 },
    update: {},
    create: {
      titre: "JavaScript Gratuit",
      description: "Apprenez les bases du JavaScript gratuitement.",
      prix: 0, categorie: "Développement Web", niveau: "Débutant",
      typeCours: "GRATUIT", image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600",
      professeurId: professor1?.id || 1,
      statut: "VALIDEE",
    },
  });
  console.log("✅Formation 6 créée");

  // ==================== SESSIONS ====================
  console.log("🎬 Création des sessions...");

  // Sessions pour Formation 1 (React)
  const session1 = await prisma.session.upsert({
    where: { id: 1 },
    update: {},
    create: {
      titre: "Introduction à React",
      contenu: "Bienvenue dans ce cours React ! Dans cette session, nous verrons les bases.",
      duree: "1h30", formationId: formation1.id,
    },
  });

  const session2 = await prisma.session.upsert({
    where: { id: 2 },
    update: {},
    create: {
      titre: "Les Composants React",
      contenu: "Apprenez à créer des composants réutilisables.",
      duree: "2h", formationId: formation1.id,
    },
  });

  const session3 = await prisma.session.upsert({
    where: { id: 3 },
    update: {},
    create: {
      titre: "Les Hooks React",
      contenu: "Maîtrisez useState, useEffect et les autres hooks.",
      duree: "2h30", formationId: formation1.id,
    },
  });
  console.log("✅ Sessions créées");

  // Sessions pour Formation 2 (Node.js)
  const sessionNode1 = await prisma.session.upsert({
    where: { id: 12 },
    update: {},
    create: {
      titre: "Introduction à Node.js",
      contenu: "Découvrez Node.js et son environnement d'exécution JavaScript côté serveur.",
      duree: "1h30", formationId: formation2.id,
    },
  });

  const sessionNode2 = await prisma.session.upsert({
    where: { id: 13 },
    update: {},
    create: {
      titre: "Express.js - Créer un serveur web",
      contenu: "Apprenez à créer des API REST avec Express.js.",
      duree: "2h", formationId: formation2.id,
    },
  });

  const sessionNode3 = await prisma.session.upsert({
    where: { id: 14 },
    update: {},
    create: {
      titre: "Base de données avec MongoDB",
      contenu: "Connectez votre application à MongoDB avec Mongoose.",
      duree: "2h30", formationId: formation2.id,
    },
  });
  console.log("✅ Sessions Node.js créées");

  // Sessions pour Formation 3 (Data Science)
  const session4 = await prisma.session.upsert({
    where: { id: 4 },
    update: {},
    create: {
      titre: "Introduction à Python pour Data Science",
      contenu: "Les bases de Python pour l'analyse de données.",
      duree: "2h", formationId: formation3.id,
    },
  });

  const session5 = await prisma.session.upsert({
    where: { id: 5 },
    update: {},
    create: {
      titre: "Pandas et NumPy",
      contenu: "Manipulez vos données efficacement.",
      duree: "3h", formationId: formation3.id,
    },
  });

  // Sessions pour Formation 4 (Intelligence Artificielle)
  const sessionIA1 = await prisma.session.upsert({
    where: { id: 15 },
    update: {},
    create: {
      titre: "Introduction à l'IA",
      contenu: "Découvrez les fondamentaux de l'intelligence artificielle.",
      duree: "1h30", formationId: formation4.id,
    },
  });

  const sessionIA2 = await prisma.session.upsert({
    where: { id: 16 },
    update: {},
    create: {
      titre: "Machine Learning",
      contenu: "Apprenez les bases du machine learning.",
      duree: "2h30", formationId: formation4.id,
    },
    
  });

  // Sessions pour Formation 5 (UI/UX Design)
  const sessionUX1 = await prisma.session.upsert({
    where: { id: 17 },
    update: {},
    create: {
      titre: "Principes du Design",
      contenu: "Les bases du design d'interface utilisateur.",
      duree: "1h30", formationId: formation5.id,
    },
  });

  const sessionUX2 = await prisma.session.upsert({
    where: { id: 18 },
    update: {},
    create: {
      titre: "Wireframing et Prototypage",
      contenu: "Créez des maquettes fonctionnelles.",
      duree: "2h", formationId: formation5.id,
    },
  });

  // Sessions pour Formation 6 (JavaScript Gratuit)
  const sessionJS1 = await prisma.session.upsert({
    where: { id: 10 },
    update: {},
    create: {
      titre: "Bases de JavaScript",
      contenu: "Apprenez les fondamentaux du langage.",
      duree: "2h", formationId: formation6.id,
    },
  });

  const sessionJS2 = await prisma.session.upsert({
    where: { id: 11 },
    update: {},
    create: {
      titre: "DOM et Events",
      contenu: "Manipulez le DOM et gérez les événements.",
      duree: "2h30", formationId: formation6.id,
    },
  });

  console.log("✅ Plus de sessions créées");

  // ==================== CHAPITRES ====================
  console.log("📖 Création des chapitres...");

  // Formation 1 - React - Session 1
  await prisma.chapitre.upsert({
    where: { id: 1 },
    update: {},
    create: {
      titre: "Installation de React",
      contenu: "## Installation de React\n\nDans ce chapitre, nous allons installer React et creer notre premier projet.\n\n### Prerequisites\n\n- Node.js (version 18 ou superieure)\n- npm ou yarn\n\n### Creation du projet\n\nUtilisez la commande suivante pour creer un nouveau projet React:\n\n```bash\nnpx create-react-app mon-projet\ncd mon-projet\nnpm start\n```\n\n### Structure du projet\n\nApres l'installation, votre projet aura la structure suivante:\n\n- `src/` - Contient le code source\n- `public/` - Contient les fichiers publics\n- `node_modules/` - Les dependances\n\n### Resume\n\nVous avez maintenant un projet React fonctionnel qui s'execute sur `http://localhost:3000`.",
      videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
      duree: "30min", typeContenu: "VIDEO", ordre: 1,
      sessionId: session1.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 2 },
    update: {},
    create: {
      titre: "Votre premier composant",
      contenu: "## Votre premier composant React\n\nDans ce chapitre, nous allons creer notre premier composant React.\n\n### Qu'est-ce qu'un composant ?\n\nUn composant est une piece reutilisable de l'interface utilisateur.\n\n### Creer un composant\n\n```jsx\nfunction Bonjour() {\n  return <h1>Bonjour, React !</h1>;\n}\n```\n\n### Props\n\nLes props permettent de passer des donnees aux composants:\n\n```jsx\nfunction Bonjour(props) {\n  return <h1>Bonjour, {props.nom} !</h1>;\n}\n\n// Utilisation\n<Bonjour nom=\"Alice\" />\n```\n\n### Resume\n\n- Les composants sont des fonctions JavaScript\n- Ils retournent du JSX\n- Les props permettent la personnalite",
      videoUrl: "https://www.youtube.com/embed/Ke90Tje7VS0",
      duree: "45min", typeContenu: "VIDEO", ordre: 2,
      sessionId: session1.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 3 },
    update: {},
    create: {
      titre: "TP: Créer un compteur",
      contenu: "## TP: Créer un compteur\n\nC'est l'heure de pratiquer ! Nous allons créer un compteur interactif.\n\n### Objectif\n\nCréer un composant qui:\n\n- Affiche un nombre\n- Possède un bouton pour incrementer\n- Possède un bouton pour décrémenter\n\n### Solution\n\n\`\`\`jsx\nimport { useState } from 'react';\n\nfunction Compteur() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Compteur: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+</button>\n      <button onClick={() => setCount(count - 1)}>-</button>\n    </div>\n  );\n}\n\`\`\`\n\n### Explications\n\n- \`useState\` est un hook qui permet de gérer l'état\n- \`count\` est la valeur actuelle\n- \`setCount\` permet de modifier la valeur\n\n### Défi bonus\n\nAjoutez un bouton pour réinitialiser le compteur à 0 !",
      pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/css/C12",
      duree: "1h", typeContenu: "TEXTE", ordre: 3,
      sessionId: session1.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 4 },
    update: {},
    create: {
      titre: "Props et State",
      contenu: "## Props et State\n\nComprendre la différence entre les props et le state est essentiel en React.\n\n### Les Props\n\nLes props (propriétés) sont des données passées d'un composant parent à un composant enfant.\n\n**Características:**\n\n- **Immuables**: Ne peuvent pas être modifiées par le composant enfant\n- **Passées en lecture seule**\n- **Du parent vers l'enfant**\n\n### Le State\n\nLe state est des données gérées localement par un composant.\n\n**Características:**\n\n- **Mutables**: Peut être modifié avec setState\n- **Privés au composant**\n- **Gère les interactions utilisateur**\n\n### Exemple\n\n\`\`\`jsx\n// Props - données reçues\nfunction Enfant({ donnee }) {\n  return <p>{donnee}</p>;\n}\n\n// State - données locales\nfunction Parent() {\n  const [compteur, setCompteur] = useState(0);\n  return <Enfant donnee={compteur} />;\n}\n\`\`\`\n\n### Résumé\n\n| Props | State |\n|-------|-------|\n| Externes | Internes |\n| Immuables | Mutables |\n| Du parent | Du composant |",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duree: "1h", typeContenu: "VIDEO", ordre: 1,
      sessionId: session2.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 5 },
    update: {},
    create: {
      titre: "Composants fonctionnels",
      contenu: "## Composants fonctionnels\n\nLes composants fonctionnels sont la norme moderne en React.\n\n### Qu'est-ce qu'un composant fonctionnel ?\n\nUn composant fonctionnel est simplement une fonction JavaScript qui retourne du JSX.\n\n### Exemple\n\n\`\`\`jsx\nfunction Bienvenue(props) {\n  return <h1>Bienvenue, {props.nom}!</h1>;\n}\n\`\`\`\n\n### Avec les Hooks\n\nLes hooks permettent d'ajouter du state aux composants fonctionnels:\n\n\`\`\`jsx\nimport { useState } from 'react';\n\nfunction Compteur() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>Compteur: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Incrémenter\n      </button>\n    </div>\n  );\n}\n\`\`\`\n\n### Avantages\n\n- Plus simples à écrire et comprendre\n- Moins de code boilerplate\n- Meilleures performances\n-兼容 Hooks\n\n### Résumé\n\nLes composants fonctionnels avec Hooks sont la façon recommandée de créer des composants React modernes.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duree: "1h", typeContenu: "VIDEO", ordre: 2,
      sessionId: session2.id,
    },
  });
  console.log("✅ Chapitres créés");

  // Chapitres pour Formation Node.js (sessions 6, 7, 8)
  await prisma.chapitre.upsert({
    where: { id: 6 },
    update: {},
    create: {
      titre: "Installation de Node.js",
      contenu: "## Installation de Node.js\n\nDécouvrons comment installer Node.js sur votre machine.\n\n### Téléchargement\n\nRendez-vous sur le site officiel nodejs.org et téléchargez la version LTS.\n\n### Vérification\n\nAprès installation, vérifiez que tout fonctionne:\n\n\`\`\`bash\nnode --version\nnpm --version\n\`\`\`\n\n### NPM\n\nnpm (Node Package Manager) est livré avec Node.js et permet d'installer des packages.\n\n### Premier script\n\nCréez un fichier \`index.js\`:\n\n\`\`\`javascript\nconsole.log('Bonjour Node.js !');\n\`\`\`\n\nExécutez avec:\n\n\`\`\`bash\nnode index.js\n\`\`\`",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duree: "30min", typeContenu: "VIDEO", ordre: 1,
      sessionId: sessionNode1.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 7 },
    update: {},
    create: {
      titre: "Votre premier script Node.js",
      contenu: "## Votre premier script Node.js\n\nCréons et exécutons notre premier script JavaScript côté serveur.\n\n### Créer le fichier\n\nCréez un fichier nommé \`index.js\`:\n\n\`\`\`javascript\n// Un simple message\nconsole.log('Hello World!');\n\n// Variables\nconst nom = 'Alice';\nconsole.log('Bonjour, ' + nom);\n\n// Fonctions\nfunction saluer(prenom) {\n  return 'Bonjour, ' + prenom;\n}\nconsole.log(saluer('Bob'));\n\n// Tableaux\nconst fruits = ['pomme', 'banane', 'orange'];\nfruits.forEach(fruit => console.log(fruit));\n\n// Objets\nconst personne = {\n  nom: 'Dupont',\n  age: 30\n};\nconsole.log(personne.nom, 'a', personne.age, 'ans');\n\`\`\`\n\n### Exécuter\n\n\`\`\`bash\nnode index.js\n\`\`\`",
      pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/css/C12",
      duree: "45min", typeContenu: "TEXTE", ordre: 2,
      sessionId: sessionNode1.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 8 },
    update: {},
    create: {
      titre: "Introduction à Express",
      contenu: "## Introduction à Express\n\nExpress.js est le framework web le plus populaire pour Node.js.\n\n### Installation\n\n```bash\nnpm install express\n```\n\n### Créer un serveur\n\n```javascript\nconst express = require('express');\nconst app = express();\n\napp.get('/', (req, res) => {\n  res.send('Bonjour Express!');\n});\n\napp.listen(3000, () => {\n  console.log('Serveur démarré sur le port 3000');\n});\n```\n\n### Routes\n\n```javascript\n// GET\napp.get('/api/users', (req, res) => {\n  res.json(users);\n});\n\n// POST\napp.post('/api/users', (req, res) => {\n  const newUser = req.body;\n  users.push(newUser);\n  res.status(201).json(newUser);\n});\n```",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duree: "1h", typeContenu: "VIDEO", ordre: 1,
      sessionId: sessionNode2.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 9 },
    update: {},
    create: {
      titre: "Les routes et controleurs",
      contenu: "## Les routes et controleurs\n\nApprenons a organiser notre code avec les routes et controleurs Express.\n\n### Structure recommandee\n\n```javascript\nconst express = require('express');\nconst router = express.Router();\n\nrouter.get('/', (req, res) => {\n  res.json(users);\n});\n\nmodule.exports = router;\n```\n\n### Controleur\n\n```javascript\nconst getAllUsers = (req, res) => {\n  res.json(users);\n};\n\nmodule.exports = { getAllUsers };\n```",
      duree: "1h", typeContenu: "TEXTE", ordre: 2,
      sessionId: sessionNode2.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 10 },
    update: {},
    create: {
      titre: "Connexion a MongoDB",
      contenu: "## Connexion a MongoDB\n\nDecouvrons comment connecter notre application a MongoDB avec Mongoose.\n\n### Installation de Mongoose\n\n```bash\nnpm install mongoose\n```\n\n### Connexion a la base\n\n```javascript\nconst mongoose = require('mongoose');\n\nmongoose.connect('mongodb://localhost:27017/mabdd')\n  .then(() => console.log('Connecte a MongoDB'))\n  .catch(err => console.error('Erreur:', err));\n```\n\n### Definir un schema\n\n```javascript\nconst userSchema = new mongoose.Schema({\n  nom: String,\n  email: { type: String, unique: true },\n  age: Number\n});\n\nconst User = mongoose.model('User', userSchema);\n```\n\n### Operations CRUD\n\n```javascript\n// Creer\nconst user = new User({ nom: 'Alice', email: 'alice@test.com' });\nawait user.save();\n\n// Lire\nconst users = await User.find();\n\n// Mettre a jour\nawait User.updateOne({ _id: id }, { nom: 'Nouveau nom' });\n\n// Supprimer\nawait User.deleteOne({ _id: id });\n```",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duree: "45min", typeContenu: "VIDEO", ordre: 1,
      sessionId: sessionNode3.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 11 },
    update: {},
    create: {
      titre: "Creer un modele Mongoose",
      contenu: "Definissez des modeles de donnees avec Mongoose en utilisant des schemas. Les schemas permettent de valider les donnees et definir des methodes personnalisees.",
      pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/css/C12",
      duree: "1h", typeContenu: "TEXTE", ordre: 2,
      sessionId: sessionNode3.id,
    },
  });
  console.log("✅ Chapitres Node.js créés");

  // ==================== CHAPITRES FORMATION 3 (Data Science) ====================
  // Chapitres pour session4 (Introduction à Python)
  await prisma.chapitre.upsert({
    where: { id: 20 },
    update: {},
    create: {
      titre: "Installation de Python",
      contenu: "## Installation de Python\n\nDans ce chapitre, nous allons installer Python et configurer l'environnement de développement.\n\n### Installation\n\nTéléchargez Python depuis python.org et installez-le sur votre machine.\n\n### Vérification\n\n```bash\npython --version\n```\n\n### IDE\n\nNous recommandons d'utiliser VS Code ou PyCharm.",
      videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8",
      duree: "30min", typeContenu: "VIDEO", ordre: 1,
      sessionId: session4.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 21 },
    update: {},
    create: {
      titre: "Variables et Types",
      contenu: "## Variables et Types\n\nApprenez les bases du langage Python.\n\n### Variables\n\n```python\n nom = \"Alice\"\n age = 25\n```\n\n### Types\n\n- str (string)\n- int (entier)\n- float (décimal)\n- bool (booléen)",
      videoUrl: "https://www.youtube.com/embed/_uQrJ0TkZlc",
      duree: "45min", typeContenu: "VIDEO", ordre: 2,
      sessionId: session4.id,
    },
  });

  // Chapitres pour session5 (Pandas et NumPy)
  await prisma.chapitre.upsert({
    where: { id: 22 },
    update: {},
    create: {
      titre: "Introduction à NumPy",
      contenu: "## Introduction à NumPy\n\nNumPy est la bibliothèque fondamentale pour le calcul scientifique en Python.\n\n### Création de tableaux\n\n```python\nimport numpy as np\narr = np.array([1, 2, 3])\n```\n\n### Opérations\n\n- Addition, soustraction\n- Multiplication, division\n- Transposition",
      videoUrl: "https://www.youtube.com/embed/QUTxV38Eo-8",
      duree: "1h", typeContenu: "VIDEO", ordre: 1,
      sessionId: session5.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 23 },
    update: {},
    create: {
      titre: "Pandas pour l'analyse",
      contenu: "## Pandas pour l'analyse\n\nPandas permet de manipuler facilement des données.\n\n### DataFrame\n\n```python\nimport pandas as pd\ndf = pd.read_csv('data.csv')\n```\n\n### Opérations\n\n- Filtrage\n- Groupement\n- Agrégation",
      videoUrl: "https://www.youtube.com/embed/vmEHCnof5f8",
      duree: "1h30", typeContenu: "VIDEO", ordre: 2,
      sessionId: session5.id,
    },
  });
  console.log("✅ Chapitres Data Science créés");

  // ==================== CHAPITRES FORMATION 4 (IA) ====================
  // Chapitres pour sessionIA1
  await prisma.chapitre.upsert({
    where: { id: 24 },
    update: {},
    create: {
      titre: "Qu'est-ce que l'IA ?",
      contenu: "## Qu'est-ce que l'Intelligence Artificielle ?\n\nL'IA est la capacité des machines à apprendre et à prendre des décisions.\n\n### Types d'IA\n\n- IA faible (specialized)\n- IA forte (generalized)\n\n### Applications\n\n- Reconnaissance d'image\n- Traitement du langage\n- Robotique",
      videoUrl: "https://www.youtube.com/embed/aircAruvnKk",
      duree: "30min", typeContenu: "VIDEO", ordre: 1,
      sessionId: sessionIA1.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 25 },
    update: {},
    create: {
      titre: "Histoire de l'IA",
      contenu: "## Histoire de l'Intelligence Artificielle\n\nParcourons les grandes étapes de l'évolution de l'IA.\n\n### Années 1950-1960\n\n- Naissance de l'IA\n- Test de Turing\n\n### Années 1980-1990\n\n- Apprentissage automatique\n- Réseaux neuronaux\n\n### Années 2010-aujourd'hui\n\n- Deep Learning\n- Transformers",
      videoUrl: "https://www.youtube.com/embed/5q87K1WujFI",
      duree: "45min", typeContenu: "VIDEO", ordre: 2,
      sessionId: sessionIA1.id,
    },
  });

  // Chapitres pour sessionIA2
  await prisma.chapitre.upsert({
    where: { id: 26 },
    update: {},
    create: {
      titre: "Introduction au Machine Learning",
      contenu: "## Introduction au Machine Learning\n\nLe ML permet aux ordinateurs d'apprendre à partir de données.\n\n### Types d'apprentissage\n\n- Supervisé\n- Non supervisé\n- Par renforcement\n\n### Algorithmes\n\n- Régression\n- Classification\n- Clustering",
      videoUrl: "https://www.youtube.com/embed/i_LodwvqRyk",
      duree: "1h", typeContenu: "VIDEO", ordre: 1,
      sessionId: sessionIA2.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 27 },
    update: {},
    create: {
      titre: "Réseaux de neurones",
      contenu: "## Réseaux de neurones\n\nLes réseaux de neurones sont inspirés du cerveau humain.\n\n### Structure\n\n- Couche d'entrée\n- Couches cachées\n- Couche de sortie\n\n### Fonctionnement\n\n- Forward propagation\n- Backpropagation",
      videoUrl: "https://www.youtube.com/embed/bf-3Fep8-F4",
      duree: "1h30", typeContenu: "VIDEO", ordre: 2,
      sessionId: sessionIA2.id,
    },
  });
  console.log("✅ Chapitres IA créés");

  // ==================== CHAPITRES FORMATION 5 (UI/UX) ====================
  // Chapitres pour sessionUX1
  await prisma.chapitre.upsert({
    where: { id: 28 },
    update: {},
    create: {
      titre: "Principes du Design",
      contenu: "## Principes du Design\n\nLes principes fondamentaux pour créer de belles interfaces.\n\n### Hiérarchie\n\nL'œil doit être guidé vers les éléments importants.\n\n### Équilibre\n\nRépartition visuelle du poids sur la page.\n\n### Contraste\n\nDifférencier les éléments par la couleur.",
      videoUrl: "https://www.youtube.com/embed/YqQx75OPRa0",
      duree: "30min", typeContenu: "VIDEO", ordre: 1,
      sessionId: sessionUX1.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 29 },
    update: {},
    create: {
      titre: "Couleurs et Typographie",
      contenu: "## Couleurs et Typographie\n\nMaîtrisez l'art des couleurs et des polices.\n\n### Palette de couleurs\n\n- Couleurs primaires\n- Couleurs secondaires\n- Couleurs d'accent\n\n### Typographie\n\n- Hiérarchie des textes\n- Lisibilité\n- Accessibilité",
      videoUrl: "https://www.youtube.com/embed/3elGSZ2TbUM",
      duree: "45min", typeContenu: "VIDEO", ordre: 2,
      sessionId: sessionUX1.id,
    },
  });

  // Chapitres pour sessionUX2
  await prisma.chapitre.upsert({
    where: { id: 30 },
    update: {},
    create: {
      titre: "Wireframing",
      contenu: "## Wireframing\n\nCréez des squelettes d'interface avant le design final.\n\n### Outils\n\n- Figma\n- Adobe XD\n- Balsamiq\n\n### Bonnes pratiques\n\n- Simplicité\n- Navigation claire\n- Hiérarchie",
      videoUrl: "https://www.youtube.com/embed/PFMLZUDLEJ8",
      duree: "1h", typeContenu: "VIDEO", ordre: 1,
      sessionId: sessionUX2.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 31 },
    update: {},
    create: {
      titre: "Prototypage",
      contenu: "## Prototypage\n\nTransformez vos wireframes en prototypes interactifs.\n\n### Interactions\n\n- Animations\n- Transitions\n- Micro-interactions\n\n### Tests\n\n- Tests utilisateurs\n- Itérations\n- Amélioration continue",
      videoUrl: "https://www.youtube.com/embed/4W3AXG3PeJU",
      duree: "1h", typeContenu: "VIDEO", ordre: 2,
      sessionId: sessionUX2.id,
    },
  });
  console.log("✅ Chapitres UI/UX créés");

  // ==================== CHAPITRES FORMATION 6 (JavaScript) ====================
  // Chapitres pour sessionJS1
  await prisma.chapitre.upsert({
    where: { id: 32 },
    update: {},
    create: {
      titre: "Variables et Opérateurs",
      contenu: "## Variables et Opérateurs en JavaScript\n\nLes fondamentaux du langage.\n\n### Déclaration\n\n```javascript\nlet nom = \"Alice\";\nconst age = 25;\nvar ancien = \"méthode\";\n```\n\n### Opérateurs\n\n- Arithmétiques (+, -, *, /)\n- Comparaison (==, ===, !=)\n- Logiques (&&, ||, !)",
      videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
      duree: "30min", typeContenu: "VIDEO", ordre: 1,
      sessionId: sessionJS1.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 33 },
    update: {},
    create: {
      titre: "Fonctions",
      contenu: "## Fonctions en JavaScript\n\nApprenez à créer des fonctions réutilisables.\n\n### Déclaration\n\n```javascript\nfunction direBonjour(nom) {\n  return \"Bonjour \" + nom;\n}\n```\n\n### Arrow functions\n\n```javascript\nconst direBonjour = (nom) => \"Bonjour \" + nom;\n```\n\n### Paramètres\n\n- Par défaut\n- Rest parameters\n- Destructuration",
      videoUrl: "https://www.youtube.com/embed/FOD408a0EzU",
      duree: "45min", typeContenu: "VIDEO", ordre: 2,
      sessionId: sessionJS1.id,
    },
  });

  // Chapitres pour sessionJS2
  await prisma.chapitre.upsert({
    where: { id: 34 },
    update: {},
    create: {
      titre: "Le DOM",
      contenu: "## Le DOM (Document Object Model)\n\nManipulez les éléments HTML avec JavaScript.\n\n### Sélection\n\n```javascript\ndocument.getElementById('monId');\ndocument.querySelector('.maClasse');\n```\n\n### Modification\n\n```javascript\nelement.innerHTML = 'Nouveau contenu';\nelement.style.color = 'blue';\n```\n\n### Création\n\n```javascript\nconst nouveau = document.createElement('div');\ndocument.body.appendChild(nouveau);\n```",
      videoUrl: "https://www.youtube.com/embed/y17RuQWKnc8",
      duree: "1h", typeContenu: "VIDEO", ordre: 1,
      sessionId: sessionJS2.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 35 },
    update: {},
    create: {
      titre: "Événements",
      contenu: "## Les Événements\n\nRéagissez aux actions de l'utilisateur.\n\n### Écouteurs\n\n```javascript\nelement.addEventListener('click', () => {\n  console.log('Clic détecté!');\n});\n```\n\n### Types d'événements\n\n- click\n- mouseover\n- keydown\n- submit\n\n### Propagation\n\n- Bubbling\n- Capturing",
      videoUrl: "https://www.youtube.com/embed/7a9QdGmsU7M",
      duree: "1h30", typeContenu: "VIDEO", ordre: 2,
      sessionId: sessionJS2.id,
    },
  });
  console.log("✅ Chapitres JavaScript créés");

  // ==================== QUIZZES ====================
  console.log("❓ Création des quiz...");

  const quiz1 = await prisma.quiz.upsert({
    where: { id: 1 },
    update: {},
    create: {
      score: null, formationId: formation1.id, sessionId: session1.id,
    },
  });

  const quiz2 = await prisma.quiz.upsert({
    where: { id: 2 },
    update: {},
    create: {
      score: null, formationId: formation1.id, sessionId: session2.id,
    },
  });

  const quiz3 = await prisma.quiz.upsert({
    where: { id: 3 },
    update: {},
    create: {
      score: null, formationId: formation3.id, sessionId: session4.id,
    },
  });
  console.log("✅ Quiz créés");

  // ==================== QUESTIONS ET RÉPONSES ====================
  console.log("📝 Création des questions et réponses...");

  // Questions pour Quiz 1
  await prisma.question.upsert({
    where: { id: 1 },
    update: {},
    create: {
      contenu: "Qu'est-ce que React ?",
      quizId: quiz1.id,
    },
  });

  const question1 = await prisma.question.findFirst({ where: { id: 1 } });
  if (question1) {
    await prisma.reponse.createMany({
      data: [
        { contenu: "Un langage de programmation", estCorrecte: false, questionId: question1.id },
        { contenu: "Une bibliothèque JavaScript", estCorrecte: true, questionId: question1.id },
        { contenu: "Un serveur web", estCorrecte: false, questionId: question1.id },
        { contenu: "Une base de données", estCorrecte: false, questionId: question1.id },
      ],
      skipDuplicates: true,
    });
  }

  await prisma.question.upsert({
    where: { id: 2 },
    update: {},
    create: {
      contenu: "Comment créer un composant React ?",
      quizId: quiz1.id,
    },
  });

  const question2 = await prisma.question.findFirst({ where: { id: 2 } });
  if (question2) {
    await prisma.reponse.createMany({
      data: [
        { contenu: "Avec la fonction class", estCorrecte: false, questionId: question2.id },
        { contenu: "Avec une fonction JavaScript", estCorrecte: true, questionId: question2.id },
        { contenu: "Avec HTML pur", estCorrecte: false, questionId: question2.id },
        { contenu: "Avec CSS", estCorrecte: false, questionId: question2.id },
      ],
      skipDuplicates: true,
    });
  }

  // Questions pour Quiz 2
  await prisma.question.upsert({
    where: { id: 3 },
    update: {},
    create: {
      contenu: "Quelle est la différence entre props et state ?",
      quizId: quiz2.id,
    },
  });

  const question3 = await prisma.question.findFirst({ where: { id: 3 } });
  if (question3) {
    await prisma.reponse.createMany({
      data: [
        { contenu: "Il n'y a pas de différence", estCorrecte: false, questionId: question3.id },
        { contenu: "Les props sont immuables, le state peut changer", estCorrecte: true, questionId: question3.id },
        { contenu: "Le state est immuable, les props peuvent changer", estCorrecte: false, questionId: question3.id },
        { contenu: "Les props sont pour les fonctions", estCorrecte: false, questionId: question3.id },
      ],
      skipDuplicates: true,
    });
  }

  // Questions pour Quiz 3
  await prisma.question.upsert({
    where: { id: 4 },
    update: {},
    create: {
      contenu: "Que signifie Pandas en Python ?",
      quizId: quiz3.id,
    },
  });

  const question4 = await prisma.question.findFirst({ where: { id: 4 } });
  if (question4) {
    await prisma.reponse.createMany({
      data: [
        { contenu: "Un animal", estCorrecte: false, questionId: question4.id },
        { contenu: "Un outil d'analyse de données", estCorrecte: true, questionId: question4.id },
        { contenu: "Un langage de programmation", estCorrecte: false, questionId: question4.id },
        { contenu: "Un framework web", estCorrecte: false, questionId: question4.id },
      ],
      skipDuplicates: true,
    });
  }
  console.log("✅ Questions et réponses créées");

// ==================== INSCRIPTIONS ====================
console.log("📝 Création des inscriptions...");

const app1 = await prisma.apprenant.findFirst({ where: { utilisateurId: apprenant1.id } });
const app2 = await prisma.apprenant.findFirst({ where: { utilisateurId: apprenant2.id } });
const app3 = await prisma.apprenant.findFirst({ where: { utilisateurId: apprenant3.id } });

if (app1) {
  await prisma.apprenantFormation.upsert({
    where: {
      apprenantId_formationId: {
        apprenantId: app1.id,
        formationId: formation1.id
      }
    },
    update: {},
    create: {
      apprenantId: app1.id,
      formationId: formation1.id
    }
  });
}

if (app1) {
  await prisma.apprenantFormation.upsert({
    where: {
      apprenantId_formationId: {
        apprenantId: app1.id,
        formationId: formation3.id
      }
    },
    update: {},
    create: {
      apprenantId: app1.id,
      formationId: formation3.id
    }
  });
}

if (app2) {
  await prisma.apprenantFormation.upsert({
    where: {
      apprenantId_formationId: {
        apprenantId: app2.id,
        formationId: formation1.id
      }
    },
    update: {},
    create: {
      apprenantId: app2.id,
      formationId: formation1.id
    }
  });
}

if (app1) {
  await prisma.apprenantFormation.upsert({
    where: {
      apprenantId_formationId: {
        apprenantId: app1.id,
        formationId: formation2.id
      }
    },
    update: {},
    create: {
      apprenantId: app1.id,
      formationId: formation2.id
    }
  });
}

if (app3) {
  await prisma.apprenantFormation.upsert({
    where: {
      apprenantId_formationId: {
        apprenantId: app3.id,
        formationId: formation6.id
      }
    },
    update: {},
    create: {
      apprenantId: app3.id,
      formationId: formation6.id
    }
  });
}

console.log("✅ Inscriptions créées");

  // ==================== PAIEMENTS ====================
  console.log("💳 Création des paiements...");

  if (app1) {
    await prisma.paiement.upsert({
      where: { id: 1 },
      update: {},
      create: {
        montant: 50000, moyenPaiement: "WAVE", apprenantFormationId: app1.id,
      },
    });
  }

  if (app2) {
    await prisma.paiement.upsert({
      where: { id: 2 },
      update: {},
      create: {
        montant: 50000, moyenPaiement: "OM", apprenantFormationId: app2.id,
      },
    });
  }

  if (app1) {
    await prisma.paiement.upsert({
      where: { id: 3 },
      update: {},
      create: {
        montant: 75000, moyenPaiement: "WAVE", apprenantFormationId: app1.id,
      },
    });
  }
  console.log("✅ Paiements créés");

  // ==================== CERTIFICATIONS ====================
  console.log("🎓 Création des certifications...");

  if (app1) {
    await prisma.certification.upsert({
      where: { id: 1 },
      update: {},
      create: { apprenantId: app1.id, formationId: formation1.id },
    });
  }
  console.log("✅ Certifications créées");

  // ==================== PROGRESSION EXEMPLE APPRENANT ====================
  console.log("🌱 Création des données de progression exemple...");

  // Liste des apprenants et formations pour lesquels on ajoute une progression
  const progressionsExemples = [
    { login: "apprenant_aminata", rechercheFormation: "React" },
    { login: "apprenant_malick", rechercheFormation: "Node.js" },
    { login: "apprenant_fatou", rechercheFormation: "JavaScript" }
  ];

  for (const exemple of progressionsExemples) {
    // Récupérer l'apprenant
    const apprenantUser = await prisma.utilisateur.findUnique({ 
      where: { login: exemple.login },
      include: { apprenant: true }
    });

    // Récupérer la formation
    const formation = await prisma.formation.findFirst({ 
      where: { titre: { contains: exemple.rechercheFormation } }
    });

    if (apprenantUser?.apprenant && formation) {

      // 1. Lier l'apprenant à la formation
      const apprenantFormation = await prisma.apprenantFormation.upsert({
        where: { 
          apprenantId_formationId: { 
            apprenantId: apprenantUser.apprenant.id, 
            formationId: formation.id 
          }
        },
        create: {
          apprenantId: apprenantUser.apprenant.id,
          formationId: formation.id
        },
        update: {}
      });

      // 2. Créer l'entrée Progression
      const progression = await prisma.progression.upsert({
        where: { apprenantFormationId: apprenantFormation.id },
        create: {
          apprenantFormationId: apprenantFormation.id
        },
        update: {}
      });

      // 3. Récupérer tous les chapitres de la formation
      const chapitres = await prisma.chapitre.findMany({ 
        where: { session: { formationId: formation.id } },
        orderBy: { id: 'asc' }
      });

      // 4. Marquer les 3 premiers chapitres comme complétés pour avoir une progression exemple
      for (let i = 0; i < 3 && i < chapitres.length; i++) {
        await prisma.apprenantChapitre.upsert({
          where: {
            progressionId_chapitreId: {
              progressionId: progression.id,
              chapitreId: chapitres[i].id
            }
          },
          create: {
            progressionId: progression.id,
            chapitreId: chapitres[i].id,
            estComplete: true,
            dateCompletion: new Date()
          },
          update: {
            estComplete: true
          }
        });
      }

      console.log(`✅ Progression créée pour ${exemple.login} sur la formation ${formation.titre}`);
    }
  }

  console.log("===========================================");
  console.log("✅ SEED TERMINÉ AVEC SUCCÈS !");
  console.log("===========================================");
  console.log("📋 Comptes disponibles :");
  console.log("   ADMIN: admin / 123456");
  console.log("   PROF 1: prof_khadidiatou / 123456");
  console.log("   PROF 2: prof_mamadou / 123456");
  console.log("   PROF 3: prof_omar / 123456");
  console.log("   APPRENANT 1: apprenant_aminata / 123456");
  console.log("   APPRENANT 2: apprenant_malick / 123456");
  console.log("   APPRENANT 3: apprenant_fatou / 123456");
  console.log("===========================================");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
