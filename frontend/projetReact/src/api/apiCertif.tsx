const BASE_URL = "http://localhost:4004";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };
};

export const apiCertif = {
  getCertifications: async () => {
    try {
      const response = await fetch(`${BASE_URL}/certifications`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch des certifications");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch des certifications:', error);
      throw error;
    }
  },

  getAdminCertifications: async () => {
    try {
      const response = await fetch(`${BASE_URL}/certifications/admin/all`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch des certifications admin");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch des certifications admin:', error);
      throw error;
    }
  },

  getProfessorCertifications: async () => {
    try {
      const response = await fetch(`${BASE_URL}/certifications/professeur/mine`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch des certifications du professeur");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch des certifications du professeur:', error);
      throw error;
    }
  },

  getOneCertification: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/certifications/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch de la certification");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch de la certification:', error);
      throw error;
    }
  },

  createCertification: async (certificationData: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/certifications`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(certificationData)
      });
      if (!response.ok) throw new Error("Erreur lors de la création de la certification");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la certification:', error);
      throw error;
    }
  },

  deleteCertification: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/certifications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression de la certification");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression de la certification:', error);
      throw error;
    }
  }
};
