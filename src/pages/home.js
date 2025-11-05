import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import AdModal from "../components/AdModal";
import CreateAdModal from "../components/CreateAdModal";
import NotificationsPanel from "../components/ui/NotificationsPanel";
import { 
  FaChevronRight, 
  FaEllipsisV, 
  FaEdit, 
  FaTrash, 
  FaPlay, 
  FaPause,
  FaSignOutAlt
} from "react-icons/fa";

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
  const [showMenu, setShowMenu] = useState(null);

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
        headers: { Authorization: `Bearer ${token}` }
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
        headers: { Authorization: `Bearer ${token}` }
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
    if (!confirm("Tem certeza que deseja deletar esta campanha?")) return;
    try {
      const response = await fetch(`/api/ads/${ad._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setAds(ads.filter(a => a._id !== ad._id));
        setIsModalOpen(false);
        setSelectedAd(null);
        setShowMenu(null);
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
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const duplicatedAd = await response.json();
        setAds([duplicatedAd, ...ads]);
        setShowMenu(null);
        fetchStats();
      }
    } catch (error) {
      console.error("Error duplicating ad:", error);
    }
  };

  const toggleAdStatus = async (ad) => {
    const updatedStatus = ad.status === "Ativa" ? "Desativado" : "Ativa";
    await handleEditAd({ ...ad, status: updatedStatus });
    setShowMenu(null);
  };

  const spendingBreakdown = platformStats ? {
    google: {
      amount: platformStats.Google?.totalSpent || 0,
      percentage: totalSpent > 0 ? Math.round((platformStats.Google?.totalSpent || 0) / totalSpent * 100) : 0,
      color: 'bg-yellow-400'
    },
    facebook: {
      amount: platformStats.Facebook?.totalSpent || 0,
      percentage: totalSpent > 0 ? Math.round((platformStats.Facebook?.totalSpent || 0) / totalSpent * 100) : 0,
      color: 'bg-blue-500'
    },
    instagram: {
      amount: platformStats.Instagram?.totalSpent || 0,
      percentage: totalSpent > 0 ? Math.round((platformStats.Instagram?.totalSpent || 0) / totalSpent * 100) : 0,
      color: 'bg-pink-500'
    }
  } : null;

  const activeCampaigns = ads.filter(ad => ad.status === "Ativa").length;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ads'n Gets</h1>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                {activeCampaigns} campanhas ativas
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
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Card de Gasto Total */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Montante total gasto</p>
              <p className="text-4xl font-bold text-gray-900">{totalSpent.toFixed(2)} €</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Sem limite de gastos</p>
              <FaChevronRight className="w-5 h-5 text-gray-400 ml-auto mt-1" />
            </div>
          </div>
          
          {/* Gráfico Horizontal */}
          {spendingBreakdown && (
            <div className="space-y-3 mt-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">🟡 Google</span>
                  <span className="text-gray-900 font-semibold">{spendingBreakdown.google.amount.toFixed(2)} € ({spendingBreakdown.google.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className={`${spendingBreakdown.google.color} h-3 rounded-full transition-all duration-500`} style={{width: `${spendingBreakdown.google.percentage}%`}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">🔵 Facebook</span>
                  <span className="text-gray-900 font-semibold">{spendingBreakdown.facebook.amount.toFixed(2)} € ({spendingBreakdown.facebook.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className={`${spendingBreakdown.facebook.color} h-3 rounded-full transition-all duration-500`} style={{width: `${spendingBreakdown.facebook.percentage}%`}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">🟣 Instagram</span>
                  <span className="text-gray-900 font-semibold">{spendingBreakdown.instagram.amount.toFixed(2)} € ({spendingBreakdown.instagram.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className={`${spendingBreakdown.instagram.color} h-3 rounded-full transition-all duration-500`} style={{width: `${spendingBreakdown.instagram.percentage}%`}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card de Sugestão de Melhoria */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-gray-900">💡 Sugestão de Melhoria</h2>
            <FaChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex gap-2 mb-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs font-medium">↑ +2 pontos</span>
              <span className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-medium">Novo</span>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-3">Usar o público Advantage+ pode melhorar o desempenho</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-1">Potencial resultado:</p>
              <p className="text-lg text-green-600 font-semibold">Custo médio por Lead 9,7% inferior</p>
              <p className="text-xs text-gray-500 mt-1">Com base na nossa experiência ⓘ</p>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
                Pré-visualizar
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors">
                Aplicar
              </button>
            </div>
          </div>
        </div>

        {/* Título Campanhas */}
        <div className="py-4">
          <h2 className="text-2xl font-bold text-gray-900">Campanhas</h2>
        </div>

        {/* Cards das Campanhas */}
        {ads.map((ad) => (
          <div key={ad._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-2">{ad.title}</h3>
                <p className={`text-sm font-medium ${ad.status === 'Ativa' ? 'text-green-600' : 'text-gray-500'}`}>
                  {ad.status} • {ad.platform}
                </p>
              </div>
              <div className="relative">
                <button 
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  onClick={() => setShowMenu(showMenu === ad._id ? null : ad._id)}
                >
                  <FaEllipsisV className="w-5 h-5 text-gray-400" />
                </button>
                
                {showMenu === ad._id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button
                      onClick={() => toggleAdStatus(ad)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      {ad.status === 'Ativa' ? (
                        <>
                          <FaPause className="w-4 h-4" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <FaPlay className="w-4 h-4" />
                          Ativar
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAd(ad);
                        setIsModalOpen(true);
                        setShowMenu(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <FaEdit className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteAd(ad)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 rounded-b-lg transition-colors"
                    >
                      <FaTrash className="w-4 h-4" />
                      Deletar
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">{ad.leads || 0}</p>
                <p className="text-sm text-gray-600">Leads no site</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{ad.costPerLead ? ad.costPerLead.toFixed(2) : '0.00'} €</p>
                <p className="text-sm text-gray-600">Custo por Lead no site</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{ad.spent ? ad.spent.toFixed(2) : '0.00'} €</p>
                <p className="text-sm text-gray-600">Gastos</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(null)}
        />
      )}

      <Footer />
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