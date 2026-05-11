import { createContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axios';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const checkToken = async () => {
    const token = localStorage.getItem('token');

    // If no token exists, we can stop loading immediately
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // Use your 'api' instance (which should have the interceptors we discussed)
      const res = await api.get('/me');

      // Successfully got the user from the backend
      setUser(res.data);

    } catch (err) {
      // If /me fails (e.g., database deleted, token expired)
      console.error("Session invalid, clearing data...", err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      // Always stop the loading state so the app can render the Login or Dashboard
      setLoading(false);
    }
  };

  checkToken();
}, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/login', { email, password });
    localStorage.setItem('token', res.data.access_token);
    setUser(res.data.user);
  };

  const logout = () => {
    api.post('/logout');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
