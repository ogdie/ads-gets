import { FaTimes, FaCopy } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

export default function DuplicateModal({ isOpen, onClose, onConfirm, adTitle }) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border-4 border-sky-500 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaCopy className="text-white text-2xl" />
            <h2 className="text-xl font-bold text-white">
              {t("home.modal.duplicateTitle")}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-700">
            {t("home.modal.duplicateMessage")} <strong>"{adTitle}"</strong>?
          </p>
        </div>

        <div className="flex gap-3 p-6 pt-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onConfirm}
            className="flex-1 bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors shadow-md hover:shadow-lg"
          >
            {t("home.modal.duplicateButton")}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            {t("home.modal.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

