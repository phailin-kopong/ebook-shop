// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      setLoading(false);
    } else {
      alert('เข้าสู่ระบบสำเร็จ!');
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <span className="text-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-3 rounded-2xl text-white shadow inline-block mb-3">📚</span>
          <h1 className="text-2xl font-black text-slate-900">ยินดีต้อนรับกลับมา</h1>
          <p className="text-xs text-slate-400 mt-1">เข้าสู่ระบบเพื่อจัดการบัญชีของคุณ</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">อีเมล</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 text-sm border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">รหัสผ่าน</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 text-sm border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-200 transition-all mt-2"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : '🔑 เข้าสู่ระบบ'}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          ยังไม่มีบัญชีผู้ใช้?{' '}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">
            สมัครสมาชิกใหม่
          </Link>
        </div>
      </div>
    </div>
  );
}