'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

export const useAuth = (): AuthState => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // เริ่มต้นด้วย loading
  const router = useRouter();
  const pathname = usePathname();

  // useCallback เพื่อไม่ให้ฟังก์ชันถูกสร้างใหม่ทุกครั้งที่ re-render
  const checkAuthStatus = useCallback(() => {
    // ตรวจสอบว่าโค้ดกำลังรันบน client side หรือไม่
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token); // !! แปลง string/null เป็น boolean
    }
    setIsLoading(false); // ตรวจสอบเสร็จแล้ว
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [pathname, checkAuthStatus]); // ตรวจสอบสถานะใหม่ทุกครั้งที่เปลี่ยนหน้า

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setIsAuthenticated(false);
    router.push('/login');
    router.refresh(); // บังคับให้ re-fetch ข้อมูลใหม่
  };

  return { isAuthenticated, isLoading, logout };
};