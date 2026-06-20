import { useState, useEffect } from "react";
import { Plus, TrendingUp, Scale, History, Folder, CircleHelp, LogOut, MoreHorizontal } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { IconMary, getInitials, LogoutModal } from "./sidebarShared";

const bottomItems = [
  { icon: Plus, label: "New", key: "new" },
  { icon: TrendingUp, label: "Analytics", key: "Analytics" },
  { icon: Scale, label: "Law", key: "Law" },
  { icon: History, label: "History", key: "History" },
  { icon: Folder, label: "Folder", key: "Folder" },
];

export default function MobileNav({ active, setActive }) {
  const { user, logout } = useAuth();
  const [showMore, setShowMore] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [navLocked, setNavLocked] = useState(false);

  useEffect(() => {
    function handleLock(e) {
      setNavLocked(e.detail);
    }
    window.addEventListener("mary:lock-nav", handleLock);
    return () => window.removeEventListener("mary:lock-nav", handleLock);
  }, []);

  return (
    <>
      {/* Topbar — hanya mobile */}
      <header className="sm:hidden flex items-center justify-between px-4 h-14 bg-[#F6F6F6] border-b border-[#D3D1C7]/60 flex-shrink-0">
        <div className="flex items-center gap-2">
          <IconMary />
          <span className="text-[#085041] font-bold text-[15px] tracking-widest">MARY</span>
        </div>

        <div className="flex items-center gap-2">
          {navLocked && (
            <span className="text-[10px] text-[#854F0B] mr-1">⚠ Sedang lapor</span>
          )}
          <div className="w-8 h-8 rounded-full bg-[#B6E0CD] flex items-center justify-center text-[#085041] text-xs font-semibold overflow-hidden">
            {user?.picture
              ? <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
              : getInitials(user?.name)}
          </div>
          <button
            onClick={() => setShowMore(!showMore)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#5F5E5A] hover:bg-[#E8E6DF] transition-colors"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>

      {/* Dropdown "more" — Help + Logout + info user */}
      {showMore && (
        <>
          <div className="sm:hidden fixed inset-0 z-30" onClick={() => setShowMore(false)} />
          <div className="sm:hidden fixed top-14 right-4 bg-white border border-[#E8E6DF] rounded-xl shadow-lg z-40 w-[220px] py-2">
            <div className="px-3 py-2 border-b border-[#F1EFE8]">
              <p className="text-[13px] font-medium text-[#2C2C2A] truncate">{user?.name || "Pengguna"}</p>
              <p className="text-[11px] text-[#888780] truncate">{user?.email || ""}</p>
            </div>
            <button
              onClick={() => { setActive("Help"); setShowMore(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-[#5F5E5A] hover:bg-[#F1EFE8] transition-colors"
            >
              <CircleHelp size={16} />
              Help
            </button>
            <button
              onClick={() => { setShowLogoutModal(true); setShowMore(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-[#A32D2D] hover:bg-[#FCEBEB] transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </>
      )}

      {/* Bottom nav bar — hanya mobile */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#F6F6F6] border-t border-[#D3D1C7]/60 flex items-stretch z-30 pb-[env(safe-area-inset-bottom)]">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors
                ${isActive ? "text-[#085041]" : "text-[#888780]"}`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] ${isActive ? "font-medium" : ""}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {showLogoutModal && (
        <LogoutModal onConfirm={logout} onCancel={() => setShowLogoutModal(false)} />
      )}
    </>
  );
}