// client/app/admin/announcements/edit/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import api from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

interface AnnouncementForm {
  title: string;
  content?: string;
  linkUrl?: string;
  type: 'NEWS' | 'ADVERTISEMENT';
  isActive: boolean;
  announcementImage?: FileList;
}

export default function EditAnnouncementPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<AnnouncementForm>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/admin/announcements/${id}`)
      .then(res => {
        const data = res.data;
        setValue('title', data.title);
        setValue('content', data.content || '');
        setValue('linkUrl', data.linkUrl || '');
        setValue('type', data.type);
        setValue('isActive', data.isActive);
      })
      .catch(err => console.error("Failed to load announcement data:", err))
      .finally(() => setIsLoading(false));
  }, [id, setValue]);

  const onSubmit: SubmitHandler<AnnouncementForm> = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);
    formData.append('isActive', String(data.isActive));
    if (data.content) formData.append('content', data.content);
    if (data.linkUrl) formData.append('linkUrl', data.linkUrl);
    if (data.announcementImage && data.announcementImage[0]) {
      formData.append('announcementImage', data.announcementImage[0]);
    }
    
    try {
      await api.put(`/admin/announcements/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Announcement updated successfully!');
      router.push('/admin/announcements');
    } catch (error) {
      console.error("Failed to update announcement", error);
      const message = axios.isAxiosError(error) && error.response ? error.response.data.message : 'An unexpected error occurred.';
      alert(`Error: ${message}`);
    }
  };
  
  if (isLoading) return <p>Loading data...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Announcement</h1>
      
      {/* --- แก้ไข JSX ของฟอร์มทั้งหมดที่นี่ --- */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input id="title" {...register('title', { required: 'Title is required' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
              <select id="type" {...register('type')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white">
                <option value="NEWS">ข่าวสาร News</option>
                <option value="ADVERTISEMENT">โฆษณา Advertisement</option>
              </select>
            </div>
            <div className="flex items-center pt-6">
              <input id="isActive" type="checkbox" {...register('isActive')} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Is Active?</label>
            </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content (Optional)</label>
          <textarea id="content" {...register('content')} rows={4} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        
        <div>
          <label htmlFor="linkUrl" className="block text-sm font-medium text-gray-700">Link URL (Optional)</label>
          <input id="linkUrl" type="url" placeholder="https://example.com" {...register('linkUrl')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        
        <div>
          <label htmlFor="announcementImage" className="block text-sm font-medium text-gray-700">New Image (Optional)</label>
          <p className="text-xs text-gray-500">Uploading a new image will replace the old one.</p>
          <input id="announcementImage" type="file" {...register('announcementImage')} accept="image/*" className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>
        
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button type="button" onClick={() => router.back()} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 font-semibold">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-semibold">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}