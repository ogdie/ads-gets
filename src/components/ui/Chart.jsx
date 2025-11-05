import { FaFacebook, FaInstagram, FaGoogle } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

export default function Chart({ platformStats }) {
  const { t } = useLanguage();
  const platforms = [
    { name: "Facebook", icon: FaFacebook, color: "bg-blue-500", key: "Facebook" },
    { name: "Instagram", icon: FaInstagram, color: "bg-pink-500", key: "Instagram" },
    { name: "Google", icon: FaGoogle, color: "bg-green-500", key: "Google" }
  ];

  const maxSpent = Math.max(
    ...platforms.map(p => platformStats?.[p.key]?.spent || 0)
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">
        {t("home.chart.spendingByPlatform")}
      </h3>
      <div className="space-y-4">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const spent = platformStats?.[platform.key]?.spent || 0;
          const percentage = maxSpent > 0 ? (spent / maxSpent) * 100 : 0;

          return (
            <div key={platform.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`${platform.color.replace("bg-", "text-")} text-xl`} />
                  <span className="font-medium">{platform.name}</span>
                </div>
                <span className="font-semibold">
                  €{spent.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${platform.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

