// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { orderId, email, name, bookTitle } = await request.json();

    // ส่งอีเมลผ่าน Resend API
    const data = await resend.emails.send({
      from: 'Vibe E-Book <onboarding@resend.dev>',
      to: [email],
      subject: `[Vibe E-Book] ยืนยันคำสั่งซื้อหนังสือ: ${bookTitle}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">สวัสดีคุณ ${name},</h2>
          <p>ขอบคุณสำหรับการสั่งซื้อ E-Book: <strong>${bookTitle}</strong></p>
          <p>รหัสคำสั่งซื้อของคุณคือ: <strong>#${orderId}</strong></p>
          <p>คุณสามารถคลิกที่ลิงก์ด้านล่างเพื่อดาวน์โหลดหนังสือของคุณได้ทันที:</p>
          <a href="http://localhost:3000/download?order=${orderId}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 8px; margin-top: 10px; font-weight: bold;">ดาวน์โหลด E-Book ของคุณ</a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">หากมีข้อสงสัยประการใด สามารถติดต่อเราได้ตลอดเวลา</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Resend Error:', error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}