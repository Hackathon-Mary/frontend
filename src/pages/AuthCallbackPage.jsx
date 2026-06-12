import { useEffect, useState } from "react";
import { handleAuthCallback } from "../services/auth";

export default function AuthCallbackPage() {
  const [error, setError] = useState(null);

  useEffect(() => {
    const result = handleAuthCallback();

    if (result.success) {
      window.location.href = "/";
    } else {
      setError(result.error || "Login gagal.");
    }
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="h-screen w-full bg-[#EDEAE2] flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <p className="text-[14px] text-[#A32D2D] font-medium mb-2">Login gagal</p>
            <p className="text-[13px] text-[#5F5E5A]">{error}</p>
            <a href="/login" className="text-[13px] text-[#085041] font-medium underline mt-4 inline-block">
              Coba lagi
            </a>
          </>
        ) : (
          <>
            <div className="w-8 h-8 border-2 border-[#B6E0CD] border-t-[#085041] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[13px] text-[#5F5E5A]">Menyelesaikan login...</p>
          </>
        )}
      </div>
    </div>
  );
}