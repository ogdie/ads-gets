import { useState, useEffect } from "react";
import { FaTimes, FaFacebook, FaInstagram, FaGoogle } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

const platformIcons = {
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  Google: FaGoogle
};

export default function AdModal({ ad, isOpen, onClose, onSave, onDelete }) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState(ad || {});
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setFormData(ad || {});
    setIsEditing(false);
    setShowDeleteConfirm(false);
  }, [ad, isOpen]);

  if (!isOpen) return null;

  const Icon = platformIcons[formData.platform] || FaFacebook;
  const isCold = formData.audience === "frio";

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(formData);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(ad || {});
  };

  return (
    <>
      {/* Modal de confirmação de exclusão */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border-4 border-red-500 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">{t("home.modal.confirmDelete")}</h3>
            <p className="text-gray-600 mb-6">
              {t("home.modal.confirmDeleteMessage")} <strong>"{formData.title}"</strong>? {t("home.modal.confirmDeleteWarning")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-md"
              >
                {t("home.modal.yesDelete")}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                {t("home.modal.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal principal */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-4 border-sky-600 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? t("home.modal.editAd") : (formData.title || t("home.modal.adDetails"))}
            </h2>
            <button 
              onClick={onClose} 
              className="text-white hover:text-gray-200 hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1 bg-gray-50">
          {!isEditing ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <Icon className={`text-2xl ${
                  formData.platform === "Facebook" ? "text-blue-500" :
                  formData.platform === "Instagram" ? "text-pink-600" :
                  "text-green-600"
                }`} />
                <span className="text-lg font-semibold">{formData.platform}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">{t("home.ad.spent")}</label>
                  <p className="font-semibold text-lg">€{formData.spent?.toFixed(2) || "0.00"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">{t("home.ad.leads")}</label>
                  <p className="font-semibold text-lg">{formData.leads || 0}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">{t("home.ad.costPerLead")}</label>
                  <p className="font-semibold text-lg">€{formData.costPerLead?.toFixed(2) || "0.00"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">{t("home.ad.clicks")}</label>
                  <p className="font-semibold text-lg">{formData.clicks || 0}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">{t("home.ad.impressions")}</label>
                  <p className="font-semibold text-lg">{formData.impressions || 0}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">{t("home.ad.reach")}</label>
                  <p className="font-semibold text-lg">{formData.reach || 0}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <label className="text-sm text-gray-600">{t("home.audience.label")}</label>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-4 h-4 rounded-full ${isCold ? "bg-blue-500" : "bg-red-500"}`} />
                  <span className="font-medium">
                    {isCold ? t("home.audience.cold") : t("home.audience.hot")}
                  </span>
                </div>
              </div>

              {(formData.description || formData.descriptionEn) && (
                <div className="pt-4 border-t">
                  <label className="text-sm text-gray-600">{t("home.ad.description")}</label>
                  <p className="mt-1">
                    {(() => {
                      if (language === "en" && formData.descriptionEn && formData.descriptionEn.trim() !== "") {
                        return formData.descriptionEn;
                      }
                      if (formData.description && formData.description.trim() !== "") {
                        return formData.description;
                      }
                      return formData.descriptionEn || "";
                    })()}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors shadow-md hover:shadow-lg"
                >
                  {t("home.actions.edit")}
                </button>
                {onDelete && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    {t("home.actions.delete")}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("home.ad.title")}</label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t("home.ad.platform")}</label>
                <select
                  value={formData.platform || ""}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                >
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Google">Google</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t("home.audience.label")}</label>
                <select
                  value={formData.audience || ""}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                >
                  <option value="frio">{t("home.audience.cold")}</option>
                  <option value="quente">{t("home.audience.hot")}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t("home.ad.spent")} (€)</label>
                  <input
                    type="number"
                    value={formData.spent || 0}
                    onChange={(e) => setFormData({ ...formData, spent: parseFloat(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t("home.ad.budget")} (€)</label>
                  <input
                    type="number"
                    value={formData.budget || 0}
                    onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t("home.ad.leads")}</label>
                  <input
                    type="number"
                    value={formData.leads || 0}
                    onChange={(e) => setFormData({ ...formData, leads: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t("home.ad.clicks")}</label>
                  <input
                    type="number"
                    value={formData.clicks || 0}
                    onChange={(e) => setFormData({ ...formData, clicks: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t("home.ad.description")} ({language === "pt" ? "PT" : "EN"})</label>
                <textarea
                  value={language === "en" && formData.descriptionEn !== undefined
                    ? formData.descriptionEn || "" 
                    : formData.description || ""}
                  onChange={(e) => {
                    if (language === "en") {
                      setFormData({ ...formData, descriptionEn: e.target.value });
                    } else {
                      setFormData({ ...formData, description: e.target.value });
                    }
                  }}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                  rows="3"
                  placeholder={language === "pt" ? "Descrição do anúncio" : "Ad description"}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors shadow-md hover:shadow-lg"
                >
                  {t("home.modal.save")}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  {t("home.modal.cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}