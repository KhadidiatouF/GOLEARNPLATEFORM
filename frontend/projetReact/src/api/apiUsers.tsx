
const BASE_URL = "http://localhost:4004"; 

export const apiUsers ={
  getUsers : async () => {
    const accessToken = localStorage.getItem('accessToken')
  try {

    const response = await fetch("/users",
        {
            method: 'GET',
            headers:{'Authorization': `Bearer ${accessToken}`}
        });
    console.log('Réponse API:', response.status, response.statusText);
    const result = await response.json();
    console.log('Données API:', result);
    // Le backend retourne { success: true, data: [...], message: string }
    return result.data || [];
  }catch (error) {
      console.error('Erreur lors du fetch des utilisateurs:', error);
      throw error; 
    }
  },

  getOneUser : async (id: number) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await fetch(`${BASE_URL}/users/${id}`,
          {
              method: 'GET',
              headers:{'Authorization': `Bearer ${accessToken}`}
          });
      if (!response.ok) throw new Error("Erreur lors du fetch des tâches");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  updateUser : async (id: number, updates: Record<string, unknown>) => {
    const accessToken = localStorage.getItem('accessToken')

  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${accessToken}` },
      body: JSON.stringify(updates),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
 },

  deleteUser : async (id: number) => {
        const accessToken = localStorage.getItem('accessToken')

    try {
        await fetch(`${BASE_URL}/users/${id}`, { method: "DELETE", headers: {'Authorization': `Bearer ${accessToken}` }});
    } catch (error) {
        console.error(error);
        throw error;
    }
  },

  loginUser : async (login: string, password: string) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (!data.error) {
        localStorage.setItem('accessToken', data.tokens.accessToken);
        localStorage.setItem('userId', data.tokens.user.id);
        localStorage.setItem('userName', data.tokens.user.nom);
        localStorage.setItem('userPrenom', data.tokens.user.prenom);
        localStorage.setItem('userRole', data.tokens.user.role);

        return { success: true, user: data.tokens.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Erreur API:", error);
      return { success: false, error: "Impossible de contacter le serveur" };
    }
  },

  createUsers: async (userData: Record<string, unknown>) => {
    try {
      const res = await fetch(`${BASE_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData)
      });

      const data = await res.json();  
      if (!res.ok) {
        console.error("Erreur API:", data);
        return { success: false, error: data.message || "Erreur API" };
      }

      return { success: true, user: data.data };
    } catch (err) {
      console.error("Erreur inscription:", err);
      return { success: false, error: "Impossible de contacter le serveur" };
    }
  }

}