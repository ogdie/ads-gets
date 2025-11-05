import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Logo from "../components/Logo";

export default function Login() {
  const router = useRouter();
  const { login, register, token, loading: authLoading } = useAuth();
  const { language, changeLanguage, t } = useLanguage();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !authLoading) {
      router.push("/home");
    }
  }, [token, authLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = isRegister
      ? await register(name, email, password)
      : await login(email, password);

    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "/api/auth/facebook";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-700 to-indigo-200 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-1 bg-white rounded-lg shadow-md p-1">
          <button
            onClick={() => changeLanguage("pt")}
            className={`px-3 py-1 rounded text-sm font-medium ${
              language === "pt"
                ? "bg-sky-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            title="Português"
          >
            PT
          </button>
          <button
            onClick={() => changeLanguage("en")}
            className={`px-3 py-1 rounded text-sm font-medium ${
              language === "en"
                ? "bg-sky-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            title="English"
          >
            EN
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* LOGO CENTRALIZADO */}
        <Logo />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium mb-1">
                {language === "pt" ? "Nome" : "Name"}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={language === "pt" ? "Seu nome" : "Your name"}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("login.email")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("login.email")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("login.password")}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("login.password")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-700 text-white py-3 rounded-lg font-semibold hover:bg-sky-500 transition-colors disabled:opacity-50"
          >
            {loading
              ? language === "pt"
                ? "Carregando..."
                : "Loading..."
              : isRegister
              ? t("login.registerButton")
              : t("login.loginButton")}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">{t("login.or")}</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <FaGoogle className="text-red-500 text-xl" />
            {t("login.googleLogin")}
          </button>
        </div>
      </div>
    </div>
  );
}
