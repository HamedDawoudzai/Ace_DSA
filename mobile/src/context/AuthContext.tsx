import React, { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";
import * as storage from "../services/storage";
import api from "../services/api";
import { getApiBaseUrl } from "../config";
import { accessTokenNeedsRefresh } from "../utils/jwt";
import { TokenResponse, SignupRequest, LoginRequest, RefreshRequest } from "../types";

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  showWelcome: boolean;
}

type AuthAction =
  | { type: "RESTORE_TOKEN"; token: string | null }
  | { type: "SIGN_IN"; token: string }
  | { type: "SIGN_OUT" }
  | { type: "WELCOME_DONE" };

interface SignUpParams {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

interface AuthContextValue extends AuthState {
  signUp: (params: SignUpParams) => Promise<void>;
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  completeWelcome: () => void;
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
        showWelcome: false,
      };
    case "SIGN_IN":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        accessToken: action.token,
        showWelcome: true,
      };
    case "SIGN_OUT":
      return {
        ...state,
        isAuthenticated: false,
        accessToken: null,
        showWelcome: false,
      };
    case "WELCOME_DONE":
      return {
        ...state,
        showWelcome: false,
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
    showWelcome: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const access = await storage.getItem("access_token");
        const refresh = await storage.getItem("refresh_token");
        const base = getApiBaseUrl();

        if (!access && !refresh) {
          dispatch({ type: "RESTORE_TOKEN", token: null });
          return;
        }

        if (refresh && accessTokenNeedsRefresh(access)) {
          try {
            const body: RefreshRequest = { refresh_token: refresh };
            const { data } = await axios.post<TokenResponse>(`${base}/auth/refresh`, body, {
              headers: { "Content-Type": "application/json" },
              timeout: 15000,
            });
            await storeTokens(data);
            dispatch({ type: "RESTORE_TOKEN", token: data.access_token });
            return;
          } catch {
            await storage.deleteItem("access_token");
            await storage.deleteItem("refresh_token");
            dispatch({ type: "RESTORE_TOKEN", token: null });
            return;
          }
        }

        if (!refresh && accessTokenNeedsRefresh(access)) {
          await storage.deleteItem("access_token");
          dispatch({ type: "RESTORE_TOKEN", token: null });
          return;
        }

        dispatch({ type: "RESTORE_TOKEN", token: access });
      } catch {
        await storage.deleteItem("access_token");
        await storage.deleteItem("refresh_token");
        dispatch({ type: "RESTORE_TOKEN", token: null });
      }
    })();
  }, []);

  const authContext: AuthContextValue = {
    ...state,
    signUp: async (params: SignUpParams) => {
      const body: SignupRequest = {
        first_name: params.firstName,
        last_name: params.lastName,
        username: params.username,
        email: params.email,
        password: params.password,
      };
      const { data } = await api.post<TokenResponse>("/auth/signup", body);
      await storeTokens(data);
      dispatch({ type: "SIGN_IN", token: data.access_token });
    },
    signIn: async (identifier: string, password: string) => {
      const body: LoginRequest = { identifier, password };
      const { data } = await api.post<TokenResponse>("/auth/login", body);
      await storeTokens(data);
      dispatch({ type: "SIGN_IN", token: data.access_token });
    },
    signOut: async () => {
      await storage.deleteItem("access_token");
      await storage.deleteItem("refresh_token");
      dispatch({ type: "SIGN_OUT" });
    },
    completeWelcome: () => {
      dispatch({ type: "WELCOME_DONE" });
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
