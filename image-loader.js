// client/image-loader.js

// ไม่ต้อง 'use client'

// ฟังก์ชันนี้จะทำหน้าที่เป็น Loader โดยตรง
// มันจะถูกเรียกโดย Next.js Image Component
export default function imageLoader({ src, width, quality }) {
  // เราจะคืนค่า src กลับไปตรงๆ โดยไม่สนใจ width หรือ quality
  // เพื่อบังคับให้เบราว์เซอร์โหลดรูปจาก URL ต้นทางโดยตรง
  return src;
}