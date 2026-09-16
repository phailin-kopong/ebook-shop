import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookId, customerName, customerEmail } = body;

    // บันทึกข้อมูลลงตาราง orders สถานะจะเป็น 'PENDING' ตามค่าเริ่มต้น
    const { data, error } = await supabase
      .from('orders')
      .insert([
        { 
          book_id: bookId, 
          customer_name: customerName, 
          customer_email: customerEmail 
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create order' }, { status: 500 });
  }
}