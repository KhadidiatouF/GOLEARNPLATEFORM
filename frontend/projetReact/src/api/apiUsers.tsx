
const BASE_URL = "http://localhost:4004"; 

export const apiUsers ={
  getUsers : async (page: number = 1, limit: number = 10, search: string = '', role: string = '') => {
    const accessToken = localStorage.getItem('accessToken')
  try {
    let url = `${BASE_URL}/users?page=${page}&limit=${limit}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    if (role && role.trim()) {
      url += `&role=${encodeURIComponent(role.trim())}`;
    }

    const response = await fetch(url,
        {
            method: 'GET',
            headers:{'Authorization': `Bearer ${accessToken}`}
        });
    console.log('Réponse API:', response.status, response.statusText);
    const result = await response.json();
    console.log('Données API:', result);
    // Le backend retourne { success: true, data: { users: [...], pagination: {...} }, message: string }
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
    const accessToken = localStorage.getItem('accessToken');
    console.log('API deleteUser - ID:', id, 'Token:', accessToken);

    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, { 
        method: "DELETE", 
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('Réponse suppression:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur API:', errorText);
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      return true;
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
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
    const accessToken = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${BASE_URL}/users`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accessToken}`
          },
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
  },

  // Récupérer le profil de l'utilisateur connecté (avec son solde)
  getMonProfil: async () => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`${BASE_URL}/users/moi`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) throw new Error("Erreur lors du fetch du profil");
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}