import { useState } from "react";
import { FaFacebook, FaInstagram, FaGoogle, FaEllipsisV } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

const platformIcons = {
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  Google: FaGoogle
};

export default function AdCard({ ad, onEdit, onDelete, onDuplicate, onShare, onClick }) {
  const { t, language } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const Icon = platformIcons[ad.platform] || FaFacebook;
  const isCold = ad.audience === "frio";

  const handleMenuClick = (e, action) => {
    e.stopPropagation();
    setShowMenu(false);
    if (action === "edit") onEdit(ad);
    else if (action === "delete") onDelete(ad);
    else if (action === "duplicate") onDuplicate(ad);
    else if (action === "share") onShare(ad);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 relative cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick(ad)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`text-xl ${
            ad.platform === "Facebook" ? "text-blue-600" :
            ad.platform === "Instagram" ? "text-pink-600" :
            "text-green-600"
          }`} />
          <h3 className="font-semibold text-lg">{ad.title}</h3>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaEllipsisV />
          </button>
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-20 border border-gray-200">
                <button
                  onClick={(e) => handleMenuClick(e, "edit")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
                >
                  {t("home.actions.edit")}
                </button>
                <button
                  onClick={(e) => handleMenuClick(e, "duplicate")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {t("home.actions.duplicate")}
                </button>
                <button
                  onClick={(e) => handleMenuClick(e, "share")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {t("home.actions.share")}
                </button>
                <button
                  onClick={(e) => handleMenuClick(e, "delete")}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-b-lg"
                >
                  {t("home.actions.delete")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{t("home.ad.spent")}:</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold">€{ad.spent.toFixed(2)}</span>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              ad.status === "ativo" 
                ? "bg-green-100 text-green-700" 
                : ad.status === "pausado"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}>
              {ad.status === "ativo" ? t("home.ad.status.active") : ad.status === "pausado" ? t("home.ad.status.paused") : t("home.ad.status.finished")}
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">{t("home.ad.leads")}:</span>
          <span className="font-semibold">{ad.leads}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">{t("home.ad.costPerLead")}:</span>
          <span className="font-semibold">€{ad.costPerLead.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isCold ? "bg-blue-500" : "bg-red-500"}`} />
            <span className="text-sm font-medium">
              {isCold ? t("home.audience.cold") : t("home.audience.hot")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {ad.startDate ? new Date(ad.startDate).toLocaleDateString(language === "pt" ? 'pt-BR' : 'en-US', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              }) : ''}
            </span>
            <span className="text-xs text-gray-500">{ad.platform}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

