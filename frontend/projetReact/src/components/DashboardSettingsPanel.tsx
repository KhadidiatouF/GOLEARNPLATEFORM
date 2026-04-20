import { useEffect, useMemo, useState } from 'react';
import { Bell, Camera, Mail, Palette, Shield, UserRound } from 'lucide-react';
import { useAuth, type UserRole } from '../contexts/AuthContext';
import {
  getDashboardPreferences,
  saveDashboardPreferences,
  type DashboardPreferences,
  type ThemeColor,
} from '../utils/dashboardPreferences';

interface SettingStat {
  label: string;
  value: string;
}

interface DashboardSettingsPanelProps {
  role: UserRole;
  roleLabel: string;
  stats: SettingStat[];
  securityText: string;
}

const themeOptions: Array<{ value: ThemeColor; label: string; classes: string }> = [
  { value: 'purple', label: 'Violet', classes: 'bg-purple-500' },
  { value: 'blue', label: 'Bleu', classes: 'bg-blue-500' },
  { value: 'green', label: 'Vert', classes: 'bg-green-500' },
];

export default function DashboardSettingsPanel({
  role,
  roleLabel,
  stats,
  securityText,
}: DashboardSettingsPanelProps) {
  const { user, updateUser } = useAuth();
  const [preferences, setPreferences] = useState<DashboardPreferences>(() => getDashboardPreferences(role, user?.id));
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    setPreferences(getDashboardPreferences(role, user?.id));
  }, [role, user?.id]);

  useEffect(() => {
    setDisplayName(user?.name || '');
    setEmail(user?.email || '');
  }, [user?.name, user?.email]);

  const profileInitials = useMemo(() => {
    const parts = (displayName || user?.name || 'U').trim().split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('') || 'U';
  }, [displayName, user?.name]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreferences((prev) => ({
        ...prev,
        profilePhoto: typeof reader.result === 'string' ? reader.result : prev.profilePhoto,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveDashboardPreferences(role, preferences, user?.id);
    updateUser({
      name: displayName.trim() || user?.name || '',
      email: email.trim() || user?.email || '',
    });
    setSavedMessage('Paramètres enregistrés sur cet appareil.');
    window.setTimeout(() => setSavedMessage(''), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">
        <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              {preferences.profilePhoto ? (
                <img
                  src={preferences.profilePhoto}
                  alt="Photo de profil"
                  className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-purple-100 text-3xl font-bold text-purple-700 border-4 border-white shadow-md">
                  {profileInitials}
                </div>
              )}
              <label className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700">
                <Camera className="h-4 w-4" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{displayName || user?.name || roleLabel}</h3>
            <p className="mt-1 text-sm text-gray-500">{roleLabel}</p>
            <p className="mt-3 text-xs text-gray-500">
              Ajoutez une photo de profil et personnalisez votre espace.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-2">
            <UserRound className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Informations personnelles</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">Nom complet</span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                placeholder="Votre nom complet"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                placeholder="Votre email"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Couleur du tableau de bord</h3>
          </div>
          <div className="space-y-3">
            {themeOptions.map((theme) => (
              <button
                key={theme.value}
                type="button"
                onClick={() => setPreferences((prev) => ({ ...prev, themeColor: theme.value }))}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                  preferences.themeColor === theme.value
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <span className={`h-4 w-4 rounded-full ${theme.classes}`} />
                  {theme.label}
                </span>
                {preferences.themeColor === theme.value && (
                  <span className="text-xs font-semibold text-purple-700">Actif</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
              <span className="flex items-center gap-3 text-sm text-gray-700">
                <Mail className="h-4 w-4 text-purple-600" />
                Notifications email
              </span>
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => setPreferences((prev) => ({ ...prev, emailNotifications: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
              <span className="flex items-center gap-3 text-sm text-gray-700">
                <Bell className="h-4 w-4 text-purple-600" />
                Notifications dans le dashboard
              </span>
              <input
                type="checkbox"
                checked={preferences.pushNotifications}
                onChange={(e) => setPreferences((prev) => ({ ...prev, pushNotifications: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-amber-900">Sécurité</h3>
          </div>
          <p className="text-sm leading-6 text-gray-700">{securityText}</p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h3 className="mb-3 font-semibold text-blue-900">Résumé rapide</h3>
          <div className="space-y-2 text-sm text-gray-700">
            {stats.map((stat) => (
              <p key={stat.label}>
                <span className="font-medium">{stat.label} :</span> {stat.value}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5">
        <p className="text-sm text-gray-500">{savedMessage || 'Les changements sont sauvegardés localement sur cet appareil.'}</p>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-purple-700"
        >
          Enregistrer les paramètres
        </button>
      </div>
    </div>
  );
}
