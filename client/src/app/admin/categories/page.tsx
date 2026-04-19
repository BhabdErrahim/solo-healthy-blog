"use client";
import React, { useEffect, useState } from 'react';
import { getCategories, deleteCategory } from '@/lib/api';
import Link from 'next/link';
import { Plus, Edit3, Trash2, FolderTree } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => { fetchCats(); }, []);

  const fetchCats = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Deleting a category will affect all linked articles. Continue?')) {
      await deleteCategory(id);
      fetchCats();
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-[#114AB1]">Content Pillars</h1>
          <p className="text-[#6793AC] mt-2">Manage the 5 core foundations of SoloLife</p>
        </div>
        <Link href="/admin/categories/new" className="bg-[#E4580B] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition shadow-lg shadow-orange-100">
          <Plus size={20} /> Add New Pillar
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat: any) => (
          <div key={cat.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#114AB1] mb-6">
              <FolderTree size={24} />
            </div>
            <h3 className="text-2xl font-black text-[#114AB1] mb-2">{cat.name}</h3>
            <p className="text-xs font-mono text-[#E4580B] mb-4">slug: {cat.slug}</p>
            <p className="text-gray-500 text-sm line-clamp-2 mb-8">{cat.description || "No description provided."}</p>
            
            <div className="flex justify-between items-center pt-6 border-t border-gray-50">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{cat.article_count || 0} Articles</span>
              <div className="flex gap-2">
                <Link href={`/admin/categories/edit/${cat.id}`} className="p-2 text-[#114AB1] hover:bg-blue-50 rounded-lg transition">
                  <Edit3 size={18} />
                </Link>
                <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-400 hover:text-red-600 transition">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}