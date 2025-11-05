import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import AdCard from "../components/AdCard";
import AdModal from "../components/AdModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import DuplicateModal from "../components/DuplicateModal";
import ShareModal from "../components/ShareModal";
import CustomSelect from "../components/ui/CustomSelect";
import { FaSignOutAlt } from "react-icons/fa";

export default function Log() {
  const router = useRouter();
  const { token, loading: authLoading, logout } = useAuth();
  const { t, language } = useLanguage();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const [adToDuplicate, setAdToDuplicate] = useState(null);
  const [adToShare, setAdToShare] = useState(null);
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
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.day) params.append("day", filters.day);
      if (filters.month) params.append("month", filters.month);
      if (filters.year) params.append("year", filters.year);
      if (filters.platform) params.append("platform", filters.platform);

      const url = params.toString() ? `/api/ads?${params.toString()}` : "/api/ads";
      const response = await fetch(url, {
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

  const handleDeleteAd = (ad) => {
    setAdToDelete(ad);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAd = async () => {
    if (!adToDelete) return;

    try {
      const response = await fetch(`/api/ads/${adToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setAds(ads.filter(a => a._id !== adToDelete._id));
        setIsModalOpen(false);
        setSelectedAd(null);
        setIsDeleteModalOpen(false);
        setAdToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting ad:", error);
    }
  };

  const handleDuplicateAd = (ad) => {
    setAdToDuplicate(ad);
    setIsDuplicateModalOpen(true);
  };

  const confirmDuplicateAd = async () => {
    if (!adToDuplicate) return;

    try {
      const response = await fetch(`/api/ads/${adToDuplicate._id}/duplicate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const duplicatedAd = await response.json();
        setAds([duplicatedAd, ...ads]);
        setIsDuplicateModalOpen(false);
        setAdToDuplicate(null);
      }
    } catch (error) {
      console.error("Error duplicating ad:", error);
    }
  };

  const handleShareAd = (ad) => {
    setAdToShare(ad);
    setIsShareModalOpen(true);
  };

  const handleEditAd = async (adData) => {
    try {
      const response = await fetch(`/api/ads/${adData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(adData)
      });

      if (response.ok) {
        const updatedAd = await response.json();
        setAds(ads.map(ad => ad._id === updatedAd._id ? updatedAd : ad));
        setSelectedAd(updatedAd);
      }
    } catch (error) {
      console.error("Error updating ad:", error);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString()
  }));
  
  // Criar array de meses com nomes traduzidos
  const months = [
    { value: "01", label: t("log.months.01") },
    { value: "02", label: t("log.months.02") },
    { value: "03", label: t("log.months.03") },
    { value: "04", label: t("log.months.04") },
    { value: "05", label: t("log.months.05") },
    { value: "06", label: t("log.months.06") },
    { value: "07", label: t("log.months.07") },
    { value: "08", label: t("log.months.08") },
    { value: "09", label: t("log.months.09") },
    { value: "10", label: t("log.months.10") },
    { value: "11", label: t("log.months.11") },
    { value: "12", label: t("log.months.12") }
  ];
  
  const days = Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString().padStart(2, "0"),
    label: (i + 1).toString().padStart(2, "0")
  }));

  const platforms = [
    { value: "Facebook", label: "Facebook" },
    { value: "Instagram", label: "Instagram" },
    { value: "Google", label: "Google" }
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t("log.loading")}</div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-200 pb-24 md:pb-0 md:pt-16 flex flex-col">
      <div className="bg-sky-600 border-b border-gray-200 sticky top-0 md:top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 bg-sky-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl md:text-2xl font-bold">{t("log.title")}</h1>
            <button
              onClick={logout}
              className="p-2 text-white hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
              title={t("home.logout")}
            >
              <FaSignOutAlt className="text-lg" />
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">{t("log.year")}</label>
              <CustomSelect
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                placeholder={t("log.all")}
                options={[
                  { value: "", label: t("log.all") },
                  ...years
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">{t("log.month")}</label>
              <CustomSelect
                value={filters.month}
                onChange={(e) => handleFilterChange("month", e.target.value)}
                placeholder={t("log.all")}
                options={[
                  { value: "", label: t("log.all") },
                  ...months
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">{t("log.day")}</label>
              <CustomSelect
                value={filters.day}
                onChange={(e) => handleFilterChange("day", e.target.value)}
                placeholder={t("log.all")}
                options={[
                  { value: "", label: t("log.all") },
                  ...days
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">{t("log.platform")}</label>
              <CustomSelect
                value={filters.platform}
                onChange={(e) => handleFilterChange("platform", e.target.value)}
                placeholder={t("log.all")}
                options={[
                  { value: "", label: t("log.all") },
                  ...platforms
                ]}
              />
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
                onDelete={handleDeleteAd}
                onDuplicate={handleDuplicateAd}
                onShare={handleShareAd}
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
              {t("log.noAdsFound")}
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
        onSave={handleEditAd}
        onDelete={handleDeleteAd}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAdToDelete(null);
        }}
        onConfirm={confirmDeleteAd}
        adTitle={adToDelete?.title || ""}
      />

      <DuplicateModal
        isOpen={isDuplicateModalOpen}
        onClose={() => {
          setIsDuplicateModalOpen(false);
          setAdToDuplicate(null);
        }}
        onConfirm={confirmDuplicateAd}
        adTitle={adToDuplicate?.title || ""}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setAdToShare(null);
        }}
        ad={adToShare}
      />
    </div>
  );
}
