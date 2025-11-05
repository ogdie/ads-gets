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
      loading: "Carregando...",
      user: "Usuário",
      logout: "Sair",
      ads: "Anúncios",
      deleteConfirm: "este anúncio?",
      linkCopied: "Link copiado para área de transferência!",
      toStart: "para começar",
      audience: {
        cold: "Frio",
        hot: "Quente",
        label: "Público"
      },
      ad: {
        spent: "Gasto",
        leads: "Leads",
        costPerLead: "Custo/Lead",
        clicks: "Cliques",
        platform: "Plataforma",
        impressions: "Impressões",
        reach: "Alcance",
        description: "Descrição",
        title: "Título",
        budget: "Orçamento",
        startDate: "Data de Início",
        status: {
          active: "Ativa",
          paused: "Pausada",
          finished: "Finalizada"
        }
      },
      modal: {
        editAd: "Editar Anúncio",
        adDetails: "Detalhes do Anúncio",
        confirmDelete: "Confirmar Exclusão",
        confirmDeleteMessage: "Tem certeza que deseja excluir o anúncio",
        confirmDeleteWarning: "Esta ação não pode ser desfeita.",
        yesDelete: "Sim, Excluir",
        cancel: "Cancelar",
        save: "Salvar",
        createButton: "Criar Anúncio",
        required: "*",
        confirmButton: "Confirmar",
        deleteWarning: "Esta ação não pode ser desfeita.",
        duplicateTitle: "Duplicar Anúncio",
        duplicateMessage: "Deseja criar uma cópia do anúncio",
        duplicateButton: "Duplicar",
        shareTitle: "Compartilhar Anúncio",
        shareLink: "Link para compartilhar",
        shareNative: "Compartilhar",
        close: "Fechar"
      },
      chart: {
        spendingByPlatform: "Gastos por Plataforma"
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
      all: "Todos",
      loading: "Carregando...",
      noAdsFound: "Nenhum anúncio encontrado",
      months: {
        "01": "Janeiro",
        "02": "Fevereiro",
        "03": "Março",
        "04": "Abril",
        "05": "Maio",
        "06": "Junho",
        "07": "Julho",
        "08": "Agosto",
        "09": "Setembro",
        "10": "Outubro",
        "11": "Novembro",
        "12": "Dezembro"
      }
    },
    support: {
      title: "Suporte",
      search: "Pesquisar dúvidas...",
      frequent: "Dúvidas Frequentes",
      noResults: "Nenhum resultado encontrado"
    },
    navbar: {
      home: "Início",
      history: "Histórico",
      support: "Suporte"
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
      loading: "Loading...",
      user: "User",
      logout: "Logout",
      ads: "Ads",
      deleteConfirm: "this ad?",
      linkCopied: "Link copied to clipboard!",
      toStart: "to get started",
      audience: {
        cold: "Cold",
        hot: "Hot",
        label: "Audience"
      },
      ad: {
        spent: "Spent",
        leads: "Leads",
        costPerLead: "Cost/Lead",
        clicks: "Clicks",
        platform: "Platform",
        impressions: "Impressions",
        reach: "Reach",
        description: "Description",
        title: "Title",
        budget: "Budget",
        startDate: "Start Date",
        status: {
          active: "Active",
          paused: "Paused",
          finished: "Finished"
        }
      },
      modal: {
        editAd: "Edit Ad",
        adDetails: "Ad Details",
        confirmDelete: "Confirm Deletion",
        confirmDeleteMessage: "Are you sure you want to delete the ad",
        confirmDeleteWarning: "This action cannot be undone.",
        yesDelete: "Yes, Delete",
        cancel: "Cancel",
        save: "Save",
        createButton: "Create Ad",
        required: "*",
        confirmButton: "Confirm",
        deleteWarning: "This action cannot be undone.",
        duplicateTitle: "Duplicate Ad",
        duplicateMessage: "Do you want to create a copy of the ad",
        duplicateButton: "Duplicate",
        shareTitle: "Share Ad",
        shareLink: "Share link",
        shareNative: "Share",
        close: "Close"
      },
      chart: {
        spendingByPlatform: "Spending by Platform"
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
      all: "All",
      loading: "Loading...",
      noAdsFound: "No ads found",
      months: {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December"
      }
    },
    support: {
      title: "Support",
      search: "Search questions...",
      frequent: "Frequently Asked Questions",
      noResults: "No results found"
    },
    navbar: {
      home: "Home",
      history: "History",
      support: "Support"
    }
  }
};

export function LanguageProvider({ children }) {
  const { user, updateLanguage, token } = useAuth();
  const [language, setLanguage] = useState("pt");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("language");
      if (storedLang) {
        setLanguage(storedLang);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      const storedLang = localStorage.getItem("language");
      
      if (user && token && user.language) {        
        if (storedLang && user.language !== storedLang && updateLanguage) {
          updateLanguage(storedLang);
        } else if (!storedLang) {
          setLanguage(user.language);
          localStorage.setItem("language", user.language);
        }
      }
    }
  }, [user, token, mounted, updateLanguage]);

  const changeLanguage = async (newLang) => {
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    if (user && token && updateLanguage) {
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