// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [books, setBooks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      const { data } = await supabase.from('books').select('*');
      if (data) setBooks(data);
      setLoading(false);
    }
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCategory === 'ทั้งหมด') return matchesSearch;
    return matchesSearch && (book.tag === selectedCategory || book.title.toLowerCase().includes(selectedCategory.toLowerCase()));
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      
      {/* 1. TOP NAVIGATION (อัปเดตเพิ่มปุ่มสมัครสมาชิกและเข้าสู่ระบบเรียบร้อย) */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl text-white shadow-md">📚</span>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-none">Vibe E-Book</span>
              <span className="text-[10px] text-slate-400">อ่านง่าย ได้ทุกที่ ทุกเวลา</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <Link href="/" className="text-blue-600 font-semibold">หน้าหลัก</Link>
            <Link href="#books">หนังสือทั้งหมด</Link>
            <Link href="#categories">หมวดหมู่ ▾</Link>
            <Link href="#about">เกี่ยวกับเรา</Link>
            <Link href="#help">ช่วยเหลือ</Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Link href="/track" className="text-xs md:text-sm font-semibold text-slate-700 hover:text-blue-600 flex items-center space-x-1 mr-2">
              <span>🛒</span>
              <span className="hidden sm:inline">ติดตามสถานะ</span>
            </Link>
            
            <Link href="/register" className="text-xs font-bold px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all">
              สมัครสมาชิก
            </Link>

            <Link href="/login" className="text-xs font-bold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-100 transition-all">
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-b from-blue-50/50 to-transparent rounded-b-[40px]">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full border border-amber-200">
            <span>⚡</span>
            <span>อ่านได้ทันที หลังชำระเงิน</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            เปิดโลกแห่งจินตนาการ <br />
            ไปกับ <span className="text-blue-600">E-Book คุณภาพสูง</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-lg leading-relaxed">
            รวมหนังสือดีจากนักเขียนชื่อดัง หลากหลายหมวดหมู่ อ่านได้ทุกที่ ทุกเวลา บนทุกอุปกรณ์
          </p>

          <div className="relative max-w-md">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 ค้นหาหนังสือที่ใช่สำหรับคุณ..." 
              className="w-full bg-white text-sm px-5 py-3.5 rounded-2xl shadow-sm border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-6 text-xs text-slate-500 font-medium pt-2">
            <div className="flex items-center space-x-1.5"><span>📚</span><span>หนังสือคุณภาพ ราคาประหยัด</span></div>
            <div className="flex items-center space-x-1.5"><span>⚡</span><span>ดาวน์โหลดทันที หลังชำระเงิน</span></div>
            <div className="flex items-center space-x-1.5"><span>🛡️</span><span>ปลอดภัย 100% ชำระเงินผ่านระบบมาตรฐานสากล</span></div>
          </div>
        </div>

        <div className="lg:col-span-5 relative flex justify-center">
          <div className="w-full max-w-md bg-slate-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden border-4 border-slate-800">
            <div className="absolute top-2 right-4 text-[10px] text-amber-400">หนังสือดีๆ เปลี่ยนวันธรรมดาให้พิเศษได้เสมอ ♡</div>
            <div className="bg-slate-800 p-4 rounded-2xl mt-4 flex items-center space-x-4 border border-slate-700">
              <span className="text-3xl">📱</span>
              <div>
                <h4 className="font-bold text-sm">Good Books Better Days</h4>
                <p className="text-xs text-slate-400">อ่านง่าย สบายตา ทุกหน้าจอ</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY ICONS */}
      <section id="categories" className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-900">🔥 หมวดหมู่ยอดนิยม</h2>
          <span className="text-xs font-bold text-blue-600 cursor-pointer hover:underline">ดูทั้งหมด →</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 text-center">
          {[
            { name: 'ทั้งหมด', icon: '📚' },
            { name: 'นิยาย', icon: '💖' },
            { name: 'มังงะ', icon: '🐱' },
            { name: 'พัฒนาตนเอง', icon: '🎯' },
            { name: 'ธุรกิจ', icon: '📈' },
            { name: 'เทคโนโลยี', icon: '💻' },
            { name: 'จิตวิทยา', icon: '🧠' },
            { name: 'อื่นๆ', icon: '✨' },
          ].map((cat) => (
            <button 
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name === 'ทั้งหมด' ? 'ทั้งหมด' : cat.name)}
              className="flex flex-col items-center space-y-2 p-3 bg-white hover:bg-blue-50 rounded-2xl border border-slate-100 shadow-sm transition-all group"
            >
              <div className="w-12 h-12 bg-slate-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center text-xl shadow-inner">
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-slate-700">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. BOOKS GRID */}
      <section id="books" className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">⭐ หนังสือแนะนำ</h2>
          <span className="text-xs font-bold text-slate-400">คัดสรรมาให้คุณโดยเฉพาะ อ่านก่อนใคร</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">กำลังโหลดหนังสือ...</div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12 text-slate-400">ไม่พบหนังสือที่คุณค้นหา</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <div 
                key={book.id} 
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col group"
              >
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  <img 
                    src={book.cover || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"} 
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow">
                    {book.tag || 'ขายดี'}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-sm text-slate-900 mb-1 line-clamp-1 group-hover:text-blue-600">
                    {book.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mb-2">โดย {book.author || 'Vibe Team'}</p>

                  <div className="flex items-center space-x-1 text-[11px] text-amber-500 mb-3">
                    <span>★</span>
                    <span className="font-bold text-slate-700">{book.rating || 4.8}</span>
                    <span className="text-slate-400">(320 รีวิว)</span>
                  </div>

                  <div className="flex space-x-1 mb-4">
                    <span className="px-1.5 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-600 rounded">PDF</span>
                    <span className="px-1.5 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-600 rounded">EPUB</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="font-black text-base text-blue-600">฿{book.price}</span>
                      <span className="text-xs text-slate-300 line-through ml-1.5">฿350</span>
                    </div>
                    <Link 
                      href={`/book/${book.id}`}
                      className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-xl shadow transition-colors"
                    >
                      ซื้อเลย
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-xl">
          <div className="space-y-3 mb-6 md:mb-0">
            <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full">สมาชิกใหม่</span>
            <h3 className="text-2xl sm:text-3xl font-black">สมัครสมาชิกวันนี้ รับส่วนลด 10%</h3>
            <p className="text-slate-300 text-xs sm:text-sm">สำหรับการซื้อ E-Book ครั้งแรก สมัครง่าย ไม่มีค่าใช้จ่าย</p>
          </div>
          <Link href="/register" className="px-8 py-3.5 bg-white text-slate-900 font-bold text-xs rounded-2xl hover:bg-blue-50 transition-colors shadow-lg">
            สมัครสมาชิก →
          </Link>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-8 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">📚</span>
              <div>
                <span className="font-extrabold text-base block leading-none">Vibe E-Book</span>
                <span className="text-[10px] text-slate-400">อ่านได้ ทุกที่ ทุกเวลา</span>
              </div>
            </div>
            <div className="flex space-x-6 text-xs text-slate-400">
              <Link href="/">หน้าหลัก</Link>
              <Link href="#books">หนังสือทั้งหมด</Link>
              <Link href="#categories">หมวดหมู่</Link>
              <Link href="#about">เกี่ยวกับเรา</Link>
            </div>
          </div>
          <div className="pt-8 text-center text-xs text-slate-500">
            <p>© 2026 Vibe E-Book. สงวนลิขสิทธิ์ทุกประการ</p>
          </div>
        </div>
      </footer>

    </div>
  );
}