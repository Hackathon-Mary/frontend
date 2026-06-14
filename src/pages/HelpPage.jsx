import { useState } from "react";
import { HelpCircle, ChevronDown, ShieldCheck, Upload, FileSearch, FileCheck2 } from "lucide-react";

const faqs = [
  {
    q: "Apa itu Mary?",
    a: "Mary adalah sistem verifikasi yang menganalisis apakah sebuah foto merupakan hasil rekayasa kecerdasan buatan (AI-generated). Hasilnya bisa digunakan untuk klarifikasi maupun sebagai bukti pendukung laporan ke pihak berwenang.",
  },
  {
    q: "Apakah file yang saya upload aman?",
    a: "Ya. File dienkripsi sejak pertama kali diupload dan otomatis dihapus secara permanen setelah 72 jam. Hanya kamu yang bisa melihat hasil analisis dan laporanmu.",
  },
  {
    q: "Berapa lama proses analisis berjalan?",
    a: "Umumnya beberapa detik hingga puluhan detik, tergantung ukuran file dan apakah sistem memerlukan analisis visual tambahan (VLLM).",
  },
  {
    q: "Apa arti status 'Sinyal Tidak Memadai'?",
    a: "Status ini muncul saat gambar mengalami kompresi tinggi sehingga sinyal forensik dasar tidak cukup kuat untuk dianalisis. Kamu bisa coba analisis ulang, atau upload file dengan kualitas asli (belum dikompres ulang oleh aplikasi chat).",
  },
  {
    q: "Bisakah hasil Mary dijadikan bukti hukum?",
    a: "Laporan Mary adalah dokumen pendukung laporan awal, bukan pengganti keterangan ahli forensik digital tersertifikasi. Sertakan laporan ini sebagai lampiran saat melapor ke pihak berwenang, dan konsultasikan dengan pengacara atau lembaga bantuan hukum untuk proses lebih lanjut.",
  },
  {
    q: "Ke mana saya bisa melapor?",
    a: "Tergantung jenis kasusnya: Kepolisian (Polda/Bareskrim) untuk laporan pidana UU ITE, Komnas Perempuan untuk kekerasan berbasis gender online, atau KPAI khusus untuk korban di bawah 18 tahun. Detail lengkap ada di halaman Law.",
  },
];

const steps = [
  { icon: Upload, title: "Upload foto", desc: "Drop file atau masukkan URL gambar di halaman New Chat." },
  { icon: FileSearch, title: "Jalankan analisis", desc: "Buka halaman Analytics, klik 'Jalankan Analisis AI' pada foto yang ingin diperiksa." },
  { icon: ShieldCheck, title: "Lihat hasil", desc: "Sistem menampilkan skor keyakinan dan breakdown per layer deteksi." },
  { icon: FileCheck2, title: "Generate laporan", desc: "Download PDF report untuk klarifikasi atau lampiran laporan resmi, tersimpan di halaman Folder." },
];

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#F1EFE8] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 py-3 text-left"
      >
        <span className="text-[13px] font-medium text-[#2C2C2A]">{faq.q}</span>
        <ChevronDown
          size={16}
          className={`text-[#888780] flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="text-[12px] text-[#5F5E5A] leading-relaxed pb-3 pr-6">{faq.a}</p>
      )}
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="absolute inset-0 overflow-y-auto px-4 py-5">
      <div className="max-w-[600px] mx-auto flex flex-col gap-4">

        {/* Cara kerja */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E6DF]">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={16} className="text-[#5F5E5A]" />
            <span className="text-[13px] font-medium text-[#2C2C2A]">Cara kerja Mary</span>
          </div>
          <div className="flex flex-col gap-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#B6E0CD] flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-[#085041]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-[#2C2C2A]">
                      {idx + 1}. {step.title}
                    </p>
                    <p className="text-[12px] text-[#5F5E5A] leading-relaxed mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E6DF]">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle size={16} className="text-[#5F5E5A]" />
            <span className="text-[13px] font-medium text-[#2C2C2A]">Pertanyaan umum</span>
          </div>
          <div className="flex flex-col">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} faq={faq} />
            ))}
          </div>
        </div>

        {/* Kontak */}
        <div className="bg-[#E1F5EE] rounded-2xl p-5 border border-[#B6E0CD]">
          <p className="text-[13px] font-medium text-[#085041]">Butuh bantuan lebih lanjut?</p>
          <p className="text-[12px] text-[#5F5E5A] leading-relaxed mt-1">
            Lihat referensi pasal hukum dan kontak instansi terkait di halaman{" "}
            <span className="font-medium text-[#085041]">Law</span>.
          </p>
        </div>

      </div>
    </div>
  );
}