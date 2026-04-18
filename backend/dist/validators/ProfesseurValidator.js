"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demandeProfesseurSchema = exports.updateProfesseurSchema = exports.professeurSchema = void 0;
const zod_1 = require("zod");
exports.professeurSchema = zod_1.z.object({
    specialite: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional()
});
exports.updateProfesseurSchema = exports.professeurSchema;
exports.demandeProfesseurSchema = zod_1.z.object({
    nom: zod_1.z.string().min(2, "Le nom est requis"),
    prenom: zod_1.z.string().min(2, "Le prénom est requis"),
    email: zod_1.z.string().email("Email invalide"),
    domaineExpertise: zod_1.z.string().min(2, "Le domaine d'expertise est requis"),
    experience: zod_1.z.string().min(1, "L'expérience est requise"),
    motivation: zod_1.z.string().min(10, "La motivation doit contenir au moins 10 caractères"),
    specialite: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional()
});
//# sourceMappingURL=ProfesseurValidator.js.map