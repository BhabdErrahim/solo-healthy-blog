import HomeHero from "@/components/HomeHero";
import RecentArticles from "@/components/RecentArticles";
import PopularArticles from "@/components/PopularArticles";
import DiscoveryGrid from "@/components/DiscoveryGrid";
import { getArticles } from "@/lib/api";
import { ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const allArticles = await getArticles();
  
  // If there's an error or no data, show a welcoming "Empty" state
  if (!allArticles || allArticles.length === 0) {
    return (
      <main className="bg-white min-h-screen">
        <HomeHero />
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold text-brand-deep opacity-30 uppercase tracking-widest">
            Initializing Platform Data...
          </h2>
          <p className="text-brand-muted mt-2">Log in to /admin to deploy your first cornerstone.</p>
        </div>
      </main>
    );
  }
  
  // High-End Logic: Ensuring we don't show the same article twice
  const recent = allArticles.slice(0, 3);
  const recentIds = recent.map((a: any) => a.id);
  
  const popular = allArticles
    .filter((a: any) => a.featured && !recentIds.includes(a.id))
    .slice(0, 4);
    
  const popularIds = popular.map((a: any) => a.id);
  const mixed = allArticles
    .filter((a: any) => !recentIds.includes(a.id) && !popularIds.includes(a.id))
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  return (
    <main className="bg-white min-h-screen">
      {/* 1. HERO SECTION: The Hook */}
      <HomeHero />

      {/* 2. TRANSITION BAR: Authority & Quick Navigation */}
      <div className="border-y border-gray-100 bg-gray-50/50 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-8">
          <div className="flex gap-10">
            {['Healthy', 'Traveling', 'Solo-Living', 'Sport', 'Recipes'].map((cat) => (
              <Link 
                key={cat} 
                href={`/category/${cat.toLowerCase()}`}
                className="text-xs font-black uppercase tracking-[0.2em] text-brand-muted hover:text-brand-orange transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2 text-brand-deep font-bold text-sm">
            <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></span>
            50+ New Strategies Published This Month
          </div>
        </div>
      </div>

      {/* 3. RECENT SECTION: The "Fresh" Feed */}
      <section className="relative py-24 overflow-hidden">
        {/* Subtle background text for "Magazine" feel */}
        <div className="absolute top-10 left-0 text-[15rem] font-black text-gray-50 select-none -z-10 leading-none">
          NEW
        </div>
        <RecentArticles articles={recent} />
        <div className="max-w-7xl mx-auto px-6 mt-10">
           <Link href="/category/healthy" className="group flex items-center gap-2 text-brand-deep font-bold hover:text-brand-orange transition-all">
             Browse all latest stories <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
           </Link>
        </div>
      </section>

      {/* 4. POPULAR SECTION: The "Authority" Pillar (Deep Blue Contrast) */}
      {/* We wrap this in a container that adds a "Floating" effect to the section */}
      <div className="px-0 md:px-6">
        <div className="rounded-none md:rounded-[5rem] overflow-hidden shadow-2xl">
          <PopularArticles articles={popular} />
        </div>
      </div>

      {/* 5. DISCOVERY SECTION: The "Curation" Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-black text-brand-deep leading-tight">
                Curated for <br />
                <span className="text-brand-orange">Independent Minds</span>
              </h2>
            </div>
            <p className="text-brand-muted max-w-sm text-lg italic border-l-2 border-brand-orange pl-6">
              "Solitude is where you find the version of yourself that doesn't need permission."
            </p>
          </div>
          
          <DiscoveryGrid articles={mixed} />
          
          {/* Professional Finish: Newsletter Teaser */}
          <div className="mt-32 p-12 md:p-20 bg-gray-50 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-md">
              <h3 className="text-3xl font-black text-brand-deep mb-4">The Solo Edit</h3>
              <p className="text-brand-muted">Get a weekly curation of the 5 most important strategies for solo living, delivered every Sunday morning.</p>
            </div>
            <div className="flex w-full md:w-auto gap-4">
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="flex-grow md:w-80 p-5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
              />
              <button className="bg-brand-deep text-white px-8 py-5 rounded-2xl font-bold hover:bg-brand-orange transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final extra padding before footer */}
      <div className="pb-20"></div>
    </main>
  );
}