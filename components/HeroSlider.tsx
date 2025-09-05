// client/components/HeroSlider.tsx

'use client'; // <-- ระบุว่าเป็น Client Component

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade'; // สไตล์สำหรับ effect 'fade'

// Import Icons
import { ChevronLeft, ChevronRight } from 'lucide-react';

// กำหนด Type ของข้อมูลสไลด์เพื่อความถูกต้องของโค้ด (ดีต่อ ESLint/TypeScript)
type Slide = {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
};

// ข้อมูลของแต่ละสไลด์
const slideData: Slide[] = [
  {
    id: 1,
    title: 'ค้นหาเพื่อนร่วมทริปในฝัน',
    subtitle: 'ไม่ว่าจะเป็นภูเขาหรือทะเล เรามีเพื่อนเดินทางรอคุณอยู่',
    imageUrl: '/images/s1.jpg', // ต้องมีไฟล์นี้ใน public/images/
    ctaText: 'หาเพื่อนเที่ยว',
    ctaLink: '/search?category=TRAVEL',
  },
  {
    id: 2,
    title: 'มื้ออร่อยไม่เหงาอีกต่อไป',
    subtitle: 'หาเพื่อนไปทานข้าวร้านโปรด หรือลองร้านใหม่ๆ ด้วยกัน',
    imageUrl: '/images/s2.jpg', // ต้องมีไฟล์นี้ใน public/images/
    ctaText: 'หาเพื่อนกิน',
    ctaLink: '/search?category=DINING',
  },
  {
    id: 3,
    title: 'เล่นกีฬาให้สนุกยิ่งขึ้น',
    subtitle: 'หาคู่ซ้อมแบดมินตัน ทีมฟุตบอล หรือเพื่อนวิ่งยามเช้า',
    imageUrl: '/images/s3.jpg', // ต้องมีไฟล์นี้ใน public/images/
    ctaText: 'หาเพื่อนเล่นกีฬา',
    ctaLink: '/search?category=SPORTS',
  },
];

export default function HeroSlider() {
  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] lg:h-[80vh] text-white">
      <Swiper
        // ติดตั้ง modules ที่ต้องการใช้งาน
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        effect="fade" // ใช้ effect 'fade' เพื่อความนุ่มนวล
        fadeEffect={{
          crossFade: true,
        }}
        navigation={{
          nextEl: '.swiper-button-next-custom', // กำหนด custom button
          prevEl: '.swiper-button-prev-custom', // กำหนด custom button
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination-custom',
        }}
        className="w-full h-full"
      >
        {slideData.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            {/* Background Image using Next/Image for Optimization */}
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              style={{ objectFit: 'cover' }}
              // โหลดรูปแรกทันทีเพื่อประสิทธิภาพ (LCP)
              priority={index === 0}
              unoptimized={true}  
              sizes="(max-width: 768px) 100vw, 100vw"
            />
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center p-4">
              <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg animate-fade-in-down">
                {slide.title}
              </h1>
              <p className="mt-4 text-lg md:text-xl max-w-2xl drop-shadow-md animate-fade-in-up">
                {slide.subtitle}
              </p>
              <Link href="/register">
                <span className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg">
                  {slide.ctaText} 
                </span>
                
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation & Pagination Controls */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <button className="swiper-button-prev-custom p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors duration-300">
          <ChevronLeft size={24} />
        </button>
        <div className="swiper-pagination-custom flex gap-2" />
        <button className="swiper-button-next-custom p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors duration-300" >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* CSS สำหรับ Custom Pagination */}
      <style jsx global>{`
        .swiper-pagination-custom .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background-color: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: background-color 0.3s, transform 0.3s;
        }
        .swiper-pagination-custom .swiper-pagination-bullet-active {
          background-color: #ffffff;
          transform: scale(1.2);
        }
      `}</style>
    </section>
  );
}