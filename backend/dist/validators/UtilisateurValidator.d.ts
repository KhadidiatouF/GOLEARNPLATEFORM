import { z } from "zod";
export declare const utilisateurSchema: z.ZodObject<{
    nom: z.ZodString;
    prenom: z.ZodString;
    email: z.ZodString;
    login: z.ZodString;
    mdp: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        PROF: "PROF";
        APPRENANT: "APPRENANT";
    }>;
    niveau: z.ZodOptional<z.ZodString>;
    specialite: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    telephone: z.ZodOptional<z.ZodString>;
    date_naissance: z.ZodOptional<z.ZodString>;
    adresse: z.ZodOptional<z.ZodString>;
    photo: z.ZodOptional<z.ZodString>;
    demande_prof: z.ZodOptional<z.ZodBoolean>;
    solde: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateUtilisateurSchema: z.ZodObject<{
    nom: z.ZodOptional<z.ZodString>;
    prenom: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    login: z.ZodOptional<z.ZodString>;
    mdp: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        ADMIN: "ADMIN";
        PROF: "PROF";
        APPRENANT: "APPRENANT";
    }>>;
    niveau: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    specialite: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    bio: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    telephone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    date_naissance: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    adresse: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    photo: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    demande_prof: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    solde: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    mdp: z.ZodString;
}, z.core.$strip>;
export declare const apprenantSchema: z.ZodObject<{
    utilisateurId: z.ZodNumber;
    niveau: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const professeurSchema: z.ZodObject<{
    specialite: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=UtilisateurValidator.d.ts.map