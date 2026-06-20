/* eslint-disable react-refresh/only-export-components */
import { LogOut, X, TrendingUp, Scale, History, Folder, CircleHelp } from "lucide-react";

export const IconMary = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="14" fill="#B6E0CD"/>
    <ellipse cx="14" cy="14" rx="8" ry="9" fill="#5DCAA5"/>
    <ellipse cx="14" cy="14" rx="5" ry="6" fill="#E1F5EE"/>
    <ellipse cx="14" cy="14" rx="2.5" ry="3" fill="#085041"/>
    <ellipse cx="15" cy="13" rx="1" ry="1" fill="#fff"/>
  </svg>
);

export const navItems = [
  { icon: <TrendingUp size={16} />, label: "Analytics" },
  { icon: <Scale size={16} />, label: "Law" },
  { icon: <History size={16} />, label: "History" },
  { icon: <Folder size={16} />, label: "Folder" },
  { icon: <CircleHelp size={16} />, label: "Help" },
];

export function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-[340px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-full bg-[#F7C1C1] flex items-center justify-center shrink-0">
            <LogOut size={18} className="text-[#A32D2D]" />
          </div>
          <button onClick={onCancel} className="text-[#888780] hover:text-[#2C2C2A] transition-colors">
            <X size={18} />
          </button>
        </div>
        <p className="text-[15px] font-semibold text-[#2C2C2A] mb-1">Keluar dari akun?</p>
        <p className="text-[13px] text-[#5F5E5A] leading-relaxed mb-5">
          Kamu perlu login kembali dengan Google untuk mengakses Mary.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-[#F1EFE8] text-[#2C2C2A] text-[13px] font-medium py-2.5 rounded-xl hover:bg-[#E8E6DF] transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#A32D2D] text-white text-[13px] font-medium py-2.5 rounded-xl hover:bg-[#8C2424] transition-colors"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
}