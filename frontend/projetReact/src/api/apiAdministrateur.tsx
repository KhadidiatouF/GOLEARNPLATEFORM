const BASE_URL = "http://localhost:4004";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };
};

export const apiAdministrateur = {
  getAdministrateurs: async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch des administrateurs");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch des administrateurs:', error);
      throw error;
    }
  },

  getOneAdministrateur: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch de l'administrateur");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch de l\'administrateur:', error);
      throw error;
    }
  },

  createAdministrateur: async (adminData: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/admin`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(adminData)
      });
      if (!response.ok) throw new Error("Erreur lors de la création de l'administrateur");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de l\'administrateur:', error);
      throw error;
    }
  },

  updateAdministrateur: async (id: number, updates: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour de l'administrateur");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'administrateur:', error);
      throw error;
    }
  },

  deleteAdministrateur: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression de l'administrateur");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'administrateur:', error);
      throw error;
    }
  },

  getStatistics: async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/statistics`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch des statistiques");
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Erreur lors du fetch des statistiques:', error);
      throw error;
    }
  }
};
