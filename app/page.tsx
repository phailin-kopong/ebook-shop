// app/page.tsx
import BookCard from '@/components/BookCard';
import Link from 'next/link';

// ข้อมูลจำลอง (Mock Data) ตามที่กำหนด
const mockBooks = [
  {
    id: '1',
    title: '100 Prompts for Vibe Coding',
    price: 199,
    cover: 'https://placehold.co/600x800/e2e8f0/1e293b?text=100+Prompts+for+Vibe+Coding',
    description: 'ปลดล็อกศักยภาพการเขียนโค้ดของคุณด้วย 100 Prompts ที่คัดมาแล้วว่าเวิร์กสำหรับสาย Vibe Coding'
  },
  {
    id: '2',
    title: 'Productive Lazy',
    price: 250,
    cover: 'https://placehold.co/600x800/fef08a/1e293b?text=Productive+Lazy',
    description: 'เทคนิคการทำงานให้ได้ผลลัพธ์มหาศาล ด้วยการลงแรงที่น้อยที่สุด สไตล์คนขี้เกียจแต่โปรดักทีฟ'
  },
  {
    id: '3',
    title: 'มังงะ Bug Slayer',
    price: 120,
    cover: 'https://placehold.co/600x800/fca5a5/1e293b?text=Bug+Slayer+Manga',
    description: 'การ์ตูนสุดมันส์ของการตามล่าและปราบปิศาจบั๊กในโลกแห่งการเขียนโปรแกรม อ่านสนุกได้ความรู้'
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
              E-Book Shop
            </h1>
            <p className="text-lg text-gray-600">
              หนังสือดีๆ ที่โปรแกรมเมอร์และคนทำงานยุคใหม่ต้องมี
            </p>
          </div>
          
          {/* ปุ่มไปหน้าติดตามสถานะตามแผนที่ตกลงกันไว้ */}
          <Link 
            href="/track" 
            className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
          >
            🔍 ติดตามสถานะคำสั่งซื้อ
          </Link>
        </div>

        {/* Grid แสดงรายการหนังสือ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockBooks.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              price={book.price}
              cover={book.cover}
              description={book.description}
            />
          ))}
        </div>

      </div>
    </main>
  );
}