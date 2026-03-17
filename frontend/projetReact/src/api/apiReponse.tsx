const BASE_URL = "http://localhost:4004";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };
};

export const apiReponse = {
  getReponses: async () => {
    try {
      const response = await fetch(`${BASE_URL}/reponses`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch des réponses");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch des réponses:', error);
      throw error;
    }
  },

  getOneReponse: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/reponses/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch de la réponse");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch de la réponse:', error);
      throw error;
    }
  },

  createReponse: async (reponseData: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/reponses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reponseData)
      });
      if (!response.ok) throw new Error("Erreur lors de la création de la réponse");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la réponse:', error);
      throw error;
    }
  },

  updateReponse: async (id: number, updates: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/reponses/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour de la réponse");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réponse:', error);
      throw error;
    }
  },

  deleteReponse: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/reponses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression de la réponse");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression de la réponse:', error);
      throw error;
    }
  }
};
