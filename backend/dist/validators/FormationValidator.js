"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeFormationSchema = exports.updateFormationSchema = exports.formationSchema = void 0;
const zod_1 = require("zod");
// ===========================================
// Ancien schéma (pour compatibilité)
// ===========================================
exports.formationSchema = zod_1.z.object({
    titre: zod_1.z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
    description: zod_1.z.string().min(10, "La description doit contenir au moins 10 caractères"),
    prix: zod_1.z.number().min(0, "Le prix ne peut pas être négatif"),
    categorie: zod_1.z.string().min(1, "La catégorie est requise"),
    niveau: zod_1.z.string().min(1, "Le niveau est requis"),
    image: zod_1.z.string().optional(),
    typeCours: zod_1.z.enum(["PAYANT", "GRATUIT"]),
    professeurId: zod_1.z.number().int().positive("L'ID du professeur doit être un nombre positif")
});
exports.updateFormationSchema = exports.formationSchema.partial();
// ===========================================
// Nouveau schéma pour création complète (avec sessions, quiz, questions, réponses)
// ===========================================
// Schéma pour une réponse (answer)
const reponseDataSchema = zod_1.z.object({
    contenu: zod_1.z.string().min(1, "Le contenu de la réponse est requis"),
    estCorrecte: zod_1.z.boolean()
});
// Schéma pour une question
const questionDataSchema = zod_1.z.object({
    contenu: zod_1.z.string().min(1, "Le contenu de la question est requis"),
    reponses: zod_1.z.array(reponseDataSchema).min(2, "Une question doit avoir au moins 2 réponses")
});
// Schéma pour un chapitre
const chapitreDataSchema = zod_1.z.object({
    titre: zod_1.z.string().min(2, "Le titre du chapitre est requis"),
    contenu: zod_1.z.string().min(1, "Le contenu du chapitre est requis"),
    duree: zod_1.z.string().min(1, "La durée est requise"),
    typeContenu: zod_1.z.enum(["VIDEO", "PDF", "TEXTE"]),
    ordre: zod_1.z.number().int().positive().optional()
});
// Schéma pour un quiz
const quizDataSchema = zod_1.z.object({
    questions: zod_1.z.array(questionDataSchema).min(1, "Un quiz doit avoir au moins une question")
});
// Schéma pour une session (module)
const sessionDataSchema = zod_1.z.object({
    titre: zod_1.z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
    contenu: zod_1.z.string().optional(), // Résumé du module
    duree: zod_1.z.string().optional(), // Durée totale du module
    chapitres: zod_1.z.array(chapitreDataSchema).optional(), // Chapitres/leçons
    quiz: quizDataSchema.optional() // Quiz optionnel pour la session
});
// Schéma principal pour la création complète d'une formation
exports.completeFormationSchema = zod_1.z.object({
    // Données de la formation
    titre: zod_1.z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
    description: zod_1.z.string().min(10, "La description doit contenir au moins 10 caractères"),
    prix: zod_1.z.number().min(0, "Le prix ne peut pas être négatif"),
    categorie: zod_1.z.string().min(1, "La catégorie est requise"),
    niveau: zod_1.z.string().min(1, "Le niveau est requis"),
    image: zod_1.z.string().optional(),
    typeCours: zod_1.z.enum(["PAYANT", "GRATUIT"]),
    professeurId: zod_1.z.number().int().positive("L'ID du professeur doit être un nombre positif"),
    // Tableau des sessions (modules)
    sessions: zod_1.z.array(sessionDataSchema).min(1, "Au moins une session est requise"),
    quizFinal: quizDataSchema.optional()
});
//# sourceMappingURL=FormationValidator.js.map