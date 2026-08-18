import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, LogOut } from "lucide-react";
import { logout } from "@/services/auth/authService";

/* ── Route → human-readable label map ─────────────────────────────── */
const PAGE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  expenses: "Expenses",
  approvals: "Approvals",
  reports: "Reports & Analytics",
  users: "User Administration",
  settings: "Settings",
};

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  // Derive active page from path segment
  const segment = location.pathname.split("/")[1] || "dashboard";
  const pageLabel = PAGE_LABELS[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header
      className="flex h-16 shrink-0 items-center justify-between px-6 gap-4"
      style={{
        background: "rgba(13, 17, 23, 0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* ── Left: Breadcrumb ── */}
      <nav className="flex items-center gap-2 text-sm min-w-0">
        <span className="text-[#A1A1A4] shrink-0">Workspace</span>
        <span className="text-[#A1A1A4] shrink-0">/</span>
        <span className="font-semibold text-[#F5F6F5] truncate">{pageLabel}</span>
      </nav>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Search bar */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
          }}
        >
          <Search size={14} className="text-[#A1A1A4] shrink-0" strokeWidth={1.8} />
          <input
            type="text"
            placeholder="Search expenses, claims..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-transparent outline-none text-[#F5F6F5] placeholder:text-[#A1A1A4] w-52 text-sm"
          />
        </div>

        {/* Notification bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex items-center justify-center w-9 h-9 rounded-xl transition-colors hover:bg-white/5 cursor-pointer"
          style={{ border: "1px solid rgba(255, 255, 255, 0.08)" }}
        >
          <Bell size={16} className="text-[#A1A1A4]" strokeWidth={1.8} />
          {/* Notification dot */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "#B13A29", boxShadow: "0 0 6px rgba(177, 58, 41, 0.7)" }}
          />
        </button>

        {/* Logout button */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90 transition-opacity shadow-md cursor-pointer"
        >
          <LogOut size={14} strokeWidth={2} />
          Log Out
        </button>
      </div>
    </header>
  );
};

export default Topbar;
