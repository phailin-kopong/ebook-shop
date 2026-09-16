// app/checkout/[id]/page.tsx
"use client";
import { useState, use } from 'react';
import Link from 'next/link';

const mockBooks = [
  { id: '1', title: '100 Prompts for Vibe Coding', price: 199 },
  { id: '2', title: 'Productive Lazy', price: 250 },
  { id: '3', title: 'มังงะ Bug Slayer', price: 120 }
];

export default function Checkout({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const book = mockBooks.find((b) => b.id === id);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'PENDING' | 'PAID'>('IDLE');
  
  // เพิ่ม State สำหรับเก็บรหัสออเดอร์และสถานะการโหลด
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!book) return <div className="text-center py-20 text-2xl">ไม่พบข้อมูล</div>;

  // 1. ฟังก์ชันสร้างคำสั่งซื้อ (ยิง API ไปเซฟลง Supabase เป็น PENDING)
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: book.id, customerName: name, customerEmail: email }),
      });
      const data = await res.json();
      
      if (data.success) {
        setOrderId(data.order.id); // เก็บ ID ที่ได้จากฐานข้อมูล
        setStatus('PENDING'); // เปลี่ยนหน้าจอไปรอชำระเงิน
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.error);
      }
    } catch (error) {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. ฟังก์ชันจำลองจ่ายเงิน (ยิง API ไปแก้สถานะเป็น PAID และส่งอีเมล)
  const handleMockPayment = async () => {
    if (!orderId) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      
      if (data.success) {
        setStatus('PAID'); // เปลี่ยนหน้าจอเป็นชำระเงินสำเร็จ
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.error);
      }
    } catch (error) {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center items-start pt-20">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-2xl font-extrabold text-center text-gray-900 mb-6">สรุปคำสั่งซื้อ</h1>
        
        <div className="bg-gray-50 p-4 rounded-xl mb-6 flex justify-between items-center">
          <span className="font-bold text-gray-800">{book.title}</span>
          <span className="font-bold text-lg text-blue-600">฿{book.price}</span>
        </div>

        {/* สถานะ 1: กรอกฟอร์ม */}
        {status === 'IDLE' && (
          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อ-นามสกุล</label>
              <input 
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">อีเมล</label>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {isLoading ? 'กำลังบันทึกข้อมูล...' : 'สร้างคำสั่งซื้อ'}
            </button>
          </form>
        )}

        {/* สถานะ 2: รอชำระเงิน (PENDING) */}
        {status === 'PENDING' && (
          <div className="mt-6 border-t pt-6 text-center space-y-4">
            <div className="bg-red-100 text-red-600 text-sm font-extrabold px-4 py-2 rounded-full inline-block animate-pulse">
              ⚠️ DEMO ONLY ⚠️
            </div>
            <p className="text-gray-600 font-medium">คำสั่งซื้อสร้างสำเร็จ (สถานะ: PENDING)</p>
            <p className="text-xs text-gray-400 break-all">Order ID: {orderId}</p>
            <button 
              onClick={handleMockPayment}
              disabled={isLoading}
              className="w-full bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 transition-colors shadow-lg disabled:bg-gray-400"
            >
              {isLoading ? 'กำลังประมวลผล...' : 'จำลองชำระเงินสำเร็จ'}
            </button>
          </div>
        )}

        {/* สถานะ 3: ชำระเงินสำเร็จ (PAID) */}
        {status === 'PAID' && (
          <div className="mt-6 border-t pt-6 text-center space-y-4">
            <div className="text-5xl">🎉</div>
            <h2 className="text-xl font-bold text-green-600">ชำระเงินสำเร็จ! (PAID)</h2>
            <p className="text-gray-600 text-sm">
              ระบบได้ส่งลิงก์ดาวน์โหลด E-book ไปที่:<br/><span className="font-bold text-gray-900">{email}</span>
            </p>
            <Link href="/" className="inline-block mt-4 text-blue-600 underline">กลับไปหน้าแรก</Link>
          </div>
        )}

        {status === 'IDLE' && (
          <div className="mt-6 text-center">
            <Link href={`/book/${book.id}`} className="text-sm text-gray-500 hover:text-gray-800 underline">ยกเลิก</Link>
          </div>
        )}
      </div>
    </main>
  );
}