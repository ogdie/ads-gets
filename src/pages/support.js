import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import { FaSearch, FaSignOutAlt } from "react-icons/fa";

export default function Support() {
  const router = useRouter();
  const { token, loading: authLoading, logout } = useAuth();
  const { t, language } = useLanguage();
  const [frequentFAQs, setFrequentFAQs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/");
    }
  }, [token, authLoading]);

  useEffect(() => {
    if (token) {
      fetchFrequentFAQs();
    }
  }, [token, language]);

  const fetchFrequentFAQs = async () => {
    try {
      const response = await fetch(`/api/support/frequent?language=${language}`);
      if (response.ok) {
        const data = await response.json();
        setFrequentFAQs(data);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(`/api/support/search?q=${encodeURIComponent(query)}&language=${language}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error("Error searching FAQs:", error);
    } finally {
      setSearching(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  const displayFAQs = searchQuery.trim() ? searchResults : frequentFAQs;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0 md:pt-16 flex flex-col">
      <div className="bg-white border-b border-gray-200 sticky top-0 md:top-16 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl md:text-2xl font-bold">{t("support.title")}</h1>
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
              title="Sair"
            >
              <FaSignOutAlt className="text-lg" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t("support.search")}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {searchQuery.trim() ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {language === "pt" ? "Resultados da busca" : "Search Results"}
            </h2>
            {searching ? (
              <div className="text-center py-8">
                <div className="text-gray-500">
                  {language === "pt" ? "Buscando..." : "Searching..."}
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((faq) => (
                  <FAQItem key={faq._id} faq={faq} />
                ))}
              </div>
            ) : (
              <div className="bg-[#1f6bbb] text-white rounded-lg shadow-md p-12 text-center">
                <p className="text-white/90 text-lg">{t("support.noResults")}</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">{t("support.frequent")}</h2>
            {frequentFAQs.length > 0 ? (
              <div className="space-y-4">
                {frequentFAQs.map((faq) => (
                  <FAQItem key={faq._id} faq={faq} />
                ))}
              </div>
            ) : (
              <div className="bg-[#1f6bbb] text-white rounded-lg shadow-md p-12 text-center">
                <p className="text-white/90 text-lg">
                  {language === "pt" ? "Nenhuma dúvida frequente encontrada" : "No frequent questions found"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
      <Navbar />
    </div>
  );
}

function FAQItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#1f6bbb] text-white rounded-lg shadow-md overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#6aa8ff] transition-colors"
      >
        <span className="font-semibold text-lg">{faq.question}</span>
        <span className="text-white/90">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-white/30">
          <p className="text-white/95 whitespace-pre-line">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}