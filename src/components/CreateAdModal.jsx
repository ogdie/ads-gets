import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

export default function CreateAdModal({ isOpen, onClose, onSave }) {
  const { t } = useLanguage();
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
    startDate: new Date().toISOString().split("T")[0],
    status: "ativo"
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const costPerLead = formData.leads > 0 ? formData.spent / formData.leads : 0;
    const costPerClick = formData.clicks > 0 ? formData.spent / formData.clicks : 0;

    onSave({
      ...formData,
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
      startDate: new Date().toISOString().split("T")[0],
      status: "ativo"
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {t("home.createAd")}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Plataforma *</label>
              <select
                required
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="Google">Google</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Público *</label>
              <select
                required
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="frio">{t("home.audience.cold")}</option>
                <option value="quente">{t("home.audience.hot")}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Gasto (€) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.spent}
                onChange={(e) => setFormData({ ...formData, spent: parseFloat(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Orçamento (€) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Leads</label>
              <input
                type="number"
                min="0"
                value={formData.leads}
                onChange={(e) => setFormData({ ...formData, leads: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cliques</label>
              <input
                type="number"
                min="0"
                value={formData.clicks}
                onChange={(e) => setFormData({ ...formData, clicks: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Impressões</label>
              <input
                type="number"
                min="0"
                value={formData.impressions}
                onChange={(e) => setFormData({ ...formData, impressions: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Alcance</label>
            <input
              type="number"
              min="0"
              value={formData.reach}
              onChange={(e) => setFormData({ ...formData, reach: parseInt(e.target.value) || 0 })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Data de Início</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              rows="3"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Criar Anúncio
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

