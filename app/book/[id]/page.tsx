import Link from 'next/link';

const mockBooks = [
  { id: '1', title: '100 Prompts for Vibe Coding', price: 199, cover: 'https://placehold.co/600x800/e2e8f0/1e293b?text=100+Prompts+for+Vibe+Coding', description: 'ปลดล็อกศักยภาพการเขียนโค้ดของคุณด้วย 100 Prompts ที่คัดมาแล้วว่าเวิร์กสำหรับสาย Vibe Coding' },
  { id: '2', title: 'Productive Lazy', price: 250, cover: 'https://placehold.co/600x800/fef08a/1e293b?text=Productive+Lazy', description: 'เทคนิคการทำงานให้ได้ผลลัพธ์มหาศาล ด้วยการลงแรงที่น้อยที่สุด สไตล์คนขี้เกียจแต่โปรดักทีฟ' },
  { id: '3', title: 'มังงะ Bug Slayer', price: 120, cover: 'https://placehold.co/600x800/fca5a5/1e293b?text=Bug+Slayer+Manga', description: 'การ์ตูนสุดมันส์ของการตามล่าและปราบปิศาจบั๊กในโลกแห่งการเขียนโปรแกรม อ่านสนุกได้ความรู้' }
];

// แก้ไขให้รองรับ Next.js 15 โดยใช้ async/await
export default async function BookDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // รอรับค่า ID จาก URL
  const book = mockBooks.find((b) => b.id === id);

  if (!book) return <div className="text-center py-20 text-2xl">ไม่พบหนังสือ</div>;

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2">
          <img src={book.cover} alt={book.title} className="w-full rounded-2xl shadow-lg object-cover" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <Link href="/" className="text-blue-600 mb-4 hover:underline">← กลับไปหน้าร้าน</Link>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{book.title}</h1>
          <p className="text-lg text-gray-600 mb-8">{book.description}</p>
          <div className="text-3xl font-bold text-blue-600 mb-8">฿{book.price}</div>
          
          <Link 
            href={`/checkout/${book.id}`}
            className="w-full bg-blue-600 text-white text-center py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            ไปหน้าชำระเงิน
          </Link>
        </div>
      </div>
    </main>
  );
}