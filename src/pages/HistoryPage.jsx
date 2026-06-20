import { useState, useEffect } from "react";
import { Clock, ChevronRight, ArrowLeft } from "lucide-react";
import { apiFetch } from "../services/api";
import { getCustodyLog, EVENT_TYPE_LABELS } from "../services/custody";
import { formatTimestamp, formatFileSize } from "../services/formatters";
import ImagePreviewModal from "../components/ImagePreviewModal";

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // { src, alt } | null

  const loadUploads = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/api/v1/upload/");
      const list = Array.isArray(data) ? data : data?.items || [];
      setItems(list);
    } catch (err) {
      setError(err.message || "Gagal memuat riwayat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUploads();
  }, []);

  async function openCustody(upload) {
    setSelected(upload);
    setEventsLoading(true);
    try {
      const log = await getCustodyLog(upload.upload_id);
      setEvents(log.events || []);
    } catch (err) {
      setError(err.message || "Gagal memuat chain of custody.");
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  }

  if (selected) {
    return (
      <div className="absolute inset-0 overflow-y-auto px-4 py-5">
        <div className="max-w-[500px] mx-auto">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-1.5 text-[13px] text-[#5F5E5A] hover:text-[#085041] mb-4"
          >
            <ArrowLeft size={14} />
            Kembali ke riwayat
          </button>

          <div className="bg-[#F6F6F6] rounded-2xl p-4 border border-[#E8E6DF] mb-4 flex gap-3">
            <div
              className="w-[56px] h-[56px] rounded-xl bg-[#E8E6DF] flex-shrink-0 overflow-hidden cursor-pointer"
              onClick={() => selected.thumbnail_url && setPreviewImage({ src: selected.thumbnail_url, alt: selected.original_filename })}
            >
              {selected.thumbnail_url
                ? <img src={selected.thumbnail_url} alt={selected.original_filename} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-[#D3D1C7]" />
              }
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-medium text-[#2C2C2A] truncate">{selected.original_filename}</p>
              <p className="text-[12px] text-[#888780] mt-0.5">
                {formatFileSize(selected.file_size_bytes)} · {formatTimestamp(selected.uploaded_at)}
              </p>
            </div>
          </div>

          <p className="text-[12px] font-medium text-[#5F5E5A] uppercase tracking-wide mb-3">
            Chain of Custody
          </p>

          {eventsLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-[#B6E0CD] border-t-[#085041] rounded-full animate-spin" />
            </div>
          )}

          {!eventsLoading && events.length === 0 && (
            <p className="text-[13px] text-[#888780]">Belum ada audit trail.</p>
          )}

          {!eventsLoading && events.length > 0 && (
            <div className="relative pl-5">
              {/* garis vertikal timeline */}
              <div className="absolute left-[5px] top-2 bottom-2 w-px bg-[#D3D1C7]" />

              {events.map((event, idx) => (
                <div key={idx} className="relative pb-4 last:pb-0">
                  <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-[#5DCAA5] border-2 border-[#F6F6F6]" />
                  <p className="text-[13px] font-medium text-[#2C2C2A]">
                    {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
                  </p>
                  {event.description && (
                    <p className="text-[12px] text-[#5F5E5A] mt-0.5 leading-relaxed">{event.description}</p>
                  )}
                  <p className="text-[11px] text-[#888780] mt-0.5">
                    {formatTimestamp(event.occurred_at)} · {event.actor}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <ImagePreviewModal
          src={previewImage?.src}
          alt={previewImage?.alt}
          onClose={() => setPreviewImage(null)}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-y-auto px-4 py-5">
      <div className="max-w-[500px] mx-auto">

        <div className="mb-4">
          <h2 className="text-[14px] font-semibold text-[#2C2C2A]">Riwayat Upload</h2>
          <p className="text-[12px] text-[#888780] mt-0.5">
            Semua foto yang pernah kamu upload beserta jejak audit (chain of custody) untuk keperluan forensik.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#B6E0CD] border-t-[#085041] rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-[#FCEBEB] border border-[#F09595] text-[#791F1F] text-[13px] rounded-xl px-4 py-3 mb-3">
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[13px] text-[#888780]">Belum ada riwayat upload.</p>
          </div>
        )}

        {!loading && items.map((item) => (
          <button
            key={item.upload_id}
            onClick={() => openCustody(item)}
            className="w-full flex items-center gap-3 bg-[#F6F6F6] rounded-2xl p-4 border border-[#E8E6DF] mb-3 text-left hover:border-[#B6E0CD] transition-colors"
          >
            <div className="w-[48px] h-[48px] rounded-xl bg-[#E8E6DF] flex-shrink-0 overflow-hidden">
              {item.thumbnail_url
                ? <img src={item.thumbnail_url} alt={item.original_filename} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-[#D3D1C7]" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#2C2C2A] truncate">{item.original_filename}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock size={11} className="text-[#888780]" />
                <span className="text-[11px] text-[#888780]">{formatTimestamp(item.uploaded_at)}</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#888780] flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}