import React, { useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface CertificateProps {
  courseName: string;
  completionDate: string;
  instructor: string;
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
export const CertificateContent: React.FC<{ courseName: string; completionDate: string; instructor: string }> = ({
  courseName,
  completionDate,
  instructor
}) => {
  const { user } = useAuth();

  return (
    <div
      style={{
        width: '1123px',
        height: '794px',
        backgroundColor: '#ffffff',
        margin: '0 auto',
        position: 'relative',
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        backgroundImage: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',
        boxSizing: 'border-box'
      }}
    >
      {/* Bordure décorative extérieure */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          bottom: '20px',
          border: '3px solid #9333ea',
          borderRadius: '4px'
        }}
      />
      
      {/* Bordure intérieure dorée */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          right: '30px',
          bottom: '30px',
          border: '2px solid #c9a961',
          borderRadius: '2px'
        }}
      />
      
      {/* Coin décoratif supérieur gauche */}
      <div
        style={{
          position: 'absolute',
          top: '40px',
          left: '40px',
          width: '60px',
          height: '60px',
          borderTop: '4px solid #c9a961',
          borderLeft: '4px solid #c9a961'
        }}
      />
      
      {/* Coin décoratif supérieur droit */}
      <div
        style={{
          position: 'absolute',
          top: '40px',
          right: '40px',
          width: '60px',
          height: '60px',
          borderTop: '4px solid #c9a961',
          borderRight: '4px solid #c9a961'
        }}
      />
      
      {/* Coin décoratif inférieur gauche */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '40px',
          width: '60px',
          height: '60px',
          borderBottom: '4px solid #c9a961',
          borderLeft: '4px solid #c9a961'
        }}
      />
      
      {/* Coin décoratif inférieur droit */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '40px',
          width: '60px',
          height: '60px',
          borderBottom: '4px solid #c9a961',
          borderRight: '4px solid #c9a961'
        }}
      />

      {/* Logo GOLEARN */}
      <div style={{ marginTop: '25px', marginBottom: '15px' }}>
        <span
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#9333ea',
            letterSpacing: '4px'
          }}
        >
          GOLEARN
        </span>
        <div
          style={{
            width: '100px',
            height: '3px',
            backgroundColor: '#c9a961',
            margin: '8px auto'
          }}
        />
      </div>

      {/* Titre CERTIFICAT */}
      <h1
        style={{
          fontSize: '48px',
          fontFamily: 'Georgia, serif',
          color: '#9333ea',
          letterSpacing: '8px',
          marginTop: '10px',
          marginBottom: '5px',
          textTransform: 'uppercase'
        }}
      >
        Certificat d'achèvement
      </h1>

     

      {/* Texte principal */}
      <p
        style={{
          fontSize: '16px',
          color: '#333',
          marginBottom: '10px',
          fontStyle: 'italic'
        }}
      >
        Ceci certifie que
      </p>

      {/* Nom de l'apprenant */}
      <h2
        style={{
          fontSize: '42px',
          fontFamily: "'Brush Script MT', cursive",
          color: '#9333ea',
          marginTop: '0',
          marginBottom: '15px',
          paddingBottom: '15px',
          borderBottom: '1px solid #c9a961'
        }}
      >
        {user?.name || "Nom de l'apprenant"}
      </h2>

      {/* Description */}
      <p
        style={{
          fontSize: '18px',
          color: '#333',
          maxWidth: '700px',
          lineHeight: '1.6',
          marginBottom: '25px'
        }}
      >
        A terminé avec succès le cours en ligne{' '}
        <span
          style={{
            fontWeight: 'bold',
            color: '#9333ea',
            fontSize: '22px'
          }}
        >
          {courseName}
        </span>{' '}
        et satisfait à toutes les exigences.
      </p>

      {/* Section date et signature */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '100%',
          maxWidth: '800px',
          marginTop: 'auto',
          paddingTop: '25px'
        }}
      >
        {/* Date */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '150px',
              borderBottom: '2px solid #9333ea',
              marginBottom: '10px',
              paddingBottom: '5px'
            }}
          >
            <span
              style={{
                fontSize: '16px',
                color: '#333'
              }}
            >
              {completionDate}
            </span>
          </div>
          <p
            style={{
              fontSize: '12px',
              color: '#666',
              letterSpacing: '2px',
              margin: 0
            }}
          >
            DATE
          </p>
        </div>

        {/* Ligne décorative au centre */}
        <div
          style={{
            width: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              border: '2px solid #c9a961',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(45deg)'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#c9a961',
                borderRadius: '50%',
                transform: 'rotate(-45deg)'
              }}
            />
          </div>
        </div>

        {/* Signature */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '150px',
              borderBottom: '2px solid #9333ea',
              marginBottom: '10px',
              paddingBottom: '5px'
            }}
          >
            <span
              style={{
                fontSize: '20px',
                fontFamily: "'Brush Script MT', cursive",
                color: '#9333ea'
              }}
            >
              {instructor}
            </span>
          </div>
          <p
            style={{
              fontSize: '12px',
              color: '#666',
              letterSpacing: '2px',
              margin: 0
            }}
          >
            INSTRUCTEUR
          </p>
        </div>
      </div>

      {/* Numéro de certificat */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          fontSize: '10px',
          color: '#999',
          letterSpacing: '1px'
        }}
      >
        Certificate ID: GL-2024-{courseName.length}-CERT
      </div>
    </div>
  );
};

const Certificate: React.FC<CertificateProps> = ({
  courseName,
  completionDate,
  instructor,
  onClose,
  autoDownload = false
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  };

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    try {
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
      alert(
        `Erreur lors de la génération du PDF: ${
          error instanceof Error ? error.message : 'Erreur inconnue'
        }`
      );
    }
  };

  // Téléchargement automatique si autoDownload est true
  useEffect(() => {
    if (autoDownload) {
      handleDownload();
      onClose();
    }
  }, [autoDownload, onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '1200px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '20px',
            borderBottom: '1px solid #e5e5e5'
          }}
        >
          <h3 style={{ margin: 0 }}>Aperçu du certificat</h3>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleDownload}
              style={{
                padding: '10px 20px',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Télécharger PDF
            </button>

            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: '#e5e5e5',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Fermer
            </button>
          </div>
        </div>

        {/* Preview */}
        <div
          style={{
            padding: '40px',
            backgroundColor: '#f3f4f6',
            overflow: 'auto'
          }}
        >
          <div ref={certificateRef}>
            <CertificateContent courseName={courseName} completionDate={completionDate} instructor={instructor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
