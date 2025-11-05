import { useState, useEffect } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

export default function NotificationsPanel({ token }) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  useEffect(() => {
    // Verificar se há notificações não lidas no localStorage
    if (typeof window !== "undefined") {
      const lastSeen = localStorage.getItem("notificationsLastSeen");
      if (lastSeen) {
        const lastSeenTime = parseInt(lastSeen);
        const now = Date.now();
        // Se foi visto há menos de 1 hora, não mostrar bolinha
        setHasUnread(now - lastSeenTime > 3600000);
      } else {
        setHasUnread(notifications.length > 0);
      }
    }
  }, [notifications]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/ads/stats/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const stats = await response.json();
        const todaySpent = stats.todaySpent || 0;
        const totalSpent = stats.totalSpent || 0;

        const notifs = [
          {
            id: 1,
            type: "balance",
            message: language === "pt"
              ? `Balanço do dia: €${todaySpent.toFixed(2)}`
              : `Today's balance: €${todaySpent.toFixed(2)}`,
            time: language === "pt" ? "Hoje" : "Today"
          },
          {
            id: 2,
            type: "total",
            message: language === "pt"
              ? `Total gasto: €${totalSpent.toFixed(2)}`
              : `Total spent: €${totalSpent.toFixed(2)}`,
            time: language === "pt" ? "Total" : "Total"
          }
        ];

        setNotifications(notifs);
        
        // Verificar se há notificações não lidas
        if (typeof window !== "undefined") {
          const lastSeen = localStorage.getItem("notificationsLastSeen");
          if (!lastSeen) {
            setHasUnread(true);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      // Marcar como visto quando abrir
      if (typeof window !== "undefined") {
        localStorage.setItem("notificationsLastSeen", Date.now().toString());
      }
      setHasUnread(false);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2 text-gray-600 hover:text-gray-800"
      >
        <FaBell className="text-xl text-white" />
        {hasUnread && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-20 border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold">{t("home.notifications")}</h3>
              <button onClick={() => setIsOpen(false)}>
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div key={notif.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                    <p className="text-sm">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  {language === "pt" ? "Nenhuma notificação" : "No notifications"}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

