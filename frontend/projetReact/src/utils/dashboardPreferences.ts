import type { UserRole } from '../contexts/AuthContext';

export type ThemeColor = 'purple' | 'blue' | 'green';

export interface DashboardPreferences {
  profilePhoto: string | null;
  themeColor: ThemeColor;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

const DEFAULT_PREFERENCES: DashboardPreferences = {
  profilePhoto: null,
  themeColor: 'purple',
  emailNotifications: true,
  pushNotifications: false,
};

export function getDashboardPreferenceKey(role: UserRole, userId?: number | null): string {
  return userId ? `dashboard-preferences:${role}:${userId}` : `dashboard-preferences:${role}`;
}

export function getDashboardPreferences(role: UserRole, userId?: number | null): DashboardPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFERENCES;
  }

  const raw =
    localStorage.getItem(getDashboardPreferenceKey(role, userId)) ||
    localStorage.getItem(getDashboardPreferenceKey(role));
  if (!raw) return DEFAULT_PREFERENCES;

  try {
    return {
      ...DEFAULT_PREFERENCES,
      ...(JSON.parse(raw) as Partial<DashboardPreferences>),
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveDashboardPreferences(role: UserRole, preferences: DashboardPreferences, userId?: number | null) {
  if (typeof window === 'undefined') return;

  localStorage.setItem(getDashboardPreferenceKey(role, userId), JSON.stringify(preferences));
  window.dispatchEvent(new CustomEvent('dashboard-preferences-updated', {
    detail: {
      role,
      userId,
      preferences,
    },
  }));
}
