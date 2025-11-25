// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import api from "../api/client";
import { 
  saveTokens,
  clearAllTokens,
  getAccessToken,
  getUserEmail
} from "../utils/auth";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load stored tokens on refresh
  useEffect(() => {
    const token = getAccessToken();
    const email = getUserEmail();

    if (token && email) {
      setUser({ email });
    }
  }, []);

  // LOGIN FUNCTION
  async function login({ email, password, remember = true }) {
    try {
      const resp = await api.post("/auth/login", { email, password });

      const access =
        resp.data.access_token ||
        resp.data.token ||
        resp.data.access ||
        null;

      const refresh =
        resp.data.refresh_token ||
        resp.data.refreshToken ||
        resp.data.refresh ||
        null;

      if (!access) {
        console.error("Invalid response:", resp.data);
        throw new Error("Login failed");
      }

      // Save tokens
      saveTokens(access, refresh, email, remember);

      // Save user state
      setUser({ email });
      return resp.data;

    } catch (err) {
      console.error("API Login Error:", err);
      throw err;
    }
  }

  // LOGOUT FUNCTION
  function logout() {
    clearAllTokens();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
