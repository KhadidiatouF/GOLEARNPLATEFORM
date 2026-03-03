import "dotenv/config"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient(); 

async function main() {
  console.log("✅ Connexion réussie");
  console.log("🌱 Vidage de la base de données...");
  
  // On vide tout pour éviter l'erreur de duplication (P2002)
  await prisma.apprenantFormation.deleteMany({});
  await prisma.certification.deleteMany({});
  await prisma.paiement.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.formation.deleteMany({});
  await prisma.apprenant.deleteMany({});
  await prisma.professeur.deleteMany({});
  await prisma.utilisateur.deleteMany({});

  console.log("🌱 Création des utilisateurs...");

  const admin = await prisma.utilisateur.create({
    data: {
      nom: "Admin", prenom: "System", email: "admin@golearn.com",
      login: "admin", mdp: "admin123", role: "ADMIN",
    },
  });

  const profUser = await prisma.utilisateur.create({
    data: {
      nom: "Fall", prenom: "Khadidiatou", email: "prof@golearn.com",
      login: "prof1", mdp: "123456", role: "PROF",
    },
  });

  const professeur = await prisma.professeur.create({
    data: {
      utilisateurId: profUser.id,
      specialite: "Développement Web",
      bio: "Expert React & Node",
    },
  });

  const apprenantUser = await prisma.utilisateur.create({
    data: {
      nom: "Diallo", prenom: "Aminata", email: "apprenant@golearn.com",
      login: "student1", mdp: "123456", role: "APPRENANT",
    },
  });

  const apprenant = await prisma.apprenant.create({
    data: {
      utilisateurId: apprenantUser.id,
      niveau: "Débutant",
    },
  });

  console.log("📚 Création des formations...");

  const formation = await prisma.formation.create({
    data: {
      titre: "React de A à Z", description: "Formation complète React",
      prix: 50000, categorie: "Développement Web", niveau: "Débutant",
      typeCours: "PAYANT", professeurId: professeur.id,
    },
  });

  console.log("🎬 Création des sessions...");

  await prisma.session.create({
    data: {
      titre: "Introduction à React", contenu: "Comprendre les composants",
      duree: "2h", typeContenu: "VIDEO", formationId: formation.id,
    },
  });

  console.log("📝 Création inscription...");

  await prisma.apprenantFormation.create({
    data: {
      apprenantId: apprenant.id,
      formationId: formation.id,
    },
  });

  console.log("💳 Création paiement...");

  await prisma.paiement.create({
    data: {
      montant: 50000,
      moyenPaiement: "WAVE",
      apprenantId: apprenant.id,
    },
  });

  console.log("🎓 Création certification...");

  await prisma.certification.create({
    data: {
      apprenantId: apprenant.id,
      formationId: formation.id,
    },
  });

  console.log("✅ SEED TERMINÉ AVEC SUCCÈS !");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });