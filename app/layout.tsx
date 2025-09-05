import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Import Navbar // Import Footer
import Footer2 from "@/components/Footer2"; // Import Footer

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "icarejob.online - Find Friends",
   keywords: [
    "ICarejob.online ",
    "เพื่อนกัน",
    "หาเพื่อนเที่ยว",
    "ทำธุระ",
    "ขับรถ",
    "ทานข้าว",
    "ปรึกษาพูดคุย",
  ],
  description: "เว็บไซต์สำหรับค้นหางานและเพื่อนทำกิจกรรมต่างๆFind new friends for your activities. Travel, errands, meals, consultations, and more!,ไปเที่ยว ทำธุระ ทานข้าว ปรึกษาพูดคุย พาไปหาหมอ! มาเป็นส่วนหนึ่งของ I Care เพื่อนกัน สมัครลงทะเบียนได้แล้ววันนี้!,สนใจเปิดตี้หาเพื่อนกิน เที่ยว กิจกรรมไม่ว่าจะเป็นเที่ยวคาเฟ่ ทะเล ตีแบด เตะบอล กินหมูกระทะ icarejob.online แหล่งรวมเพื่อนเที่ยว เพื่อนกิน ที่พร้อมสนุกไปกับทุกไลฟ์สไตล์",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}>
        <Navbar />  
        {/* <Header /> Header จะอยู่ด้านบนสุดของทุกหน้า */}
        <main className="flex-grow">
          {children}
        </main>
        <Footer2 /> {/* Footer จะอยู่ด้านล่างสุดของทุกหน้า */}
        {/* <Footer /> Footer จะอยู่ด้านล่างสุดของทุกหน้า */}
      </body>
    </html>
  );
}