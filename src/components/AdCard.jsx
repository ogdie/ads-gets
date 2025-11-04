import { useState } from "react";
import { FaFacebook, FaInstagram, FaGoogle, FaEllipsisV } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

const platformIcons = {
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  Google: FaGoogle
};

export default function AdCard({ ad, onEdit, onDelete, onDuplicate, onShare, onClick }) {
  const { t } = useLanguage();
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
        <div className="flex justify-between">
          <span className="text-gray-600">{t("home.ad.spent")}:</span>
          <span className="font-semibold">€{ad.spent.toFixed(2)}</span>
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
          <span className="text-xs text-gray-500">{ad.platform}</span>
        </div>
      </div>
    </div>
  );
}

