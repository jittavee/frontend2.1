import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-blue-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-gray-900" >
                <Link href="/" className="text-2xl font-bold text-blue-600">
                  iCareJob.online
                </Link>
              </h2>
              <p className="text-sm text-gray-600">
                 I Care job เพื่อนกัน
              </p>
              <p className="text-sm text-gray-600">
                หาเพื่อนเที่ยว ทำธุระ ขับรถ ทานข้าว ปรึกษาพูดคุย พาไปหาหมอ!มาเป็นส่วนหนึ่งของ I Care เพื่อนกัน สมัครลงทะเบียนได้แล้ววันนี้!
มาพร้อมระบบ Ai จับคู่งานกับธุระของคุณ ได้ที่นี่
              </p>
            </div>
          </div>

          {/* For Company */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">สำหรับประกาศงานฟรี</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-600 hover:text-green-500">ลงประกาศงาน</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-green-500">อัตราค่าบริการ</Link></li>
            </ul>
          </div>

          {/* For Students */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">สำหรับประกาศงานฟรี, ผู้หางาน</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-600 hover:text-green-500">สร้างงานออนไลน์</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-green-500">ค้นหางาน</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-green-500">ค้นหาเพื่อน</Link></li>
            </ul>
          </div>

          {/* Popular Keywords */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">คำค้นหายอดนิยม</h3>
            <div className="flex flex-wrap gap-2 text-sm">
              <Link href="#" className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:text-green-500 rounded-full">หาเพื่อนทำธุระ</Link>
              <Link href="#" className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:text-green-500 rounded-full">หางาน</Link>
              <Link href="#" className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:text-green-500 rounded-full">เว็บหาเพื่อน</Link>
              <Link href="#" className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:text-green-500 rounded-full">ลงประกาศงานฟรี</Link>
              <Link href="#" className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:text-green-500 rounded-full">งานสมัครงานออนไลน์</Link>
              <Link href="#" className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:text-green-500 rounded-full">ไปหาหมอ</Link>
              <Link href="#" className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:text-green-500 rounded-full">ค้นหาเพื่อน</Link>
              <Link href="#" className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:text-green-500 rounded-full">งาน Part Time</Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-sm text-center text-gray-600">
          © Copyright {new Date().getFullYear()}  By Jittavee ICarejob.online 
        </div>
      </div>
    </footer>
  );
};

export default Footer