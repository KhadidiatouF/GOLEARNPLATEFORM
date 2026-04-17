import { z } from "zod";

// ===========================================
// Ancien schéma (pour compatibilité)
// ===========================================
export const formationSchema = z.object({
    titre: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
    description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
    prix: z.number().min(0, "Le prix ne peut pas être négatif"),
    categorie: z.string().min(1, "La catégorie est requise"),
    niveau: z.string().min(1, "Le niveau est requis"),
    image: z.string().optional(),
    typeCours: z.enum(["PAYANT", "GRATUIT"]),
    professeurId: z.number().int().positive("L'ID du professeur doit être un nombre positif")
});

export const updateFormationSchema = formationSchema.partial();

// ===========================================
// Nouveau schéma pour création complète (avec sessions, quiz, questions, réponses)
// ===========================================

// Schéma pour une réponse (answer)
const reponseDataSchema = z.object({
    contenu: z.string().min(1, "Le contenu de la réponse est requis"),
    estCorrecte: z.boolean()
});

// Schéma pour une question
const questionDataSchema = z.object({
    contenu: z.string().min(1, "Le contenu de la question est requis"),
    reponses: z.array(reponseDataSchema).min(2, "Une question doit avoir au moins 2 réponses")
});

// Schéma pour un chapitre
const chapitreDataSchema = z.object({
    titre: z.string().min(2, "Le titre du chapitre est requis"),
    contenu: z.string().min(1, "Le contenu du chapitre est requis"),
    duree: z.string().min(1, "La durée est requise"),
    typeContenu: z.enum(["VIDEO", "PDF", "TEXTE"]),
    ordre: z.number().int().positive().optional()
});

// Schéma pour un quiz
const quizDataSchema = z.object({
    questions: z.array(questionDataSchema).min(1, "Un quiz doit avoir au moins une question")
});

// Schéma pour une session (module)
const sessionDataSchema = z.object({
    titre: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
    contenu: z.string().optional(), // Résumé du module
    duree: z.string().optional(),  // Durée totale du module
    chapitres: z.array(chapitreDataSchema).optional(), // Chapitres/leçons
    quiz: quizDataSchema.optional() // Quiz optionnel pour la session
});

// Schéma principal pour la création complète d'une formation
export const completeFormationSchema = z.object({
    // Données de la formation
    titre: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
    description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
    prix: z.number().min(0, "Le prix ne peut pas être négatif"),
    categorie: z.string().min(1, "La catégorie est requise"),
    niveau: z.string().min(1, "Le niveau est requis"),
    image: z.string().optional(),
    typeCours: z.enum(["PAYANT", "GRATUIT"]),
    professeurId: z.number().int().positive("L'ID du professeur doit être un nombre positif"),
    
    // Tableau des sessions (modules)
    sessions: z.array(sessionDataSchema).min(1, "Au moins une session est requise"),
    quizFinal: quizDataSchema.optional()
});

// Type inféré du schéma
export type CompleteFormationData = z.infer<typeof completeFormationSchema>;
