import { createContext, useContext, useMemo, useState } from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("electrodead_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("electrodead_user");
    return stored ? JSON.parse(stored) : null;
  });

  async function login(credentials) {
    const { data } = await api.post("/auth/login", credentials);

    localStorage.setItem("electrodead_token", data.token);
    localStorage.setItem("electrodead_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("electrodead_token");
    localStorage.removeItem("electrodead_user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      login,
      logout,
      token,
      user
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}
