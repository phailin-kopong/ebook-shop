// app/checkout/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id;

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchBook() {
      const { data: books } = await supabase.from('books').select('*');
      const foundBook = books?.find((b: any) => String(b.id) === String(bookId));
      if (foundBook) {
        setBook(foundBook);
      }
      setLoading(false);
    }
    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !book) return;
    setSubmitting(true);

    try {
      // 1. บันทึกคำสั่งซื้อลงตาราง orders ใน Supabase (ใช้รหัส book_id เป็นข้อความ/ตัวเลขตามจริง)
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            book_id: book.id,
            customer_name: name,
            customer_email: email,
            status: 'PENDING',
          },
        ])
        .select()
        .single();

      if (orderError) {
        console.error('Supabase Order Error:', orderError);
        alert('เกิดข้อผิดพลาดในการบันทึกคำสั่งซื้อ: ' + (orderError.message || 'โปรดตรวจสอบตาราง orders ใน Supabase'));
        setSubmitting(false);
        return;
      }

      // 2. เรียก API ส่งเมลผ่าน Resend
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.id,
          email: email,
          name: name,
          bookTitle: book.title,
        }),
      });

      if (res.ok) {
        router.push(`/download?order=${orderData.id}`);
      } else {
        // แม้ส่งเมลไม่ผ่าน แต่บันทึกออเดอร์สำเร็จ ให้พาไปหน้าดาวน์โหลดได้ปกติ
        router.push(`/download?order=${orderData.id}`);
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400 font-sans">กำลังโหลดข้อมูล...</div>;
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="text-5xl mb-4">🛒</div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">ไม่พบข้อมูลหนังสือสำหรับการชำระเงิน</h1>
        <p className="text-slate-500 text-sm mb-6">กรุณากลับไปเลือกหนังสือใหม่อีกครั้ง</p>
        <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow hover:bg-blue-700 transition-colors">
          ← กลับสู่หน้าแรก
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl text-white shadow">📚</span>
            <span className="font-extrabold text-lg text-slate-900">Vibe E-Book</span>
          </Link>
          <Link href={`/book/${book.id}`} className="text-xs font-bold text-blue-600 hover:underline">
            ← กลับไปหน้าหนังสือ
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-10">
          <h1 className="text-2xl font-black text-slate-900 mb-6 border-l-4 border-blue-600 pl-3">
            ยืนยันคำสั่งซื้อและชำระเงิน
          </h1>

          <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8">
            <img src={book.cover} alt={book.title} className="w-16 h-20 object-cover rounded-xl shadow" />
            <div className="flex-grow">
              <h3 className="font-bold text-slate-900 text-base">{book.title}</h3>
              <p className="text-xs text-slate-500 mt-1">ผู้แต่ง: {book.author || 'Vibe Team'}</p>
              <p className="font-black text-blue-600 text-lg mt-1">฿{book.price}</p>
            </div>
          </div>

          <form onSubmit={handleCheckout} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">ชื่อ -นามสกุล (สำหรับออกหลักฐาน)</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="กรอกชื่อของคุณ..." 
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 text-sm border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">อีเมล (สำหรับรับลิงก์ดาวน์โหลด PDF/EPUB)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="กรอกอีเมลของคุณ (เช่น user@gmail.com)..." 
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 text-sm border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-200 transition-all mt-4"
            >
              {submitting ? 'กำลังดำเนินการชำระเงิน...' : `💳 ชำระเงินจำนวน ฿{book.price} ทันที`}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}