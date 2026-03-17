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
      titre: "React de A à Z",
      description: "Maîtrisez React de A à Z avec ce cours complet. Apprenez les bases, les hooks, Redux et Next.js.",
      prix: 50000, categorie: "Développement Web", niveau: "Débutant",
      typeCours: "PAYANT", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600",
      professeurId: professor1?.id || 1,
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
      prix: 55000, categorie: "Développement Web", niveau: "Intermédiaire",
      typeCours: "PAYANT", image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600",
      professeurId: professor1?.id || 1,
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
    where: { id: 6 },
    update: {},
    create: {
      titre: "Introduction à Node.js",
      contenu: "Découvrez Node.js et son environnement d'exécution JavaScript côté serveur.",
      duree: "1h30", formationId: formation2.id,
    },
  });

  const sessionNode2 = await prisma.session.upsert({
    where: { id: 7 },
    update: {},
    create: {
      titre: "Express.js - Créer un serveur web",
      contenu: "Apprenez à créer des API REST avec Express.js.",
      duree: "2h", formationId: formation2.id,
    },
  });

  const sessionNode3 = await prisma.session.upsert({
    where: { id: 8 },
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
  console.log("✅Plus de sessions créées");

  // ==================== CHAPITRES ====================
  console.log("📖 Création des chapitres...");

  await prisma.chapitre.upsert({
    where: { id: 1 },
    update: {},
    create: {
      titre: "Installation de React",
      contenu: "Comment installer Node.js et créer un projet React",
      duree: "30min", typeContenu: "VIDEO", ordre: 1,
      sessionId: session1.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 2 },
    update: {},
    create: {
      titre: "Votre premier composant",
      contenu: "Créez votre premier composant React étape par étape",
      duree: "45min", typeContenu: "VIDEO", ordre: 2,
      sessionId: session1.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 3 },
    update: {},
    create: {
      titre: "TP: Créer un compteur",
      contenu: "Exercice pratique pour manipuler le state",
      duree: "1h", typeContenu: "TEXTE", ordre: 3,
      sessionId: session1.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 4 },
    update: {},
    create: {
      titre: "Props et State",
      contenu: "Comprendre la différence entre props et state",
      duree: "1h", typeContenu: "VIDEO", ordre: 1,
      sessionId: session2.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 5 },
    update: {},
    create: {
      titre: "Composants fonctionnels",
      contenu: "Les composants modernes avec les fonctions",
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
      contenu: "Comment installer Node.js et npm sur votre machine",
      duree: "30min", typeContenu: "VIDEO", ordre: 1,
      sessionId: sessionNode1.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 7 },
    update: {},
    create: {
      titre: "Votre premier script Node.js",
      contenu: "Créez et exécutez votre premier script JavaScript côté serveur",
      duree: "45min", typeContenu: "TEXTE", ordre: 2,
      sessionId: sessionNode1.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 8 },
    update: {},
    create: {
      titre: "Introduction à Express",
      contenu: "Configurer Express et créer votre première route API",
      duree: "1h", typeContenu: "VIDEO", ordre: 1,
      sessionId: sessionNode2.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 9 },
    update: {},
    create: {
      titre: "Les routes et contrôleurs",
      contenu: "Organiser votre code avec les routes et contrôleurs Express",
      duree: "1h", typeContenu: "TEXTE", ordre: 2,
      sessionId: sessionNode2.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 10 },
    update: {},
    create: {
      titre: "Connexion à MongoDB",
      contenu: "Installer Mongoose et se connecter à MongoDB",
      duree: "45min", typeContenu: "VIDEO", ordre: 1,
      sessionId: sessionNode3.id,
    },
  });

  await prisma.chapitre.upsert({
    where: { id: 11 },
    update: {},
    create: {
      titre: "Créer un modèle Mongoose",
      contenu: "Définir des modèles de données avec Mongoose",
      duree: "1h", typeContenu: "TEXTE", ordre: 2,
      sessionId: sessionNode3.id,
    },
  });
  console.log("✅ Chapitres Node.js créés");

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
      where: { id: 1 },
      update: {},
      create: { apprenantId: app1.id, formationId: formation1.id },
    });
  }

  if (app1) {
    await prisma.apprenantFormation.upsert({
      where: { id: 2 },
      update: {},
      create: { apprenantId: app1.id, formationId: formation3.id },
    });
  }

  if (app2) {
    await prisma.apprenantFormation.upsert({
      where: { id: 3 },
      update: {},
      create: { apprenantId: app2.id, formationId: formation1.id },
    });
  }

  if (app1) {
    await prisma.apprenantFormation.upsert({
      where: { id: 5 },
      update: {},
      create: { apprenantId: app1.id, formationId: formation2.id },
    });
  }

  if (app3) {
    await prisma.apprenantFormation.upsert({
      where: { id: 6 },
      update: {},
      create: { apprenantId: app3.id, formationId: formation6.id },
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
        montant: 50000, moyenPaiement: "WAVE", apprenantId: app1.id,
      },
    });
  }

  if (app2) {
    await prisma.paiement.upsert({
      where: { id: 2 },
      update: {},
      create: {
        montant: 50000, moyenPaiement: "OM", apprenantId: app2.id,
      },
    });
  }

  if (app1) {
    await prisma.paiement.upsert({
      where: { id: 3 },
      update: {},
      create: {
        montant: 75000, moyenPaiement: "WAVE", apprenantId: app1.id,
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
