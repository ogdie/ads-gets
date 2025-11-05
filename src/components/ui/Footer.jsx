import { useLanguage } from "../../context/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();
  
  return (
    <footer className="bg-slate-200 border-t border-gray-200 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-600">
          © 2025 ads'n gets. {language === "pt" ? "Todos os direitos reservados." : "All rights reserved."}
        </p>
      </div>
    </footer>
  );
}

