import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Helper to handle API responses safely
const handleApiResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  let data = {};
  
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    // If not JSON, get raw text (could be gateway error or crash log)
    const text = await response.text();
    throw new Error(text || `Erreur serveur (Status: ${response.status})`);
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || `Erreur (Status: ${response.status})`);
  }

  return data;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = async (email, mdp) => {
    setError(null);
    try {
      const response = await fetch('/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, mdp }),
      });

      const data = await handleApiResponse(response);
      
      setUser(data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
      return data.data;
    } catch (err) {
      // If the backend isn't running, show a friendly connection message
      if (err.message.includes('Failed to fetch')) {
        const connErr = new Error("Impossible de se connecter au serveur backend. Assurez-vous que le serveur Node.js est lancé sur le port 3000.");
        setError(connErr.message);
        throw connErr;
      }
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fetch('/users/logout', { method: 'POST' });
    } catch (err) {
      console.error('Erreur lors de la déconnexion backend:', err);
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (formData) => {
    setError(null);
    try {
      const isMultipart = formData instanceof FormData;
      
      const response = await fetch('/users', {
        method: 'POST',
        headers: isMultipart ? {} : { 'Content-Type': 'application/json' },
        body: isMultipart ? formData : JSON.stringify(formData),
      });

      const data = await handleApiResponse(response);
      return data.user;
    } catch (err) {
      if (err.message.includes('Failed to fetch')) {
        const connErr = new Error("Impossible de se connecter au serveur backend. Assurez-vous que le serveur Node.js est lancé sur le port 3000.");
        setError(connErr.message);
        throw connErr;
      }
      setError(err.message);
      throw err;
    }
  };

  const checkSession = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/users/${user._id}`);
      if (!response.ok) {
        setUser(null);
        localStorage.removeItem('user');
      } else {
        const data = await handleApiResponse(response);
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (err) {
      console.error('Session verification failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, register, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
