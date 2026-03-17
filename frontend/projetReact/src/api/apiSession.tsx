const BASE_URL = "http://localhost:4004";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };
};

export const apiSession = {
  getSessions: async () => {
    try {
      const response = await fetch(`${BASE_URL}/sessions`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch des sessions");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch des sessions:', error);
      throw error;
    }
  },

  getOneSession: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/sessions/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors du fetch de la session");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du fetch de la session:', error);
      throw error;
    }
  },

  createSession: async (sessionData: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/sessions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(sessionData)
      });
      if (!response.ok) throw new Error("Erreur lors de la création de la session");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
      throw error;
    }
  },

  updateSession: async (id: number, updates: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BASE_URL}/sessions/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour de la session");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la session:', error);
      throw error;
    }
  },

  deleteSession: async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/sessions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression de la session");
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression de la session:', error);
      throw error;
    }
  }
};
