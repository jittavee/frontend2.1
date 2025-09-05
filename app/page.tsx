// import Hero from "@/components/Hero";
// // import Hero1 from "@/components/Hero1";
// import About from "@/components/About";
// import Resume from "@/components/Resume";
// import HeroSlider from '@/components/HeroSlider'; // Import component



// export default function HomePage() {
//   return (
//     <>
//       {/* <Hero /> */}
      
//       {/* สามารถเพิ่ม Section อื่นๆ ของหน้า Home ได้ที่นี่ */}
//       <HeroSlider />
//       <Hero />
//       <section className="py-20 px-4">
//         <div className="container mx-auto">
//           <h2 className="text-3xl font-bold text-center mb-8">
//             ฟีเจอร์เด่นของเรา
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             {/* ตัวอย่าง Card เนื้อหา */}
//             <div className="p-6 border rounded-lg text-center">
//               <h3 className="text-xl font-semibold">ค้นหาง่าย</h3>
//               <p className="mt-2 text-gray-600">
//                 ระบุความต้องการและค้นหาเพื่อนที่ใช่สำหรับคุณ
//               </p>
//             </div>
//             <div className="p-6 border rounded-lg text-center">
//               <h3 className="text-xl font-semibold">ปลอดภัย</h3>
//               <p className="mt-2 text-gray-600">
//                 เรามีระบบยืนยันตัวตนเพื่อความน่าเชื่อถือ
//               </p>
//             </div>
//             <div className="p-6 border rounded-lg text-center">
//               <h3 className="text-xl font-semibold">คอมมูนิตี้ดีๆ</h3>
//               <p className="mt-2 text-gray-600">
//                 พบปะผู้คนใหม่ๆ ที่มีความสนใจเหมือนกัน
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
      
//       <div className="py-5 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 className="text-3xl font-extrabold text-gray-900 text-center">
//                 วิธีใช้งาน?
//             </h2>
//             <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
//                 {/* Step 1 */}
//                 <div className="text-center">
//                     <div className="text-4xl font-bold text-blue-600">1</div>
//                     <h3 className="mt-2 text-lg font-medium text-gray-900">สร้างโปรไฟล์  {"👤"}</h3>
//                     <p className="mt-2 text-base text-gray-500">ลงทะเบียนและบอกเราว่าคุณสนใจทำกิจกรรมอะไร</p>
//                 </div>
//                 {/* Step 2 */}
//                 <div className="text-center">
//                     <div className="text-4xl font-bold text-blue-600">2</div>
//                     <h3 className="mt-2 text-lg font-medium text-gray-900">ค้นหาเพื่อน {"💬"}</h3>
//                     <p className="mt-2 text-base text-gray-500">ดูประกาศจากเพื่อนๆ หรือสร้างประกาศของคุณเอง</p>
//                 </div>
//                 {/* Step 3 */}
//                 <div className="text-center">
//                     <div className="text-4xl font-bold text-blue-600">3</div>
//                     <h3 className="mt-2 text-lg font-medium text-gray-900">นัดเจอกัน! {"🤝"}</h3>
//                     <p className="mt-2 text-base text-gray-500">เริ่มต้นมิตรภาพใหม่ๆ และสนุกกับกิจกรรมของคุณ</p>
//                 </div>
//             </div>
//         </div>
//       </div>
//       <hr/>

//       <Resume />
//       <About />
      


//     </>
//   );
// }


// client/app/page.tsx
'use client';

// --- 1. เพิ่ม Imports ที่จำเป็น ---
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Image from 'next/image';

// --- Imports Components เดิมของคุณ ---
import Hero from "@/components/Hero";
// import About from "@/components/About";
import Resume from "@/components/Resume";
import HeroSlider from '@/components/HeroSlider';

// --- 2. สร้าง Type และ Component ย่อยสำหรับ Announcement ---
interface Announcement {
  id: string;
  title: string;
  content?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  type: 'NEWS' | 'ADVERTISEMENT';
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');
  const imageSrc = announcement.imageUrl 
    ? `${API_BASE_URL}${announcement.imageUrl}` 
    : `https://placehold.co/800x400/EEE/31343C&text=${encodeURIComponent(announcement.type)}`;

  const content = (
    <div className="relative w-full h-64 rounded-lg overflow-hidden group shadow-lg">
      <Image 
        src={imageSrc}
        alt={announcement.title}
        fill
        style={{ objectFit: 'cover' }}
        className="transition-transform duration-500 group-hover:scale-110"
        unoptimized={true}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block ${announcement.type === 'NEWS' ? 'bg-blue-500' : 'bg-green-500'}`}>
          {announcement.type === 'NEWS' ? 'ข่าวสาร' : 'โฆษณา'}
        </span>
        <h3 className="text-2xl font-bold leading-tight">{announcement.title}</h3>
        {announcement.content && <p className="text-sm mt-1 opacity-90 truncate">{announcement.content}</p>}
      </div>
    </div>
  );

  return announcement.linkUrl ? (
    <a href={announcement.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    <div className="block">{content}</div>
  );
}


export default function HomePage() {
  // --- 3. เพิ่ม State และ useEffect สำหรับดึงข้อมูล Announcements ---
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  
  useEffect(() => {
    api.get('/announcements/public')
      .then(res => setAnnouncements(res.data))
      .catch(err => console.error("Failed to fetch announcements", err));
  }, []);

  return (
    // ใช้ <main> แทน <></> เพื่อ Semantic HTML ที่ดีกว่า
    <main>
      <HeroSlider />
      <Hero />
      <section className="py-5 px-4">
        {/* ... (ส่วน "ฟีเจอร์เด่นของเรา" เหมือนเดิม) ... */}
      </section>
      
      {/* --- 4. แทรก Section ของ Announcements ที่นี่ --- */}
      {/* จะแสดงผลก็ต่อเมื่อมีข้อมูล announcements เท่านั้น */}
      {announcements.length > 0 && (
        <section className="pt-0 pb-10 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">
              News ข่าว & Promotions ติดโฆษณา
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {announcements.map(item => (
                <AnnouncementCard key={item.id} announcement={item} />
              ))}
            </div>
          </div>
        </section>
      )}
      {/* ------------------------------------------- */}

      <div className="py-5 bg-white">
        {/* ... (ส่วน "วิธีใช้งาน?" เหมือนเดิม) ... */}
      </div>
      <hr/>

      <Resume />
      {/* <About /> */}
    </main>
  );
}
