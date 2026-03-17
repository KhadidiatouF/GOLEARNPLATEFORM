const BASE_URL = "http://localhost:4004";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };
};

export const apiApprenant = {
  getApprenants: async () => {
    try {
      const response = await fetch(`${BASE_URL}/apprenants`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch des apprenants");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch des apprenants:', error);
      throw error;
    }
  },

  getOneApprenant: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/apprenants/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch de l'apprenant");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch de l\'apprenant:', error);
      throw error;
    }
  },

  createApprenant: async (apprenantData: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/apprenants`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(apprenantData)
      });
      if (!response.ok) throw new Error("Erreur lors de la création de l'apprenant");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de l\'apprenant:', error);
      throw error;
    }
  },

  updateApprenant: async (id: number, updates: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/apprenants/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour de l'apprenant");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'apprenant:', error);
      throw error;
    }
  },

  deleteApprenant: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/apprenants/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression de l'apprenant");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'apprenant:', error);
      throw error;
    }
  }
};
