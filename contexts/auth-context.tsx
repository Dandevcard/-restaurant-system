"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
}
//tipando o contexto de autenticação
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Carregar usuário do localStorage ao iniciar
    const storedUser = localStorage.getItem("restaurant_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulação de login - em um app real, isso seria uma chamada de API
    const users = JSON.parse(localStorage.getItem("restaurant_users") || "[]");
    const foundUser = users.find((u: any) => u.email === email);

    if (foundUser && foundUser.password === password) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem(
        "restaurant_user",
        JSON.stringify(userWithoutPassword)
      );
      return;
    }

    throw new Error("Credenciais inválidas");
  };

  const signup = async (name: string, email: string, password: string) => {
    // Simulação de cadastro - em um app real, isso seria uma chamada de API
    const users = JSON.parse(localStorage.getItem("restaurant_users") || "[]");

    // Verificar se o email já existe
    if (users.some((u: any) => u.email === email)) {
      throw new Error("Email já cadastrado");
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: "admin" as const,
    };

    users.push(newUser);
    localStorage.setItem("restaurant_users", JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem(
      "restaurant_user",
      JSON.stringify(userWithoutPassword)
    );
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("restaurant_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext)
  if(context === undefined) {
    throw new Error ('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
