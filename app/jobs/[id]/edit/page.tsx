// 'use client';

// import { useForm } from 'react-hook-form';
// import api from '@/lib/api';
// import { useRouter, useParams } from 'next/navigation';
// import { useState, useEffect, useCallback } from 'react';
// import { type JobCategory, type JobPostDetails } from '@/types';

// type JobEditFormData = {
//   title: string;
//   description: string;
//   categoryId: string;
//   duration: string;
//   budget: number;
//   location: string;
//   status: 'OPEN' | 'CLOSED';
// };

// export default function EditJobPage() {
//   const router = useRouter();
//   const params = useParams();
//   const id = params.id as string;

//   const { register, handleSubmit, formState: { errors }, reset } = useForm<JobEditFormData>();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [categories, setCategories] = useState<JobCategory[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const fetchJobData = useCallback(async () => {
//     if (!id) return;
//     try {
//       const [jobRes, categoriesRes] = await Promise.all([
//         api.get<JobPostDetails>(`/jobs/${id}`),
//         api.get<JobCategory[]>('/jobs/categories'),
//       ]);
      
//       const jobData = jobRes.data;
//       setCategories(categoriesRes.data);
      
//       // ตั้งค่าเริ่มต้นให้ฟอร์ม
//       reset({
//         title: jobData.title,
//         description: jobData.description,
//         categoryId: jobData.category.id,
//         duration: jobData.duration || '',
//         budget: jobData.budget || 0,
//         location: jobData.location || '',
//         status: jobData.status,
//       });

//     } catch (err: any) {
//       if (err.response?.status === 403 || err.response?.status === 404) {
//           setError("Job not found or you don't have permission to edit it.");
//       } else {
//           setError("Failed to load job data.");
//       }
//     }
//   }, [id, reset]);

//   useEffect(() => {
//     fetchJobData();
//   }, [fetchJobData]);

//   const onSubmit = async (data: JobEditFormData) => {
//     setIsSubmitting(true);
//     try {
//       await api.put(`/jobs/${id}`, data);
//       alert('Job updated successfully!');
//       router.push(`/jobs/${id}`); // กลับไปหน้ารายละเอียด
//     } catch (error) {
//       console.error(error);
//       alert('Failed to update job.');
//       setIsSubmitting(false);
//     }
//   };

//   if (error) {
//       return <div className="text-center p-10 text-red-500">{error}</div>
//   }

//   return (
//     <div className="container mx-auto p-6 max-w-2xl">
//       <h1 className="text-3xl font-bold mb-6">Edit Job Post</h1>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
//         {/* Fields ต่างๆ จะเหมือนกับหน้า New Job แต่จะมีฟิลด์ Status เพิ่มมา */}
//         <div>
//           <label htmlFor="title" className="block font-medium">Job Title</label>
//           <input id="title" {...register('title', { required: 'Title is required' })} className="w-full p-2 border rounded-md mt-1" />
//         </div>
        
//         <div>
//           <label htmlFor="status" className="block font-medium">Status</label>
//           <select id="status" {...register('status')} className="w-full p-2 border rounded-md mt-1">
//             <option value="OPEN">Open</option>
//             <option value="CLOSED">Closed</option>
//           </select>
//         </div>
        
//         {/* ... ใส่ input fields อื่นๆ (categoryId, duration, budget, location, description) เหมือนกับหน้า new ... */}
//         {/* ... (ขออนุญาตย่อส่วนนี้เพื่อความกระชับ) ... */}

//         <button type="submit" disabled={isSubmitting} className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400">
//           {isSubmitting ? 'Saving...' : 'Save Changes'}
//         </button>
//       </form>
//     </div>
//   );
// }
// client/app/jobs/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import api from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

// --- Types ---
interface JobEditForm {
  title: string;
  description: string;
  categoryId: string;
  budget?: number;
  location?: string;
}

interface JobCategory {
  id: string;
  name: string;
}

// --- 1. ฟังก์ชัน Validation  ---
const containsPersonalInfo = (value: string): boolean | string => {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const phoneRegex = /(?:\+66|0)\d{1,2}-?\d{3,4}-?\d{4}/;
  const lineKeywordRegex = /line(\s*id)?|ไลน์(\s*ไอดี)?/i;
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
  return true;
};


export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<JobEditForm>();
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // ดึงข้อมูลทั้งสองอย่างพร้อมกัน
    Promise.all([
      api.get(`/jobs/${id}`),
      api.get('/jobs/categories')
    ]).then(([jobRes, categoriesRes]) => {
      const jobData = jobRes.data;
      // ตั้งค่าเริ่มต้นให้ฟอร์มด้วยข้อมูลเดิม
      setValue('title', jobData.title);
      setValue('description', jobData.description);
      setValue('categoryId', jobData.categoryId);
      setValue('budget', jobData.budget);
      setValue('location', jobData.location);
      
      setCategories(categoriesRes.data);
    }).catch(err => {
      console.error("Failed to load data for editing", err);
      setError("Failed to load job data. It might not exist.");
    }).finally(() => {
      setIsLoading(false);
    });

  }, [id, setValue]);

  const onSubmit: SubmitHandler<JobEditForm> = async (data) => {
    try {
      // ใช้ API endpoint สำหรับอัปเดต (PUT)
      await api.put(`/jobs/${id}`, data);
      alert('Job updated successfully!');
      router.push(`/jobs/${id}`); // กลับไปหน้ารายละเอียดงาน
    } catch (err) {
      console.error("Failed to update job:", err);
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data.message || 'Failed to update job.');
      } else {
        alert('An unexpected error occurred.');
      }
    }
  };

  if (isLoading) return <p className="text-center p-10">Loading job data for editing...</p>;
  if (error) return <p className="text-center text-red-500 p-10">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Job Post</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title">Title</label>
            <input id="title" {...register('title', { required: 'Title is required' })} className="mt-1 w-full p-2 border rounded-md" />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>
          
          <div>
            <label htmlFor="categoryId">Category</label>
            <select id="categoryId" {...register('categoryId', { required: 'Category is required' })} className="mt-1 w-full p-2 border rounded-md bg-white">
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
          </div>

          <div>
            <label htmlFor="budget">Budget (Baht)</label>
            <input id="budget" type="number" {...register('budget')} className="mt-1 w-full p-2 border rounded-md" />
          </div>

          <div>
            <label htmlFor="location">Location</label>
            <input id="location" {...register('location')} className="mt-1 w-full p-2 border rounded-md" />
          </div>
          
          <div>
            <label htmlFor="description">Description</label>
            <textarea id="description" {...register('description', { required: 'Description is required', validate: {
                  noPersonalInfo: (value) => containsPersonalInfo(value)
                }
                 })} rows={6} className="mt-1 w-full p-2 border rounded-md" />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end space-x-4">
             <button type="button" onClick={() => router.back()} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                Cancel
             </button>
             <button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
