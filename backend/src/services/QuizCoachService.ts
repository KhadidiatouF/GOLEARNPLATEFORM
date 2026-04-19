import { config } from "../config/env";

export interface QuizCoachQuestionInput {
    question: string;
    options: string[];
    selectedIndex: number;
    correctIndex: number;
}

export interface QuizCoachRequest {
    formationTitle?: string;
    sessionTitle?: string;
    score: number;
    requiredScore: number;
    attemptCount: number;
    questions: QuizCoachQuestionInput[];
}

export interface QuizCoachResponse {
    coachName: string;
    message: string;
    usedAI: boolean;
}

export class QuizCoachService {
    private static readonly COACH_NAME = "Professeur Awa";

    async generateFeedback(payload: QuizCoachRequest): Promise<QuizCoachResponse> {
        if (config.OPENAI_API_KEY && config.OPENAI_MODEL) {
            try {
                const message = await this.generateWithOpenAI(payload);
                return {
                    coachName: QuizCoachService.COACH_NAME,
                    message,
                    usedAI: true
                };
            } catch (error) {
                console.error("Erreur generation coach IA, fallback active:", error);
            }
        }

        return {
            coachName: QuizCoachService.COACH_NAME,
            message: this.generateFallbackFeedback(payload),
            usedAI: false
        };
    }

    private async generateWithOpenAI(payload: QuizCoachRequest): Promise<string> {
        const wrongQuestions = payload.questions.filter(
            (question) => question.selectedIndex !== question.correctIndex
        );

        const prompt = [
            "Tu es un professeur bienveillant qui accompagne un apprenant en difficulte sur un quiz.",
            "Parle uniquement en francais, avec un ton clair, encourageant et pedagogique.",
            "Tu dois agir comme un vrai professeur, pas comme un chatbot technique.",
            "Ne donne pas une simple liste de bonnes reponses et ne revele pas les lettres exactes des reponses.",
            "Tu dois obligatoirement fournir une vraie explication des erreurs et une aide a la comprehension.",
            "Explique les notions mal comprises, les confusions probables, les points a reviser et la logique correcte a retenir.",
            "Pour chaque erreur importante, dis pourquoi la reponse choisie est trompeuse et quelle idee de cours il fallait mobiliser.",
            "Ajoute ensuite une aide a la comprehension avec une reformulation simple, une mini-methode ou un exemple tres court.",
            "Termine en invitant l'apprenant a retenter le quiz de cette session.",
            "",
            `Nom du professeur IA: ${QuizCoachService.COACH_NAME}`,
            `Formation: ${payload.formationTitle || "Formation"}`,
            `Session: ${payload.sessionTitle || "Session actuelle"}`,
            `Tentative echouee numero: ${payload.attemptCount}`,
            `Score obtenu: ${payload.score}%`,
            `Score requis: ${payload.requiredScore}%`,
            "",
            "Questions mal reussies:",
            JSON.stringify(
                wrongQuestions.map((question) => ({
                    question: question.question,
                    reponseChoisie: question.options[question.selectedIndex] || null,
                    bonneReponse: question.options[question.correctIndex] || null
                })),
                null,
                2
            ),
            "",
            "Structure attendue en markdown:",
            "1. Une courte introduction adressee a l'apprenant.",
            "2. Une section 'Explication des erreurs'.",
            "3. Une section 'Aide a la comprehension'.",
            "4. Une section 'Ce que tu dois retenir'.",
            "5. Une section 'Comment reussir au prochain essai'.",
            "6. Une phrase finale motivante pour retenter le quiz."
        ].join("\n");

        const response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${config.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: config.OPENAI_MODEL,
                input: prompt
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
        }

        const data = await response.json() as { output_text?: string };
        const message = data.output_text?.trim();

        if (!message) {
            throw new Error("Aucune reponse exploitable renvoyee par l'API OpenAI.");
        }

        return message;
    }

    private generateFallbackFeedback(payload: QuizCoachRequest): string {
        const wrongQuestions = payload.questions.filter(
            (question) => question.selectedIndex !== question.correctIndex
        );

        const focusPoints = wrongQuestions.slice(0, 3).map((question) => {
            const selected = question.options[question.selectedIndex];
            return `- Sur **${question.question}**, ta reponse montre une confusion autour de **${selected || "la notion evaluee"}**. Reprends l'idee principale du cours et cherche la regle ou l'exemple qui justifie la bonne logique.`;
        }).join("\n");

        return [
            `Je suis **${QuizCoachService.COACH_NAME}** et je vais t'aider a mieux comprendre cette session avant un nouveau passage du quiz.`,
            "",
            "### Explication des erreurs",
            focusPoints || "- Certaines reponses montrent surtout un manque de clarte sur les notions principales de cette session.",
            "",
            "### Aide a la comprehension",
            "- Repars de la notion centrale demandee par la question avant de regarder les propositions.",
            "- Demande-toi toujours quelle regle, definition ou exemple du cours permet de justifier la bonne logique.",
            "- Si deux reponses te paraissent proches, compare leur sens exact au lieu de choisir la plus familiere.",
            "",
            "### Ce que tu dois retenir",
            `Tu viens d'echouer a la tentative ${payload.attemptCount} avec **${payload.score}%**. L'objectif est d'atteindre **${payload.requiredScore}%**. Ce n'est pas un blocage definitif: cela montre surtout qu'il faut consolider quelques notions clefs de la session **${payload.sessionTitle || "actuelle"}**.`,
            "",
            "### Comment reussir au prochain essai",
            "- Relis le contenu de la session en cherchant les definitions, regles et exemples concrets.",
            "- Reformule chaque notion avec tes propres mots avant de retenter.",
            "- Quand une question se ressemble a une autre, compare les concepts au lieu de repondre trop vite.",
            "",
            "Tu peux maintenant reprendre calmement la session, puis **retenter le quiz de cette session**. Je sais que tu peux le valider."
        ].join("\n");
    }
}
