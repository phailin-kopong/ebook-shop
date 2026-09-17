// app/track/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function TrackOrderPage() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    // ค้นหาออเดอร์จากอีเมลลูกค้าใน Supabase และดึงข้อมูลหนังสือมาร่วมด้วย
    const { data, error } = await supabase
      .from('orders')
      .select('*, books(title, cover)')
      .eq('customer_email', email)
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data);
    }
    setSearched(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl text-white shadow-md shadow-blue-200">📚</span>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Vibe <span className="text-blue-600">E-Book</span>
            </span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-blue-600 hover:underline">
            ← กลับสู่หน้าแรก
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-blue-50 text-blue-600 rounded-2xl text-2xl mb-3 shadow-inner">🔍</div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">ติดตามสถานะคำสั่งซื้อ</h1>
          <p className="text-slate-500 text-sm mt-2">กรอกอีเมลที่คุณใช้สั่งซื้อ E-Book เพื่อตรวจสอบสถานะและลิงก์ดาวน์โหลด</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-3">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="กรอกอีเมลของคุณ (เช่น user@gmail.com)..." 
            required
            className="flex-grow px-5 py-3.5 rounded-2xl bg-slate-50 text-slate-900 text-sm border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-blue-200 whitespace-nowrap"
          >
            {loading ? 'กำลังค้นหา...' : 'ค้นหาออเดอร์'}
          </button>
        </form>

        {/* Results Section */}
        {searched && (
          <div className="mt-10 space-y-4">
            <h2 className="font-bold text-slate-900 text-lg border-l-4 border-blue-600 pl-3">
              ผลการค้นหา ({orders.length} รายการ)
            </h2>

            {orders.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl text-center text-slate-400 border border-slate-200">
                ไม่พบประวัติการสั่งซื้อด้วยอีเมลนี้ กรุณาตรวจสอบความถูกต้องอีกครั้ง
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={order.books?.cover || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"} 
                      alt="book cover" 
                      className="w-16 h-20 object-cover rounded-xl shadow-sm border border-slate-100"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{order.books?.title || 'E-Book'}</h3>
                      <p className="text-xs text-slate-400 mt-1">รหัสคำสั่งซื้อ: {order.id}</p>
                      <p className="text-xs text-slate-400">ชื่อผู้ซื้อ: {order.customer_name}</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                    {order.status === 'PAID' ? (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-full border border-emerald-200">
                        ✅ ชำระเงินแล้ว (PAID)
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 font-bold text-xs rounded-full border border-amber-200">
                        ⏳ รอชำระเงิน (PENDING)
                      </span>
                    )}

                    {order.status === 'PAID' && (
                      <Link 
                        href={`/download?order=${order.id}`}
                        className="mt-2 w-full md:w-auto text-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                      >
                        📥 ไปหน้าดาวน์โหลด
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}