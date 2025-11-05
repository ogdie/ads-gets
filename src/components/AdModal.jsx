import { useState, useEffect } from "react";
import { FaTimes, FaFacebook, FaInstagram, FaGoogle } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

const platformIcons = {
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  Google: FaGoogle
};

export default function AdModal({ ad, isOpen, onClose, onSave, onDelete }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState(ad || {});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setFormData(ad || {});
    setIsEditing(false);
  }, [ad, isOpen]);

  if (!isOpen) return null;

  const Icon = platformIcons[formData.platform] || FaFacebook;
  const isCold = formData.audience === "frio";

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{formData.title || "Detalhes do Anúncio"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="p-6 space-y-4">
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
                  <label className="text-sm text-gray-600">Cliques</label>
                  <p className="font-semibold text-lg">{formData.clicks || 0}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Impressões</label>
                  <p className="font-semibold text-lg">{formData.impressions || 0}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Alcance</label>
                  <p className="font-semibold text-lg">{formData.reach || 0}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <label className="text-sm text-gray-600">Público</label>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-4 h-4 rounded-full ${isCold ? "bg-blue-500" : "bg-red-500"}`} />
                  <span className="font-medium">
                    {isCold ? t("home.audience.cold") : t("home.audience.hot")}
                  </span>
                </div>
              </div>

              {formData.description && (
                <div className="pt-4 border-t">
                  <label className="text-sm text-gray-600">Descrição</label>
                  <p className="mt-1">{formData.description}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {t("home.actions.edit")}
                </button>
                {onDelete && (
                  <button
                    onClick={() => onDelete(formData)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                  >
                    {t("home.actions.delete")}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Plataforma</label>
                <select
                  value={formData.platform || ""}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Google">Google</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Público</label>
                <select
                  value={formData.audience || ""}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="frio">{t("home.audience.cold")}</option>
                  <option value="quente">{t("home.audience.hot")}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Gasto (€)</label>
                  <input
                    type="number"
                    value={formData.spent || 0}
                    onChange={(e) => setFormData({ ...formData, spent: parseFloat(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Orçamento (€)</label>
                  <input
                    type="number"
                    value={formData.budget || 0}
                    onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Leads</label>
                  <input
                    type="number"
                    value={formData.leads || 0}
                    onChange={(e) => setFormData({ ...formData, leads: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cliques</label>
                  <input
                    type="number"
                    value={formData.clicks || 0}
                    onChange={(e) => setFormData({ ...formData, clicks: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows="3"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Salvar
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(ad);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

