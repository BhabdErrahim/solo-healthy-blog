"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCategories, getAdminArticleBySlug, updateArticle } from '@/lib/api';
import { Save, Zap, ArrowLeft, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import matter from 'gray-matter';
import { marked } from 'marked';
import MarkdownInput, { normalizeImageTags } from '@/components/MarkdownInput';

// 1. STABLE RENDERER (Same as New Page)
const markedOptions: any = {
  breaks: true,
  gfm: true,
  renderer: {
    space() { return ''; },
    heading({ text, depth }: { text: string; depth: number }) {
      const size = depth === 1 ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl';
      const color = depth === 1 ? 'text-[#114AB1]' : 'text-[#E4580B]';
      return `<h${depth} class="${size} font-black ${color} mt-12 mb-6 leading-tight">${text}</h${depth}>`;
    },
    paragraph({ text }: { text: string }) {
      if (text.includes('<div class="my-12') || text.includes('<img')) return text;
      return `<p class="text-gray-600 text-lg leading-relaxed mb-6">${text}</p>`;
    },
    image({ href, text }: { href: string; text: string }) {
      const cleanHref = (href || '').replace(/\s+/g, '');
      return `<div class="my-12 w-full">
        <img src="${cleanHref}" alt="${text || ''}" class="w-full h-auto rounded-[2.5rem] shadow-2xl border-[10px] border-white block bg-gray-100" loading="lazy" />
        ${text ? `<p class="text-center text-sm text-[#6793AC] mt-6 italic font-bold tracking-wide">${text}</p>` : ''}
      </div>`;
    },
  },
};

export default function EditArticle() {
  const router = useRouter();
  const { slug: urlSlugParam } = useParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [rawMarkdown, setRawMarkdown] = useState('');
  const [catMatchStatus, setCatMatchStatus] = useState<'none' | 'found' | 'error'>('none');
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', category: '', status: 'draft', featured: false, content: '',
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null);

  // Load Categories and Article Data
  useEffect(() => {
    const loadData = async () => {
      const cats = await getCategories();
      setCategories(cats);

      try {
        const article = await getAdminArticleBySlug(urlSlugParam as string);
        
        // Reconstruct Markdown string with Frontmatter
        const reconstructedMd = `---
title: "${article.title}"
slug: "${article.slug}"
excerpt: "${article.excerpt}"
category: "${article.category.name}"
featured: ${article.featured}
status: "${article.status}"
---

${article.content}`; // Note: Ideally your DB stores raw MD, but we can parse HTML back or store MD in a separate field later.

        setRawMarkdown(reconstructedMd);
        setExistingThumbnail(article.thumbnail);
        setFormData({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          category: article.category.id,
          status: article.status,
          featured: article.featured,
          content: article.content,
        });
        setCatMatchStatus('found');
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load article", err);
      }
    };
    loadData();
  }, [urlSlugParam]);

  const processMarkdown = (val: string) => {
    try {
      const sanitized = val.replace(/\r/g, '');
      const fixed = normalizeImageTags(sanitized);
      const { data, content } = matter(fixed);
      const htmlContent = marked.parse(content, markedOptions) as string;

      const rawCatName = String(data.category || '').toLowerCase().trim();
      const matchedCategory = categories.find((c: any) => 
        c.name.toLowerCase().includes(rawCatName) || c.slug.toLowerCase().includes(rawCatName)
      );

      if (matchedCategory) setCatMatchStatus('found');
      else setCatMatchStatus('error');

      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        category: matchedCategory ? matchedCategory.id : '',
        status: data.status || 'draft',
        featured: data.featured || false,
        content: htmlContent,
      });
    } catch (err) {
      console.error('Markdown parse error:', err);
    }
  };

  const handleUpdate = (val: string) => {
    setRawMarkdown(val);
    processMarkdown(val);
  };

  const handleSave = async () => {
    const finalData = new FormData();
    Object.entries(formData).forEach(([key, value]) => finalData.append(key, String(value)));
    if (thumbnail) finalData.append('thumbnail', thumbnail);

    try {
      await updateArticle(urlSlugParam as string, finalData);
      router.push('/admin/articles');
    } catch {
      alert('Update failed. Check your data.');
    }
  };

  if (isLoading) return <div className="p-20 text-center font-black text-brand-deep animate-pulse">Loading Pillar Data...</div>;

  return (
    <div className="max-w-[1600px] mx-auto p-4 lg:p-10">
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/articles" className="p-3 bg-gray-50 hover:bg-[#114AB1] hover:text-white rounded-full transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-[#114AB1]">Edit Cornerstone</h1>
            <p className="text-[#6793AC] text-sm font-bold uppercase tracking-widest">Update existing strategy</p>
          </div>
        </div>
        <button onClick={handleSave} className="w-full md:w-auto bg-[#114AB1] text-white px-12 py-5 rounded-[1.5rem] font-black text-lg hover:bg-[#E4580B] transition-all shadow-xl flex items-center justify-center gap-2">
          <Save size={22} /> Update Platform
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6 space-y-4">
          <MarkdownInput value={rawMarkdown} onChange={handleUpdate} />
        </div>

        <div className="lg:col-span-6 space-y-8">
          <div className="bg-white p-10 rounded-[4rem] border border-gray-100 shadow-sm space-y-8 min-h-[850px] flex flex-col">
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-6 rounded-3xl border flex items-center justify-between transition-all ${catMatchStatus === 'found' ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50'}`}>
                <div>
                  <p className="text-[10px] font-black text-[#6793AC] uppercase">Category</p>
                  <p className="font-black text-lg text-[#114AB1]">{catMatchStatus === 'found' ? 'Verified' : 'Searching...'}</p>
                </div>
                {catMatchStatus === 'found' ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-gray-300" />}
              </div>
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <p className="text-[10px] font-black text-[#6793AC] uppercase">Slug</p>
                <p className="font-bold text-xs text-[#114AB1] truncate">{formData.slug}</p>
              </div>
            </div>

            <div className="border-b border-gray-100 pb-6">
              <h2 className="text-3xl font-black text-[#114AB1] leading-tight">{formData.title}</h2>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-[#6793AC] uppercase">Change Card Thumbnail (Optional)</p>
              <div className="relative h-64 w-full bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden hover:border-[#E4580B] transition-all">
                {thumbnail ? (
                  <img src={URL.createObjectURL(thumbnail)} className="w-full h-full object-cover" />
                ) : existingThumbnail ? (
                  <img src={existingThumbnail} className="w-full h-full object-cover opacity-60" />
                ) : (
                  <ImageIcon className="text-gray-300" size={48} />
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && setThumbnail(e.target.files[0])} />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex-grow">
              <p className="text-[10px] font-black text-[#6793AC] uppercase mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#E4580B] rounded-full animate-pulse" /> Live Rendering
              </p>
              <div className="overflow-y-auto max-h-[500px] pr-4 custom-scrollbar" dangerouslySetInnerHTML={{ __html: formData.content }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}