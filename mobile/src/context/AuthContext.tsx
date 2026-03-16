import React, { createContext, useContext, useEffect, useReducer } from "react";
import * as storage from "../services/storage";
import api from "../services/api";
import {
  TokenResponse,
  SignupRequest,
  LoginRequest,
} from "../types";

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
}

type AuthAction =
  | { type: "RESTORE_TOKEN"; token: string | null }
  | { type: "SIGN_IN"; token: string }
  | { type: "SIGN_OUT" };

interface AuthContextValue extends AuthState {
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: action.token !== null,
        accessToken: action.token,
      };
    case "SIGN_IN":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        accessToken: action.token,
      };
    case "SIGN_OUT":
      return {
        ...state,
        isAuthenticated: false,
        accessToken: null,
      };
  }
}

async function storeTokens(data: TokenResponse) {
  await storage.setItem("access_token", data.access_token);
  await storage.setItem("refresh_token", data.refresh_token);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    isLoading: true,
    isAuthenticated: false,
    accessToken: null,
  });

  useEffect(() => {
    (async () => {
      const token = await storage.getItem("access_token");
      dispatch({ type: "RESTORE_TOKEN", token });
    })();
  }, []);

  const authContext: AuthContextValue = {
    ...state,
    signUp: async (email: string, password: string) => {
      const body: SignupRequest = { email, password };
      const { data } = await api.post<TokenResponse>("/auth/signup", body);
      await storeTokens(data);
      dispatch({ type: "SIGN_IN", token: data.access_token });
    },
    signIn: async (email: string, password: string) => {
      const body: LoginRequest = { email, password };
      const { data } = await api.post<TokenResponse>("/auth/login", body);
      await storeTokens(data);
      dispatch({ type: "SIGN_IN", token: data.access_token });
    },
    signOut: async () => {
      await storage.deleteItem("access_token");
      await storage.deleteItem("refresh_token");
      dispatch({ type: "SIGN_OUT" });
    },
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
