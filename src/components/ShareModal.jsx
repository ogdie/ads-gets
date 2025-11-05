import { useState } from "react";
import { 
  FaTimes, 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedin, 
  FaWhatsapp, 
  FaCopy, 
  FaCheck 
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

export default function ShareModal({ isOpen, onClose, ad }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !ad) return null;

  const shareText = `${ad.title} - ${ad.platform}`;
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/ad/${ad._id}` : "";

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl || shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl || shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToInstagram = () => {
    handleCopy();
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
    window.open(url, "_blank");
  };

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
          <h2 className="text-xl font-bold text-white">
            {t("home.modal.shareTitle")}
          </h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <button
              onClick={shareToFacebook}
              className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-sky-200 hover:border-sky-500 hover:bg-sky-50 transition-all group"
            >
              <FaFacebook className="text-sky-600 text-3xl mb-2 group-hover:text-sky-700" />
              <span className="text-sm font-medium text-sky-600">Facebook</span>
            </button>

            <button
              onClick={shareToInstagram}
              className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-sky-200 hover:border-sky-500 hover:bg-sky-50 transition-all group"
            >
              <FaInstagram className="text-sky-600 text-3xl mb-2 group-hover:text-sky-700" />
              <span className="text-sm font-medium text-sky-600">Instagram</span>
            </button>

            <button
              onClick={shareToTwitter}
              className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-sky-200 hover:border-sky-500 hover:bg-sky-50 transition-all group"
            >
              <FaTwitter className="text-sky-600 text-3xl mb-2 group-hover:text-sky-700" />
              <span className="text-sm font-medium text-sky-600">Twitter</span>
            </button>

            <button
              onClick={shareToLinkedIn}
              className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-sky-200 hover:border-sky-500 hover:bg-sky-50 transition-all group"
            >
              <FaLinkedin className="text-sky-600 text-3xl mb-2 group-hover:text-sky-700" />
              <span className="text-sm font-medium text-sky-600">LinkedIn</span>
            </button>

            <button
              onClick={shareToWhatsApp}
              className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-sky-200 hover:border-sky-500 hover:bg-sky-50 transition-all group"
            >
              <FaWhatsapp className="text-sky-600 text-3xl mb-2 group-hover:text-sky-700" />
              <span className="text-sm font-medium text-sky-600">WhatsApp</span>
            </button>

            <button
              onClick={handleCopy}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all group ${
                copied
                  ? "border-green-500 bg-green-50"
                  : "border-sky-200 hover:border-sky-500 hover:bg-sky-50"
              }`}
            >
              {copied ? (
                <>
                  <FaCheck className="text-green-600 text-3xl mb-2" />
                  <span className="text-sm font-medium text-green-600">Copiado!</span>
                </>
              ) : (
                <>
                  <FaCopy className="text-sky-600 text-3xl mb-2 group-hover:text-sky-700" />
                  <span className="text-sm font-medium text-sky-600">Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            className="w-full bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors"
          >
            {t("home.modal.close")}
          </button>
        </div>
      </div>
    </div>
  );
}

