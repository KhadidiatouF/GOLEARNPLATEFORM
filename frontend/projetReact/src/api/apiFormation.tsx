const BASE_URL = "http://localhost:4004";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };
};


export const apiFormation = {
  // Endpoint public - Pas besoin d'authentification
  getFormationsPubliques: async () => {
    try {
      const response = await fetch(`${BASE_URL}/formations/publiques`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error("Erreur lors du fetch des formations");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch des formations:', error);
      throw error;
    }
  },

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

  // Pas d'authentification nécessaire pour voir les détails d'une formation
  getOneFormation: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/formations/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
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
  },

  // S'inscrire à une formation
  inscriptionFormation: async (formationId: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/formations/${formationId}/inscrire`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de l'inscription");
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur inscription:', error);
      throw error;
    }
  },

  // Valider une formation (admin seulement)
  validerFormation: async (formationId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/formations/${formationId}/valider`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors de la validation de la formation");
      return await response.json();
    } catch (error) {
      console.error('Erreur validation formation:', error);
      throw error;
    }
  },

  // Rejeter une formation (admin seulement)
  rejeterFormation: async (formationId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/formations/${formationId}/rejeter`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du rejet de la formation");
      return await response.json();
    } catch (error) {
      console.error('Erreur rejet formation:', error);
      throw error;
    }
  }
};
