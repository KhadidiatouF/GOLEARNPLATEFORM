import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  FileText,
  ClipboardList,
  CheckCircle,
  Lock,
  BookOpen,
  Video,
 
  Clock,
} from "lucide-react";

interface VideoContentProps { content: { videoUrl: string; description: string }; title: string; }
interface PdfContentProps { content: { pdfUrl: string; description: string }; title: string; }
interface QuizQuestion { id: number; question: string; options: string[]; correct: number; }
interface QuizContentProps { content: { questions: QuizQuestion[] }; }

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
  ],
  forum: [
    { id: 1, user: "Aminata Diallo", avatar: "https://i.pravatar.cc/40?img=47", role: "Student", message: "Super session, très bien expliqué !", time: "2h" },
    { id: 2, user: "Moussa Ndiaye", avatar: "https://i.pravatar.cc/40?img=12", role: "Student (level Beginner)", message: "J'ai eu du mal avec les grid areas, quelqu'un peut aider ?", time: "1h" },
    { id: 3, user: "Moussa Diallo", avatar: "https://i.pravatar.cc/40?img=33", role: "Student (Intermediate)", message: "Voici un lien utile : css-tricks.com/snippets/css/a-guide-to-flexbox/", time: "45m" },
  ],
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

function ArticleContent({ content, title }: { content: { body: string; breadcrumb?: string[] }; title: string }) {
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

function VideoContent({ content, title }: VideoContentProps) {
  return (
    <div className="w-full">
      <div className="rounded-2xl overflow-hidden shadow-lg bg-black aspect-video mb-6">
        <iframe src={content.videoUrl} title={title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><PlayCircle size={18} className="text-blue-500" /> Description</h2>
        <p className="text-gray-600 text-sm leading-relaxed">{content.description}</p>
      </div>
    </div>
  );
}

function PdfContent({ content, title }: PdfContentProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-4 border border-red-100"><BookOpen size={36} className="text-red-400" /></div>
      <h2 className="text-lg font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 text-sm text-center mb-6 max-w-sm">{content.description}</p>
      <a href={content.pdfUrl} target="_blank" rel="noreferrer" className="px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors shadow-sm flex items-center gap-2">
        <BookOpen size={16} /> Ouvrir le PDF
      </a>
    </div>
  );
}

function QuizContent({ content }: QuizContentProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = submitted ? content.questions.filter((q) => answers[q.id] === q.correct).length : 0;
  return (
    <div className="w-full max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-50 rounded-xl border border-orange-100"><ClipboardList size={22} className="text-orange-500" /></div>
        <div><h2 className="font-bold text-gray-900">Quiz</h2><p className="text-sm text-gray-400">{content.questions.length} questions</p></div>
      </div>
      {submitted ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-100"><CheckCircle size={32} className="text-green-500" /></div>
          <p className="text-2xl font-bold text-gray-900">{score}/{content.questions.length}</p>
          <p className="text-gray-500 mt-1">{score === content.questions.length ? "Parfait !" : "Continuez à pratiquer !"}</p>
          <button onClick={() => { setAnswers({}); setSubmitted(false); }} className="mt-5 px-5 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors">Recommencer</button>
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
            Soumettre
          </button>
        </div>
      )}
    </div>
  );
}

interface CourseViewerProps { onBack: () => void; formationId?: number; }

export default function CourseViewer({ onBack }: CourseViewerProps) {
  const formation = mockFormation;
  const [activeSessionId, setActiveSessionId] = useState(formation.sessions[0].id);



  const activeSession = formation.sessions.find((s) => s.id === activeSessionId);
  const activeIndex = formation.sessions.findIndex((s) => s.id === activeSessionId);


  const renderSessionContent = () => {
    if (!activeSession) return null;
    if (activeSession.locked)
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Lock size={40} className="text-gray-300 mb-4" />
          <p className="font-semibold text-gray-500">Session verrouillée</p>
          <p className="text-sm text-gray-400 mt-1">Terminez les sessions précédentes pour débloquer.</p>
        </div>
      );
    switch (activeSession.type) {
      case "article": return <ArticleContent content={activeSession.content as { body: string; breadcrumb?: string[] }} title={activeSession.title} />;
      case "video": return <VideoContent content={activeSession.content as { videoUrl: string; description: string }} title={activeSession.title} />;
      case "pdf": return <PdfContent content={activeSession.content as { pdfUrl: string; description: string }} title={activeSession.title} />;
      case "quiz": return <QuizContent content={activeSession.content as { questions: QuizQuestion[] }} />;
      default: return null;
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
              <button onClick={() => activeIndex < formation.sessions.length - 1 && setActiveSessionId(formation.sessions[activeIndex + 1].id)} disabled={activeIndex === formation.sessions.length - 1}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-500 rounded-xl hover:bg-teal-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                Suivant <ChevronRight size={16} />
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
              {formation.sessions.map((session) => (
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