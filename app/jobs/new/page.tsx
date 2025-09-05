// client/app/jobs/new/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // <-- 1. Import axios เข้ามา

interface JobPostForm {
  title: string;
  description: string;
  categoryId: string;
  duration?: string;
  budget?: number;
  location?: string;
  jobImage?: FileList;
}

interface JobCategory {
  id: string;
  name: string;
}

// --- 1. สร้างฟังก์ชัน Validation สำหรับตรวจสอบข้อมูลส่วนตัว ---
const containsPersonalInfo = (value: string): boolean | string => {
  // Regex สำหรับอีเมล
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  // Regex สำหรับเบอร์โทรศัพท์ (รองรับ 0xx-xxx-xxxx, 0xxxxxxxx, +66xxxxxxxxx)
  const phoneRegex = /(?:\+66|0)\d{1,2}-?\d{3,4}-?\d{4}/;
  // Regex สำหรับหาคำว่า "line", "line id", "ไลน์", "ไอดีไลน์" (case-insensitive)
  const lineKeywordRegex = /line(\s*id)?|ไลน์(\s*ไอดี)?/i;
  // Regex สำหรับหาลิงก์ URL
  const urlRegex = /(https?:\/\/[^\s]+)/;

  if (emailRegex.test(value)) {
    return "Please do not include email addresses in the description.";
  }
  if (phoneRegex.test(value)) {
    return "Please do not include phone numbers in the description.";
  }
  if (lineKeywordRegex.test(value)) {
    return "Please do not share LINE ID or other contact information here.";
  }
  if (urlRegex.test(value)) {
    return "Please do not include website links in the description.";
  }

  // ถ้าไม่เจออะไรเลย ให้ return true (ผ่าน)
  return true;
};


export default function NewJobPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<JobPostForm>();
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to post a job.");
      router.push('/login');
    } else {
      api.get('/jobs/categories')
        .then(res => {
          setCategories(res.data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch categories", err);
          setIsLoading(false);
        });
    }
  }, [router]);

  const onSubmit = async (data: JobPostForm) => {
    const formData = new FormData();
    
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('categoryId', data.categoryId);
    
    if (data.duration) formData.append('duration', data.duration);
    if (data.budget) formData.append('budget', String(data.budget));
    if (data.location) formData.append('location', data.location);
    if (data.jobImage && data.jobImage[0]) {
      formData.append('jobImage', data.jobImage[0]);
    }

    try {
      const response = await api.post('/jobs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Job posted successfully!');
      router.push(`/jobs/${response.data.id}`);
    } catch (error) { // <-- 2. ลบ : any ออก
      // --- ส่วนที่แก้ไข ---
      console.error("Failed to post job:", error);
      // 3. ใช้ Type Guard ของ Axios เพื่อตรวจสอบ
      if (axios.isAxiosError(error) && error.response) {
        // ถ้าเป็น Axios Error และมี response, เราสามารถเข้าถึง error.response ได้อย่างปลอดภัย
        alert(error.response.data.message || 'An error occurred while posting the job.');
      } else if (error instanceof Error) {
        // ถ้าเป็น Error ทั่วไป
        alert(error.message);
      } else {
        // กรณีอื่นๆ
        alert('An unexpected error occurred.');
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><p>Loading...</p></div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Post a New Job</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* --- Fields --- */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input id="title" {...register('title', { required: 'Title is required' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
            <select id="categoryId" {...register('categoryId', { required: 'Category is required' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white">
              <option value="">Select a category</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget (Baht)</label>
            <input id="budget" type="number" step="0.01" {...register('budget')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input id="location" {...register('location')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" {...register('description', { required: 'Description is required',validate: {
                  noPersonalInfo: (value) => containsPersonalInfo(value)
                } })} rows={6} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label htmlFor="jobImage" className="block text-sm font-medium text-gray-700">Image (Optional)</label>
            <input id="jobImage" type="file" {...register('jobImage')} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>

          <div className="flex justify-end space-x-4">
             <button type="button" onClick={() => router.back()} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                Cancel
             </button>
             <button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400">
              {isSubmitting ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}