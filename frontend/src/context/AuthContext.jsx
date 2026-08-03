import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user_data');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          const res = await api.get('/auth/profile');
          setUser(res.data);
          localStorage.setItem('user_data', JSON.stringify(res.data));
        } catch (error) {
          console.error('Error verificando sesión inicial:', error);
          localStorage.clear();
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
    const handleForcedLogout = () => {
      localStorage.clear();
      setUser(null);
    };
    window.addEventListener('auth:logout', handleForcedLogout);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
    let retryDelay = 1000;
    const MAX_DELAY = 30000;
    let retryTimeout = null;
    let es = null;
    let destroyed = false;

    const connectSSE = () => {
      if (destroyed) return;

      es = new EventSource(`${API_URL}/auth/events`);

      es.onopen = () => {
        retryDelay = 1000;
      };

      es.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          const savedUser = localStorage.getItem('user_data');
          if (savedUser) {
            const u = JSON.parse(savedUser);
            if (u.id === data.userId) {
              try {
                await api.get('/auth/profile');
              } catch (err) {
                if (err.response?.status === 401) {
                  localStorage.clear();
                  setUser(null);
                }
              }
            }
          }
        } catch (e) {
        }
      };

      es.onerror = () => {
        es.close();
        if (!destroyed) {
          retryTimeout = setTimeout(() => {
            retryDelay = Math.min(retryDelay * 2, MAX_DELAY);
            connectSSE();
          }, retryDelay);
        }
      };
    };

    connectSSE();

    return () => {
      destroyed = true;
      if (retryTimeout) clearTimeout(retryTimeout);
      if (es) es.close();
      window.removeEventListener('auth:logout', handleForcedLogout);
    };
  }, []);

  const login = async (usuario, clave) => {
    let clientIp = null;
    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipRes.json();
      clientIp = ipData.ip;
    } catch (e) {
      console.warn('No se pudo resolver la IP pública en cliente:', e);
    }

    const res = await api.post('/auth/login', { usuario, clave, clientIp });
    const { user, access_token, refresh_token } = res.data;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user_data', JSON.stringify(user));

    setUser(user);
    return user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.warn('Cierre de sesión local:', e);
    } finally {
      localStorage.clear();
      setUser(null);
    }
  };

  const hasRole = (rolesArray) => {
    if (!user) return false;
    return rolesArray.includes(user.rol);
  };

  const canEditTalento = (talento) => {
    if (!user || !talento) return false;
    if (user.rol === 'Administrador') return true;
    if (talento.registradoPor?.id === user.id) return true;
    if (talento.empresa && user.empresasAsignadas) {
      return user.empresasAsignadas.some(re => re.empresa?.id === talento.empresa.id || re.empresaId === talento.empresa.id);
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasRole, canEditTalento }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
