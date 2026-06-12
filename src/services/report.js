import { apiFetch } from "./api";

/**
 * Generate PDF forensic report dari hasil analisis.
 * Backend: POST /api/v1/report/generate
 * Body: { upload_id }
 * Return: ReportResponse {
 *   report_id, report_token, download_url, letter_template_url,
 *   generated_at, expires_with_file
 * }
 *
 * Catatan: jalankan analyzeUpload() terlebih dahulu sebelum generate report.
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
 * download_url di-refresh setiap request (expire 1 jam).
 */
export async function getReport(reportToken) {
  return apiFetch(`/api/v1/report/${reportToken}`);
}