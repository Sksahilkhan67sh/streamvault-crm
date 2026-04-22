import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem("crm_admin")); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  // Validate token on mount
  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("crm_token");
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await authAPI.getMe();
        setAdmin(data.admin);
        localStorage.setItem("crm_admin", JSON.stringify(data.admin));
      } catch {
        localStorage.removeItem("crm_token");
        localStorage.removeItem("crm_admin");
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem("crm_token", data.token);
    localStorage.setItem("crm_admin", JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("crm_token");
    localStorage.removeItem("crm_admin");
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}
