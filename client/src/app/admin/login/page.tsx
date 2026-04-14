"use client";
import React, { useState } from 'react';
import { login } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(form);
      router.push('/admin'); // Redirect to dashboard
    } catch (err) {
      setError('Invalid credentials. Access Denied.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-deep flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-orange-200">
            <Lock size={30} />
          </div>
          <h1 className="text-3xl font-black text-brand-deep">SoloLife Admin</h1>
          <p className="text-brand-muted mt-2">Enter your sovereign credentials</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 font-bold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-4 top-4 text-brand-muted" size={20} />
            <input 
              type="text" 
              placeholder="Username"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-orange outline-none transition"
              onChange={(e) => setForm({...form, username: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-brand-muted" size={20} />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-orange outline-none transition"
              onChange={(e) => setForm({...form, password: e.target.value})}
            />
          </div>
          <button className="w-full bg-brand-deep text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-orange transition-all flex items-center justify-center gap-2 group">
            Login to Command Center <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}