import { useState } from 'react';
import axios from 'axios';

export function useAuth() {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('token'));

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
    setTokenState(newToken);
  };

  // Set default axios auth header on init if token exists
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  return { token, setToken };
}