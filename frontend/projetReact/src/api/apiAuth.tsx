const BASE_URL = "http://localhost:4004";

export const apiAuth = {
  login: async (login: string, password: string) => {
    try {
      const response = await fetch("/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: login, mdp: password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Erreur de connexion' };
      }

      // Stocker le token et les informations utilisateur
      if (data.tokens?.accessToken) {
        localStorage.setItem('accessToken', data.tokens.accessToken);
        localStorage.setItem('userId', data.tokens.user.id);
        localStorage.setItem('userName', data.tokens.user.nom);
        localStorage.setItem('userRole', data.tokens.user.role);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return { success: false, error: 'Impossible de contacter le serveur' };
    }
  },

  refreshToken: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors du rafraîchissement du token");
      }

      const data = await response.json();
      
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      return { success: false, error: 'Impossible de rafraîchir le token' };
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  getUserRole: () => {
    return localStorage.getItem('userRole');
  }
};
