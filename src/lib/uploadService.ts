/**
 * Upload Service dành riêng cho Frontend (Farriott Client)
 * 
 * Hỗ trợ 2 chế độ:
 * 1. Cloudinary Direct Upload (Khuyên dùng): Upload trực tiếp từ trình duyệt lên Cloudinary qua Unsigned Preset.
 *    -> Trả về URL https://res.cloudinary.com/... chuẩn quốc tế, không phụ thuộc Backend.
 * 2. Client-Side Image Compression & Base64: Tự động nén ảnh (max 1200px, quality 0.85)
 *    -> Giảm từ 5-10MB xuống còn ~100-300KB, không bao giờ lo tràn localStorage hay nghẽn mạng.
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Nén ảnh trên trình duyệt bằng HTML5 Canvas để tối ưu dung lượng trước khi lưu/upload
 */
export async function compressImage(
  source: Blob | File | string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<{ blob: Blob; base64: string }> {
  if (source instanceof File) {
    const isGif =
      source.type.toLowerCase().includes("gif") ||
      /\.gif$/i.test(source.name);
    if (isGif) {
      return Promise.reject(
        new Error(
          `File "${source.name}" là ảnh động (GIF). Hệ thống chỉ hỗ trợ hình ảnh tĩnh để in áo.`
        )
      );
    }
    const isStaticImage =
      /\.(png|jpe?g|webp|svg|bmp)$/i.test(source.name) ||
      (source.type.startsWith("image/") && !source.type.includes("gif"));
    if (!isStaticImage) {
      return Promise.reject(
        new Error(
          `File "${source.name}" không phải là hình ảnh tĩnh hợp lệ (chấp nhận JPG, PNG, WEBP, SVG, BMP).`
        )
      );
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      let { width, height } = img;

      // Giữ đúng tỉ lệ ảnh khi resize
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          maxHeight = height;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Không thể khởi tạo Canvas 2D context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Định dạng xuất: PNG nếu ảnh gốc trong suốt (PNG), ngược lại JPG/WebP để dung lượng siêu nhẹ
      const isPng = typeof source === "object" && source.type === "image/png";
      const mimeType = isPng ? "image/png" : "image/jpeg";

      const base64 = canvas.toDataURL(mimeType, quality);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Lỗi khi chuyển đổi Canvas sang Blob"));
            return;
          }
          resolve({ blob, base64 });
        },
        mimeType,
        quality
      );
    };

    img.onerror = (err) => reject(err);

    if (typeof source === "string") {
      img.src = source;
    } else {
      img.src = URL.createObjectURL(source);
    }
  });
}

/**
 * Upload ảnh trực tiếp từ Frontend lên Cloudinary thông qua Unsigned Upload Preset
 */
export async function uploadToCloudinary(fileOrBlob: Blob | File): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Chưa cấu hình VITE_CLOUDINARY_CLOUD_NAME hoặc VITE_CLOUDINARY_UPLOAD_PRESET trong file .env"
    );
  }

  const formData = new FormData();
  formData.append("file", fileOrBlob);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "farriott_custom_designs");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `Lỗi tải ảnh lên Cloudinary (HTTP ${response.status})`
    );
  }

  const data = await response.json();
  return data.secure_url as string;
}

/**
 * Hàm upload tổng hợp thông minh:
 * - Ưu tiên 1: Upload lên Cloudinary nếu đã cấu hình (trả về URL https)
 * - Ưu tiên 2: Tự động nén và trả về chuỗi Base64 tối ưu dung lượng
 */
export async function processAndUploadImage(
  source: File | Blob | string
): Promise<{ url: string; isCloud: boolean }> {
  try {
    // 1. Nén ảnh trước để giảm dung lượng mạng
    const { blob, base64 } = await compressImage(source);

    // 2. Nếu có cấu hình Cloudinary, upload ngay
    if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET) {
      try {
        const cloudUrl = await uploadToCloudinary(blob);
        return { url: cloudUrl, isCloud: true };
      } catch (cloudErr) {
        console.warn("Upload Cloudinary không thành công, tự động fallback về Base64:", cloudErr);
      }
    }

    // 3. Fallback: trả về chuỗi Base64 đã nén
    return { url: base64, isCloud: false };
  } catch (err) {
    console.error("Lỗi khi xử lý ảnh:", err);
    throw err;
  }
}
