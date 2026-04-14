"use client";
import React, { useEffect, useState } from 'react';
import { getAdminArticles, deleteArticle } from '@/lib/api';
import Link from 'next/link';
import { Plus, Edit3, Trash2, Search, ExternalLink } from 'lucide-react';

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const data = await getAdminArticles();
    setArticles(data);
  };

  const handleDelete = async (slug: string) => {
    if (confirm('Are you sure you want to delete this cornerstone?')) {
      await deleteArticle(slug);
      fetchArticles();
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-brand-deep">Articles</h1>
          <p className="text-brand-muted">Manage your 20+ content pillars</p>
        </div>
        <Link href="/admin/articles/new" className="bg-brand-orange text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition shadow-lg shadow-orange-100">
          <Plus size={20} /> Create New
        </Link>
      </header>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-xs font-black uppercase text-brand-muted tracking-widest">Article Title</th>
              <th className="px-8 py-5 text-xs font-black uppercase text-brand-muted tracking-widest">Category</th>
              <th className="px-8 py-5 text-xs font-black uppercase text-brand-muted tracking-widest">Status</th>
              <th className="px-8 py-5 text-xs font-black uppercase text-brand-muted tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {articles.map((article: any) => (
              <tr key={article.id} className="hover:bg-gray-50/50 transition">
                <td className="px-8 py-6">
                  <div className="font-bold text-brand-deep">{article.title}</div>
                  <div className="text-xs text-brand-muted mt-1 font-mono">{article.slug}</div>
                </td>
                <td className="px-8 py-6 text-sm font-bold text-brand-muted">
                  {article.category_details?.name}
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    article.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-brand-orange'
                  }`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/article/${article.slug}`} target="_blank" className="p-2 text-brand-muted hover:text-brand-deep">
                       <ExternalLink size={18} />
                    </Link>
                    <Link href={`/admin/articles/edit/${article.slug}`} className="p-2 text-brand-deep hover:bg-white rounded-lg border border-transparent hover:border-gray-100 transition">
                       <Edit3 size={18} />
                    </Link>
                    <button onClick={() => handleDelete(article.slug)} className="p-2 text-red-400 hover:text-red-600">
                       <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}