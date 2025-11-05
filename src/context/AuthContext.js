import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken) => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem("token");
        setToken(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        
        // Sincronizar idioma do localStorage com o usuário após login
        const storedLang = localStorage.getItem("language");
        if (storedLang && data.user.language !== storedLang) {
          // Atualizar no servidor após um pequeno delay para garantir que o token está setado
          setTimeout(async () => {
            try {
              await fetch("/api/auth/language", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${data.token}`
                },
                body: JSON.stringify({ language: storedLang })
              });
            } catch (error) {
              console.error("Error syncing language:", error);
            }
          }, 100);
        }
        
        router.push("/home");
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Erro ao conectar com o servidor" };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        
        // Sincronizar idioma do localStorage com o usuário após registro
        const storedLang = localStorage.getItem("language");
        if (storedLang && data.user.language !== storedLang) {
          // Atualizar no servidor após um pequeno delay para garantir que o token está setado
          setTimeout(async () => {
            try {
              await fetch("/api/auth/language", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${data.token}`
                },
                body: JSON.stringify({ language: storedLang })
              });
            } catch (error) {
              console.error("Error syncing language:", error);
            }
          }, 100);
        }
        
        router.push("/home");
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Erro ao conectar com o servidor" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/");
  };

  const updateLanguage = async (language) => {
    try {
      const response = await fetch("/api/auth/language", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ language })
      });

      if (response.ok) {
        const data = await response.json();
        setUser({ ...user, language: data.language });
        return { success: true };
      }
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateLanguage }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

