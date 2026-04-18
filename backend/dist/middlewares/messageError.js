"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    // Utilisateur
    ErrorCode["USER_NOT_FOUND"] = "Utilisateur introuvable";
    ErrorCode["USER_ALREADY_EXISTS"] = "Utilisateur d\u00E9j\u00E0 existant";
    ErrorCode["INVALID_INPUT"] = "Donn\u00E9es invalides";
    ErrorCode["INTERNAL_ERROR"] = "Erreur interne du serveur";
    // Apprenant
    ErrorCode["APPRENANT_NOT_FOUND"] = "Apprenant introuvable";
    ErrorCode["APPRENANT_ALREADY_EXISTS"] = "Apprenant d\u00E9j\u00E0 existant";
    // Professeur
    ErrorCode["PROFESSEUR_NOT_FOUND"] = "Professeur introuvable";
    ErrorCode["PROFESSEUR_ALREADY_EXISTS"] = "Professeur d\u00E9j\u00E0 existant";
    // Administrateur
    ErrorCode["ADMIN_NOT_FOUND"] = "Administrateur introuvable";
    ErrorCode["ADMIN_ALREADY_EXISTS"] = "Administrateur d\u00E9j\u00E0 existant";
    // Formation
    ErrorCode["FORMATION_NOT_FOUND"] = "Formation introuvable";
    ErrorCode["FORMATION_ALREADY_EXISTS"] = "Formation d\u00E9j\u00E0 existant";
    ErrorCode["FORMATION_REQUIRE"] = "Formation requise";
    // Session
    ErrorCode["SESSION_NOT_FOUND"] = "Session introuvable";
    ErrorCode["SESSION_ALREADY_EXISTS"] = "Session d\u00E9j\u00E0 existante";
    // Paiement
    ErrorCode["PAIEMENT_NOT_FOUND"] = "Paiement introuvable";
    ErrorCode["PAIEMENT_ALREADY_EXISTS"] = "Paiement d\u00E9j\u00E0 existant";
    ErrorCode["PAIEMENT_FAILED"] = "Paiement \u00E9chou\u00E9";
    // Certification
    ErrorCode["CERTIFICATION_NOT_FOUND"] = "Certification introuvable";
    ErrorCode["CERTIFICATION_ALREADY_EXISTS"] = "Certification d\u00E9j\u00E0 existante";
    // Quiz
    ErrorCode["QUIZ_NOT_FOUND"] = "Quiz introuvable";
    ErrorCode["QUIZ_ALREADY_EXISTS"] = "Quiz d\u00E9j\u00E0 existant";
    // Question
    ErrorCode["QUESTION_NOT_FOUND"] = "Question introuvable";
    ErrorCode["QUESTION_ALREADY_EXISTS"] = "Question d\u00E9j\u00E0 existante";
    // Réponse
    ErrorCode["REPONSE_NOT_FOUND"] = "R\u00E9ponse introuvable";
    ErrorCode["REPONSE_ALREADY_EXISTS"] = "R\u00E9ponse d\u00E9j\u00E0 existante";
    // Auth
    ErrorCode["TOKEN_NOT_FOUND"] = "Token non trouv\u00E9 ou invalide";
    ErrorCode["ACCES_INTERDIT"] = "Acc\u00E8s interdit";
    ErrorCode["PERMISSION_NON_ACCORDER"] = "Permission non autoris\u00E9e";
    ErrorCode["INVALID_CREDENTIALS"] = "Identifiants invalides";
    ErrorCode["UNAUTHORIZED"] = "Non autoris\u00E9";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
//# sourceMappingURL=messageError.js.map