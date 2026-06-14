import { apiFetch } from "./api";

/**
 * Generate PDF forensic report dari hasil analisis.
 * Backend: POST /api/v1/report/generate
 */
export async function generateReport(uploadId) {
  return apiFetch("/api/v1/report/generate", {
    method: "POST",
    body: JSON.stringify({ upload_id: uploadId }),
  });
}

/**
 * Ambil report yang sudah pernah digenerate via report_token.
 * Backend: GET /api/v1/report/{report_token}
 */
export async function getReport(reportToken) {
  return apiFetch(`/api/v1/report/${reportToken}`);
}

/**
 * Ambil semua report milik user yang sedang login.
 * Backend: GET /api/v1/report/
 * Return: { items: [{ report_id, report_token, upload_id, original_filename,
 *                       thumbnail_url, verdict, total_confidence_score,
 *                       generated_at, download_count, has_letter_template }] }
 */
export async function listReports() {
  return apiFetch("/api/v1/report/");
}