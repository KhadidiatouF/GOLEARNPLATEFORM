import React, { useState } from 'react';
import { X, Smartphone, CreditCard, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
  amount: number;
  onPaymentSuccess: (paymentMethod: string) => void;
}

type PaymentMethod = 'wave' | 'orange_money' | 'card' | null;

// ID de paiement fixe pour la démo
const DEMO_PAYMENT_ID = 'PAY-2026-DEMO';

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  courseName,
  amount,
  onPaymentSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);
    setPaymentStatus('idle');
    setErrorMessage('');

    // Simulation du paiement (2 secondes)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulation réussie pour la démo (80% de succès)
    const isSuccess = true;

    if (isSuccess) {
      setPaymentStatus('success');
      
      // Simuler l'enregistrement du paiement
      const paymentRecord = {
        id: DEMO_PAYMENT_ID,
        amount: amount,
        method: selectedMethod,
        courseName: courseName
      };
      
      console.log('Paiement enregistré:', paymentRecord);
      
      // Simuler le partage des revenus (70% enseignant, 30% plateforme)
      const platformFee = Math.round(amount * 0.3);
      const teacherRevenue = Math.round(amount * 0.7);
      console.log(`Revenu partagé - Plateforme: ${platformFee} CFA, Enseignant: ${teacherRevenue} CFA`);
      
      setTimeout(() => {
        onPaymentSuccess(selectedMethod);
        handleClose();
      }, 1500);
    } else {
      setPaymentStatus('error');
      setErrorMessage('La transaction a échoué. Veuillez réessayer ou utiliser un autre moyen de paiement.');
    }

    setIsProcessing(false);
  };

  const handleClose = () => {
    setSelectedMethod(null);
    setPaymentStatus('idle');
    setErrorMessage('');
    onClose();
  };

  const paymentMethods = [
    {
      id: 'wave' as const,
      name: 'Wave',
      icon: (
        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">W</span>
        </div>
      ),
      description: 'Paiement instantané via Wave'
    },
    {
      id: 'orange_money' as const,
      name: 'Orange Money',
      icon: (
        <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
          <Smartphone className="w-6 h-6 text-white" />
        </div>
      ),
      description: 'Paiement via Orange Money'
    },
    {
      id: 'card' as const,
      name: 'Carte bancaire',
      icon: (
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
      ),
      description: 'Paiement par carte Visa/Mastercard'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-[#a855f7] to-purple-700 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Paiement sécurisé</h2>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-white/90 mt-2">Finalisez votre inscription</p>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Récapitulatif */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Formation</span>
              <span className="font-medium text-gray-800">{courseName}</span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
              <span className="text-gray-600 font-semibold">Total à payer</span>
              <span className="text-2xl font-bold text-[#a855f7]">{amount.toLocaleString()} CFA</span>
            </div>
          </div>

          {paymentStatus === 'idle' && (
            <>
              {/* Méthodes de paiement */}
              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Sélectionnez un moyen de paiement :</p>
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      selectedMethod === method.id
                        ? 'border-[#a855f7] bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {method.icon}
                    <div className="text-left flex-1">
                      <p className="font-medium text-gray-800">{method.name}</p>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <CheckCircle className="w-5 h-5 text-[#a855f7]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Bouton payer */}
              <button
                onClick={handlePayment}
                disabled={!selectedMethod || isProcessing}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  selectedMethod
                    ? 'bg-[#a855f7] text-white hover:bg-purple-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Traitement en cours...
                  </span>
                ) : (
                  `Payer ${amount.toLocaleString()} CFA`
                )}
              </button>
            </>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Paiement réussi !</h3>
              <p className="text-gray-600">
                Votre inscription a été créée avec succès. Vous allez être redirigé vers votre tableau de bord.
              </p>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Paiement échoué</h3>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentStatus('idle')}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Réessayer
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 bg-red-100 text-red-600 rounded-xl font-medium hover:bg-red-200 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pied de page */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Smartphone className="w-4 h-4" />
            <span>Paiement sécurisé par Mobile Money</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
