// client/app/admin/jobs/[id]/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

// ควรย้าย Types เหล่านี้ไปไว้ที่ไฟล์กลาง เช่น @/types/index.ts
// เพื่อให้สามารถนำไปใช้ซ้ำในไฟล์อื่นได้
interface AdminJobApplication {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  applicant: { id: string; username: string };
}
interface AdminJobDetails {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'CLOSED';
  author: { username: string };
  category: { name: string };
  applications: AdminJobApplication[];
  createdAt: string;
}

export default function AdminJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [job, setJob] = useState<AdminJobDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ใช้ useCallback เพื่อป้องกันการสร้างฟังก์ชันใหม่ทุกครั้งที่ re-render
  const fetchJobData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await api.get(`/admin/jobs/${id}`);
      setJob(res.data);
    } catch (error) {
      console.error("Failed to fetch job details for admin", error);
      alert("Job not found or an error occurred.");
      router.back(); // กลับไปหน้าก่อนหน้าถ้าหา job ไม่เจอ
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchJobData();
  }, [fetchJobData]);

  // ฟังก์ชันสำหรับอนุมัติใบสมัคร
  const handleApprove = async (applicationId: string, applicantName: string) => {
    if (window.confirm(`Are you sure you want to approve ${applicantName} for this job? This will close the job post.`)) {
      try {
        await api.put(`/admin/applications/${applicationId}/approve`);
        alert('Application approved successfully!');
        fetchJobData(); // โหลดข้อมูลใหม่เพื่ออัปเดตสถานะบนหน้าจอ
      } catch (error) {
        alert('Failed to approve application.');
        console.error(error);
      }
    }
  };

  // ฟังก์ชันสำหรับปฏิเสธใบสมัคร
  const handleReject = async (applicationId: string, applicantName: string) => {
    if (window.confirm(`Are you sure you want to reject ${applicantName}? This action can be permanent.`)) {
      try {
        await api.put(`/admin/applications/${applicationId}/reject`);
        alert('Application rejected successfully!');
        fetchJobData(); // โหลดข้อมูลใหม่เพื่ออัปเดตสถานะบนหน้าจอ
      } catch (error) {
        alert('Failed to reject application.');
        console.error(error);
      }
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Loading job details...</div>;
  }

  if (!job) {
    return <div className="text-center p-10">Job post not found.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      {/* --- Job Details Section --- */}
      <div className="border-b pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <Link href={`/jobs/${job.id}`} target="_blank" className="text-sm text-blue-500 hover:underline">
            View Public Page
          </Link>
        </div>
        <div className="text-sm text-gray-500 mt-2 space-x-4">
          <span>Posted by: <span className="font-medium">{job.author.username}</span></span>
          <span>Category: <span className="font-medium">{job.category.name}</span></span>
          <span>Created: <span className="font-medium">{new Date(job.createdAt).toLocaleDateString()}</span></span>
        </div>
        <p className="mt-2">Status: 
          <span className={`font-semibold ml-2 ${job.status === 'OPEN' ? 'text-green-600' : 'text-red-600'}`}>
            {job.status}
          </span>
        </p>
      </div>
      
      {/* --- Applicants Management Section --- */}
      <div>
        <h2 className="text-xl font-bold mb-4">Applicants Management ({job.applications.length})</h2>
        {job.applications.length > 0 ? (
          <div className="space-y-3">
            {job.applications.map(app => (
              <div key={app.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-50 rounded-md gap-2">
                <span className="font-medium">{app.applicant.username}</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 
                      app.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                    {app.status}
                  </span>
                  
                  {/* แสดงปุ่ม Approve และ Reject เฉพาะเมื่อสถานะเป็น PENDING และ Job ยัง OPEN */}
                  {job.status === 'OPEN' && app.status === 'PENDING' && (
                    <>
                      <button 
                        onClick={() => handleApprove(app.id, app.applicant.username)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(app.id, app.applicant.username)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">There are no applicants for this job.</p>
        )}
      </div>
    </div>
  );
}