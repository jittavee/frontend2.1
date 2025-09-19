'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { type User } from '@/types';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  
  // ดึงฟังก์ชันที่จำเป็นทั้งหมดจาก useForm
  const { register, handleSubmit, reset } = useForm<User>();
  const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');

  // 1. สร้างฟังก์ชันดึงข้อมูลโปรไฟล์ด้วย useCallback
  // เพื่อให้ฟังก์ชันนี้สามารถถูกเรียกใช้จากที่อื่นได้โดยไม่ถูกสร้างใหม่ทุกครั้ง
  const fetchProfile = useCallback(async () => {
    // ไม่ตั้ง setIsLoading(true) ที่นี่ เพื่อให้การ re-fetch หลังอัปรูปไม่แสดงหน้า Loading
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const response = await api.get<User>('/users/profile'); 
      setUser(response.data);
      reset(response.data); // คำสั่งนี้จะรีเซ็ตค่าทั้งหมดในฟอร์มให้ตรงกับข้อมูลล่าสุด
    } catch (error) {
      console.error('Failed to fetch profile', error);
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router, reset]);

  // 2. useEffect สำหรับการโหลดข้อมูลครั้งแรก
  useEffect(() => {
    setIsLoading(true);
    fetchProfile().finally(() => {
      setIsLoading(false);
    });
  }, [fetchProfile]);

  // 3. ฟังก์ชันอัปเดตข้อมูลโปรไฟล์ (Text fields)
  const onUpdateProfile = async (data: Partial<User>) => {
    // สร้าง payload ที่มีเฉพาะ field ที่อนุญาตให้อัปเดต
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: data.address,
      education: data.education,
      experience: data.experience,
      skills: data.skills,
      lineId: data.lineId,
    };
    try {
      const response = await api.put('/users/profile', payload);
      setUser(response.data.user); // อัปเดต state เพื่อแสดงผล
      reset(response.data.user); // อัปเดตฟอร์มด้วย
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile.');
    }
  };

  // 4. ฟังก์ชันจัดการการเลือกไฟล์รูปภาพ
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // 5. ฟังก์ชันจัดการการอัปโหลดรูปภาพ (แก้ไขแล้ว)
  const handleImageUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('profileImage', selectedFile);

    try {
      // อัปโหลดรูปไปที่ API
      await api.post('/users/profile/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Image uploaded successfully! Refreshing profile...');
      setSelectedFile(null); // เคลียร์ไฟล์ที่เลือก

      // เรียก fetchProfile() เพื่อดึงข้อมูลทั้งหมดใหม่!
      // นี่คือวิธีที่การันตีว่า State ทั้งหมดจะตรงกัน 100%
      await fetchProfile();

    } catch (error) {
      console.error('Failed to upload image', error);
      alert('Failed to upload image.');
    }
  };

  // 6. ฟังก์ชัน Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // --- ส่วนแสดงผล (Render) ---

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading Profile...</div>;
  }

  if (!user) {
    return <div className="text-center p-10">User not found. Redirecting to login...</div>;
  }

  const profileImageUrl = user.profileImageUrl
    ? `${API_BASE_URL}${user.profileImageUrl}`
    : `https://placehold.co/150x150/EFEFEF/AAAAAA&text=No+Image`;

  return (
    <div className="container mx-auto max-w-2xl mt-10 p-4 md:p-8">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold">Logout</button>
        </div>

        {/* ส่วนอัปโหลดรูปภาพ */}
        <div className="my-5 text-center">
            {/* --- 2. แก้ไขส่วนแสดงรูปภาพ --- */}
            <div className="relative w-50 h-80  mx-auto overflow-hidden border-4 border-gray-200 bg-gray-100">
                <Image 
                    src={profileImageUrl} 
                    alt="Profile"
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized={true}
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/150x150/EFEFEF/AAAAAA&text=Error'; }}
                />
            </div>
          <input type="file" onChange={handleFileChange} accept="image/*" className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          <button onClick={handleImageUpload} disabled={!selectedFile} className="bg-gray-700 text-white px-4 py-2 rounded mt-2 disabled:bg-gray-400">Upload Image</button>
        </div>

        {/* ฟอร์มแก้ไขข้อมูล */}
        <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700">First Name</label>
              <input {...register('firstName')} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Last Name</label>
              <input {...register('lastName')} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
            </div>
          </div>
          <div>
            <label className="block font-medium text-gray-700">Phone</label>
            <input {...register('phone')} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Address</label>
            <textarea {...register('address')} className="w-full p-2 border border-gray-300 rounded-md mt-1" rows={3}/>
          </div>
          
          <hr className="my-8"/>
          
          <h2 className="text-xl font-semibold text-gray-800">Professional Info</h2>
          <div>
            <label className="block font-medium text-gray-700">Education การศึกษา</label>
            <textarea {...register('education')} className="w-full p-2 border border-gray-300 rounded-md mt-1" rows={3} />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Experience อาชีพและประสบการณ์</label>
            <textarea {...register('experience')} className="w-full p-2 border border-gray-300 rounded-md mt-1" rows={3} />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Skills</label>
            <input {...register('skills')} placeholder="e.g., Cooking, Programming, Driving" className="w-full p-2 border border-gray-300 rounded-md mt-1" />
          </div>

           <div>
            <label className="block font-medium text-gray-700">LINE ID</label>
            <input 
              {...register('lineId')} 
              placeholder="Your LINE ID for contact"
              className="w-full p-2 border border-gray-300 rounded-md mt-1" 
            />
          </div>


          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md mt-6 hover:bg-blue-700 font-semibold text-lg">Update Profile</button>
        </form>
      </div>
    </div>
  );
}