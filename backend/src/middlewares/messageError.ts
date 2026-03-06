export enum ErrorCode {

    // Utilisateur
    USER_NOT_FOUND = "Utilisateur introuvable",
    USER_ALREADY_EXISTS = "Utilisateur déjà existant",
    INVALID_INPUT = "Données invalides",
    INTERNAL_ERROR = "Erreur interne du serveur",

    // Apprenant
    APPRENANT_NOT_FOUND = "Apprenant introuvable",
    APPRENANT_ALREADY_EXISTS = "Apprenant déjà existant",

    // Professeur
    PROFESSEUR_NOT_FOUND = "Professeur introuvable",
    PROFESSEUR_ALREADY_EXISTS = "Professeur déjà existant",

    // Administrateur
    ADMIN_NOT_FOUND = "Administrateur introuvable",
    ADMIN_ALREADY_EXISTS = "Administrateur déjà existant",

    // Formation
    FORMATION_NOT_FOUND = "Formation introuvable",
    FORMATION_ALREADY_EXISTS = "Formation déjà existant",
    FORMATION_REQUIRE = "Formation requise",

    // Session
    SESSION_NOT_FOUND = "Session introuvable",
    SESSION_ALREADY_EXISTS = "Session déjà existante",

    // Paiement
    PAIEMENT_NOT_FOUND = "Paiement introuvable",
    PAIEMENT_ALREADY_EXISTS = "Paiement déjà existant",
    PAIEMENT_FAILED = "Paiement échoué",

    // Certification
    CERTIFICATION_NOT_FOUND = "Certification introuvable",
    CERTIFICATION_ALREADY_EXISTS = "Certification déjà existante",

    // Quiz
    QUIZ_NOT_FOUND = "Quiz introuvable",
    QUIZ_ALREADY_EXISTS = "Quiz déjà existant",

    // Question
    QUESTION_NOT_FOUND = "Question introuvable",
    QUESTION_ALREADY_EXISTS = "Question déjà existante",

    // Réponse
    REPONSE_NOT_FOUND = "Réponse introuvable",
    REPONSE_ALREADY_EXISTS = "Réponse déjà existante",

    // Auth
    TOKEN_NOT_FOUND = "Token non trouvé ou invalide",
    ACCES_INTERDIT = "Accès interdit",
    PERMISSION_NON_ACCORDER = "Permission non autorisée",
    INVALID_CREDENTIALS = "Identifiants invalides",
    UNAUTHORIZED = "Non autorisé"

}
