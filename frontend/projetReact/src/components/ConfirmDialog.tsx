import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'success';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
  type = 'danger',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const typeConfig = {
    danger: {
      icon: <XCircle className="w-12 h-12 text-red-500" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      confirmBtn: 'bg-red-500 hover:bg-red-600',
    },
    warning: {
      icon: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      confirmBtn: 'bg-yellow-500 hover:bg-yellow-600',
    },
    success: {
      icon: <CheckCircle className="w-12 h-12 text-green-500" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      confirmBtn: 'bg-green-500 hover:bg-green-600',
    },
  };

  const config = typeConfig[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl transform transition-all animate-fadeIn">
        <div className={`p-8 ${config.bgColor} rounded-t-2xl flex flex-col items-center`}>
          <div className="mb-4">
            {config.icon}
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-center">{title}</h2>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 text-center mb-6">{message}</p>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 ${config.confirmBtn} text-white rounded-xl font-medium transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
