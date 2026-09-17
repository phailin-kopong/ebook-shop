// app/book/[id]/page.tsx
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 0;

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const bookId = resolvedParams.id;

  // ดึงหนังสือทั้งหมดจาก Supabase แล้วหาเล่มที่ตรงกับ ID
  const { data: books, error } = await supabase.from('books').select('*');
  const book = books?.find((b: any) => String(b.id) === String(bookId));

  if (error || !book) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">ไม่พบข้อมูลหนังสือ (ID: {bookId})</h1>
        <p className="text-slate-500 text-sm mb-6">หนังสือเล่มนี้อาจไม่มีอยู่ในระบบฐานข้อมูล</p>
        <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow hover:bg-blue-700 transition-colors">
          ← กลับสู่หน้าแรก
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl text-white shadow">📚</span>
            <span className="font-extrabold text-lg text-slate-900">Vibe E-Book</span>
          </Link>
          <Link href="/" className="text-xs font-bold text-blue-600 hover:underline">
            ← กลับไปหน้าแรก
          </Link>
        </div>
      </header>

      {/* Main Detail Section */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 p-8 md:p-12 items-center">
          
          {/* ฝั่งซ้าย: รูปปกหนังสือ */}
          <div className="md:col-span-5 relative">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-slate-100">
              <img 
                src={book.cover || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"} 
                alt={book.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-black uppercase shadow">
                {book.tag || 'ขายดี'}
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: รายละเอียดหนังสือ */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 font-bold text-xs rounded-full">
                E-Book (PDF / EPUB)
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 mb-2 leading-tight">
                {book.title}
              </h1>
              <p className="text-sm text-slate-500">
                เขียนโดย <span className="font-bold text-slate-700">{book.author || 'Vibe Team'}</span>
              </p>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <div className="text-amber-500 flex space-x-0.5"><span>★</span><span className="font-bold text-slate-800">{book.rating || 4.8}</span></div>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 text-xs">รีวิวจากผู้ซื้อจริง (320 รีวิว)</span>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {book.description || 'หนังสือคู่มือคุณภาพเยี่ยม อ่านง่าย เข้าใจได้ทันที นำไปปรับใช้ได้จริงในชีวิตประจำวันและการทำงาน'}
            </p>

            <div className="flex items-baseline space-x-3 pt-2">
              <span className="text-3xl font-black text-blue-600">฿{book.price}</span>
              <span className="text-sm text-slate-400 line-through">฿350</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">ประหยัดทันที 40%</span>
            </div>

            <div className="pt-4">
              <Link 
                href={`/checkout/${book.id}`}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2"
              >
                <span>🚀 ไปหน้าชำระเงินทันที</span>
              </Link>
            </div>

            <div className="text-center text-[11px] text-slate-400 pt-2">
              🔒 รับประกันความพอใจ ดาวน์โหลดได้ทันทีหลังชำระเงินสำเร็จ
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}