import Image from 'next/image'
import Link from 'next/link';


const Hero = () => {
  return (
    <div className="relative bg-white pt-20 pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Side - Images */}
          <div className="relative">
            <div className="relative w-full aspect-square max-w-[400px] lg:max-w-[600px] mx-auto">
              {/* Background Shapes */}
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#E6FAF5] rounded-[32px] -z-10" />
              <div className="absolute -top-8 right-24 w-16 h-16 bg-[#E6FAF5] rounded-full -z-10" />
              <div className="absolute -bottom-4 right-16 w-24 h-24 bg-[#FFF9E6] rounded-[32px] -z-10" />
              <div className="absolute bottom-24 -left-8 w-16 h-16 bg-[#FFE6F1] rounded-full -z-10" />
              
              {/* Hero Images - Mobile */}
              <div className="lg:hidden">
                <div className="absolute top-8 left-0 w-[180px] h-[180px] animate-float-1">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/s1.jpg"
                       
                      alt="Student with megaphone"
                      fill
                      className="object-contain"
                      priority unoptimized={true} 
                    />
                  </div>
                </div>
                <div className="absolute top-8 right-0 w-[180px] h-[180px] animate-float-2">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/s8.jpg"
                       
                      alt="Professional in white shirt"
                      fill
                      className="object-contain"
                      priority unoptimized={true} 
                    />
                  </div>
                </div>
                <div className="absolute top-[220px] left-1/2 -translate-x-1/2 w-[180px] h-[180px] animate-float-3">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/s3.jpg"
                      
                      alt="Student with phone"
                      fill
                      className="object-contain"
                      priority unoptimized={true} 
                    />
                  </div>
                </div>
              </div>

              {/* Hero Images - Desktop */}
              <div className="hidden lg:block">
                <div className="absolute top-0 left-0 w-[320px] h-[320px] animate-float-1">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/s1.jpg"
                      alt="Student with megaphone"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
                <div className="absolute top-12 right-0 w-[280px] h-[280px] animate-float-2">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/s8.jpg"
                      alt="Professional in white shirt"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
                <div className="absolute bottom-0 right-24 w-[280px] h-[280px] animate-float-3">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/s3.jpg"
                      alt="Student with phone"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ค้นหางาน หาเพื่อนทำธุระ
            </h1>
            <p className="text-2xl text-gray-600 mb-6">
              I Care หาเพื่อนเที่ยว ทำธุระ ขับรถ ทานข้าว ปรึกษาพูดคุย พาไปหาหมอ! สมัครลงทะเบียนได้แล้ววันนี้! <br/>
              มาพร้อมระบบ Ai จับคู่งานกับธุระของคุณ ได้ที่นี่ 😋npm
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
              href="/board"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
            >
              ดูประกาศ
            </Link>
              

          </div>
        </div>
<div className="relative bg-white pt-10">


</div>

            {/* Search Box */}
            <div className="flex w-full max-w-xl mb-6 bg-white rounded-full overflow-hidden border border-gray-200">
              
              <input
                type="text"
                placeholder="เช่น หาเพื่อนทำธุระ, หาเพื่อนเที่ยว, หาเพื่อนไปหาหมอ"
                className="flex-1 px-6 py-3 bg-transparent focus:outline-none text-gray-900 placeholder:text-gray-500"
              />
              <button className="px-6 py-2 m-1 bg-blue-700 text-white rounded-full hover:bg-gray-800 flex items-center gap-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                ค้นหา
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-12">
              {['หาเพื่อนไปเที่ยว', 'หาเพื่อนไปทานข้าว', 'หาเพื่อนไปทำธุระ', 'หาเพื่อนไปหาหมอ','หาเพื่อนเล่นกีฬา','หาเพื่อนใปซื้อของ'].map((tag) => (
                <span 
                  key={tag} 
                  className="px-4 py-1.5 bg-blue-700 text-[#faf9fd] rounded-full text-sm hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  {tag}
                  {tag}
                </span>
              ))}
            </div>

            {/* Resume Section */}
            <div >
              {/* <h2 className="text-2xl font-bold text-gray-900 mb-3">
                สร้างบัญชี!ลงทะเบียนกับเราได้เลย.
              </h2> */}
              <h3 className="text-2xl text-gray-600 mb-6">
                ผู้หางาน/ผู้รับงาน สมัครสมาชิกเพื่อสร้างบัญชีฟรี  ได้ที่นี่❤️
              </h3>
              {/* <button className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                สมัครลงทะเบียนได้แล้ววันนี้!
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t pt-8"> </div>
    </div>
  );
};

export default Hero