"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories, createArticle } from '@/lib/api';
import {
  Save, Zap, ArrowLeft, Image as ImageIcon,
  CheckCircle2, AlertCircle, Upload, ClipboardPaste
} from 'lucide-react';
import Link from 'next/link';
import matter from 'gray-matter';
import { marked } from 'marked';
import MarkdownInput, { normalizeImageTags } from '@/components/MarkdownInput';

// ─────────────────────────────────────────────────────────────────────────────
// Configure marked once globally
// ─────────────────────────────────────────────────────────────────────────────
const g = globalThis as any;
if (!g.__markedConfigured) {
  g.__markedConfigured = true;

  marked.use({
    gfm: true,
    breaks: true,
    renderer: {
      space() {
        return '';
      },

      // ─────────────────────────────────────────────────────────────────────────────
      // UPDATED LINK RENDERER: Fixed for Marked v12+ token structure
      // ─────────────────────────────────────────────────────────────────────────────
      link(token: any) {
        const { href, title, text } = token;
        
        // Logic to detect if link is internal or external
        const isInternal = 
          href.startsWith('/') || 
          href.startsWith('#') || 
          href.includes('sololife-six.vercel.app') || 
          href.includes('localhost');

        // We use standard Tailwind classes. 
        // IMPORTANT: Ensure these colors are defined in your tailwind.config.ts
        const baseClass = "font-extrabold transition-all duration-200 underline decoration-2 underline-offset-4";
        
        if (isInternal) {
          // Internal: Deep Blue (#114AB1)
          return `<a href="${href}" title="${title || ''}" class="${baseClass} text-brand-deep hover:text-brand-orange">${text}</a>`;
        } else {
          // External: Vibrant Orange (#E4580B)
          return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer" class="${baseClass} text-brand-orange hover:text-brand-deep">${text}<span class="text-[10px] ml-1 opacity-80">↗</span></a>`;
        }
      },

      heading(token: any) {
        const text = marked.parseInline(token.text || '') as string;
        const depth = token.depth;
        const size = depth === 1 ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl';
        const color = depth === 1 ? 'text-brand-deep' : 'text-brand-orange';
        return `<h${depth} class="${size} font-black ${color} mt-12 mb-6 leading-tight">${text}</h${depth}>`;
      },

      paragraph(token: any) {
        const text = token.text || token.raw || '';
        if (text.includes('<div class="my-12') || text.includes('<img')) {
          return text;
        }
        const parsedText = marked.parseInline(text) as string;
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
            ${text ? `<p class="text-center text-sm text-brand-muted mt-6 italic font-bold tracking-wide">${text}</p>` : ''}
          </div>`;
      },

      list({ items, ordered }: { items: any[]; ordered: boolean }) {
        const tag = ordered ? 'ol' : 'ul';
        const cls = ordered ? 'list-decimal' : 'list-disc';
        const rows = items
          .map((item: any) => {
            const itemText = typeof item === 'string' ? item : (item.text || '');
            return `<li class="mb-3 ml-6 pl-2 text-gray-600">${marked.parseInline(itemText) as string}</li>`;
          })
          .join('');
        return `<${tag} class="${cls} text-lg mb-8 space-y-1">${rows}</${tag}>`;
      },
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Post-processor safety net
// ─────────────────────────────────────────────────────────────────────────────
function postProcessImages(html: string): string {
  return html.replace(
    /!\[([^\]]*)\]\((https?[^)]+)\)/g,
    (_: string, alt: string, url: string) => {
      const cleanUrl = url.trim().replace(/\s+/g, '');
      return `
        <div class="my-12 w-full">
          <img src="${cleanUrl}" alt="${alt || 'Article Image'}" class="w-full h-auto rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border-[10px] border-white block bg-gray-100" loading="lazy" />
          ${alt ? `<p class="text-center text-sm text-brand-muted mt-6 italic font-bold tracking-wide">${alt}</p>` : ''}
        </div>`;
    }
  );
}

async function safeMarkedParse(src: string): Promise<string> {
  const result = marked.parse(src);
  if (result instanceof Promise) return await result;
  return result as string;
}

function formatApiError(err: any): string {
  const data = err?.response?.data;
  if (!data) return err?.message || 'Network error.';
  if (typeof data === 'string') return data;
  return Object.entries(data).map(([f, m]) => `• ${f}: ${m}`).join('\n');
}

export default function NewArticleMarkdown() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [rawMarkdown, setRawMarkdown] = useState('');
  const [catMatchStatus, setCatMatchStatus] = useState<'none' | 'found' | 'error'>('none');
  const [activeTab, setActiveTab] = useState<InputTab>('paste');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', category: '', status: 'draft', featured: false, content: '',
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  useEffect(() => { getCategories().then(setCategories); }, []);

  const processMarkdown = async (val: string) => {
    try {
      const sanitizedInput = val.replace(/\r/g, '');
      const fixed = normalizeImageTags(sanitizedInput);
      const { data, content } = matter(fixed);

      const rawHtml = await safeMarkedParse(content);
      const htmlContent = postProcessImages(rawHtml);

      const rawCatName = String(data.category || '').toLowerCase().trim();
      const matchedCategory = categories.find((c: any) => {
        return c.name.toLowerCase().includes(rawCatName) || c.slug.toLowerCase().includes(rawCatName);
      });

      setCatMatchStatus(matchedCategory ? 'found' : (rawCatName ? 'error' : 'none'));

      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        excerpt: String(data.excerpt || '').slice(0, 490),
        category: matchedCategory ? matchedCategory.id : '',
        status: data.status || 'draft',
        featured: Boolean(data.featured),
        content: htmlContent,
      });
      setValidationError(null);
    } catch (err) {
      setValidationError('Markdown parsing error.');
    }
  };

  const handleMarkdownInputUpdate = (val: string) => {
    setRawMarkdown(val);
    processMarkdown(val);
  };

  const handleMarkdownFile = (file: File) => {
    if (!file.name.match(/\.(md|markdown|txt)$/i)) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = normalizeImageTags(e.target?.result as string);
      setRawMarkdown(content);
      processMarkdown(content);
    };
    reader.readAsText(file);
  };

  const handleSave = async () => {
    if (!formData.category || !thumbnail) {
      alert('Verification Failed: Missing category or thumbnail.');
      return;
    }
    setIsSaving(true);
    const finalData = new FormData();
    Object.entries(formData).forEach(([k, v]) => finalData.append(k, String(v)));
    finalData.append('thumbnail', thumbnail);

    try {
      await createArticle(finalData);
      router.push('/admin/articles');
    } catch (err) {
      alert(`Deployment failed: ${formatApiError(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 lg:p-10">
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/articles" className="p-3 bg-gray-50 hover:bg-brand-deep hover:text-white rounded-full transition-all">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-black text-brand-deep flex items-center gap-2">
            <Zap className="text-brand-orange" fill="currentColor" size={28} /> Deployment
          </h1>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="bg-brand-deep text-white px-12 py-5 rounded-[1.5rem] font-black text-lg hover:bg-brand-orange transition-all shadow-xl disabled:opacity-60">
          <Save size={22} /> {isSaving ? 'Deploying...' : 'Deploy Cornerstone'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 w-fit">
            <button onClick={() => setActiveTab('paste')} className={`px-5 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'paste' ? 'bg-brand-deep text-white shadow-md' : 'text-brand-muted hover:text-brand-deep'}`}>
              Paste
            </button>
            <button onClick={() => setActiveTab('upload')} className={`px-5 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'upload' ? 'bg-brand-deep text-white shadow-md' : 'text-brand-muted hover:text-brand-deep'}`}>
              Upload
            </button>
          </div>
          {activeTab === 'paste' ? (
            <MarkdownInput value={rawMarkdown} onChange={handleMarkdownInputUpdate} />
          ) : (
            <div onClick={() => fileInputRef.current?.click()} className="h-[820px] rounded-[3rem] border-4 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50">
              <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => e.target.files && handleMarkdownFile(e.target.files[0])} />
              <p className="font-bold text-gray-400">Click to upload .md file</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-6 space-y-8">
          <div className="bg-white p-10 rounded-[4rem] border border-gray-100 shadow-sm space-y-8 min-h-[850px] flex flex-col">
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-6 rounded-3xl border flex items-center justify-between transition-all ${catMatchStatus === 'found' ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50'}`}>
                <div>
                  <p className="text-[10px] font-black text-brand-muted uppercase">Category</p>
                  <p className="font-black text-lg text-brand-deep">{catMatchStatus === 'found' ? 'Verified' : 'Searching...'}</p>
                </div>
                {catMatchStatus === 'found' ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-gray-300" />}
              </div>
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <p className="text-[10px] font-black text-brand-muted uppercase">Slug</p>
                <p className="font-bold text-xs text-brand-deep truncate">{formData.slug || '...'}</p>
              </div>
            </div>

            <div className="border-b border-gray-100 pb-6">
              <h2 className="text-3xl font-black text-brand-deep leading-tight">{formData.title || 'Input required...'}</h2>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-brand-muted uppercase">Thumbnail (Required)</p>
              <div className="relative h-64 w-full bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden hover:border-brand-orange transition-all">
                {thumbnail ? <img src={URL.createObjectURL(thumbnail)} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" size={48} />}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && setThumbnail(e.target.files[0])} />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex-grow">
               <p className="text-[10px] font-black text-brand-muted uppercase mb-6">Visual Preview</p>
               <div className="overflow-y-auto max-h-[500px] pr-4 custom-scrollbar" dangerouslySetInnerHTML={{ __html: formData.content }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}