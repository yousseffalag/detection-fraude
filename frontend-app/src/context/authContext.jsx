import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // infos utilisateur (décodées du token)

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Vérifie si le token est expiré
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          logout();
        } else {
          setUser({ ...decoded, token }); // ajoute le token à l'objet utilisateur
        }
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
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
