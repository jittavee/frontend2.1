'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import api from '@/lib/api';

// ควรย้าย Type ไปไว้ที่ไฟล์กลาง @/types/index.ts
interface JobCategory {
  id: string;
  name: string;
}

interface JobPostSummary {
  id: string;
  title: string;
  imageUrl?: string | null;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  author: { id: string; username: string };
  category: JobCategory;
  _count: {
    applications: number;
    comments: number;
  };
}

// Component ย่อยสำหรับแสดงการ์ดงาน
function JobCard({ job }: { job: JobPostSummary }) {
  const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');
  
  const hasValidImage = job.imageUrl && job.imageUrl.trim() !== '';
  const imageUrl = hasValidImage
    ? `${API_BASE_URL}${job.imageUrl}` 
    : `https://placehold.co/400x300/EEE/31343C&text=${encodeURIComponent(job.category.name)}`;
  
  return (
    <Link href={`/jobs/${job.id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="relative w-full h-48 bg-gray-200"> {/* แก้ไข: กำหนดขนาดให้ parent div */}
        {/* --- แก้ไข: เปลี่ยน <img> เป็น <Image> --- */}
        <Image 
          src={imageUrl} 
          alt={job.title}
          fill // ให้รูปภาพเต็มพื้นที่ parent div
          // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // บอก browser ว่ารูปจะกว้างเท่าไหร่ในแต่ละขนาดจอ
          style={{ objectFit: 'cover' }} // ทำให้รูปภาพ cover พื้นที่ (เหมือน object-cover)
          onError={(e) => { e.currentTarget.src = `https://placehold.co/400x300/EEE/31343C&text=Image+Error`; }}
          priority
          unoptimized={true} // <-- เพิ่ม Prop นี้เข้าไป
        />
        {job.status === 'CLOSED' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <span className="text-white text-xl font-bold border-2 border-white px-4 py-2 rounded">CLOSED</span>
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full self-start">{job.category.name}</span>
        <h3 className="font-bold text-lg mt-2 truncate flex-grow">{job.title}</h3>
        <p className="text-sm text-gray-500 mt-1">by {job.author.username}</p>
        <div className="flex justify-between text-sm mt-4 text-gray-600 border-t pt-2">
          <span>{job._count.applications} Applicants</span>
          <span>{job._count.comments} Comments</span>
        </div>
      </div>
    </Link>
  );
}

export default function JobBoardPage() {
  const [jobs, setJobs] = useState<JobPostSummary[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [allowPosting, setAllowPosting] = useState(true); // <<-- STATE ใหม่

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // ใช้ Promise.all เพื่อดึงข้อมูลพร้อมกัน
        const [jobsRes, categoriesRes, settingsRes] = await Promise.all([
          api.get('/jobs', { params: { categoryId: selectedCategory || undefined } }),
          api.get('/jobs/categories'),
          api.get('/public-settings') // <<-- FETCH SETTINGS
        ]);
        setJobs(jobsRes.data);
        setCategories(categoriesRes.data);
        setAllowPosting(settingsRes.data.allowJobPosting); // <<-- SET STATE
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [selectedCategory]); // re-fetch เมื่อมีการเปลี่ยน category

  return (
    <div className="container mx-auto p-4 md:p-6">
     <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold self-start md:self-center">Job Board ประกาศงาน</h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
           <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-md w-full sm:w-auto sm:flex-grow"
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          
          {/* --- ส่วนที่แก้ไข --- */}
          {allowPosting && (
            <Link href="/jobs/new" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full sm:w-auto text-center whitespace-nowrap">
              Post a Job
            </Link>
          )}
          {/* -------------------- */}
        </div>
      </div>

      {isLoading ? <p className="text-center">Loading jobs...</p> : (
        <>
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-8">No jobs found for this category.</p>
          )}
        </>
      )}
    </div>
  );
}
