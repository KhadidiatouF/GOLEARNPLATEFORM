import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import NotificationDialog from './NotificationDialog';

interface CertificateProps {
  courseName: string;
  completionDate: string;
  instructor: string;
  courseInstructorName?: string;
  onClose: () => void;
  autoDownload?: boolean;
}

interface WindowWithLibs {
  html2canvas?: unknown;
  jspdf?: {
    jsPDF?: unknown;
  };
}

type Html2CanvasFunction = (
  element: HTMLElement,
  options?: Record<string, unknown>
) => Promise<HTMLCanvasElement>;

type JsPDFConstructor = new (options?: {
  orientation?: string;
  unit?: string;
  format?: string;
}) => {
  addImage: (data: string, format: string, x: number, y: number, w: number, h: number) => void;
  save: (filename: string) => void;
};

// Composant pour le contenu du certificat (utilisable directement ou dans le modal)
export const CertificateContent: React.FC<{
  courseName: string;
  completionDate: string;
  instructor: string;
  courseInstructorName?: string;
}> = ({
  courseName,
  completionDate,
  instructor,
  courseInstructorName
}) => {
  const { user } = useAuth();
  const certificateId = `GL-${new Date().getFullYear()}-${courseName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase()}-${String((user?.name || 'USER').length).padStart(2, '0')}`;

  return (
    <div
      style={{
        width: '1123px',
        height: '794px',
        background: 'linear-gradient(135deg, #fcfbff 0%, #f7f2ff 45%, #fffaf1 100%)',
        margin: '0 auto',
        position: 'relative',
        padding: '56px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: '"Georgia", "Times New Roman", serif'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '18px',
          border: '2px solid #7c3aed',
          borderRadius: '28px'
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '30px',
          border: '1px solid rgba(201, 169, 97, 0.55)',
          borderRadius: '22px'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-140px',
          right: '-120px',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.16) 0%, rgba(124,58,237,0.04) 48%, rgba(124,58,237,0) 72%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-180px',
          left: '-140px',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,169,97,0.18) 0%, rgba(201,169,97,0.06) 46%, rgba(201,169,97,0) 72%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '54px',
          left: '54px',
          width: '86px',
          height: '86px',
          borderTop: '3px solid #c9a961',
          borderLeft: '3px solid #c9a961',
          borderTopLeftRadius: '18px'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '54px',
          right: '54px',
          width: '86px',
          height: '86px',
          borderTop: '3px solid #c9a961',
          borderRight: '3px solid #c9a961',
          borderTopRightRadius: '18px'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '54px',
          left: '54px',
          width: '86px',
          height: '86px',
          borderBottom: '3px solid #c9a961',
          borderLeft: '3px solid #c9a961',
          borderBottomLeftRadius: '18px'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '54px',
          right: '54px',
          width: '86px',
          height: '86px',
          borderBottom: '3px solid #c9a961',
          borderRight: '3px solid #c9a961',
          borderBottomRightRadius: '18px'
        }}
      />

      <div style={{ marginTop: '6px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '6px',
            color: '#a16207',
            marginBottom: '10px'
          }}
        >
          Plateforme d'excellence
        </div>
        <span
          style={{
            fontSize: '34px',
            fontWeight: 700,
            color: '#9333ea',
            letterSpacing: '6px'
          }}
        >
          GOLEARN
        </span>
        <div
          style={{
            width: '180px',
            height: '2px',
            background: 'linear-gradient(90deg, rgba(201,169,97,0) 0%, rgba(201,169,97,1) 50%, rgba(201,169,97,0) 100%)',
            margin: '14px auto 0'
          }}
        />
      </div>

      <h1
        style={{
          fontSize: '52px',
          color: '#4c1d95',
          letterSpacing: '5px',
          marginTop: '0',
          marginBottom: '8px',
          textTransform: 'uppercase'
        }}
      >
        Certificat de Réussite
      </h1>
      <p
        style={{
          fontSize: '15px',
          color: '#7c3aed',
          marginBottom: '20px',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          fontWeight: 600
        }}
      >
        Excellence academique certifiee
      </p>
      <div
        style={{
          padding: '14px 34px 18px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.76)',
          border: '1px solid rgba(147,51,234,0.12)',
          boxShadow: '0 18px 36px rgba(124,58,237,0.08)',
          marginBottom: '22px',
          position: 'relative',
          zIndex: 1
        }}
      >
        <h2
          style={{
            fontSize: '44px',
            fontFamily: '"Brush Script MT", cursive',
            color: '#6d28d9',
            margin: 0,
            paddingBottom: '10px',
            borderBottom: '1px solid rgba(201,169,97,0.7)'
          }}
        >
          {user?.name || "Nom de l'apprenant"}
        </h2>
      </div>
      <p
        style={{
          fontSize: '18px',
          color: '#3f3f46',
          maxWidth: '760px',
          lineHeight: '1.8',
          marginBottom: '24px'
        }}
      >
        Ce certificat atteste que l'apprenant a suivi avec succes le parcours de formation,
        valide les competences evaluees et repond aux exigences de la plateforme pour le programme
        <span
          style={{
            display: 'block',
            marginTop: '14px',
            fontWeight: 700,
            color: '#5b21b6',
            fontSize: '28px',
            letterSpacing: '0.3px'
          }}
        >
          {courseName}
        </span>{' '}
      </p>
      {courseInstructorName ? (
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 26px',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.76)',
            border: '1px solid rgba(147,51,234,0.12)',
            boxShadow: '0 16px 32px rgba(124,58,237,0.07)',
            marginBottom: '22px',
            position: 'relative',
            zIndex: 1
          }}
        >
          <span
            style={{
              fontSize: '12px',
              color: '#8b5cf6',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            Professeur du cours certifie
          </span>
          <span
            style={{
              fontSize: '24px',
              color: '#5b21b6',
              fontWeight: 700
            }}
          >
            {courseInstructorName}
          </span>
        </div>
      ) : null}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '24px',
          color: '#a16207'
        }}
      >
        <div style={{ width: '78px', height: '1px', backgroundColor: '#c9a961' }} />
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            border: '2px solid #c9a961',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.8)',
            fontSize: '18px',
            fontWeight: 700
          }}
        >
          GL
        </div>
        <div style={{ width: '78px', height: '1px', backgroundColor: '#c9a961' }} />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '100%',
          maxWidth: '800px',
          marginTop: '18px',
          paddingTop: '22px',
          marginBottom: '46px',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div
          style={{
            textAlign: 'center',
            minWidth: '190px',
            background: 'rgba(255,255,255,0.74)',
            border: '1px solid rgba(147,51,234,0.12)',
            borderRadius: '18px',
            padding: '18px 20px'
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: '#8b5cf6',
              letterSpacing: '3px',
              margin: '0 0 10px',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            Date d'obtention
          </p>
          <div
            style={{
              width: '100%',
              borderBottom: '2px solid #7c3aed',
              marginBottom: '10px',
              paddingBottom: '8px'
            }}
          >
            <span
              style={{
                fontSize: '18px',
                color: '#27272a',
                fontWeight: 600
              }}
            >
              {completionDate}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#71717a', margin: 0 }}>Validation officielle</p>
        </div>
        <div
          style={{
            width: '130px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              border: '2px solid #c9a961',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.82)',
              boxShadow: '0 12px 24px rgba(124,58,237,0.08)'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                background: 'linear-gradient(135deg, #c9a961 0%, #f0dca6 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5b3b00',
                fontSize: '14px',
                fontWeight: 700
              }}
            >
              Sceau
            </div>
          </div>
          <div style={{ width: '70px', height: '1px', backgroundColor: '#d4b873' }} />
        </div>
        <div
          style={{
            textAlign: 'center',
            minWidth: '190px',
            background: 'rgba(255,255,255,0.74)',
            border: '1px solid rgba(147,51,234,0.12)',
            borderRadius: '18px',
            padding: '18px 20px'
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: '#8b5cf6',
              letterSpacing: '3px',
              margin: '0 0 10px',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            Signature
          </p>
          <div
            style={{
              width: '100%',
              borderBottom: '2px solid #7c3aed',
              marginBottom: '10px',
              paddingBottom: '8px'
            }}
          >
            <span
              style={{
                fontSize: '24px',
                fontFamily: '"Brush Script MT", cursive',
                color: '#6d28d9'
              }}
            >
              {instructor}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#71717a', margin: '0 0 6px' }}>Responsable pedagogique</p>
          {courseInstructorName ? (
            <p style={{ fontSize: '12px', color: '#5b21b6', margin: 0, fontWeight: 600 }}>
              Professeur: {courseInstructorName}
            </p>
          ) : null}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '36px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '11px',
          color: '#6b7280',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          background: 'rgba(255,255,255,0.8)',
          padding: '8px 16px',
          borderRadius: '999px',
          border: '1px solid rgba(201,169,97,0.3)'
        }}
      >
        Certificate ID: {certificateId}
      </div>
    </div>
  );
};

const Certificate: React.FC<CertificateProps> = ({
  courseName,
  completionDate,
  instructor,
  courseInstructorName,
  onClose,
  autoDownload = false
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
      if (existingScript) {
        if (existingScript.dataset.loaded === 'true') {
          resolve();
          return;
        }

        const handleLoad = () => {
          existingScript.dataset.loaded = 'true';
          resolve();
        };
        const handleError = () => reject(new Error(`Failed to load ${src}`));

        existingScript.addEventListener('load', handleLoad, { once: true });
        existingScript.addEventListener('error', handleError, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        script.dataset.loaded = 'true';
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  };

  const handleDownload = async () => {
    if (!certificateRef.current || isDownloading) return;

    try {
      setIsDownloading(true);
      const windowWithLibs = window as unknown as WindowWithLibs;

      // Charger html2canvas
      if (!windowWithLibs.html2canvas) {
        await loadScript(
          'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
        );
      }

      // Charger jsPDF
      if (!windowWithLibs.jspdf) {
        await loadScript(
          'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        );
      }

      const html2canvas = windowWithLibs.html2canvas as Html2CanvasFunction;
      const jsPDF = (windowWithLibs.jspdf?.jsPDF as JsPDFConstructor | undefined);

      if (!html2canvas || !jsPDF) {
        throw new Error('Les librairies de génération PDF ne sont pas disponibles');
      }

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,

        onclone: (clonedDoc: Document) => {
          const styles = clonedDoc.querySelectorAll(
            'style, link[rel="stylesheet"]'
          );
          styles.forEach((style) => style.remove());
        }
      });

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
      pdf.save(
        `certificat-${courseName.replace(/\s+/g, '-').toLowerCase()}.pdf`
      );
    } catch (error) {
      console.error(error);
      setDownloadError(
        `Erreur lors de la génération du PDF: ${
          error instanceof Error ? error.message : 'Erreur inconnue'
        }`
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // Téléchargement automatique si autoDownload est true
  useEffect(() => {
    if (autoDownload) {
      void handleDownload().finally(() => {
        onClose();
      });
    }
  }, [autoDownload, onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(46,16,101,0.78) 0%, rgba(88,28,135,0.64) 48%, rgba(30,41,59,0.72) 100%)',
        backdropFilter: 'blur(10px)',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}
    >
      <NotificationDialog
        isOpen={Boolean(downloadError)}
        title="Téléchargement impossible"
        message={downloadError || ''}
        type="error"
        onClose={() => setDownloadError(null)}
      />
      <div
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #faf7ff 100%)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '1200px',
          boxShadow: '0 30px 80px rgba(15, 23, 42, 0.35)',
          border: '1px solid rgba(255,255,255,0.28)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '22px 24px',
            borderBottom: '1px solid rgba(124,58,237,0.08)',
            background: 'linear-gradient(90deg, rgba(124,58,237,0.08) 0%, rgba(201,169,97,0.08) 100%)'
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '20px', color: '#4c1d95' }}>Aperçu du certificat</h3>
            <p style={{ margin: '6px 0 0', fontSize: '14px', color: '#6b7280' }}>
              Version premium prête au téléchargement PDF
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => void handleDownload()}
              style={{
                padding: '11px 20px',
                background: isDownloading ? '#a78bfa' : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '999px',
                cursor: isDownloading ? 'wait' : 'pointer',
                opacity: isDownloading ? 0.85 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600,
                boxShadow: '0 12px 24px rgba(124,58,237,0.24)'
              }}
              disabled={isDownloading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              {isDownloading ? 'Generation...' : 'Télécharger PDF'}
            </button>

            <button
              onClick={onClose}
              style={{
                padding: '11px 18px',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(124,58,237,0.14)',
                borderRadius: '999px',
                cursor: 'pointer',
                color: '#4b5563',
                fontWeight: 600
              }}
            >
              Fermer
            </button>
          </div>
        </div>
        <div
          style={{
            padding: '40px',
            background: 'radial-gradient(circle at top, rgba(124,58,237,0.08) 0%, rgba(243,244,246,1) 36%, rgba(233,213,255,0.28) 100%)',
            overflow: 'auto'
          }}
        >
          <div ref={certificateRef}>
            <CertificateContent
              courseName={courseName}
              completionDate={completionDate}
              instructor={instructor}
              courseInstructorName={courseInstructorName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
