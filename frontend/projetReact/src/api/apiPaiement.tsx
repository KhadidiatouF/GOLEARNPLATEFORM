const BASE_URL = "http://localhost:4004";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };
};

export const apiPaiement = {
  getPaiements: async () => {
    try {
      const response = await fetch(`${BASE_URL}/paiements`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch des paiements");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch des paiements:', error);
      throw error;
    }
  },

  getOnePaiement: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/paiements/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch du paiement");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch du paiement:', error);
      throw error;
    }
  },

  createPaiement: async (paiementData: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/paiements`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(paiementData)
      });
      if (!response.ok) throw new Error("Erreur lors de la création du paiement");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du paiement:', error);
      throw error;
    }
  },

  updatePaiement: async (id: number, updates: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/paiements/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour du paiement");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du paiement:', error);
      throw error;
    }
  },

  deletePaiement: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/paiements/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression du paiement");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression du paiement:', error);
      throw error;
    }
  }
};
