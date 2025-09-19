'use client';

import { useForm, SubmitHandler } from 'react-hook-form'; // 👈 1. ลบ FieldError ที่ไม่ได้ใช้ออก
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { isAxiosError } from 'axios'; // 👈 2. Import isAxiosError

// 👈 3. สร้าง Type สำหรับ Register Form ให้ครบทุก field
type RegisterFormInputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string; // ต้องมี field นี้ใน Type ด้วย
  firstName: string;
  lastName: string;
  phone?: string; // field ที่ไม่บังคับใส่ '?'
  address?: string; // field ที่ไม่บังคับใส่ '?'
};

export default function RegisterPage() {
  // 👈 4. กำหนด Type ให้ useForm
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormInputs>();
  const router = useRouter();

  // 👈 5. การใช้ watch('password') ถูกต้องแล้ว เพื่อใช้ในการ validate confirmPassword
  const password = watch('password');

  // ไม่จำเป็นต้อง watch('confirmPassword') เพราะเราไม่ได้ใช้ค่าของมันไปทำอะไรต่อ
  // เราแค่ต้องการ validate มันเทียบกับ password ซึ่งทำใน register(...) ได้เลย
  // การลบบรรทัด const confirmPassword = watch('confirmPassword') จะแก้ Error 'no-unused-vars'

  // 👈 6. กำหนด Type ให้ onSubmit
  // 
  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
  try {
    // สร้าง Object ที่จะส่งไป API ด้วยตัวเองเลย
    // เลือกมาเฉพาะ field ที่ API ต้องการ
    const apiData = {
      username: data.username,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: data.address,
    };

    const response = await api.post('/auth/register', apiData);
    
    alert(response.data.message);
    router.push('/login');
  } catch (error) {
    if (isAxiosError(error)) {
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
    } else {
      console.error('An unexpected error occurred:', error);
      alert('An unexpected error occurred.');
    }
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-5 text-center">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            {...register('username', { required: 'Username is required' })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.username && <span className="text-red-500 text-xs">{errors.username.message}</span>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password ใส่อีกครั้ง</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value => value === password || "Passwords do not match"
            })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>}
        </div>

        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name ชื่อ</label>
            <input
              {...register('firstName', { required: 'First name is required' })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name นามสกุล</label>
            <input
              {...register('lastName', { required: 'Last name is required' })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName.message}</span>}
          </div>
        </div>

        {/* Optional fields: Phone & Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone เบอร์โทร (Optional)</label>
          <input
            {...register('phone')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Addressที่อยู่ email idline messenger  (Optional)</label>
          <textarea
            {...register('address')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md">
          Register ลงทะเบียน
        </button>
      </form>
    </div>
  );
}