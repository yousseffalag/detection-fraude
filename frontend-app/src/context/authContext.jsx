import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // infos utilisateur (décodées du token)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);

        console.log("decode : ", decoded)

        // Vérifie si le token est expiré
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          console.log('Token expiré');
          logout();
        } else {
          setUser({ ...decoded, token }); // ajoute le token à l'objet utilisateur
        }
        setLoading(false);
      } catch (err) {
        console.error('Token invalide', err);
        logout();
      }
    }
  }, []);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      setUser({ ...decoded, token }); // stocke les infos + token
      localStorage.setItem('token', token);
    } catch (err) {
      console.error('Erreur lors du décodage du token', err);
    } finally {
      setLoading(false); // 🔑 c'est ici que tu arrêtes le spinner
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
