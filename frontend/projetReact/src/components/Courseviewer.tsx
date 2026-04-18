import React, { useState, useEffect } from "react";
import { apiQuiz } from '../api/apiQuiz';
import { apiCertif } from '../api/apiCertif';
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  ChevronLeft,ChevronRight,PlayCircle,FileText,ClipboardList,CheckCircle,Lock,BookOpen,Video,Clock,Trophy} from "lucide-react";

interface VideoContentProps { content: { videoUrl: string; description?: string; body?: string }; title: string; onContentViewed?: () => void; }
interface PdfContentProps { content: { pdfUrl: string; description?: string; body?: string }; title: string; onContentViewed?: () => void; }
interface QuizQuestion { id: number; question: string; options: string[]; correct: number; }
interface QuizContentProps { content: { questions: QuizQuestion[] }; onSuccess?: () => void; }

interface FinalQuizResponse {
  data?: {
    questions?: Record<string, unknown>[];
  };
  questions?: Record<string, unknown>[];
}

interface SessionProgress {
  currentChapterIndex: number;
  chaptersCompleted: boolean[];
  quizPassed: boolean;
  quizScore: number | null;
}

interface FinalQuizState {
  showFinalQuiz: boolean;
  passed: boolean;
  score: number | null;
  average: number;
  allPassed: boolean;
  certificationIssued?: boolean;
  certificationError?: string | null;
}

interface ChapitreContent {
  body?: string;
  videoUrl?: string;
  pdfUrl?: string;
  description?: string;
}

interface Chapitre {
  id: number;
  title: string;
  type: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  content: ChapitreContent;
  titre?: string;
  typeContenu?: string;
  duree?: string;
  contenu?: string;
  videoUrl?: string;
  pdfUrl?: string;
}

interface Session {
  id: number;
  title: string;
  type: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  content: { body?: string; breadcrumb?: string[] };
  chapitres?: Chapitre[];
  quiz?: unknown;
  titre?: string;
  duree?: string;
  contenu?: string;
}

interface FormationData {
  id: number;
  title: string;
  description: string;
  progress: number;
  sessions: Session[];
  professor: {
    name: string;
    role: string;
    specialty: string;
    avatar: string;
    verified: boolean;
  };
}

function isAnswerMarkedCorrect(value: unknown): boolean {
  return value === true || value === 1 || value === "1" || value === "true";
}

function getCorrectAnswerIndex(reponses: unknown[]): number {
  const correctIndex = reponses.findIndex((r: unknown) => {
    const reponse = r as Record<string, unknown>;
    return isAnswerMarkedCorrect(reponse.estCorrecte);
  });

  return correctIndex >= 0 ? correctIndex : 0;
}

function normalizeQuizQuestions(rawQuestions: unknown[] = []): QuizQuestion[] {
  return rawQuestions.map((q: unknown, idx: number) => {
    const question = q as Record<string, unknown>;
    const reponses = (question.reponses as Record<string, unknown>[]) || [];
    return {
      id: Number(question.id) || (idx + 1),
      question: String(question.question || question.contenu || ''),
      options: (question.options as string[]) || reponses.map((r: Record<string, unknown>) => String(r.contenu || '')),
      correct: Number(question.correct) >= 0
        ? Number(question.correct)
        : getCorrectAnswerIndex(reponses)
    };
  });
}

function buildQuizResultsStorageKey(userId: number | undefined, formationId: number): string {
  return `quiz-results:${userId || "anonymous"}:${formationId}`;
}

function computeFormationProgress(
  sessions: Session[],
  progress: Record<number, SessionProgress>
): number {
  const totalChapters = sessions.reduce((sum, session) => sum + (session.chapitres?.length || 0), 0);
  const totalQuizSessions = sessions.filter((session) => !!session.quiz).length;
  const totalSteps = totalChapters + totalQuizSessions;

  if (totalSteps === 0) {
    return 0;
  }

  const completedChapters = sessions.reduce((sum, session) => {
    const sessionState = progress[session.id];
    const completedCount = sessionState?.chaptersCompleted?.filter(Boolean).length || 0;
    return sum + completedCount;
  }, 0);

  const passedQuizCount = sessions.reduce((sum, session) => {
    if (!session.quiz) return sum;
    return sum + (progress[session.id]?.quizPassed ? 1 : 0);
  }, 0);

  return Math.round(((completedChapters + passedQuizCount) / totalSteps) * 100);
}

function isSessionFullyCompleted(session: Session, progress: SessionProgress | undefined): boolean {
  const totalChapters = session.chapitres?.length || 0;
  const completedChapters = progress?.chaptersCompleted?.filter(Boolean).length || 0;
  const chaptersDone = totalChapters === 0 || completedChapters >= totalChapters;
  const quizDone = !session.quiz || !!progress?.quizPassed;

  return chaptersDone && quizDone;
}

const mockFormation = {
  id: 1,
  title: "Développement Web Complet",
  professor: { name: "Khadidiatou Fall", role: "PROFESSEUR", specialty: "Développement Web", avatar: "https://i.pravatar.cc/80?img=47", verified: true },
  description: "Maîtrisez le développement web moderne avec HTML, CSS, JavaScript et React.",
  progress: 15,
  sessions: [
    { id: 1, title: "Advanced CSS Layouts: Flexbox and Grid", type: "article", duration: "30 min", completed: true, locked: false,
      content: { breadcrumb: ["Home", "Development", "Modern CSS", "Session 1"], body: `
## H2 Flexbox-Code Properties

- **Display flex** : permet de créer des mises en page CSS flexibles, alignement et conteneurs adaptatifs.
- **Display-container** : définit les propriétés et organise proprement les éléments dans un conteneur.
- **justify-content: space-between; align-items: center** : centre les éléments et distribue l'espace entre eux.

## Flexbox Container Properties

Par exemple, le code suivant utilise 2 conteneurs flexbox pour définir l'identité visuelle selon la taille :

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## Grid Layout

CSS Grid est un système de mise en page bidimensionnel puissant.

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
\`\`\`` } },
    { id: 2, title: "Building a Responsive Navbar", type: "video", duration: "45 min", completed: false, locked: false,
      content: { videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Construisez une barre de navigation responsive étape par étape avec CSS Flexbox et les media queries." } },
    { id: 3, title: "Quiz: Modern CSS", type: "quiz", duration: "10 Questions", completed: false, locked: false,
      content: { questions: [
        { id: 1, question: "Quelle propriété CSS crée un layout flex ?", options: ["display: block", "display: flex", "display: grid", "display: inline"], correct: 1 },
        { id: 2, question: "Quelle valeur centre les éléments horizontalement ?", options: ["flex-start", "flex-end", "center", "space-between"], correct: 2 },
        { id: 3, question: "Comment définir 3 colonnes égales avec CSS Grid ?", options: ["grid-columns: 3", "grid-template-columns: repeat(3, 1fr)", "columns: 3", "grid: 3-cols"], correct: 1 },
      ]}},
    { id: 4, title: "State Management (PDF)", type: "pdf", duration: "1h", completed: false, locked: true,
      content: { pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/css/C12", description: "Document PDF sur la gestion d'état dans les applications modernes." } },
  ]
};

function SessionIcon({ type, size = 20 }: { type: string; size?: number }) {
  const props = { size, strokeWidth: 1.8 };
  if (type === "video") return <Video {...props} className="text-purple-500" />;
  if (type === "article") return <FileText {...props} className="text-purple-500" />;
  if (type === "quiz") return <ClipboardList {...props} className="text-orange-500" />;
  if (type === "pdf") return <BookOpen {...props} className="text-red-400" />;
  return <FileText {...props} />;
}

function typeBadge(type: string): string {
  const map: Record<string, string> = {
    video: "bg-purple-50 text-purple-600 border-purple-100",
    article: "bg-purple-50 text-purple-600 border-purple-100",
    quiz: "bg-orange-50 text-orange-600 border-orange-100",
    pdf: "bg-red-50 text-red-500 border-red-100",
  };
  return map[type] || "bg-gray-50 text-gray-500 border-gray-100";
}

function ArticleContent({ content, title, onContentViewed }: { content: { body: string; breadcrumb?: string[] }; title: string; onContentViewed?: () => void }) {
  useEffect(() => {
    if (onContentViewed) onContentViewed();
  }, [onContentViewed]);

  const renderMarkdown = (text: string) => {
    const lines = text.trim().split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith("## ")) {
        elements.push(<h2 key={i} className="text-xl font-bold text-gray-800 mt-6 mb-3">{line.slice(3)}</h2>);
      } else if (line.startsWith("```")) {
        const lang = line.slice(3); i++;
        let code = "";
        while (i < lines.length && !lines[i].startsWith("```")) { code += lines[i] + "\n"; i++; }
        elements.push(<pre key={i} className="bg-gray-900 text-green-300 rounded-xl p-5 text-sm font-mono overflow-x-auto my-4 border border-gray-700"><code className={lang ? `language-${lang}` : undefined}>{code.trim()}</code></pre>);
      } else if (line.startsWith("- ")) {
        const items: React.ReactNode[] = [];
        while (i < lines.length && lines[i].startsWith("- ")) {
          const raw = lines[i].slice(2);
          const parts = raw.split(/(\*\*[^*]+\*\*)/g);
          items.push(<li key={i} className="text-gray-700 leading-relaxed mb-1">{parts.map((p: string, pi: number) => p.startsWith("**") ? <strong key={pi} className="text-gray-900 font-semibold">{p.slice(2, -2)}</strong> : p)}</li>);
          i++;
        }
        elements.push(<ul key={`ul-${i}`} className="list-disc list-inside space-y-1 my-3 ml-2">{items}</ul>);
        continue;
      } else if (line.trim()) {
        elements.push(<p key={i} className="text-gray-700 leading-relaxed mb-2">{line}</p>);
      }
      i++;
    }
    return elements;
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
      <div className="prose prose-sm max-w-none">{renderMarkdown(content.body)}</div>
    </div>
  );
}

function VideoContent({ content, title, onContentViewed }: VideoContentProps) {
  const videoContent = content as { videoUrl?: string; description?: string; body?: string };
  const markdownContent = videoContent.body || videoContent.description || '';

  useEffect(() => {
    if (onContentViewed) onContentViewed();
  }, [onContentViewed]);

  return (
    <div className="w-full">
      <div className="rounded-2xl overflow-hidden shadow-lg bg-black aspect-video mb-6">
        <iframe src={videoContent.videoUrl} title={title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
      {markdownContent && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><PlayCircle size={18} className="text-blue-500" /> Contenu du chapitre</h2>
          <div className="prose prose-sm max-w-none text-gray-600">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

function PdfContent({ content, title, onContentViewed }: PdfContentProps) {
  const pdfContent = content as { pdfUrl?: string; description?: string; body?: string };

  useEffect(() => {
    if (onContentViewed) onContentViewed();
  }, [onContentViewed]);

  const markdownContent = pdfContent.body || pdfContent.description || '';

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-4 border border-red-100"><BookOpen size={36} className="text-red-400" /></div>
      <h2 className="text-lg font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 text-sm text-center mb-6 max-w-sm">{pdfContent.description}</p>
      <a href={pdfContent.pdfUrl} target="_blank" rel="noreferrer" className="px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors shadow-sm flex items-center gap-2">
        <BookOpen size={16} /> Ouvrir le PDF
      </a>
      {markdownContent && (
        <div className="mt-8 w-full max-w-2xl bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Contenu du chapitre</h3>
          <div className="prose prose-sm max-w-none text-gray-600">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

function QuizContent({ content, onSuccess }: QuizContentProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = submitted ? content.questions.filter((q) => answers[q.id] === q.correct).length : 0;
  const totalQuestions = content.questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 60;

  const handleContinue = () => {
    if (passed && onSuccess) {
      onSuccess();
    } else {
      setAnswers({});
      setSubmitted(false);
    }
  };

  return (
    <div className="w-full max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-50 rounded-xl border border-orange-100"><ClipboardList size={22} className="text-orange-500" /></div>
        <div><h2 className="font-bold text-gray-900">Quiz</h2><p className="text-sm text-gray-400">{content.questions.length} questions</p></div>
      </div>
      {submitted ? (
        <div className="relative">
          <div className={`mb-6 p-4 rounded-xl border-l-4 ${passed ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
                {passed ? <CheckCircle size={24} className="text-green-600" /> : <Lock size={24} className="text-red-600" />}
              </div>
              <div>
                <p className={`font-bold text-lg ${passed ? 'text-green-800' : 'text-red-800'}`}>
                  {passed ? '🎉 Félicitations !' : '❌ Échoué'}
                </p>
                <p className={`text-sm ${passed ? 'text-green-700' : 'text-red-700'}`}>
                  {passed
                    ? `Vous avez obtenu ${percentage}% - Vous passez à la suite !`
                    : `Vous avez obtenu ${percentage}%. Vous avez besoin de 60% pour continuer. Réessayez !`
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="text-center py-6 bg-white rounded-2xl border border-gray-100 shadow-sm mb-4">
            <p className="text-3xl font-bold text-gray-900">{score}/{totalQuestions}</p>
            <p className="text-gray-500 mt-1">bonnes réponses</p>
          </div>
          <button onClick={handleContinue} className={`w-full py-3 text-white rounded-xl font-semibold transition-colors shadow-sm ${passed ? 'bg-purple-500 hover:bg-purple-600' : 'bg-orange-500 hover:bg-orange-600'}`}>
            {passed ? 'Passer à la session suivante' : 'Réessayer le quiz'}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {content.questions.map((q: QuizQuestion) => (
            <div key={q.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <p className="font-semibold text-gray-800 mb-4 text-sm">{q.id}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt: string, idx: number) => (
                  <button key={idx} onClick={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${answers[q.id] === idx ? "border-orange-400 bg-orange-50 text-orange-700 font-medium" : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}>
                    <span className="mr-2 font-semibold text-gray-400">{String.fromCharCode(65 + idx)}.</span>{opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < content.questions.length}
            className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
            Soumettre (60% requis)
          </button>
        </div>
      )}
    </div>
  );
}

interface QuizWrapperProps {
  content: { questions: QuizQuestion[] };
  onSubmit: (score: number) => void;
  onSuccess?: (score: number) => void;
  requiredScore?: number;
  variant?: "session" | "final";
}

function QuizWrapper({ content, onSubmit, onSuccess, requiredScore = 60, variant = "session" }: QuizWrapperProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const computedCorrectCount = content.questions.filter((q) => answers[q.id] === q.correct).length;
  const correctCount = submitted ? computedCorrectCount : 0;
  const totalQuestions = content.questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = percentage >= requiredScore;
  const isFinalQuiz = variant === "final";
  const accentClasses = isFinalQuiz
    ? {
        selected: "border-purple-400 bg-purple-50 text-purple-700 font-medium",
        idle: "border-gray-200 text-gray-600 hover:border-purple-200 hover:bg-purple-50/60",
        submit: "bg-purple-600 hover:bg-purple-700",
        successButton: "bg-purple-600 hover:bg-purple-700",
        retryButton: "bg-purple-500 hover:bg-purple-600"
      }
    : {
        selected: "border-orange-400 bg-orange-50 text-orange-700 font-medium",
        idle: "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50",
        submit: "bg-orange-500 hover:bg-orange-600",
        successButton: "bg-purple-500 hover:bg-purple-600",
        retryButton: "bg-orange-500 hover:bg-orange-600"
      };

  const handleSubmit = () => {
    const nextPercentage = Math.round((computedCorrectCount / totalQuestions) * 100);
    setSubmitted(true);
    onSubmit(nextPercentage);
  };

  if (submitted) {
    return (
      <div className="relative">
        <div className={`mb-6 p-4 rounded-xl border-l-4 ${passed ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
              {passed ? <CheckCircle size={24} className="text-green-600" /> : <Lock size={24} className="text-red-600" />}
            </div>
            <div>
              <p className={`font-bold text-lg ${passed ? 'text-green-800' : 'text-red-800'}`}>
                {passed ? '🎉 Félicitations !' : '❌ Échoué'}
              </p>
              <p className={`text-sm ${passed ? 'text-green-700' : 'text-red-700'}`}>
                {passed
                  ? `Vous avez obtenu ${percentage}% - Vous passez à la session suivante !`
                  : `Vous avez obtenu ${percentage}%. Vous avez besoin de ${requiredScore}% pour continuer. Réessayez !`
                }
              </p>
            </div>
          </div>
        </div>

        <div className="text-center py-6 bg-white rounded-2xl border border-gray-100 shadow-sm mb-4">
          <p className="text-3xl font-bold text-gray-900">{correctCount}/{totalQuestions}</p>
          <p className="text-gray-500 mt-1">bonnes réponses</p>
        </div>

        {passed ? (
          <button
            onClick={() => { if (onSuccess) onSuccess(percentage); }}
            className={`w-full py-3 text-white rounded-xl font-semibold transition-colors shadow-sm ${accentClasses.successButton}`}
          >
            {isFinalQuiz ? "Voir mes certificats" : "Passer à la session suivante"}
          </button>
        ) : (
          <button
            onClick={() => { setAnswers({}); setSubmitted(false); }}
            className={`w-full py-3 text-white rounded-xl font-semibold transition-colors shadow-sm ${accentClasses.retryButton}`}
          >
            Réessayer le quiz
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {content.questions.map((q: QuizQuestion) => (
        <div key={q.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="font-semibold text-gray-800 mb-4 text-sm">{q.id}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt: string, idx: number) => (
              <button key={idx} onClick={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${answers[q.id] === idx ? accentClasses.selected : accentClasses.idle}`}>
                <span className="mr-2 font-semibold text-gray-400">{String.fromCharCode(65 + idx)}.</span>{opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleSubmit} disabled={Object.keys(answers).length < totalQuestions}
        className={`w-full py-3 text-white rounded-xl font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm ${accentClasses.submit}`}>
        Soumettre ({requiredScore}% requis)
      </button>
    </div>
  );
}

interface CourseViewerProps {
  onBack: () => void;
  formationId?: number;
  onCertificationEarned?: () => void;
  onOpenCertificates?: () => void;
}

export default function CourseViewer({ onBack, formationId, onCertificationEarned, onOpenCertificates }: CourseViewerProps) {
  const location = useLocation();
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) as { id?: number } : null;

  const [formation, setFormation] = useState<FormationData>(mockFormation as unknown as FormationData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFormation = async () => {
      const formationID = formationId || location.state?.formationId;

      if (!formationID) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:4004/formations/${formationID}`);
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            const formationData = data.data;
            const professorData = formationData.professeur;
            const profName = professorData?.utilisateur
              ? `${professorData.utilisateur.nom} ${professorData.utilisateur.prenom}`
              : 'Professeur';
            const profSpecialty = professorData?.specialite || 'Formation';
            const profAvatar = 'https://i.pravatar.cc/80?img=47';
            const profVerified = true;

            if (!formationData.sessions || formationData.sessions.length === 0) {
              setFormation({
                id: formationData.id,
                title: formationData.titre,
                description: formationData.description,
                progress: 0,
                sessions: [],
                professor: { name: profName, role: 'PROFESSEUR', specialty: profSpecialty, avatar: profAvatar, verified: profVerified }
              });
            } else {
              const transformedSessions = (formationData.sessions || []).map((session: Record<string, unknown>, index: number) => {
                const chapitres = ((session.chapitres || []) as unknown as Chapitre[]).map((chapitre: Chapitre, chapIndex: number) => ({
                  id: Number(chapitre.id) || (index * 100 + chapIndex + 1),
                  title: String(chapitre.titre || ''),
                  type: String(chapitre.typeContenu || 'TEXTE').toLowerCase(),
                  typeContenu: String(chapitre.typeContenu || 'TEXTE'),
                  duration: String(chapitre.duree || '15 min'),
                  completed: false,
                  locked: chapIndex > 0,
                  content: {
                    body: String(chapitre.contenu || 'Contenu du chapitre...'),
                    videoUrl: chapitre.videoUrl || undefined,
                    pdfUrl: chapitre.pdfUrl || undefined,
                    description: String(chapitre.contenu || '')
                  },
                  titre: chapitre.titre,
                  duree: chapitre.duree,
                  contenu: chapitre.contenu,
                  videoUrl: chapitre.videoUrl,
                  pdfUrl: chapitre.pdfUrl
                }));

                const apiQuiz = session.quiz as Record<string, unknown> | undefined;
                const quiz = apiQuiz && apiQuiz.questions ? {
                  content: {
                    questions: ((apiQuiz.questions as unknown[]) || []).map((q: unknown) => {
                      const question = q as Record<string, unknown>;
                      const reponses = (question.reponses as unknown[]) || [];
                      return {
                        id: Number(question.id) || 1,
                        question: String(question.contenu || ''),
                        options: reponses.map((r: unknown, ri: number) => {
                          const reponse = r as Record<string, unknown>;
                          return String(reponse.contenu || `Option ${ri + 1}`);
                        }),
                        correct: getCorrectAnswerIndex(reponses)
                      };
                    })
                  }
                } : undefined;

                const premierChapitre = chapitres[0];
                const chapterType = premierChapitre?.typeContenu?.toLowerCase() || 'texte';
                const sessionType = chapterType === 'texte' ? 'article' : chapterType;

                let sessionContent: Record<string, unknown> = { body: String(session.contenu || '') };

                if (premierChapitre) {
                  if (sessionType === 'video' || premierChapitre.typeContenu === 'VIDEO') {
                    sessionContent = { videoUrl: premierChapitre.content.videoUrl, description: premierChapitre.content.description || premierChapitre.content.body, body: premierChapitre.content.body };
                  } else if (sessionType === 'pdf' || premierChapitre.typeContenu === 'PDF') {
                    sessionContent = { pdfUrl: premierChapitre.content.pdfUrl, description: premierChapitre.content.description || premierChapitre.content.body, body: premierChapitre.content.body };
                  } else {
                    sessionContent = { body: premierChapitre.content.body, description: premierChapitre.content.description };
                  }
                }

                if (quiz && quiz.content) {
                  const quizInner = quiz.content as Record<string, unknown>;
                  if (quizInner.questions) {
                    sessionContent = {
                      ...sessionContent,
                      quizQuestions: (quizInner.questions as Record<string, unknown>[]).map((q: Record<string, unknown>, qIdx: number) => ({
                        id: Number(q.id) || (qIdx + 1),
                        question: String(q.question || ''),
                        options: (q.options as string[]) || [],
                        correct: Number(q.correct) || 0
                      }))
                    };
                  }
                }

                return {
                  id: Number(session.id) || (index + 1),
                  title: String(session.titre || ''),
                  type: sessionType,
                  duration: String(session.duree || '30 min'),
                  completed: false,
                  locked: false,
                  content: sessionContent,
                  chapitres: chapitres,
                  quiz: quiz,
                  titre: session.titre,
                  duree: session.duree,
                  contenu: session.contenu
                };
              });

              setFormation({
                id: formationData.id,
                title: formationData.titre,
                description: formationData.description,
                progress: 0,
                sessions: transformedSessions,
                professor: { name: profName, role: 'PROFESSEUR', specialty: profSpecialty, avatar: profAvatar, verified: profVerified }
              });
            }
          }
        }
      } catch (error) {
        console.error('Erreur chargement formation:', error);
        setFormation(mockFormation as unknown as FormationData);
      } finally {
        setLoading(false);
      }
    };

    loadFormation();
  }, [formationId, location.state?.formationId]);

  const [activeSessionId, setActiveSessionId] = useState<number | undefined>(undefined);
  const [sessionProgress, setSessionProgress] = useState<Record<number, SessionProgress>>({});
  const [finalQuizState, setFinalQuizState] = useState<FinalQuizState>({ showFinalQuiz: false, passed: false, score: null, average: 0, allPassed: false, certificationIssued: false, certificationError: null });
  const [showSessionQuiz, setShowSessionQuiz] = useState(false);
  const [chapterContentViewed, setChapterContentViewed] = useState(false);
  const [showAverageWarning, setShowAverageWarning] = useState(false);
  const [finalQuizQuestions, setFinalQuizQuestions] = useState<QuizQuestion[]>([]);
  const [finalQuizSaving, setFinalQuizSaving] = useState(false);

  useEffect(() => {
    if (!formation.id) return;

    const storageKey = buildQuizResultsStorageKey(currentUser?.id, formation.id);
    const storedResults = localStorage.getItem(storageKey);
    if (!storedResults) return;

    try {
      const parsed = JSON.parse(storedResults) as {
        sessionProgress?: Record<number, SessionProgress>;
        finalQuiz?: Pick<FinalQuizState, "score" | "passed" | "certificationIssued">;
      };

      if (parsed.sessionProgress) {
        setSessionProgress(prev => ({ ...prev, ...parsed.sessionProgress }));
      }

      if (parsed.finalQuiz) {
        setFinalQuizState(prev => ({
          ...prev,
          score: parsed.finalQuiz?.score ?? prev.score,
          passed: parsed.finalQuiz?.passed ?? prev.passed,
          certificationIssued: parsed.finalQuiz?.certificationIssued ?? prev.certificationIssued
        }));
      }
    } catch (error) {
      console.error("Erreur lecture scores quiz localStorage:", error);
    }
  }, [formation.id, currentUser?.id]);

  useEffect(() => {
    if (!formation.id) return;

    const storageKey = buildQuizResultsStorageKey(currentUser?.id, formation.id);
    localStorage.setItem(storageKey, JSON.stringify({
      sessionProgress,
      finalQuiz: {
        score: finalQuizState.score,
        passed: finalQuizState.passed,
        certificationIssued: finalQuizState.certificationIssued
      }
    }));
  }, [sessionProgress, finalQuizState.score, finalQuizState.passed, finalQuizState.certificationIssued, formation.id, currentUser?.id]);

  useEffect(() => {
    if (!formation.sessions?.length) {
      return;
    }

    const nextProgress = computeFormationProgress(formation.sessions, sessionProgress);

    setFormation((prev: FormationData) => {
      const nextSessions = prev.sessions.map((session: Session) => ({
        ...session,
        completed: isSessionFullyCompleted(session, sessionProgress[session.id])
      }));

      const progressChanged = prev.progress !== nextProgress;
      const sessionsChanged = nextSessions.some((session, index) => session.completed !== prev.sessions[index]?.completed);

      if (!progressChanged && !sessionsChanged) {
        return prev;
      }

      return {
        ...prev,
        progress: nextProgress,
        sessions: nextSessions
      };
    });
  }, [formation.sessions, sessionProgress]);

  // ─────────────────────────────────────────────────────────────────────────
  // ✅ CORRECTION : isSessionAccessible
  // Vérifie que toutes les sessions précédentes ont leur quiz passé (si elles en ont un)
  // ─────────────────────────────────────────────────────────────────────────
  const isSessionAccessible = React.useCallback((index: number): boolean => {
    // Toujours autoriser l'accès aux sessions déjà terminées
    if (formation.sessions[index].completed) return true;
    
    if (index === 0) return true;

    for (let i = 0; i < index; i++) {
      const session = formation.sessions[i];
      const progress = sessionProgress[session.id];
      const hasQuiz = !!(session as unknown as { quiz?: unknown }).quiz;

      // Si la session a un quiz et qu'il n'est pas passé → bloquer les suivantes
      if (hasQuiz && !progress?.quizPassed) return false;
    }

    return true;
  }, [formation.sessions, sessionProgress]);

  const markCurrentChapterAsCompleted = (sessionId: number, chapterIndex: number) => {
    setSessionProgress(prev => {
      const currentSessionProgress = prev[sessionId];
      if (!currentSessionProgress || chapterIndex < 0 || chapterIndex >= currentSessionProgress.chaptersCompleted.length) {
        return prev;
      }

      if (currentSessionProgress.chaptersCompleted[chapterIndex]) {
        return prev;
      }

      const updatedChaptersCompleted = [...currentSessionProgress.chaptersCompleted];
      updatedChaptersCompleted[chapterIndex] = true;

      return {
        ...prev,
        [sessionId]: {
          ...currentSessionProgress,
          chaptersCompleted: updatedChaptersCompleted
        }
      };
    });
  };

  const handleNextChapter = () => {
    if (!activeSession) return;

    const chapitres = activeSession.chapitres;
    const currentProgress = sessionProgress[activeSession.id];

    if (chapitres && chapitres.length > 0) {
      const currentChapterIndex = currentProgress?.currentChapterIndex ?? 0;
      markCurrentChapterAsCompleted(activeSession.id, currentChapterIndex);

      if (currentChapterIndex < chapitres.length - 1) {
        setSessionProgress(prev => ({
          ...prev,
          [activeSession.id]: {
            ...prev[activeSession.id],
            currentChapterIndex: currentChapterIndex + 1,
            chaptersCompleted: prev[activeSession.id]?.chaptersCompleted?.map((completed, index) =>
              index === currentChapterIndex ? true : completed
            ) || []
          }
        }));
        setChapterContentViewed(false);
        return;
      }

      if (activeSession.quiz) {
        const quizData = activeSession.quiz as Record<string, unknown>;
        const quizContent = quizData.content as Record<string, unknown> | undefined;
        if (quizContent && quizContent.questions) {
          setShowSessionQuiz(true);
          setChapterContentViewed(false);
          return;
        }
      }
    } else {
      if (activeSession.quiz) {
        // ✅ Forcer l'affichage du quiz à la fin du chapitre
        setShowSessionQuiz(true);
        setChapterContentViewed(false);
        return;
      }
    }

    handleNextSession();
  };

  const calculateQuizAverage = (
    progressOverride?: Record<number, SessionProgress>
  ): { average: number; allPassed: boolean; failedSessions: number[] } => {
    const scores: number[] = [];
    const failedSessions: number[] = [];
    const progressSource = progressOverride || sessionProgress;

    formation.sessions.forEach((session: Session) => {
      const progress = progressSource[session.id];
      if (progress) {
        if (progress.quizScore !== null) {
          scores.push(progress.quizScore);
        }

        if (session.quiz && !progress.quizPassed) {
          // ✅ Toute session qui CONTIENT un quiz doit être réussie
          failedSessions.push(session.id);
        }
      }
    });

    // Compte seulement les sessions qui ont réellement un quiz
    const totalQuizSessions = formation.sessions.filter((s: Session) => s.quiz).length;
    const allPassed = failedSessions.length === 0 && totalQuizSessions > 0 && scores.length === totalQuizSessions;
    const average = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    return { average, allPassed, failedSessions };
  };

  const handleNextSession = (progressOverride?: Record<number, SessionProgress>) => {
    if (!activeSession) return;

    if (activeIndex < formation.sessions.length - 1) {
      setActiveSessionId(formation.sessions[activeIndex + 1].id);
    } else {
      const { average, allPassed } = calculateQuizAverage(progressOverride);
      
      // ✅ DEBUG : Afficher dans la console les valeurs exactes
      console.log("🔍 DEBUG CALCUL MOYENNE :");
      console.log("   ✅ Moyenne calculée :", average, "%");
      console.log("   ✅ Tous les quiz sont passés :", allPassed);
      console.log("   ✅ Etat complet sessionProgress :", progressOverride || sessionProgress);
      console.log("   ✅ Nombre de sessions dans la formation :", formation.sessions.length);

      if (allPassed && average >= 60) {
        // Charger les vraies questions du quiz final depuis la base de données
        apiQuiz.getFinalQuiz(formation.id)
          .then((quizData: FinalQuizResponse) => {
            const normalizedQuestions = normalizeQuizQuestions(
              quizData?.data?.questions || quizData?.questions || []
            );
            setFinalQuizQuestions(normalizedQuestions);
            setFinalQuizState({ showFinalQuiz: true, passed: false, score: null, average, allPassed: true, certificationIssued: false, certificationError: null });
          })
          .catch(() => {
            // Fallback sur le mock si l'API échoue
            setFinalQuizQuestions([{ id: 1, question: "Quiz final - À 100% vous pouvez obtenir votre certificat", options: ["Commencer le quiz final"], correct: 0 }]);
            setFinalQuizState({ showFinalQuiz: true, passed: false, score: null, average, allPassed: true, certificationIssued: false, certificationError: null });
          });
      } else {
        setShowAverageWarning(true);
      }
    }
  };

  const handleSessionQuizSubmit = (score: number) => {
    if (!activeSession) return;
    const sessionId = activeSession.id;
    const passed = score >= 60;

    setSessionProgress((prev: Record<number, SessionProgress>) => ({
      ...prev,
      [sessionId]: { ...prev[sessionId], quizPassed: passed, quizScore: score }
    }));
  };

  const createLocalCertificationFallback = () => {
    const storedCertifications = JSON.parse(localStorage.getItem("certifications") || "[]") as Record<string, unknown>[];
    const alreadyExists = storedCertifications.some((cert) => Number(cert.formationId) === formation.id);
    if (alreadyExists) return;

    const nextCertification = {
      id: Date.now(),
      apprenantId: currentUser?.id || 0,
      formationId: formation.id,
      dateObtention: new Date().toISOString(),
      formation: {
        titre: formation.title,
        professorName: formation.professor.name
      }
    };

    localStorage.setItem("certifications", JSON.stringify([nextCertification, ...storedCertifications]));
  };

  const handleFinalQuizSubmit = async (score: number) => {
    const passed = score >= 70;
    setFinalQuizState(prev => ({
      ...prev,
      showFinalQuiz: true,
      passed,
      score,
      certificationIssued: false,
      certificationError: null
    }));

    if (!passed) {
      return;
    }

    try {
      setFinalQuizSaving(true);
      await apiCertif.createCertification({ formationId: formation.id });
      createLocalCertificationFallback();
      setFinalQuizState(prev => ({
        ...prev,
        certificationIssued: true,
        certificationError: null
      }));
      onCertificationEarned?.();
    } catch (error) {
      console.error("Erreur création certification:", error);
      createLocalCertificationFallback();
      setFinalQuizState(prev => ({
        ...prev,
        certificationIssued: true,
        certificationError: "Certification enregistrée localement. Vérifie la synchronisation serveur."
      }));
      onCertificationEarned?.();
    } finally {
      setFinalQuizSaving(false);
    }
  };

  useEffect(() => {
    if (!loading && formation.sessions && formation.sessions.length > 0) {
      setSessionProgress(prevProgress => {
        const initialProgress: Record<number, SessionProgress> = { ...prevProgress };
        let hasChanges = false;
        
        formation.sessions.forEach((session: Session) => {
          // Ne JAMAIS écraser une progression déjà existante
          if (!initialProgress[session.id]) {
            const sessionData = session as unknown as { chapitres?: Chapitre[]; quiz?: unknown };
            const chapters = sessionData.chapitres || [];
            initialProgress[session.id] = {
              currentChapterIndex: 0,
              chaptersCompleted: new Array(chapters.length).fill(false),
              quizPassed: false,
              quizScore: null
            };
            hasChanges = true;
          }
        });
        
        // Ne pas déclencher de rerendu si rien n'a changé
        return hasChanges ? initialProgress : prevProgress;
      });
    }
  }, [loading, formation.id]); // ✅ Plus de dépendance sur formation.sessions !

  useEffect(() => {
    if (!loading && formation.sessions && formation.sessions.length > 0 && activeSessionId === undefined) {
      const firstUnlockedSession = formation.sessions.find((s: Session) => !s.locked);
      if (firstUnlockedSession) setActiveSessionId(firstUnlockedSession.id);
    }
  }, [loading, formation.sessions, activeSessionId]);

  useEffect(() => {
    setChapterContentViewed(false);
    setShowSessionQuiz(false);
  }, [activeSessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!formation.sessions || formation.sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <BookOpen size={60} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Aucun contenu disponible</h2>
        <p className="text-gray-400 mb-6">Le contenu de cette formation est en cours de préparation.</p>
        <button onClick={onBack} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Retour aux formations</button>
      </div>
    );
  }

  const activeSession = formation.sessions.find((s: { id: number }) => s.id === activeSessionId);
  const activeIndex = formation.sessions.findIndex((s: { id: number }) => s.id === activeSessionId);

  const renderSessionContent = () => {
    const allChaptersCompleted = activeSession?.chapitres
      ? activeSession.chapitres.length === 0 || !!sessionProgress[activeSession.id]?.chaptersCompleted?.every((c: boolean) => c)
      : false;

    if (showSessionQuiz && activeSession?.quiz && allChaptersCompleted) {
      const quizContent = activeSession.quiz as Record<string, unknown>;
      const quizInner = quizContent.content as Record<string, unknown> | undefined;
      if (quizInner && quizInner.questions) {
        const questions = normalizeQuizQuestions(quizInner.questions as Record<string, unknown>[]);
        return (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-50 rounded-lg">
                <ClipboardList size={24} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Quiz de la session</h2>
                <p className="text-sm text-gray-500">Répondez correctement à 60% des questions pour continuer</p>
              </div>
            </div>
            <QuizWrapper
              content={{ questions }}
              onSubmit={handleSessionQuizSubmit}
              onSuccess={(score) => {
                const nextProgress = {
                  ...sessionProgress,
                  [activeSession.id]: {
                    ...sessionProgress[activeSession.id],
                    quizPassed: score >= 60,
                    quizScore: score
                  }
                };
                setShowSessionQuiz(false);
                handleNextSession(nextProgress);
              }}
              requiredScore={60}
            />
          </div>
        );
      }
    }

    if (finalQuizState.showFinalQuiz) {
      return (
        <div className="bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 rounded-xl border border-purple-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg border border-purple-200">
              <Trophy size={24} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-purple-900">Quiz Final - Certification</h2>
              <p className="text-sm text-purple-700">Le système corrige automatiquement votre copie. Obtenez au moins 70% pour recevoir votre certificat.</p>
            </div>
          </div>
          {finalQuizState.score !== null && (
            <div className={`mb-5 rounded-xl border p-4 ${finalQuizState.passed ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
              <p className={`text-sm font-semibold ${finalQuizState.passed ? "text-emerald-800" : "text-red-800"}`}>
                {finalQuizState.passed
                  ? `Quiz final réussi avec ${finalQuizState.score}%.`
                  : `Quiz final échoué avec ${finalQuizState.score}%. Vous pouvez le repasser.`}
              </p>
              {finalQuizState.passed && (
                <p className="mt-1 text-sm text-emerald-700">
                  {finalQuizSaving
                    ? "Création du certificat en cours..."
                    : finalQuizState.certificationIssued
                    ? "Votre certification est disponible dans Mes Certificats."
                    : "Résultat validé. Enregistrement du certificat en cours."}
                </p>
              )}
              {finalQuizState.certificationError && (
                <p className="mt-1 text-sm text-amber-700">{finalQuizState.certificationError}</p>
              )}
            </div>
          )}
          {finalQuizQuestions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-purple-200 bg-white/80 p-6 text-center">
              <p className="text-sm font-medium text-purple-800">Les questions du quiz final sont introuvables pour cette formation.</p>
              <p className="mt-2 text-sm text-purple-600">Vérifie que le quiz final existe bien en base avec ses questions et réponses.</p>
            </div>
          ) : (
          <QuizWrapper
            content={{ questions: finalQuizQuestions }}
            onSubmit={handleFinalQuizSubmit}
            onSuccess={() => onOpenCertificates?.()}
            requiredScore={70}
            variant="final"
          />
          )}
        </div>
      );
    }

    const getCurrentChapterInfo = () => {
      if (showSessionQuiz && activeSession?.quiz) {
        const quizData = activeSession.quiz as Record<string, unknown>;
        const quizContent = quizData.content as Record<string, unknown> | undefined;
        if (quizContent && quizContent.questions) {
          return { content: quizContent, type: 'quiz' as string };
        }
      }

      if (activeSession?.content && (activeSession.content as Record<string, unknown>).questions) {
        return { content: activeSession.content, type: 'quiz' as string };
      }

      if (!activeSession?.chapitres || activeSession.chapitres.length === 0) {
        return { content: activeSession?.content, type: activeSession?.type };
      }

      const currentProgress = sessionProgress[activeSession.id];
      const chapterIndex = currentProgress?.currentChapterIndex ?? 0;
      const currentChapter = activeSession.chapitres[chapterIndex];
      if (currentChapter) {
        return { content: currentChapter.content, type: currentChapter.type };
      }
      return { content: activeSession.content, type: activeSession.type };
    };

    const { content: currentContent, type: currentType } = getCurrentChapterInfo();

    if (!activeSession) return null;
    if (activeSession.locked)
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Lock size={40} className="text-gray-300 mb-4" />
          <p className="font-semibold text-gray-500">Session verrouillée</p>
          <p className="text-sm text-gray-400 mt-1">Terminez les sessions précédentes pour débloquer.</p>
        </div>
      );

    switch (currentType) {
      case "article": return <ArticleContent content={currentContent as { body: string; breadcrumb?: string[] }} title={activeSession.title} onContentViewed={() => setChapterContentViewed(true)} />;
      case "video": return <VideoContent content={currentContent as { videoUrl: string; description: string }} title={activeSession.title} onContentViewed={() => setChapterContentViewed(true)} />;
      case "pdf": return <PdfContent content={currentContent as { pdfUrl: string; description: string }} title={activeSession.title} onContentViewed={() => setChapterContentViewed(true)} />;
      case "quiz": return <QuizContent content={currentContent as { questions: QuizQuestion[] }} onSuccess={handleNextSession} />;
      default: return <ArticleContent content={currentContent as { body: string; breadcrumb?: string[] }} title={activeSession.title} onContentViewed={() => setChapterContentViewed(true)} />;
    }
  };

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden" style={{ marginTop: '70px' }}>

      {/* ── Contenu principal ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-18 w-full">

          {/* Bouton Retour */}
          <div className="mb-4">
            <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <ChevronLeft size={16} />
              Retour aux formations
            </button>
          </div>

          {/* Breadcrumb */}
          {activeSession?.type === "article" && (activeSession.content as { breadcrumb?: string[] }).breadcrumb && (
            <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
              {(activeSession.content as { breadcrumb: string[] }).breadcrumb.map((crumb: string, i: number, arr: string[]) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span className={i === arr.length - 1 ? "text-gray-700 font-semibold" : "hover:text-gray-600 cursor-pointer"}>{crumb}</span>
                  {i < arr.length - 1 && <ChevronRight size={12} className="text-gray-300" />}
                </span>
              ))}
            </nav>
          )}

          {renderSessionContent()}

          {/* Navigation prev/next */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
            <button
              onClick={() => activeIndex > 0 && setActiveSessionId(formation.sessions[activeIndex - 1].id)}
              disabled={activeIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} /> Précédent
            </button>
            <span className="text-xs text-gray-400">{activeIndex + 1} / {formation.sessions.length}</span>
            <button
              onClick={handleNextChapter}
              disabled={
                showSessionQuiz
                || (!chapterContentViewed && !showSessionQuiz)
                || (activeIndex === formation.sessions.length - 1 && !activeSession?.quiz && (!activeSession?.chapitres || activeSession.chapitres.length === 0))
              }
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-xl hover:bg-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title={!chapterContentViewed && !showSessionQuiz ? "Vous devez d'abord lire le contenu du chapitre" : ""}
            >
              {!chapterContentViewed && !showSessionQuiz ? "Étudier d'abord" : "Suivant"} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </main>

      {/* ── Sidebar sessions ── */}
      <aside className="w-1/5 shrink-0 bg-white border-l border-gray-100 flex flex-col overflow-y-auto md:flex">

        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-800 text-sm leading-snug w-full">{formation.title}</h2>
        </div>

        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <img src={formation.professor.avatar} alt="" className="w-11 h-11 rounded-full object-cover border-2 border-purple-100 shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-900 text-sm truncate">{formation.professor.name}</span>
                {formation.professor.verified && <CheckCircle size={13} className="text-purple-500 shrink-0" />}
              </div>
              <p className="text-xs text-gray-400">{formation.professor.role}</p>
              <p className="text-xs text-gray-500 mt-0.5">Spécialité: {formation.professor.specialty}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>Progression</span>
              <span className="font-semibold text-purple-600">{formation.progress}% Completed</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${formation.progress}%` }} />
            </div>
          </div>
        </div>

        <div className="p-3 flex-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Sessions de la formation</p>
          <div className="space-y-1.5">
            {/* ✅ CORRECTION : utilisation de isSessionAccessible(index) au lieu de session.locked */}
            {formation.sessions.map((session: { id: number; title: string; type: string; duration: string; completed: boolean; locked: boolean }, index: number) => {
              const accessible = isSessionAccessible(index);
              return (
                <button
                  key={session.id}
                  onClick={() => accessible && setActiveSessionId(session.id)}
                  className={`w-full text-left px-3 py-3 rounded-xl transition-all ${
                    activeSessionId === session.id
                      ? "bg-purple-50 border border-purple-200"
                      : !accessible
                      ? "opacity-50 cursor-not-allowed border border-transparent"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${typeBadge(session.type)} border`}>
                      <SessionIcon type={session.type} size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-medium leading-snug ${activeSessionId === session.id ? "text-purple-700" : "text-gray-700"}`}>
                        {session.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock size={10} className="text-gray-300" />
                        <span className="text-[10px] text-gray-400">{session.duration}</span>
                      </div>
                    </div>
                   <div className="shrink-0 mt-0.5">
                      {/* 👉 PRIORITE ABSOLUE A LA VALIDATION */}
                      {session.completed ? (
                        <CheckCircle size={13} className="text-purple-500" />
                      ) : !accessible ? (
                        <Lock size={12} className="text-gray-300" />
                      ) : null}
                    </div>

                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Popup moderne avertissement moyenne insuffisante */}
      {showAverageWarning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <Trophy size={24} className="text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Quiz final indisponible</h3>
                <p className="text-sm text-gray-500">Progression insuffisante</p>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-xl">
              <p className="text-gray-700 text-sm leading-relaxed">
                Votre moyenne actuelle est de <span className="font-bold text-orange-600">{calculateQuizAverage().average}%</span>.
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Vous devez avoir une moyenne <strong>supérieure ou égale à 60%</strong> et avoir réussi tous les quiz des sessions pour débloquer l'examen final.
              </p>
            </div>

            <button
              onClick={() => setShowAverageWarning(false)}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
            >
              Compris, je continue ma formation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
