import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-blue-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">ค้นหาเพื่อนใหม่</span>
          <span className="block text-blue-600">ทำกิจกรรมที่คุณชอบ</span>
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500 sm:max-w-3xl">
          ไม่ว่าจะเป็นไปเที่ยว ทานข้าว ดูหนัง หรือเล่นกีฬา
          ที่นี่คือพื้นที่สำหรับคุณในการหาเพื่อนร่วมทาง
        </p>
        <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">
          <div className="rounded-md shadow">
            <Link
              href="/register"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            >
              เริ่มต้นใช้งาน
            </Link>
          </div>
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <Link
              href="/register"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10"
            >
              ดูประกาศ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}