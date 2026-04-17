const BASE_URL = "http://localhost:4004";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };
};

export const apiProgression = {
  // Créer une progression pour une inscription
  createProgression: async (apprenantFormationId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/progressions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ apprenantFormationId })
      });
      if (!response.ok) throw new Error("Erreur lors de la création de la progression");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la progression:', error);
      throw error;
    }
  },

  // Récupérer la progression d'un apprenant pour une formation
  getProgression: async (apprenantFormationId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/progressions/apprenant/${apprenantFormationId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors de la récupération de la progression");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de la progression:', error);
      throw error;
    }
  },

  // Marquer un chapitre comme complété
  completeChapter: async (apprenantFormationId: number, chapitreId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/progressions/complete`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ apprenantFormationId, chapitreId })
      });
      if (!response.ok) throw new Error("Erreur lors de la complétion du chapitre");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la complétion du chapitre:', error);
      throw error;
    }
  },

  // Récupérer les progressions pour un professeur
  getProgressionByProfesseur: async () => {
    try {
      const response = await fetch(`${BASE_URL}/progressions/professeur`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors de la récupération des progressions");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des progressions:', error);
      throw error;
    }
  },

  // // Sauvegarder le score d'un quiz de session
  // saveQuizScore: async (data: { sessionId: number; score: number; passed: boolean }) => {
  //   try {
  //     const response = await fetch(`${BASE_URL}/progressions/quiz`, {
  //       method: 'POST',
  //       headers: getAuthHeaders(),
  //       body: JSON.stringify(data)
  //     });
  //     if (!response.ok) throw new Error("Erreur lors de la sauvegarde du score quiz");
  //     return await response.json();
  //   } catch (error) {
  //     console.error('Erreur sauvegarde score quiz:', error);
  //     throw error;
  //   }
  // }
};
