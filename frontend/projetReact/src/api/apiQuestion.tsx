const BASE_URL = "http://localhost:4004";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };
};

export const apiQuestion = {
  getQuestions: async () => {
    try {
      const response = await fetch(`${BASE_URL}/questions`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch des questions");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch des questions:', error);
      throw error;
    }
  },

  getOneQuestion: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/questions/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch de la question");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch de la question:', error);
      throw error;
    }
  },

  createQuestion: async (questionData: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/questions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(questionData)
      });
      if (!response.ok) throw new Error("Erreur lors de la création de la question");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la question:', error);
      throw error;
    }
  },

  updateQuestion: async (id: number, updates: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/questions/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour de la question");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la question:', error);
      throw error;
    }
  },

  deleteQuestion: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/questions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression de la question");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression de la question:', error);
      throw error;
    }
  }
};
