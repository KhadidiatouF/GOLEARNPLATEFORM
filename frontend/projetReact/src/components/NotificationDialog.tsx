import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';

interface NotificationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  buttonText?: string;
  type?: 'error' | 'success' | 'info' | 'warning';
}

export default function NotificationDialog({
  isOpen,
  title,
  message,
  onClose,
  buttonText = 'Compris',
  type = 'info',
}: NotificationDialogProps) {
  if (!isOpen) return null;

  const typeConfig = {
    error: {
      icon: <AlertCircle className="w-12 h-12 text-red-500" />,
      ring: 'ring-red-100',
      panel: 'from-red-50 to-white',
      button: 'bg-red-500 hover:bg-red-600',
    },
    success: {
      icon: <CheckCircle2 className="w-12 h-12 text-emerald-500" />,
      ring: 'ring-emerald-100',
      panel: 'from-emerald-50 to-white',
      button: 'bg-emerald-500 hover:bg-emerald-600',
    },
    info: {
      icon: <Info className="w-12 h-12 text-purple-500" />,
      ring: 'ring-purple-100',
      panel: 'from-purple-50 to-white',
      button: 'bg-purple-600 hover:bg-purple-700',
    },
    warning: {
      icon: <TriangleAlert className="w-12 h-12 text-amber-500" />,
      ring: 'ring-amber-100',
      panel: 'from-amber-50 to-white',
      button: 'bg-amber-500 hover:bg-amber-600',
    },
  };

  const config = typeConfig[type];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br ${config.panel} shadow-2xl ring-1 ${config.ring}`}>
        <div className="px-8 pt-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
            {config.icon}
          </div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
        </div>

        <div className="px-8 pb-8 pt-6">
          <button
            onClick={onClose}
            className={`w-full rounded-2xl px-4 py-3 font-semibold text-white transition-colors ${config.button}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
