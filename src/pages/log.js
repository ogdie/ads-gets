import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import AdCard from "../components/AdCard";
import AdModal from "../components/AdModal";
import { FaSignOutAlt } from "react-icons/fa";

export default function Log() {
  const router = useRouter();
  const { token, loading: authLoading, logout } = useAuth();
  const { t, language } = useLanguage();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    day: "",
    month: "",
    year: "",
    platform: ""
  });

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/");
    }
  }, [token, authLoading]);

  useEffect(() => {
    if (token) {
      fetchAds();
    }
  }, [token, filters]);

  const fetchAds = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.day) params.append("day", filters.day);
      if (filters.month) params.append("month", filters.month);
      if (filters.year) params.append("year", filters.year);
      if (filters.platform) params.append("platform", filters.platform);

      const response = await fetch(`/api/ads?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAds(data);
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

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

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0 md:pt-16 flex flex-col">
      <div className="bg-white border-b border-gray-200 sticky top-0 md:top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl md:text-2xl font-bold">{t("log.title")}</h1>
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
              title="Sair"
            >
              <FaSignOutAlt className="text-lg" />
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t("log.year")}</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">{t("log.all")}</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("log.month")}</label>
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange("month", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">{t("log.all")}</option>
                {months.map(month => (
                  <option key={month} value={month.toString().padStart(2, "0")}>
                    {month.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("log.day")}</label>
              <select
                value={filters.day}
                onChange={(e) => handleFilterChange("day", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">{t("log.all")}</option>
                {days.map(day => (
                  <option key={day} value={day.toString().padStart(2, "0")}>
                    {day.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("log.platform")}</label>
              <select
                value={filters.platform}
                onChange={(e) => handleFilterChange("platform", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">{t("log.all")}</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="Google">Google</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {ads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ads.map((ad) => (
              <AdCard
                key={ad._id}
                ad={ad}
                onEdit={(ad) => {
                  setSelectedAd(ad);
                  setIsModalOpen(true);
                }}
                onDelete={() => {}}
                onDuplicate={() => {}}
                onShare={() => {}}
                onClick={(ad) => {
                  setSelectedAd(ad);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">
              {language === "pt" ? "Nenhum anúncio encontrado" : "No ads found"}
            </p>
          </div>
        )}
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
      <Navbar />

      <AdModal
        ad={selectedAd}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAd(null);
        }}
        onSave={() => {}}
      />
    </div>
  );
}

