import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const LanguageContext = createContext();

const translations = {
  pt: {
    login: {
      title: "Entrar",
      email: "Email",
      password: "Senha",
      loginButton: "Entrar",
      registerButton: "Criar Conta",
      or: "ou",
      googleLogin: "Continuar com Google",
      facebookLogin: "Continuar com Facebook",
      noAccount: "Não tem uma conta?",
      haveAccount: "Já tem uma conta?",
      register: "Registrar"
    },
    home: {
      title: "Dashboard",
      totalSpent: "Total Gasto",
      todayBalance: "Balanço do Dia",
      notifications: "Notificações",
      createAd: "Criar Novo Anúncio",
      audience: {
        cold: "Frio",
        hot: "Quente"
      },
      ad: {
        spent: "Gasto",
        leads: "Leads",
        costPerLead: "Custo/Lead",
        clicks: "Cliques",
        platform: "Plataforma"
      },
      actions: {
        edit: "Editar",
        delete: "Remover",
        duplicate: "Duplicar",
        share: "Compartilhar"
      }
    },
    log: {
      title: "Histórico de Anúncios",
      filters: "Filtros",
      day: "Dia",
      month: "Mês",
      year: "Ano",
      platform: "Plataforma",
      all: "Todos"
    },
    support: {
      title: "Suporte",
      search: "Pesquisar dúvidas...",
      frequent: "Dúvidas Frequentes",
      noResults: "Nenhum resultado encontrado"
    }
  },
  en: {
    login: {
      title: "Sign In",
      email: "Email",
      password: "Password",
      loginButton: "Sign In",
      registerButton: "Create Account",
      or: "or",
      googleLogin: "Continue with Google",
      facebookLogin: "Continue with Facebook",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      register: "Register"
    },
    home: {
      title: "Dashboard",
      totalSpent: "Total Spent",
      todayBalance: "Today's Balance",
      notifications: "Notifications",
      createAd: "Create New Ad",
      audience: {
        cold: "Cold",
        hot: "Hot"
      },
      ad: {
        spent: "Spent",
        leads: "Leads",
        costPerLead: "Cost/Lead",
        clicks: "Clicks",
        platform: "Platform"
      },
      actions: {
        edit: "Edit",
        delete: "Delete",
        duplicate: "Duplicate",
        share: "Share"
      }
    },
    log: {
      title: "Ad History",
      filters: "Filters",
      day: "Day",
      month: "Month",
      year: "Year",
      platform: "Platform",
      all: "All"
    },
    support: {
      title: "Support",
      search: "Search questions...",
      frequent: "Frequently Asked Questions",
      noResults: "No results found"
    }
  }
};

export function LanguageProvider({ children }) {
  const { user, updateLanguage } = useAuth();
  const [language, setLanguage] = useState("pt");

  useEffect(() => {
    if (user?.language) {
      setLanguage(user.language);
    } else {
      const storedLang = localStorage.getItem("language");
      if (storedLang) {
        setLanguage(storedLang);
      }
    }
  }, [user]);

  const changeLanguage = async (newLang) => {
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    if (user && updateLanguage) {
      await updateLanguage(newLang);
    }
  };

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

