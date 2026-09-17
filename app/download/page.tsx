// app/download/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

function DownloadContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }

      // 1. ดึงข้อมูลออเดอร์ทั้งหมดจากตาราง orders
      const { data: ordersData, error: orderError } = await supabase
        .from('orders')
        .select('*');

      if (ordersData && ordersData.length > 0) {
        // ค้นหาออเดอร์ที่ตรงกับ ID แบบยืดหยุ่น (แปลงเป็น String เทียบกัน)
        const foundOrder = ordersData.find((o: any) => String(o.id) === String(orderId));
        
        if (foundOrder) {
          // 2. ดึงข้อมูลหนังสือจากตาราง books มาใส่คู่กัน
          const { data: booksData } = await supabase
            .from('books')
            .select('*');
          
          const foundBook = booksData?.find((b: any) => String(b.id) === String(foundOrder.book_id));

          setOrder({
            ...foundOrder,
            books: foundBook || { title: 'E-Book คุณภาพสูง', cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400' }
          });
        }
      }
      setLoading(false);
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400 font-sans">กำลังตรวจสอบข้อมูลการสั่งซื้อ...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl text-white shadow">📚</span>
            <span className="font-extrabold text-lg text-slate-900">Vibe E-Book</span>
          </Link>
          <Link href="/" className="text-xs font-bold text-blue-600 hover:underline">
            ← กลับสู่หน้าแรก
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner">
          ✓
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">ชำระเงินสำเร็จแล้ว!</h1>
        <p className="text-slate-500 text-sm mb-8">ขอบคุณที่คุณไว้วางใจ Vibe E-Book เราได้บันทึกคำสั่งซื้อและเตรียมไฟล์สำหรับคุณเรียบร้อยแล้ว</p>

        {order ? (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-left space-y-6">
            <div className="flex items-center space-x-4 border-b border-slate-100 pb-6">
              <img 
                src={order.books?.cover || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"} 
                alt="cover" 
                className="w-20 h-24 object-cover rounded-xl shadow border border-slate-100"
              />
              <div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 font-bold text-[10px] rounded-full">ชำระเงินแล้ว (PAID)</span>
                <h2 className="font-bold text-slate-900 text-lg mt-1">{order.books?.title || 'E-Book'}</h2>
                <p className="text-xs text-slate-400 mt-1">รหัสคำสั่งซื้อ: #{order.id}</p>
                <p className="text-xs text-slate-400">ชื่อผู้ซื้อ: {order.customer_name} ({order.customer_email})</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a 
                href="#"
                onClick={(e) => { e.preventDefault(); alert('กำลังดาวน์โหลดไฟล์ PDF ของหนังสือ...'); }}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2"
              >
                <span>📥 ดาวน์โหลดไฟล์ E-Book (PDF)</span>
              </a>
              <a 
                href="#"
                onClick={(e) => { e.preventDefault(); alert('กำลังดาวน์โหลดไฟล์ EPUB ของหนังสือ...'); }}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-all flex items-center justify-center space-x-2"
              >
                <span>📱 ดาวน์โหลดไฟล์ E-Book (EPUB)</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-slate-400">
            ไม่พบข้อมูลคำสั่งซื้อ (Order ID: {orderId}) ในระบบ กรุณาตรวจสอบลิงก์อีกครั้ง
          </div>
        )}
      </main>
    </div>
  );
}

export default function DownloadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400 font-sans">กำลังโหลด...</div>}>
      <DownloadContent />
    </Suspense>
  );
}