// components/BookCard.tsx
import Link from 'next/link';

interface BookCardProps {
  id: string;
  title: string;
  price: number;
  cover: string;
  description: string;
}

export default function BookCard({ id, title, price, cover, description }: BookCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {/* รูปปกหนังสือ */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        {/* ใช้ tag img ธรรมดาแทน next/image เพื่อความง่ายในการดึงรูป mock จากภายนอกในตอนนี้ */}
        <img 
          src={cover} 
          alt={title} 
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" 
        />
      </div>
      
      {/* ข้อมูลหนังสือ */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-extrabold text-blue-600">฿{price}</span>
          <Link
            href={`/book/${id}`}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            ดูรายละเอียด
          </Link>
        </div>
      </div>
    </div>
  );
}