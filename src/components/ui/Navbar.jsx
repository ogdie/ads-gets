import Link from "next/link";
import { useRouter } from "next/router";
import { FaHome, FaHistory, FaQuestionCircle } from "react-icons/fa";

export default function Navbar() {
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-0 bg-white border-t md:border-t-0 md:border-b border-gray-200 z-50">
      <div className="flex justify-around md:justify-start md:gap-8 md:px-8 items-center h-16">
        <Link
          href="/home"
          className={`flex flex-col md:flex-row md:gap-2 items-center justify-center flex-1 md:flex-none h-full px-4 ${
            isActive("/home") ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <FaHome className="text-xl md:text-lg mb-1 md:mb-0" />
          <span className="text-xs md:text-sm">Home</span>
        </Link>
        <Link
          href="/log"
          className={`flex flex-col md:flex-row md:gap-2 items-center justify-center flex-1 md:flex-none h-full px-4 ${
            isActive("/log") ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <FaHistory className="text-xl md:text-lg mb-1 md:mb-0" />
          <span className="text-xs md:text-sm">Log</span>
        </Link>
        <Link
          href="/support"
          className={`flex flex-col md:flex-row md:gap-2 items-center justify-center flex-1 md:flex-none h-full px-4 ${
            isActive("/support") ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <FaQuestionCircle className="text-xl md:text-lg mb-1 md:mb-0" />
          <span className="text-xs md:text-sm">Suporte</span>
        </Link>
      </div>
    </nav>
  );
}

