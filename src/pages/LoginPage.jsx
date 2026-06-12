import { loginWithGoogle } from "../services/auth";

const IconMary = () => (
  <svg width="56" height="56" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="14" fill="#B6E0CD"/>
    <ellipse cx="14" cy="14" rx="8" ry="9" fill="#5DCAA5"/>
    <ellipse cx="14" cy="14" rx="5" ry="6" fill="#E1F5EE"/>
    <ellipse cx="14" cy="14" rx="2.5" ry="3" fill="#085041"/>
    <ellipse cx="15" cy="13" rx="1" ry="1" fill="#fff"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.4 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.4 5.6-6.3 7.1l6.2 5.2C39.4 36.9 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z"/>
  </svg>
);

export default function LoginPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="h-screen w-full bg-[#EDEAE2] flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-[#E8E6DF] p-10 w-[360px] flex flex-col items-center text-center">
        <IconMary />
        <h1 className="text-[#085041] font-bold text-xl tracking-widest mt-4">MARY</h1>
        <p className="text-[13px] text-[#5F5E5A] mt-2 leading-relaxed">
          Verifikasi konten deepfake dengan AI Vision &amp; bukti forensik digital.
        </p>

        <button
          onClick={loginWithGoogle}
          className="mt-8 w-full flex items-center justify-center gap-3 bg-white border border-[#D3D1C7] rounded-full px-4 py-2.5 text-[13px] font-medium text-[#2C2C2A] hover:bg-[#F6F6F6] transition-colors"
        >
          <GoogleIcon />
          Lanjutkan dengan Google
        </button>

        <p className="text-[11px] text-[#888780] mt-6 leading-relaxed">
          File yang kamu upload dienkripsi dan otomatis dihapus dalam 72 jam.
        </p>
      </div>
    </div>
  );
}