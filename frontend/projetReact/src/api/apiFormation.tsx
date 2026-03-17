const BASE_URL = "http://localhost:4004";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };
};

export const apiFormation = {
  getFormations: async () => {
    try {
      const response = await fetch(`${BASE_URL}/formations`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch des formations");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch des formations:', error);
      throw error;
    }
  },

  getOneFormation: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/formations/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch de la formation");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch de la formation:', error);
      throw error;
    }
  },

  createFormation: async (formationData: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/formations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formationData)
      });
      if (!response.ok) throw new Error("Erreur lors de la création de la formation");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la formation:', error);
      throw error;
    }
  },

  createCompleteFormation: async (formationData: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/formations/complete`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formationData)
      });
      if (!response.ok) throw new Error("Erreur lors de la création de la formation complète");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la formation complète:', error);
      throw error;
    }
  },

  updateFormation: async (id: number, updates: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/formations/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour de la formation");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la formation:', error);
      throw error;
    }
  },

  deleteFormation: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/formations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression de la formation");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression de la formation:', error);
      throw error;
    }
  }
};
