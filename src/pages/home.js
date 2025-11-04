import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import Chart from "../components/ui/Chart";
import AdCard from "../components/AdCard";
import AdModal from "../components/AdModal";
import CreateAdModal from "../components/CreateAdModal";
import NotificationsPanel from "../components/ui/NotificationsPanel";
import { FaPlus, FaSignOutAlt } from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const { token, user, loading: authLoading, logout } = useAuth();
  const { t } = useLanguage();
  const [ads, setAds] = useState([]);
  const [platformStats, setPlatformStats] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [todaySpent, setTodaySpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/");
    }
  }, [token, authLoading]);

  useEffect(() => {
    if (token) {
      fetchAds();
      fetchStats();
    }
  }, [token]);

  const fetchAds = async () => {
    try {
      const response = await fetch("/api/ads", {
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

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/ads/stats/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPlatformStats(data.platformStats);
        setTotalSpent(data.totalSpent);
        setTodaySpent(data.todaySpent || 0);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleCreateAd = async (adData) => {
    try {
      const response = await fetch("/api/ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(adData)
      });

      if (response.ok) {
        const newAd = await response.json();
        setAds([newAd, ...ads]);
        setIsCreateModalOpen(false);
        fetchStats();
      }
    } catch (error) {
      console.error("Error creating ad:", error);
    }
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
        fetchStats();
      }
    } catch (error) {
      console.error("Error updating ad:", error);
    }
  };

  const handleDeleteAd = async (ad) => {
    if (!confirm(t("home.actions.delete") + " este anúncio?")) return;

    try {
      const response = await fetch(`/api/ads/${ad._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setAds(ads.filter(a => a._id !== ad._id));
        setIsModalOpen(false);
        setSelectedAd(null);
        fetchStats();
      }
    } catch (error) {
      console.error("Error deleting ad:", error);
    }
  };

  const handleDuplicateAd = async (ad) => {
    try {
      const response = await fetch(`/api/ads/${ad._id}/duplicate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const duplicatedAd = await response.json();
        setAds([duplicatedAd, ...ads]);
        fetchStats();
      }
    } catch (error) {
      console.error("Error duplicating ad:", error);
    }
  };

  const handleShareAd = (ad) => {
    const shareText = `${ad.title} - ${ad.platform}`;
    if (navigator.share) {
      navigator.share({
        title: ad.title,
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Link copiado para área de transferência!");
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

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0 md:pt-16 flex flex-col">
      <div className="bg-white border-b border-gray-200 sticky top-0 md:top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{t("home.title")}</h1>
            <p className="text-xs md:text-sm text-gray-600">
              {user?.name || "Usuário"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationsPanel token={token} />
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
              title="Sair"
            >
              <FaSignOutAlt className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 flex-1">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600 mb-1">{t("home.totalSpent")}</h3>
            <p className="text-3xl font-bold text-blue-600">€{totalSpent.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600 mb-1">{t("home.todayBalance")}</h3>
            <p className="text-3xl font-bold text-green-600">€{todaySpent.toFixed(2)}</p>
          </div>
        </div>

        {/* Chart */}
        {platformStats && (
          <Chart platformStats={platformStats} language={user?.language || "pt"} />
        )}

        {/* Create Ad Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 shadow-md"
          >
            <FaPlus />
            {t("home.createAd")}
          </button>
        </div>

        {/* Ads Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Anúncios</h2>
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
                {t("home.createAd")} para começar
              </p>
            </div>
          )}
        </div>
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

      <CreateAdModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateAd}
      />
    </div>
  );
}

