// client/app/my-applications/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface MyApplication {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  jobPost: { 
    id: string; 
    title: string;
  };
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // ตรวจสอบการ login ก่อน fetch
    if (!localStorage.getItem('token')) {
        router.push('/login');
        return;
    }

    api.get('/users/my-applications')
      .then(res => setApplications(res.data))
      .catch(err => console.error("Failed to fetch applications:", err))
      .finally(() => setIsLoading(false));
  }, [router]);

  const getStatusInfo = (status: MyApplication['status']) => {
    switch(status) {
      case 'ACCEPTED': 
        return { 
          text: 'ACCEPTED ผ่านการคัดเลือก', 
          className: 'bg-green-100 text-green-800 border-green-300' 
        };
      case 'REJECTED': 
        return { 
          text: 'NOT SELECTED ไม่ได้เลือก', 
          className: 'bg-red-100 text-red-800 border-red-300' 
        };
      default: 
        return { 
          text: 'PENDING รอดำเนินการ', 
          className: 'bg-yellow-100 text-yellow-800 border-yellow-300' 
        };
    }
  };

  if (isLoading) return <p className="text-center p-10">Loading your applications...</p>;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">My Job Applications ใบสมัครงานของฉัน</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        {applications.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {applications.map(app => {
              const statusInfo = getStatusInfo(app.status);
              return (
                <li key={app.id} className="flex flex-col md:flex-row justify-between items-start md:items-center py-4">
                  <Link href={`/jobs/${app.jobPost.id}`} className="font-semibold text-lg text-blue-600 hover:underline mb-2 md:mb-0">
                    {app.jobPost.title}
                  </Link>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.className}`}>
                    Status: {statusInfo.text}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center py-8 text-gray-500">You haven&apos;t applied for any jobs yet.คุณยังไม่ได้สมัครงานใดๆ</p>
        )}
      </div>
    </div>
  );
}