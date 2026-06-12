import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, isAuthenticated, logout as doLogout } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      if (!isAuthenticated()) {
        setLoading(false);
        return;
      }
      try {
        const me = await getCurrentUser();
        setUser(me);
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const logout = () => {
    setUser(null);
    doLogout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}