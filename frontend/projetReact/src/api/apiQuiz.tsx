const BASE_URL = "http://localhost:4004";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };
};

export const apiQuiz = {
  getQuizzes: async () => {
    try {
      const response = await fetch(`${BASE_URL}/quiz`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch des quiz");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch des quiz:', error);
      throw error;
    }
  },

  getOneQuiz: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/quiz/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch du quiz");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch du quiz:', error);
      throw error;
    }
  },

  createQuiz: async (quizData: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/quiz`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(quizData)
      });
      if (!response.ok) throw new Error("Erreur lors de la création du quiz");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du quiz:', error);
      throw error;
    }
  },

  updateQuiz: async (id: number, updates: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/quiz/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour du quiz");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du quiz:', error);
      throw error;
    }
  },

  deleteQuiz: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/quiz/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression du quiz");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression du quiz:', error);
      throw error;
    }
  },

  submitQuiz: async (id: number, answers: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/quiz/${id}/submit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(answers)
      });
      if (!response.ok) throw new Error("Erreur lors de la soumission du quiz");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la soumission du quiz:', error);
      throw error;
    }
  },

  checkCanTakeFinalQuiz: async (formationId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/quiz/formation/${formationId}/can-take-final`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors de la vérification");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      throw error;
    }
  },

  getQuizSummary: async (formationId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/quiz/formation/${formationId}/summary`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch du résumé");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch du résumé:', error);
      throw error;
    }
  },

  getFinalQuiz: async (formationId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/quiz/final/${formationId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch du quiz final");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch du quiz final:', error);
      throw error;
    }
  }
};
