const BASE_URL = "http://localhost:4004";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };
};

export const apiProfesseur = {
  createDemande: async (demandeData: Record<string, unknown>) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/profs/demandes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify(demandeData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors de la soumission de la demande");
      return data;
    } catch (error) {
      console.error('Erreur lors de la soumission de la demande:', error);
      throw error;
    }
  },

  getDemandes: async () => {
    try {
      const response = await fetch(`${BASE_URL}/profs/demandes`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch des demandes");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch des demandes:', error);
      throw error;
    }
  },

  getDemandesEnAttente: async () => {
    try {
      const response = await fetch(`${BASE_URL}/profs/demandes/en-attente`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch des demandes en attente");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch des demandes en attente:', error);
      throw error;
    }
  },

  validerDemande: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/profs/demandes/${id}/valider`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors de la validation");
      return data;
    } catch (error) {
      console.error('Erreur lors de la validation de la demande:', error);
      throw error;
    }
  },

  rejeterDemande: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/profs/demandes/${id}/rejeter`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors du rejet");
      return data;
    } catch (error) {
      console.error('Erreur lors du rejet de la demande:', error);
      throw error;
    }
  },

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

  getHistoriqueRevenus: async () => {
    try {
      const response = await fetch(`${BASE_URL}/profs/revenus/historique`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors du fetch de l'historique des revenus");
      return data;
    } catch (error) {
      console.error("Erreur lors du fetch de l'historique des revenus:", error);
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
