import { z } from "zod";
export declare const formationSchema: z.ZodObject<{
    titre: z.ZodString;
    description: z.ZodString;
    prix: z.ZodNumber;
    categorie: z.ZodString;
    niveau: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    typeCours: z.ZodEnum<{
        PAYANT: "PAYANT";
        GRATUIT: "GRATUIT";
    }>;
    professeurId: z.ZodNumber;
}, z.core.$strip>;
export declare const updateFormationSchema: z.ZodObject<{
    titre: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    prix: z.ZodOptional<z.ZodNumber>;
    categorie: z.ZodOptional<z.ZodString>;
    niveau: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    typeCours: z.ZodOptional<z.ZodEnum<{
        PAYANT: "PAYANT";
        GRATUIT: "GRATUIT";
    }>>;
    professeurId: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const completeFormationSchema: z.ZodObject<{
    titre: z.ZodString;
    description: z.ZodString;
    prix: z.ZodNumber;
    categorie: z.ZodString;
    niveau: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    typeCours: z.ZodEnum<{
        PAYANT: "PAYANT";
        GRATUIT: "GRATUIT";
    }>;
    professeurId: z.ZodNumber;
    sessions: z.ZodArray<z.ZodObject<{
        titre: z.ZodString;
        contenu: z.ZodOptional<z.ZodString>;
        duree: z.ZodOptional<z.ZodString>;
        chapitres: z.ZodOptional<z.ZodArray<z.ZodObject<{
            titre: z.ZodString;
            contenu: z.ZodString;
            duree: z.ZodString;
            typeContenu: z.ZodEnum<{
                VIDEO: "VIDEO";
                PDF: "PDF";
                TEXTE: "TEXTE";
            }>;
            ordre: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>>;
        quiz: z.ZodOptional<z.ZodObject<{
            questions: z.ZodArray<z.ZodObject<{
                contenu: z.ZodString;
                reponses: z.ZodArray<z.ZodObject<{
                    contenu: z.ZodString;
                    estCorrecte: z.ZodBoolean;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    quizFinal: z.ZodOptional<z.ZodObject<{
        questions: z.ZodArray<z.ZodObject<{
            contenu: z.ZodString;
            reponses: z.ZodArray<z.ZodObject<{
                contenu: z.ZodString;
                estCorrecte: z.ZodBoolean;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CompleteFormationData = z.infer<typeof completeFormationSchema>;
//# sourceMappingURL=FormationValidator.d.ts.map