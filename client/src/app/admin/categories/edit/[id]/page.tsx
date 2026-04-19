"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAdminCategoryById, updateCategory } from '@/lib/api';
import { Save, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function EditCategory() {
  const router = useRouter();
  const params = useParams();
  const catId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  // 1. Fetch existing Category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getAdminCategoryById(catId);
        setFormData({
          name: data.name,
          slug: data.slug,
          description: data.description || '',
        });
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load category", err);
        alert("Error loading category data.");
      }
    };
    if (catId) fetchCategory();
  }, [catId]);

  // 2. Handle changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Update logic
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateCategory(parseInt(catId), formData);
      router.push('/admin/categories');
    } catch (err) {
      alert("Update failed. Make sure the slug is unique.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <RefreshCw className="animate-spin text-[#114AB1]" size={40} />
        <p className="font-black text-[#114AB1] uppercase tracking-widest">Accessing Pillar Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/categories" 
            className="p-3 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-[#114AB1] transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-black text-[#114AB1]">Edit Pillar</h1>
        </div>
        <div className="hidden md:block">
            <span className="text-[10px] font-black bg-blue-50 text-[#114AB1] px-4 py-2 rounded-full border border-blue-100 uppercase">
                System ID: {catId}
            </span>
        </div>
      </header>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl space-y-8">
        
        {/* Name Field */}
        <div>
          <label className="block text-xs font-black uppercase text-[#6793AC] tracking-widest mb-3 px-1">Pillar Display Name</label>
          <input 
            name="name"
            type="text" 
            value={formData.name}
            onChange={handleChange}
            className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#114AB1]/10 focus:bg-white outline-none text-xl font-bold text-[#114AB1] transition-all"
            required
          />
        </div>

        {/* Slug Field (Read-only recommendation) */}
        <div>
          <label className="block text-xs font-black uppercase text-[#6793AC] tracking-widest mb-3 px-1 flex items-center gap-2">
            URL Path (Slug)
            <AlertCircle size={12} className="text-orange-400" />
          </label>
          <div className="relative">
            <input 
              name="slug"
              type="text" 
              value={formData.slug}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 rounded-2xl border-none outline-none font-mono text-sm text-[#E4580B] cursor-not-allowed"
              readOnly
            />
            <span className="absolute right-4 top-4 text-[10px] font-bold text-gray-400 uppercase">Locked</span>
          </div>
          <p className="mt-2 text-[10px] text-gray-400 px-1 italic">Changing slugs on established pillars may break existing SEO links.</p>
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-xs font-black uppercase text-[#6793AC] tracking-widest mb-3 px-1">Pillar Mission/Description</label>
          <textarea 
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            placeholder="Define the scope of this lifestyle pillar..."
            className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#114AB1]/10 focus:bg-white outline-none text-gray-600 leading-relaxed transition-all"
          />
        </div>

        {/* Action Button */}
        <button 
          type="submit"
          disabled={isSaving}
          className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 shadow-xl ${
            isSaving 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-[#114AB1] text-white hover:bg-[#E4580B] shadow-blue-900/10'
          }`}
        >
          {isSaving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
          {isSaving ? 'Processing Update...' : 'Commit Changes to Platform'}
        </button>
      </form>
    </div>
  );
}