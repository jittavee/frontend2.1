'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// ตัวอย่างข้อมูลประกาศ
const mockAnnouncements = [
  { id: 1, author: 'สมชาย', title: 'หาเพื่อนไปปีนผาที่เชียงใหม่สุดสัปดาห์นี้', category: 'TRAVEL' },
  { id: 2, author: 'สมหญิง', title: 'ใครว่างไปลองร้านบุฟเฟ่ต์เปิดใหม่ที่สยามบ้าง', category: 'DINING' },
  { id: 3, author: 'มานี', title: 'หาเพื่อนวิ่งสวนลุมตอนเย็นๆ ค่ะ', category: 'SPORTS' },
  { id: 4, author: 'วิชัย', title: 'หาเพื่อนไปดูหนัง The Matrix ภาคแรกที่ Lido', category: 'ERRANDS' },
];

export default function BoardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // ตรวจสอบ token เหมือนหน้า Profile
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">บอร์ดประกาศข่าวสาร</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          + สร้างประกาศใหม่
        </button>
      </div>

      <div className="space-y-4">
        {mockAnnouncements.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
            <p className="text-sm text-gray-500 mt-1">โดย: {post.author}</p>
            <div className="mt-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                {post.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}