import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  ChevronLeft,ChevronRight,PlayCircle,FileText,ClipboardList,CheckCircle,Lock,BookOpen,Video,Clock,Trophy} from "lucide-react";

interface VideoContentProps { content: { videoUrl: string; description?: string; body?: string }; title: string; onContentViewed?: () => void; }
interface PdfContentProps { content: { pdfUrl: string; description?: string; body?: string }; title: string; onContentViewed?: () => void; }
interface QuizQuestion { id: number; question: string; options: string[]; correct: number; }
interface QuizContentProps { content: { questions: QuizQuestion[] }; onSuccess?: () => void; }

// État pour suivre la progression d'une session
interface SessionProgress {
  currentChapterIndex: number;
  chaptersCompleted: boolean[];
  quizPassed: boolean;
  quizScore: number | null;
}

// État pour le quiz final
interface FinalQuizState {
  showFinalQuiz: boolean;
  passed: boolean;
  score: number | null;
  average: number; // Moyenne des quiz de session
  allPassed: boolean; // Tous les quiz réussis?
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
  // Propriétés API (français)
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
  // Propriétés API (français)
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
  if (type === "video") return <Video {...props} className="text-blue-500" />;
  if (type === "article") return <FileText {...props} className="text-teal-500" />;
  if (type === "quiz") return <ClipboardList {...props} className="text-orange-500" />;
  if (type === "pdf") return <BookOpen {...props} className="text-red-400" />;
  return <FileText {...props} />;
}

function typeBadge(type: string): string {
  const map: Record<string, string> = {
    video: "bg-blue-50 text-blue-600 border-blue-100",
    article: "bg-teal-50 text-teal-600 border-teal-100",
    quiz: "bg-orange-50 text-orange-600 border-orange-100",
    pdf: "bg-red-50 text-red-500 border-red-100",
  };
  return map[type] || "bg-gray-50 text-gray-500 border-gray-100";
}

function ArticleContent({ content, title, onContentViewed }: { content: { body: string; breadcrumb?: string[] }; title: string; onContentViewed?: () => void }) {
  // Appeler onContentViewed quand le composant est monté (contenu affiché)
  useEffect(() => {
    if (onContentViewed) {
      onContentViewed();
    }
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
  // Le body contient le contenu Markdown du chapitre
  const videoContent = content as { videoUrl?: string; description?: string; body?: string };
  const markdownContent = videoContent.body || videoContent.description || '';
  
  // Appeler onContentViewed quand le composant est monté (contenu affiché)
  useEffect(() => {
    if (onContentViewed) {
      onContentViewed();
    }
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
  
  // Appeler onContentViewed quand le composant est monté (contenu affiché)
  useEffect(() => {
    if (onContentViewed) {
      onContentViewed();
    }
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
          <button onClick={handleContinue} className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-sm">
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

// Wrapper pour le quiz avec callback de soumission
interface QuizWrapperProps {
  content: { questions: QuizQuestion[] };
  onSubmit: (score: number) => void;
  requiredScore?: number;
}

function QuizWrapper({ content, onSubmit, requiredScore = 60 }: QuizWrapperProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const correctCount = submitted ? content.questions.filter((q) => answers[q.id] === q.correct).length : 0;
  const totalQuestions = content.questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = percentage >= requiredScore;

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit(percentage);
  };

  if (submitted) {
    return (
      <div className="relative">
        {/* Bande de résultat en haut */}
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
        
        {/* Score détaillé */}
        <div className="text-center py-6 bg-white rounded-2xl border border-gray-100 shadow-sm mb-4">
          <p className="text-3xl font-bold text-gray-900">{correctCount}/{totalQuestions}</p>
          <p className="text-gray-500 mt-1">bonnes réponses</p>
        </div>
        
        {!passed && (
          <button onClick={() => { setAnswers({}); setSubmitted(false); }} className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-sm">
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
                className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${answers[q.id] === idx ? "border-orange-400 bg-orange-50 text-orange-700 font-medium" : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}>
                <span className="mr-2 font-semibold text-gray-400">{String.fromCharCode(65 + idx)}.</span>{opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleSubmit} disabled={Object.keys(answers).length < totalQuestions}
        className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
        Soumettre ({requiredScore}% requis)
      </button>
    </div>
  );
}

interface CourseViewerProps { onBack: () => void; formationId?: number; }

export default function CourseViewer({ onBack, formationId }: CourseViewerProps) {
  const location = useLocation();
  
  // État pour les données de la formation
  const [formation, setFormation] = useState<FormationData>(mockFormation as unknown as FormationData);
  const [loading, setLoading] = useState(true);
  
  // Charger la formation depuis l'API
  useEffect(() => {
    const loadFormation = async () => {
      // Utiliser l'ID de la formation passé en prop ou depuis le state
      const formationID = formationId || location.state?.formationId;
      
      if (!formationID) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`http://localhost:4004/formations/${formationID}`);
        console.log('API Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('API Data:', JSON.stringify(data, null, 2));
          // Transformer les données de l'API vers le format attendu
          if (data.data) {
            const formationData = data.data;
            console.log('Formation sessions:', formationData.sessions);
            
            // Si pas de sessions, on affiche quand meme les donnees de la formation
            const professorData = formationData.professeur;
            const profName = professorData?.utilisateur 
              ? `${professorData.utilisateur.nom} ${professorData.utilisateur.prenom}` 
              : 'Professeur';
            const profSpecialty = professorData?.specialite || 'Formation';
            const profAvatar = 'https://i.pravatar.cc/80?img=47';
            const profVerified = true;

            // Si pas de sessions, on affiche quand meme les donnees de la formation
            // (peut etre une formation vide ou en cours de creation)
            if (!formationData.sessions || formationData.sessions.length === 0) {
              console.log('API returned no sessions, but using real formation data');
              setFormation({
                id: formationData.id,
                title: formationData.titre,
                description: formationData.description,
                progress: 0,
                sessions: [],
                professor: {
                  name: profName,
                  role: 'PROFESSEUR',
                  specialty: profSpecialty,
                  avatar: profAvatar,
                  verified: profVerified
                }
              });
            } else {
              // Transformer les sessions et leurs chapitres
              const transformedSessions = (formationData.sessions || []).map((session: Record<string, unknown>, index: number) => {
                // Mapper tous les chapitres de la session
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
                  // Conserver les données originales pour affichage
                  titre: chapitre.titre,
                  duree: chapitre.duree,
                  contenu: chapitre.contenu,
                  videoUrl: chapitre.videoUrl,
                  pdfUrl: chapitre.pdfUrl
                }));
                
                // Determiner le type de session
                const apiQuiz = session.quiz as Record<string, unknown> | undefined;
                // Transformer le quiz au format attendu par le composant
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
                        correct: reponses.findIndex((r: unknown) => {
                          const reponse = r as Record<string, unknown>;
                          return reponse.estCorrecte === true;
                        })
                      };
                    })
                  }
                } : undefined;
                const premierChapitre = chapitres[0];
                
                // Mapper le type de contenu (VIDEO, TEXTE, PDF)
                const chapterType = premierChapitre?.typeContenu?.toLowerCase() || 'texte';
                // TEXTE est affiche comme article
                const sessionType = chapterType === 'texte' ? 'article' : chapterType;
                
                // Mapper le contenu selon le type - avec toutes les infos du chapitre
                let sessionContent: Record<string, unknown> = { body: String(session.contenu || '') };
                
                if (premierChapitre) {
                  if (sessionType === 'video' || premierChapitre.typeContenu === 'VIDEO') {
                    sessionContent = {
                      videoUrl: premierChapitre.content.videoUrl,
                      description: premierChapitre.content.description || premierChapitre.content.body,
                      body: premierChapitre.content.body // Ajouter le body pour affichage sous la vidéo
                    };
                  } else if (sessionType === 'pdf' || premierChapitre.typeContenu === 'PDF') {
                    sessionContent = {
                      pdfUrl: premierChapitre.content.pdfUrl,
                      description: premierChapitre.content.description || premierChapitre.content.body,
                      body: premierChapitre.content.body
                    };
                  } else {
                    sessionContent = { 
                      body: premierChapitre.content.body,
                      description: premierChapitre.content.description
                    };
                  }
                }
                
                // ✅ CORRECTION : Ajouter le quiz SANS écraser le contenu des chapitres
                // On stocke le quiz dans une propriété séparée, il sera affiché APRES tous les chapitres
                if (quiz && quiz.content) {
                  const quizInner = quiz.content as Record<string, unknown>;
                  if (quizInner.questions) {
                    sessionContent = { 
                      ...sessionContent,
                      // On ne met plus les questions directement à la racine
                      // elles sont stockées dans une propriété dédiée quizQuestions
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
                  quiz: quiz, // Ajouter le quiz transformé
                  // Conserver les données originales
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
                professor: {
                  name: profName,
                  role: 'PROFESSEUR',
                  specialty: profSpecialty,
                  avatar: profAvatar,
                  verified: profVerified
                }
              });
            }
          }
        }
      } catch (error) {
        console.error('Erreur chargement formation:', error);
        // En cas d'erreur, utiliser les données mock
        console.log('Using mock data as fallback - API error');
        setFormation(mockFormation as unknown as FormationData);
      } finally {
        setLoading(false);
      }
    };
    
    loadFormation();
  }, [formationId, location.state?.formationId]);

  const [activeSessionId, setActiveSessionId] = useState<number | undefined>(undefined);
  
  // État pour la progression des sessions
  const [sessionProgress, setSessionProgress] = useState<Record<number, SessionProgress>>({});
  
  // État pour le quiz final
  const [finalQuizState, setFinalQuizState] = useState<FinalQuizState>({
    showFinalQuiz: false,
    passed: false,
    score: null,
    average: 0,
    allPassed: false
  });
  
  // État pour afficher le quiz de session
  const [showSessionQuiz, setShowSessionQuiz] = useState(false);
  
  // État pour suivre si le contenu du chapitre a été vu (obligation de lire avant de passer)
  const [chapterContentViewed, setChapterContentViewed] = useState(false);

  // Fonction pour gérer le passage au chapitre suivant
  const handleNextChapter = () => {
    if (!activeSession) return;
    
    const chapitres = activeSession.chapitres;
    const currentProgress = sessionProgress[activeSession.id];
    
    // Si la session a des chapitres
    if (chapitres && chapitres.length > 0) {
      const currentChapterIndex = currentProgress?.currentChapterIndex ?? 0;
      
      // Si ce n'est pas le dernier chapitre, passer au chapitre suivant
      if (currentChapterIndex < chapitres.length - 1) {
        setSessionProgress({
          ...sessionProgress,
          [activeSession.id]: {
            ...currentProgress,
            currentChapterIndex: currentChapterIndex + 1
          }
        });
        // Réinitialiser le flag pour le nouveau chapitre
        setChapterContentViewed(false);
        return;
      }
      
      // Si c'est le dernier chapitre, vérifier s'il y a un quiz
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
      // Pas de chapitres, vérifier s'il y a un quiz directement
      if (activeSession.quiz) {
        const quizData = activeSession.quiz as Record<string, unknown>;
        const quizContent = quizData.content as Record<string, unknown> | undefined;
        if (quizContent && quizContent.questions) {
          console.log("Quiz trouvé pour la session (sans chapitres), affichage du quiz");
          setShowSessionQuiz(true);
          setChapterContentViewed(false);
          return;
        }
      }
    }
    
    // Pas de quiz ou quiz sans questions, passer à la session suivante
    handleNextSession();
  };
  
  // Fonction pour calculer la moyenne des quiz de session
  const calculateQuizAverage = (): { average: number; allPassed: boolean; failedSessions: number[] } => {
    const scores: number[] = [];
    const failedSessions: number[] = [];
    
    Object.values(sessionProgress).forEach((progress) => {
      if (progress.quizPassed && progress.quizScore !== null) {
        scores.push(progress.quizScore);
      } else if (progress.quizScore !== null) {
        // Quiz passé mais pas réussi
        failedSessions.push(progress.quizScore);
      }
    });
    
    const allPassed = failedSessions.length === 0 && scores.length > 0;
    const average = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
    
    return { average, allPassed, failedSessions };
  };
  
  // Fonction pour gérer le passage à la session suivante
  const handleNextSession = () => {
    if (!activeSession) return;
    
    if (activeIndex < formation.sessions.length - 1) {
      // Marquer la session actuelle comme terminée
      setFormation((prev: FormationData) => {
        const newSessions = [...prev.sessions];
        newSessions[activeIndex] = { ...newSessions[activeIndex], completed: true };
        return { ...prev, sessions: newSessions };
      });
      
      // Passer à la session suivante
      setActiveSessionId(formation.sessions[activeIndex + 1].id);
    } else {
      // C'était la dernière session - vérifier la moyenne des quiz
      const { average, allPassed } = calculateQuizAverage();
      
      if (allPassed && average >= 60) {
        // Moyenne >= 60% et tous les quiz réussis - afficher le quiz final
        setFinalQuizState({ showFinalQuiz: true, passed: false, score: null, average, allPassed: true });
      } else {
        // Moyenne < 60% ou certains quiz non réussis
        alert(`Votre moyenne est de ${average}%. Vous devez avoir une moyenne >= 60% et réussir tous les quiz pour accéder au quiz final.`);
      }
    }
  };
  
  // Fonction pour gérer la soumission du quiz de session
  const handleSessionQuizSubmit = (score: number) => {
    if (!activeSession) return;
    const sessionId = activeSession.id;
    const passed = score >= 60;
    
    setSessionProgress((prev: Record<number, SessionProgress>) => ({
      ...prev,
      [sessionId]: {
        ...prev[sessionId],
        quizPassed: passed,
        quizScore: score
      }
    }));
    
    setShowSessionQuiz(false);
    
    if (passed) {
      // Quiz réussi - passer automatiquement à la session suivante
      handleNextSession();
    } else {
      // Quiz échoué - rester sur la session actuelle
      // L'utilisateur peut réessayer depuis le composant QuizWrapper
    }
  };
  
  // Fonction pour gérer la soumission du quiz final
  const handleFinalQuizSubmit = (score: number) => {
    const passed = score >= 100; // 100% requis pour le certificat
    setFinalQuizState({ showFinalQuiz: false, passed, score, average: 0, allPassed: false });
  };

  // Initialiser la progression des sessions après le chargement des données
  useEffect(() => {
    if (!loading && formation.sessions && formation.sessions.length > 0) {
      const initialProgress: Record<number, SessionProgress> = {};
      
      formation.sessions.forEach((session: Session) => {
        const sessionData = session as unknown as { chapitres?: Chapitre[]; quiz?: unknown };
        const chapters = sessionData.chapitres || [];
        initialProgress[session.id] = {
          currentChapterIndex: 0,
          chaptersCompleted: new Array(chapters.length).fill(false),
          quizPassed: false,
          quizScore: null
        };
      });
      
      setSessionProgress(initialProgress);
    }
  }, [loading, formation.sessions]);
  
  // Sélectionner automatiquement la première session non verrouillée au chargement
  useEffect(() => {
    if (!loading && formation.sessions && formation.sessions.length > 0 && activeSessionId === undefined) {
      const firstUnlockedSession = formation.sessions.find((s: Session) => !s.locked);
      if (firstUnlockedSession) {
        setActiveSessionId(firstUnlockedSession.id);
      }
    }
  }, [loading, formation.sessions, activeSessionId]);
  
  // Réinitialiser le flag de contenu vu quand on change de session
  useEffect(() => {
    setChapterContentViewed(false);
  }, [activeSessionId]);



  // Afficher un chargement si nécessaire
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
        <button onClick={onBack} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Retour aux formations
        </button>
      </div>
    );
  }

  const activeSession = formation.sessions.find((s: { id: number }) => s.id === activeSessionId);
  const activeIndex = formation.sessions.findIndex((s: { id: number }) => s.id === activeSessionId);


  const renderSessionContent = () => {
    // ✅ FORCER L'AFFICHAGE DES CHAPITRES EN PREMIER SYSTÉMATIQUEMENT
    // Même si showSessionQuiz est true on affiche d'abord les chapitres s'ils ne sont pas tous terminés
    const allChaptersCompleted = activeSession?.chapitres ? 
      activeSession.chapitres.length === 0 || 
      !!sessionProgress[activeSession.id]?.chaptersCompleted?.every((c: boolean) => c) 
    : false;

    // Le quiz ne s'affiche QUE si explicitement demandé ET tous les chapitres terminés
    if (showSessionQuiz && activeSession?.quiz && allChaptersCompleted) {
      const quizContent = activeSession.quiz as Record<string, unknown>;
      const quizInner = quizContent.content as Record<string, unknown> | undefined;
      if (quizInner && quizInner.questions) {
        // Les questions sont maintenant transformées avec la structure: { question, options, correct }
        const questions = (quizInner.questions as Record<string, unknown>[]).map((q, idx) => ({
          id: Number(q.id) || (idx + 1),
          question: String(q.question || q.contenu || ''),
          options: (q.options as string[]) || (q.reponses as Record<string, unknown>[])?.map((r: Record<string, unknown>) => String(r.contenu || '')) || [],
          correct: Number(q.correct) >= 0 ? Number(q.correct) : (q.reponses as Record<string, unknown>[])?.findIndex((r: Record<string, unknown>) => r.estCorrecte === true) || 0
        }));
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
              requiredScore={60}
            />
          </div>
        );
      }
    }
    
    // Afficher le quiz final
    if (finalQuizState.showFinalQuiz) {
      return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Trophy size={24} className="text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Quiz Final - Certification</h2>
              <p className="text-sm text-gray-500">Répondez correctement à 100% des questions pour obtenir votre certificat</p>
            </div>
          </div>
          <QuizWrapper 
            content={{ questions: [
              { id: 1, question: "Quiz final - À 100% vous pouvez obtenir votre certificat", options: ["Commencer le quiz final"], correct: 0 }
            ]}}
            onSubmit={handleFinalQuizSubmit}
            requiredScore={100}
          />
        </div>
      );
    }
    
    // Obtenir le contenu et le type du chapitre actuel basé sur currentChapterIndex
    const getCurrentChapterInfo = () => {
      // ✅ CORRECTION : On vérifie D'ABORD si on doit afficher le quiz de session
      if (showSessionQuiz && activeSession?.quiz) {
        const quizData = activeSession.quiz as Record<string, unknown>;
        const quizContent = quizData.content as Record<string, unknown> | undefined;
        if (quizContent && quizContent.questions) {
          return { 
            content: quizContent, 
            type: 'quiz' as string 
          };
        }
      }
      
      // Si le contenu de la session contient des questions (quiz), afficher comme quiz
      if (activeSession?.content && (activeSession.content as Record<string, unknown>).questions) {
        return { 
          content: activeSession.content, 
          type: 'quiz' as string 
        };
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
    
    // Debug: voir si le quiz est présent
    
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
    <div className="flex h-full bg-gray-50 overflow-hidden " style={{ marginTop: '70px' }}>

        {/* ── COLONNE 2 : Contenu principal ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-18 w-full">

            {/* Bouton Retour */}
            <div className="mb-4">
              <button 
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={16} />
                Retour aux formations
              </button>
            </div>

            {/* Breadcrumb */}
            {activeSession?.type === "article" && (activeSession.content ).breadcrumb && (
              <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
                {(activeSession.content ).breadcrumb.map((crumb: string, i: number, arr: string[]) => (
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
              <button onClick={() => activeIndex > 0 && setActiveSessionId(formation.sessions[activeIndex - 1].id)} disabled={activeIndex === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={16} /> Précédent
              </button>
              <span className="text-xs text-gray-400">{activeIndex + 1} / {formation.sessions.length}</span>
              <button 
                onClick={handleNextChapter} 
                disabled={!chapterContentViewed || (activeIndex === formation.sessions.length - 1 && !activeSession?.quiz && (!activeSession?.chapitres || activeSession.chapitres.length === 0))}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-500 rounded-xl hover:bg-teal-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title={!chapterContentViewed ? "Vous devez d'abord lire le contenu du chapitre" : ""}
              >
                {!chapterContentViewed ? "Étudier d'abord" : "Suivant"} <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </main>

        {/* ── COLONNE 3 : Sidebar sessions du cours (à droite du contenu) ── */}
        <aside className="w-1/5 shrink-0 bg-white border-l border-gray-100 flex flex-col overflow-y-auto  md:flex">

          {/* Titre */}
          <div className="p-4 border-b border-gray-100 bg-gray-50 ">
            <h2 className="font-semibold text-gray-800 text-sm leading-snug w-full">{formation.title}</h2>
          </div>

          {/* Carte professeur */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <img src={formation.professor.avatar} alt="" className="w-11 h-11 rounded-full object-cover border-2 border-teal-100 shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-900 text-sm truncate">{formation.professor.name}</span>
                  {formation.professor.verified && <CheckCircle size={13} className="text-teal-500 shrink-0" />}
                </div>
                <p className="text-xs text-gray-400">{formation.professor.role}</p>
                <p className="text-xs text-gray-500 mt-0.5">Spécialité: {formation.professor.specialty}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Progression</span>
                <span className="font-semibold text-teal-600">{formation.progress}% Completed</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full transition-all duration-500" style={{ width: `${formation.progress}%` }} />
              </div>
            </div>
          </div>

          {/* Liste des sessions */}
          <div className="p-3 flex-1 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Sessions de la formation</p>
            <div className="space-y-1.5">
              {formation.sessions.map((session: { id: number; title: string; type: string; duration: string; completed: boolean; locked: boolean }) => (
                <button key={session.id} onClick={() => !session.locked && setActiveSessionId(session.id)}
                  className={`w-full text-left px-3 py-3 rounded-xl transition-all ${
                    activeSessionId === session.id ? "bg-teal-50 border border-teal-200" :
                    session.locked ? "opacity-50 cursor-not-allowed border border-transparent" :
                    "hover:bg-gray-50 border border-transparent"
                  }`}>
                  <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${typeBadge(session.type)} border`}>
                      <SessionIcon type={session.type} size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-medium leading-snug ${activeSessionId === session.id ? "text-teal-700" : "text-gray-700"}`}>{session.title}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock size={10} className="text-gray-300" />
                        <span className="text-[10px] text-gray-400">{session.duration}</span>
                      </div>
                    </div>
                    <div className="shrink-0 mt-0.5">
                      {session.locked ? <Lock size={12} className="text-gray-300" /> : session.completed ? <CheckCircle size={13} className="text-teal-500" /> : null}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
  );
}