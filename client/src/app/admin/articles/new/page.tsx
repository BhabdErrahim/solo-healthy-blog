"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories, createArticle } from '@/lib/api';
import {
  Save, Zap, ArrowLeft, Image as ImageIcon,
  CheckCircle2, AlertCircle, FileText, Upload, ClipboardPaste
} from 'lucide-react';
import Link from 'next/link';
import matter from 'gray-matter';
import { marked } from 'marked';
import MarkdownInput, { normalizeImageTags } from '@/components/MarkdownInput';

// ─────────────────────────────────────────────────────────────────────────────
// FAILURE 3 FIX: Guard marked.use() and fix "renderer.space" error.
// ─────────────────────────────────────────────────────────────────────────────
const g = globalThis as any;
if (!g.__markedConfigured) {
  g.__markedConfigured = true;

  marked.use({
    gfm: true,    // Required for **bold** text
    breaks: true, // Required for line breaks
    renderer: {
      // FIX: Add the missing 'space' function to prevent the "this.renderer.space" error
      space() {
        return '';
      },
      
      heading(token: any) {
        const text = marked.parseInline(token.text || '');
        const depth = token.depth;

        const size = depth === 1 ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl';
        const color = depth === 1 ? 'text-[#114AB1]' : 'text-[#E4580B]';

        return `<h${depth} class="${size} font-black ${color} mt-12 mb-6 leading-tight">${text}</h${depth}>`;
      },

      paragraph(token: any) {
        const text = token.text || token.raw || '';

        if (text.includes('<div class="my-12') || text.includes('<img')) {
          return text;
        }

        const parsedText = marked.parseInline(text);

        return `<p class="text-gray-600 text-lg leading-relaxed mb-6">${parsedText}</p>`;
      },

      image({ href, text }: { href: string; title?: string | null; text: string }) {
        const cleanHref = (href || '').replace(/\s+/g, '');
        return `
          <div class="my-12 w-full">
            <img
              src="${cleanHref}"
              alt="${text || 'Article Image'}"
              class="w-full h-auto rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border-[10px] border-white block bg-gray-100"
              style="display:block;width:100%;height:auto;"
              loading="lazy"
            />
            ${text ? `<p class="text-center text-sm text-[#6793AC] mt-6 italic font-bold tracking-wide">${text}</p>` : ''}
          </div>`;
      },

      list({ items, ordered }: { items: any[]; ordered: boolean }) {
        const tag = ordered ? 'ol' : 'ul';
        const cls = ordered ? 'list-decimal' : 'list-disc';
        const rows = items
          .map((item: any) => `<li class="mb-3 ml-6 pl-2 text-gray-600">${marked.parseInline(item.text)}</li>`)
          .join('');
        return `<${tag} class="${cls} text-lg mb-8 space-y-1">${rows}</${tag}>`;
      },
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Post-processor safety net for images
// ─────────────────────────────────────────────────────────────────────────────
function postProcessImages(html: string): string {
  return html.replace(
    /!\[([^\]]*)\]\((https?[^)]+)\)/g,
    (_: string, alt: string, url: string) => {
      const cleanUrl = url.trim().replace(/\s+/g, '');
      return `
        <div class="my-12 w-full">
          <img
            src="${cleanUrl}"
            alt="${alt || 'Article Image'}"
            class="w-full h-auto rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border-[10px] border-white block bg-gray-100"
            style="display:block;width:100%;height:auto;"
            loading="lazy"
          />
          ${alt ? `<p class="text-center text-sm text-[#6793AC] mt-6 italic font-bold tracking-wide">${alt}</p>` : ''}
        </div>`;
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
type InputTab = 'paste' | 'upload';

export default function NewArticleMarkdown() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [rawMarkdown, setRawMarkdown] = useState('');
  const [catMatchStatus, setCatMatchStatus] = useState<'none' | 'found' | 'error'>('none');
  const [activeTab, setActiveTab] = useState<InputTab>('paste');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    category: '',
    status: 'draft',
    featured: false,
    content: '',
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // ── Parse pipeline ─────────────────────────────────────────────────────────
  const processMarkdown = (val: string) => {
    try {
      // Strip hidden Carriage Returns (\r) to help bold tokens (**) match correctly
      const sanitizedInput = val.replace(/\r/g, '');
      
      const fixed = normalizeImageTags(sanitizedInput);
      const { data, content } = matter(fixed);

      // Parse with the globally configured marked instance
      const rawHtml = marked.parse(content) as string;

      const htmlContent = postProcessImages(rawHtml);

      const rawCatName = String(data.category || '').toLowerCase().trim();
      const matchedCategory = categories.find((c: any) => {
        const dbName = c.name.toLowerCase();
        const dbSlug = c.slug.toLowerCase();
        return (
          dbName.includes(rawCatName) ||
          dbSlug.includes(rawCatName) ||
          rawCatName.includes(dbSlug)
        );
      });

      if (matchedCategory) setCatMatchStatus('found');
      else if (rawCatName !== '') setCatMatchStatus('error');
      else setCatMatchStatus('none');

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

  const handleMarkdownInputUpdate = (val: string) => {
    setRawMarkdown(val);
    processMarkdown(val);
  };

  const handleMarkdownFile = (file: File) => {
    if (!file.name.match(/\.(md|markdown|txt)$/i)) {
      alert('Please upload a .md or .markdown file.');
      return;
    }
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const normalized = normalizeImageTags(content);
      setRawMarkdown(normalized);
      processMarkdown(normalized);
    };
    reader.readAsText(file);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleMarkdownFile(file);
  };

  const handleSave = async () => {
    if (!formData.category || !thumbnail) {
      alert('Verification Failed: Ensure Category is matched and a Card Thumbnail is uploaded.');
      return;
    }
    const finalData = new FormData();
    Object.entries(formData).forEach(([key, value]) => finalData.append(key, String(value)));
    finalData.append('thumbnail', thumbnail);
    try {
      await createArticle(finalData);
      router.push('/admin/articles');
    } catch {
      alert('Deployment failed. Check your Markdown headers.');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 lg:p-10">

      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/articles" className="p-3 bg-gray-50 hover:bg-[#114AB1] hover:text-white rounded-full transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-[#114AB1] flex items-center gap-2">
              <Zap className="text-[#E4580B]" fill="currentColor" size={28} /> Deployment Engine
            </h1>
            <p className="text-[#6793AC] text-sm font-bold uppercase tracking-widest">
              High Integrity Content Importer
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="w-full md:w-auto bg-[#114AB1] text-white px-12 py-5 rounded-[1.5rem] font-black text-lg hover:bg-[#E4580B] transition-all shadow-xl flex items-center justify-center gap-2"
        >
          <Save size={22} /> Deploy Cornerstone
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm w-fit">
            <button
              onClick={() => setActiveTab('paste')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm transition-all ${
                activeTab === 'paste' ? 'bg-[#114AB1] text-white shadow-md' : 'text-[#6793AC] hover:text-[#114AB1]'
              }`}
            >
              <ClipboardPaste size={16} /> Paste Markdown
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm transition-all ${
                activeTab === 'upload' ? 'bg-[#114AB1] text-white shadow-md' : 'text-[#6793AC] hover:text-[#114AB1]'
              }`}
            >
              <Upload size={16} /> Upload File
            </button>
          </div>

          {activeTab === 'paste' && (
            <MarkdownInput
              value={rawMarkdown}
              onChange={handleMarkdownInputUpdate}
            />
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative h-52 w-full rounded-[2.5rem] border-4 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isDragOver ? 'border-[#E4580B] bg-orange-50' : uploadedFileName ? 'border-emerald-400 bg-emerald-50' : 'border-[#114AB1]/30 bg-[#114AB1]/5'
                }`}
              >
                {uploadedFileName ? (
                    <p className="font-black text-emerald-600">{uploadedFileName}</p>
                ) : (
                  <p className="font-black text-[#114AB1]">Drag & drop or click to browse</p>
                )}
                <input ref={fileInputRef} type="file" accept=".md,.markdown,.txt" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleMarkdownFile(f); }} />
              </div>
              {rawMarkdown && (
                <pre className="w-full h-[580px] p-8 bg-[#0f172a] text-emerald-400 font-mono text-xs rounded-[2.5rem] shadow-2xl overflow-auto whitespace-pre-wrap break-words">
                  {rawMarkdown}
                </pre>
              )}
            </div>
          )}
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
                <p className="font-bold text-xs text-[#114AB1] truncate">{formData.slug || '...'}</p>
              </div>
            </div>

            <div className="border-b border-gray-100 pb-6">
              <p className="text-[10px] font-black text-[#E4580B] uppercase mb-2">Current Title</p>
              <h2 className="text-3xl font-black text-[#114AB1] leading-tight">{formData.title || 'Waiting for valid input...'}</h2>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-[#6793AC] uppercase">Card Thumbnail (Required)</p>
              <div className="relative h-64 w-full bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden hover:border-[#E4580B] transition-all">
                {thumbnail ? <img src={URL.createObjectURL(thumbnail)} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" size={48} />}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && setThumbnail(e.target.files[0])} />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex-grow">
              <p className="text-[10px] font-black text-[#6793AC] uppercase mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#E4580B] rounded-full animate-pulse" /> Display Render
              </p>
              <div
                className="overflow-y-auto max-h-[500px] pr-4 custom-scrollbar"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}