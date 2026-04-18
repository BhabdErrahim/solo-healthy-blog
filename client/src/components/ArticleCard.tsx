"use client";
import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { getFullImageUrl } from '@/lib/utils';

interface ArticleCardProps {
  article: {
    title: string;
    slug: string;
    category: { name: string };
    thumbnail: string;
    excerpt: string;
    created_at: string;
  };
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <article className="group relative bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 flex flex-col h-full">
      
      {/* 1. Image Container with "Category Tab" */}
      <div className="relative h-60 w-full mb-6 overflow-hidden rounded-[2rem]">
        {/* The Category Tab (Top Left Cutout) */}
        <div className="absolute top-0 left-0 bg-white px-6 py-2 rounded-br-[1.5rem] z-10 shadow-sm">
          <span className="text-xs font-bold text-brand-muted uppercase tracking-widest">
            {article.category.name}
          </span>
        </div>
        
        {/* Main Image — use getFullImageUrl to resolve relative paths */}
        <img 
          src={getFullImageUrl(article.thumbnail)} 
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      {/* 2. Content Section */}
      <div className="px-2 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <Link href={`/article/${article.slug}`}>
            <h3 className="text-2xl font-bold text-brand-deep leading-tight group-hover:text-brand-orange transition-colors">
              {article.title}
            </h3>
          </Link>
          <div className="bg-brand-muted/10 text-brand-muted px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2">
            5 MIN READ
          </div>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="bg-orange-50 text-brand-orange px-3 py-1 rounded-full text-[10px] font-bold uppercase">#Healthy</span>
          <span className="bg-blue-50 text-brand-deep px-3 py-1 rounded-full text-[10px] font-bold uppercase">#SoloLife</span>
        </div>

        <Link 
          href={`/article/${article.slug}`}
          className="mt-auto w-full bg-brand-orange text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-deep transition-all duration-300 shadow-lg shadow-orange-200 group-hover:shadow-blue-200"
        >
          <BookOpen size={18} />
          Read Full Article
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default ArticleCard;