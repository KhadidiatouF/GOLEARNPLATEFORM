const BASE_URL = "http://localhost:4004";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };
};

// Interface pour les formations avec progression de l'apprenant
interface EnrolledFormation {
  id: number;
  title: string;
  professor: string;
  duration: string;
  image: string | null;
  dateInscription: string;
  progress: number;
  price: number;
  typeCours: string;
}

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

  // Récupérer les formations auxquelles l'apprenant est inscrit avec sa progression
  getFormationsWithProgress: async (userId: number): Promise<{ success: boolean; data: EnrolledFormation[] }> => {
    try {
      const response = await fetch(`${BASE_URL}/apprenants/by-user/${userId}/formations`, {
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
