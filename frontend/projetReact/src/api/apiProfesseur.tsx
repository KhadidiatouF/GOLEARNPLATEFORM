const BASE_URL = "http://localhost:4004";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };
};

export const apiProfesseur = {
  getProfesseurs: async () => {
    try {
      const response = await fetch(`${BASE_URL}/profs`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch des professeurs");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch des professeurs:', error);
      throw error;
    }
  },

  getOneProfesseur: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/profs/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch du professeur");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch du professeur:', error);
      throw error;
    }
  },

  createProfesseur: async (professeurData: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/profs`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(professeurData)
      });
      if (!response.ok) throw new Error("Erreur lors de la création du professeur");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du professeur:', error);
      throw error;
    }
  },

  updateProfesseur: async (id: number, updates: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/profs/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour du professeur");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du professeur:', error);
      throw error;
    }
  },

  deleteProfesseur: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/profs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression du professeur");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression du professeur:', error);
      throw error;
    }
  }
};
