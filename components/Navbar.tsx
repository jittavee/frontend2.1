'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface StoredUser {
  id: string;
  username: string;
  role: 'USER' | 'ADMIN';
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (isClient) {
      try {
        const userString = localStorage.getItem('user');
        setUser(userString ? JSON.parse(userString) : null);
      } catch { // <-- แก้ไข: ไม่จำเป็นต้องใช้ตัวแปร error ที่นี่
        setUser(null);
      }
    }
    setIsMenuOpen(false);
  }, [pathname, isClient]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // ใช้วิธี reload เพื่อความแน่นอน แต่ยังคงใช้ router เพื่อ push ก่อน
    router.push('/login');
    // หน่วงเวลาเล็กน้อยเพื่อให้แน่ใจว่า push ทำงานก่อน reload
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  if (!isClient) {
    return <nav className="bg-white shadow-md sticky top-0 z-50"><div className="container mx-auto px-4 h-[72px]"></div></nav>;
  }

  const NavLinks = () => (
    <>
      <Link href="/jobs" className="text-gray-600 hover:text-blue-600 font-medium block px-3 py-2 rounded-md">
        Job Board
      </Link>
      {user ? (
        <>
          <Link href="/my-applications" className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md">My Applications</Link>
          <Link href="/profile" className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md">Profile</Link>
          {user.role === 'ADMIN' && (
             <Link href="/admin/users" className="text-red-500 font-semibold hover:text-red-700 block px-3 py-2 rounded-md">Admin Panel</Link>
          )}
          <button onClick={handleLogout} className="text-left w-full text-gray-600 hover:bg-gray-100 font-medium block px-3 py-2 rounded-md md:hover:bg-transparent cursor-pointer">Logout</button>
        </>
      ) : (
        <div className="flex flex-col md:flex-row md:items-center md:space-x-2 mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0">
          <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium block px-3 py-2 rounded-md">Login</Link>
          <Link href="/register" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-medium block text-center">Register</Link>
        </div>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">iCareJob.online</Link>
          <div className="hidden md:flex items-center space-x-2"><NavLinks /></div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden border-t`}>
        <div className="px-2 pt-2 pb-3 space-y-1"><NavLinks /></div>
      </div>
    </nav>
  );
}