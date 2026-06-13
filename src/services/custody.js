import { apiFetch } from "./api";

/**
 * Ambil seluruh chain of custody (audit trail) untuk satu upload.
 * Backend: GET /api/v1/custody/{upload_id}
 * Return: CustodyLog { upload_id, events: CustodyEvent[] }
 *
 * CustodyEvent: { upload_id, event_type, description, actor, occurred_at }
 */
export async function getCustodyLog(uploadId) {
  return apiFetch(`/api/v1/custody/${uploadId}`);
}

/** Label bahasa Indonesia untuk tiap event_type */
export const EVENT_TYPE_LABELS = {
  uploaded: "File diupload",
  hashed: "Hash SHA-256 dihitung",
  encrypted: "File dienkripsi",
  exif_extracted: "Metadata EXIF diekstrak",
  analysis_started: "Analisis dimulai",
  analysis_completed: "Analisis selesai",
  report_generated: "Laporan dibuat",
  report_accessed: "Laporan diakses",
  file_deleted: "File dihapus otomatis",
};