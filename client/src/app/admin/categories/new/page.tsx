"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCategory } from '@/lib/api';
import { Save, ArrowLeft, Zap } from 'lucide-react';
import Link from 'next/link';

export default function NewCategory() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [desc, setDesc] = useState('');

  // Auto-slugger logic
  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''));
  };

  // Inside handleSave in your categories/new/page.tsx
const handleSave = async () => {
  try {
    await createCategory({ name, slug, description: desc });
    router.push('/admin/categories');
  } catch (err: any) {
    // This will now show "405 Method Not Allowed" or the real error
    const status = err.response?.status;
    const message = err.response?.data ? JSON.stringify(err.response.data) : err.message;
    
    if (status === 405) {
        alert("Server Error 405: The backend is not allowing 'POST' requests. Check blog/views.py.");
    } else {
        alert(`Error: ${message}`);
    }
  }
};

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-10 flex items-center gap-4">
        <Link href="/admin/categories" className="p-3 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-[#114AB1] transition-all">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-black text-[#114AB1]">New Pillar</h1>
      </header>

      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-8">
        <div>
          <label className="block text-xs font-black uppercase text-[#6793AC] tracking-widest mb-3">Pillar Name</label>
          <input 
            type="text" 
            placeholder="e.g. Healthy Habits"
            className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none text-xl font-bold text-[#114AB1] focus:ring-4 focus:ring-blue-500/5 transition"
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-[#6793AC] tracking-widest mb-3">URL Slug</label>
          <input 
            type="text" 
            value={slug}
            className="w-full p-4 bg-gray-100 rounded-2xl border-none outline-none font-mono text-sm text-[#E4580B]"
            readOnly
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-[#6793AC] tracking-widest mb-3">Pillar Description</label>
          <textarea 
            rows={4}
            placeholder="What does this category cover?"
            className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none text-gray-600 leading-relaxed"
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-[#114AB1] text-white py-5 rounded-2xl font-black text-lg hover:bg-[#E4580B] transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20"
        >
          <Save size={20} /> Establish Pillar
        </button>
      </div>
    </div>
  );
}