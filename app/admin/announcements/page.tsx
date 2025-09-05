'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import Image from 'next/image';

interface Announcement {
  id: string;
  title: string;
  type: 'NEWS' | 'ADVERTISEMENT';
  isActive: boolean;
  imageUrl?: string | null;
  createdAt: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');

  // --- 1. สร้างฟังก์ชัน fetch ข้อมูล ---
  const fetchAnnouncements = () => {
    setIsLoading(true);
    // เรียก API ไปยัง Endpoint ที่ถูกต้องสำหรับดึงรายการทั้งหมด
    api.get('/admin/announcements')
      .then(res => {
        setAnnouncements(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch announcements:", err);
        alert("Could not load announcements.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // --- 2. เรียกใช้ฟังก์ชัน fetch เมื่อ Component โหลด ---
  useEffect(() => {
    fetchAnnouncements();
  }, []); // Dependency array ว่าง เพื่อให้ทำงานแค่ครั้งเดียว

  // --- 3. แก้ไขฟังก์ชัน Delete ---
  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        // เรียก API ไปยัง Endpoint ที่ถูกต้อง
        await api.delete(`/admin/announcements/${id}`);
        alert('Announcement deleted successfully.');
        fetchAnnouncements(); // โหลดรายการใหม่หลังลบสำเร็จ
      } catch (error) {
        console.error("Failed to delete announcement:", error);
        alert('Failed to delete announcement.');
      }
    }
  };

  if (isLoading) return <p>Loading announcements...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Announcements Management</h1>
        <Link href="/admin/announcements/new" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Create New
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white whitespace-nowrap">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">
                  <div className="relative w-16 h-10 bg-gray-100 rounded">
                    {item.imageUrl && (
                      <Image src={`${API_BASE_URL}${item.imageUrl}`} alt={item.title} fill style={{ objectFit: 'cover' }} unoptimized={true} />
                    )}
                  </div>
                </td>
                <td className="py-2 px-4 font-medium">{item.title}</td>
                <td className="py-2 px-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.type === 'NEWS' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {item.type}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-2 px-4 text-center space-x-2">
                  <Link href={`/admin/announcements/edit/${item.id}`} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(item.id, item.title)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {announcements.length === 0 && !isLoading && (
            <p className="text-center py-4 text-gray-500">No announcements found.</p>
        )}
      </div>
    </div>
  );
}