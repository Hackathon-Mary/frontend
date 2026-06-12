import { Scale, Link } from "lucide-react";

const pasals = [
  {
    title: "Pasal 27 ayat (1)",
    desc: "Melarang distribusi konten yang melanggar kesusilaan secara elektronik tanpa persetujuan pihak yang bersangkutan.",
    badge: "Distribusi konten tanpa izin",
  },
  {
    title: "Pasal 35",
    desc: "Melarang manipulasi, pembuatan, atau pengubahan informasi elektronik sehingga dianggap seolah-olah data autentik.",
    badge: "Pemalsuan konten digital",
  },
  {
    title: "Pasal 29",
    desc: "Melarang pengiriman pesan elektronik yang mengandung ancaman kekerasan atau menakut-nakuti secara pribadi.",
    badge: "Ancaman digital",
  },
];

const instansi = [
  {
    title: "Kepolisian (Polda / Bareskrim)",
    desc: "Laporan pidana UU ITE. Bawa dokumen verifikasi Mary sebagai bukti pendukung awal.",
  },
  {
    title: "Komnas Perempuan",
    desc: "Pendampingan dan advokasi untuk korban kekerasan berbasis gender online (KBGO).",
  },
  {
    title: "Pasal 29",
    desc: "Melarang pengiriman pesan elektronik yang mengandung ancaman kekerasan atau menakut-nakuti secara pribadi. Ancaman digital",
  },
];

export default function LawPage() {
  return (
    <div className="absolute inset-0 overflow-y-auto px-4 py-5">
      <div className="max-w-[600px] mx-auto flex flex-col gap-4">

        {/* Pasal yang relevan */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E6DF]">
          <div className="flex items-center gap-2 mb-4">
            <Scale size={16} className="text-[#5F5E5A]" />
            <span className="text-[13px] font-medium text-[#2C2C2A]">Pasal yang relevan</span>
          </div>
          <div className="flex flex-col gap-4">
            {pasals.map((item) => (
              <div key={item.title}>
                <p className="text-[13px] font-semibold text-[#2C2C2A] mb-0.5">{item.title}</p>
                <p className="text-[12px] text-[#5F5E5A] leading-relaxed mb-1.5">{item.desc}</p>
                <span className="inline-block text-[11px] bg-[#B6E0CD] text-[#085041] px-3 py-1 rounded-full font-medium">
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Instansi yang bisa dihubungi */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E6DF]">
          <div className="flex items-center gap-2 mb-4">
            <Link size={16} className="text-[#5F5E5A]" />
            <span className="text-[13px] font-medium text-[#2C2C2A]">Instansi yang bisa dihubungi</span>
          </div>
          <div className="flex flex-col gap-4">
            {instansi.map((item) => (
              <div key={item.title}>
                <p className="text-[13px] font-semibold text-[#2C2C2A] mb-0.5">{item.title}</p>
                <p className="text-[12px] text-[#5F5E5A] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}