import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

export default function CreateAdModal({ isOpen, onClose, onSave }) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    title: "",
    platform: "Facebook",
    audience: "frio",
    spent: 0,
    budget: 0,
    leads: 0,
    clicks: 0,
    impressions: 0,
    reach: 0,
    description: "",
    descriptionEn: "",
    startDate: new Date().toISOString().split("T")[0],
    status: "ativo"
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Garantir que valores vazios sejam convertidos para 0
    const spent = formData.spent === "" || formData.spent === null ? 0 : formData.spent;
    const budget = formData.budget === "" || formData.budget === null ? 0 : formData.budget;
    
    const costPerLead = formData.leads > 0 ? spent / formData.leads : 0;
    const costPerClick = formData.clicks > 0 ? spent / formData.clicks : 0;

    onSave({
      ...formData,
      spent,
      budget,
      costPerLead,
      costPerClick
    });

    setFormData({
      title: "",
      platform: "Facebook",
      audience: "frio",
      spent: 0,
      budget: 0,
      leads: 0,
      clicks: 0,
      impressions: 0,
      reach: 0,
      description: "",
      descriptionEn: "",
      startDate: new Date().toISOString().split("T")[0],
      status: "ativo"
    });
  };

  return (
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
            {t("home.createAd")}
          </h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 bg-gray-50">
          <div>
            <label className="block text-sm font-medium mb-1">{t("home.ad.title")} {t("home.modal.required")}</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t("home.ad.platform")} {t("home.modal.required")}</label>
              <select
                required
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              >
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="Google">Google</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("home.audience.label")} {t("home.modal.required")}</label>
              <select
                required
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              >
                <option value="frio">{t("home.audience.cold")}</option>
                <option value="quente">{t("home.audience.hot")}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t("home.ad.spent")} (€) {t("home.modal.required")}</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.spent === 0 ? "" : formData.spent}
                onFocus={() => {
                  if (formData.spent === 0) {
                    setFormData({ ...formData, spent: "" });
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value === "" ? "" : parseFloat(e.target.value) || "";
                  setFormData({ ...formData, spent: value });
                }}
                onBlur={(e) => {
                  if (e.target.value === "" || e.target.value === null) {
                    setFormData({ ...formData, spent: 0 });
                  }
                }}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("home.ad.budget")} (€) {t("home.modal.required")}</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.budget === 0 ? "" : formData.budget}
                onFocus={() => {
                  if (formData.budget === 0) {
                    setFormData({ ...formData, budget: "" });
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value === "" ? "" : parseFloat(e.target.value) || "";
                  setFormData({ ...formData, budget: value });
                }}
                onBlur={(e) => {
                  if (e.target.value === "" || e.target.value === null) {
                    setFormData({ ...formData, budget: 0 });
                  }
                }}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t("home.ad.leads")}</label>
              <input
                type="number"
                min="0"
                value={formData.leads}
                onChange={(e) => setFormData({ ...formData, leads: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("home.ad.clicks")}</label>
              <input
                type="number"
                min="0"
                value={formData.clicks}
                onChange={(e) => setFormData({ ...formData, clicks: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("home.ad.impressions")}</label>
              <input
                type="number"
                min="0"
                value={formData.impressions}
                onChange={(e) => setFormData({ ...formData, impressions: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("home.ad.reach")}</label>
            <input
              type="number"
              min="0"
              value={formData.reach}
              onChange={(e) => setFormData({ ...formData, reach: parseInt(e.target.value) || 0 })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("home.ad.startDate")}</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("home.ad.description")} ({language === "pt" ? "PT" : "EN"})</label>
            <textarea
              value={language === "en" 
                ? formData.descriptionEn || "" 
                : formData.description || ""}
              onChange={(e) => {
                if (language === "en") {
                  setFormData({ ...formData, descriptionEn: e.target.value });
                } else {
                  setFormData({ ...formData, description: e.target.value });
                }
              }}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              rows="3"
              placeholder={language === "pt" ? "Descrição do anúncio" : "Ad description"}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors shadow-md hover:shadow-lg"
            >
              {t("home.modal.createButton")}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              {t("home.modal.cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

