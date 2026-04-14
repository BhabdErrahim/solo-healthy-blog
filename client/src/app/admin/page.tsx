"use client";
import React, { useEffect, useState } from "react";
import { getAdminArticles, getCategories } from "@/lib/api";
import { FileText, FolderTree, Eye, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalCategories: 0,
    featuredCount: 0,
  });

  // Inside AdminOverview component
  useEffect(() => {
    const fetchStats = async () => {
      // Check if token exists before even trying
      if (!localStorage.getItem("access_token")) return;

      try {
        const articles = await getAdminArticles();
        const categories = await getCategories();
        const featured = articles.filter((a: any) => a.featured).length;

        setStats({
          totalArticles: articles.length,
          totalCategories: categories.length,
          featuredCount: featured,
        });
      } catch (error: any) {
        if (error.response?.status === 401) {
          console.log("Unauthorized - Redirecting to login...");
        }
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      name: "Total Articles",
      value: stats.totalArticles,
      icon: <FileText className="text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      name: "Categories",
      value: stats.totalCategories,
      icon: <FolderTree className="text-emerald-500" />,
      bg: "bg-emerald-50",
    },
    {
      name: "Featured Stories",
      value: stats.featuredCount,
      icon: <TrendingUp className="text-orange-500" />,
      bg: "bg-orange-50",
    },
    {
      name: "Platform Status",
      value: "Live",
      icon: <Eye className="text-purple-500" />,
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black text-brand-deep">
          Dashboard Overview
        </h1>
        <p className="text-brand-muted mt-2">
          Welcome back, Chief Editor. Here is your platform at a glance.
        </p>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-brand-muted text-sm font-bold uppercase tracking-widest mb-1">
                {card.name}
              </p>
              <p className="text-3xl font-black text-brand-deep">
                {card.value}
              </p>
            </div>
            <div
              className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center`}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-brand-deep p-10 rounded-[3rem] text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">Create New Content</h3>
            <p className="text-blue-100 mb-8 opacity-80">
              Ready to share a new solo-living strategy? Launch the editor now.
            </p>
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-4 rounded-2xl font-black hover:scale-105 transition shadow-lg"
            >
              <Plus size={20} /> Write Article
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-32 h-full bg-white/5 skew-x-12 translate-x-10" />
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
          <h3 className="text-2xl font-bold text-brand-deep mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
              <p className="text-sm font-bold text-brand-deep">
                System ready for new publications
              </p>
            </div>
            <p className="text-brand-muted text-sm italic">
              Detailed activity logging coming in v2.1...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
