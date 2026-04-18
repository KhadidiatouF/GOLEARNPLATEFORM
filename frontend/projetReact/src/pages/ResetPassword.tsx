import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiAuth } from '../api/apiAuth';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Le lien de réinitialisation est invalide.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('La confirmation du mot de passe ne correspond pas.');
      return;
    }

    setLoading(true);
    const result = await apiAuth.resetPassword(token, newPassword);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Impossible de modifier le mot de passe.');
      return;
    }

    setSuccess('Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.');
    setTimeout(() => navigate('/login'), 1800);
  };

  return (
    <div className="min-h-screen w-screen bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.15),_transparent_40%),linear-gradient(180deg,#f8f5ff_0%,#f3f4f6_100%)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-purple-100 bg-white shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-700 to-fuchsia-600 px-8 py-8 text-white">
          <p className="text-xs uppercase tracking-[0.35em] text-purple-100 mb-3">GOLEARN</p>
          <h1 className="text-3xl font-bold leading-tight">Sécurisez votre compte professeur</h1>
          <p className="text-sm text-white/80 mt-3">Choisissez un nouveau mot de passe pour finaliser votre première connexion.</p>
        </div>

        <div className="px-8 py-8">
          {error && <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {success && <div className="mb-4 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Au moins 8 caractères"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Répétez le mot de passe"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-purple-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Mise à jour...' : 'Mettre à jour mon mot de passe'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Déjà prêt ? <Link to="/login" className="font-medium text-purple-600 hover:text-purple-700">Retour à la connexion</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
