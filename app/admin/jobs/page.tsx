// client/app/admin/jobs/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

// ควรย้าย Type ไปไว้ที่ไฟล์กลาง @/types/index.ts
// นี่คือ Type สำหรับข้อมูลที่ Admin จะเห็น
interface AdminJobPost {
  id: string;
  title: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  author: {
    username: string;
  };
  category: {
    name: string;
  };
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<AdminJobPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // เรียก API จาก adminController ที่เราสร้างไว้
    api.get('/admin/jobs')
      .then(res => {
        setJobs(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch job posts:", err);
        alert("Could not load job posts. Please check your connection or login status.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleDelete = async (jobId: string, jobTitle: string) => {
    if (window.confirm(`Are you sure you want to delete the job post: "${jobTitle}"?`)) {
      try {
        await api.delete(`/admin/jobs/${jobId}`);
        setJobs(currentJobs => currentJobs.filter(job => job.id !== jobId));
        alert('Job post deleted successfully.');
      } catch (error) {
  console.error("Failed to delete job post:", error); // <<-- เพิ่มบรรทัดนี้
  alert('Failed to delete job post.');
      }
    }
  };

  if (isLoading) {
    return <p>Loading job posts...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Job Post Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Author</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Created Date</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 font-medium">{job.title}</td>
                <td className="py-2 px-4">{job.author.username}</td>
                <td className="py-2 px-4">{job.category.name}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    job.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="py-2 px-4">{new Date(job.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-4 text-center space-x-2">

                 {/* --- ปุ่มที่เพิ่มเข้ามา --- */}
                  <Link 
                    href={`/admin/jobs/${job.id}`}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Manage
                  </Link>
                  {/* ------------------------- */}


                  <Link 
                    href={`/jobs/${job.id}`} 
                    target="_blank" // เปิดใน tab ใหม่
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    View
                  </Link>
                  <button 
                    onClick={() => handleDelete(job.id, job.title)} 
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {jobs.length === 0 && (
          <p className="text-center py-4 text-gray-500">No job posts found.</p>
        )}
      </div>
    </div>
  );
}