import { apiFetch } from "./api";

/**
 * Upload file gambar ke backend.
 * Backend: POST /api/v1/upload/
 * Return: UploadResponse { upload_id, sha256_hash, original_filename,
 *                           file_size_bytes, mime_type, uploaded_at, expires_at, status }
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch("/api/v1/upload/", {
    method: "POST",
    body: formData,
  });
}

/**
 * Upload gambar dari URL.
 * Backend belum punya endpoint khusus untuk ini — fetch gambar dari URL
 * di sisi client, convert ke File, lalu kirim via uploadImage().
 */
export async function uploadImageFromUrl(imageUrl) {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error("Gagal mengambil gambar dari URL.");

  const blob = await res.blob();
  const filename = imageUrl.split("/").pop()?.split("?")[0] || "image.jpg";
  const file = new File([blob], filename, { type: blob.type });

  return uploadImage(file);
}