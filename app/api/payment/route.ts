import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId } = body;

    // 1. อัปเดตสถานะออเดอร์ใน Supabase เป็น 'PAID'
    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update({ status: 'PAID' })
      .eq('id', orderId)
      .select('*, books(title)')
      .single();

    if (updateError) {
      console.error("Supabase Update Error:", updateError);
      throw new Error(updateError.message);
    }

    if (!order) {
      throw new Error('Order not found');
    }

    // 2. สร้างลิงก์ดาวน์โหลดจำลอง
    const downloadLink = `http://localhost:3000/download?order=${order.id}`;

    // 3. ส่งอีเมลผ่าน Resend
    const { error: emailError } = await resend.emails.send({
      from: 'E-Book Shop <onboarding@resend.dev>',
      to: order.customer_email,
      subject: `ชำระเงินสำเร็จ: ${order.books ? order.books.title : 'E-Book'}`,
      html: `
        <h2>ชำระเงินสำเร็จ! 🎉</h2>
        <p>สวัสดีคุณ ${order.customer_name},</p>
        <p>ขอบคุณที่สั่งซื้อหนังสือกับเรา นี่คือลิงก์สำหรับดาวน์โหลด E-Book ของคุณ:</p>
        <a href="${downloadLink}" style="display:inline-block; padding:10px 20px; background:#2563eb; color:white; text-decoration:none; border-radius:5px;">
          ดาวน์โหลด E-Book
        </a>
        <p><br>รหัสอ้างอิง: ${order.id}</p>
      `,
    });

    if (emailError) {
      console.error("Resend Error:", emailError);
    }

    return NextResponse.json({ success: true, message: 'Payment confirmed and email sent' });
  } catch (error: any) {
    console.error("Payment API Error:", error);
    return NextResponse.json({ success: false, error: error.message || 'Payment processing failed' }, { status: 500 });
  }
}