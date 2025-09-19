// client/app/admin/layout.tsx
'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface StoredUser {
  id: string;
  username: string;
  role: 'USER' | 'ADMIN';
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // ... (ส่วน Logic useEffect เหมือนเดิม ไม่ต้องแก้ไข) ...
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user: StoredUser = JSON.parse(userString);
        if (user && user.role === 'ADMIN') {
          setIsAuthorized(true);
        } else {
          router.replace('/');
        }
      } else {
        router.replace('/login');
      }
    } catch (error) {
  // ส่งตัวแปร error เข้าไปเป็น argument ที่สองของ console.error
  console.error("Error parsing user data from localStorage:", error); 
  router.replace('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    setIsSidebarOpen(false);
    }, [pathname]);

  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading Admin Panel...</div>;
  }
  if (!isAuthorized) {
    return null; 
  }
  
  const navLinks = [
    { href: '/admin/users', label: 'User Management' },
    { href: '/admin/jobs', label: 'Job Post Management' },
    { href: '/admin/announcements', label: 'Announcements' }, 
    { href: '/admin/settings', label: 'System Settings' },
    { href: '/admin/dashboard', label: 'Dashboard Overview' },
  ];

 const SidebarContent = () => (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
      <nav>
        <ul>{navLinks.map(link => <li key={link.href} className="mb-2"><Link href={link.href} className={`block py-2.5 px-4 rounded transition duration-200 ${pathname === link.href ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>{link.label}</Link></li>)}</ul>
      </nav>
    </>
  );

  return (
    <div className="relative min-h-screen md:flex bg-gray-100">

      {/* --- Header สำหรับจอมือถือ --- */}
      <div className="bg-gray-800 text-gray-100 flex justify-between md:hidden">
        <Link href="/admin/users" className="block p-4 text-white font-bold">
          Admin Panel
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-4 focus:outline-none focus:bg-gray-700"
          aria-label="Toggle sidebar"
        >
          {/* ใช้ไอคอน SVG ที่สะอาดและถูกต้องสำหรับ JSX */}
          <svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* --- Sidebar (เมนูด้านซ้าย) --- */}
      <aside className={`bg-gray-800 text-white w-64 p-4 fixed md:relative inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-30 md:translate-x-0`}>
        <SidebarContent />
      </aside>

      {/* --- Main Content (เนื้อหาหลัก) --- */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto md:ml-64">
        {children}
      </main>
      
      {/* --- Overlay สำหรับจอมือถือ (เมื่อ Sidebar เปิด) --- */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          aria-hidden="true"
        ></div>
      )}

    </div>
  );
}