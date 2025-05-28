import { useState } from 'react';

export function useAuth() {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('token'));

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
    setTokenState(newToken);
  };

  return { token, setToken };
}