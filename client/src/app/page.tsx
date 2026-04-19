import HomeHero from "@/components/HomeHero";
import RecentArticles from "@/components/RecentArticles";
import PopularArticles from "@/components/PopularArticles";
import DiscoveryGrid from "@/components/DiscoveryGrid";
import { getArticles } from "@/lib/api";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const allArticles = await getArticles();
  
  // 1. SAFEGUARD: If no articles exist at all
  if (!allArticles || allArticles.length === 0) {
    return (
      <main className="bg-white min-h-screen">
        <HomeHero />
        <div className="py-40 text-center">
          <h2 className="text-2xl font-black text-brand-deep opacity-20 uppercase tracking-widest">
            Initializing Platform Data...
          </h2>
          <p className="text-brand-muted mt-2">Log in to /admin to deploy your first cornerstone.</p>
        </div>
      </main>
    );
  }

  // 2. LOGIC: Recent Articles (Always the newest 3)
  const recent = allArticles.slice(0, 3);
  const recentIds = recent.map((a: any) => a.id);
  
  // 3. LOGIC: Popular Articles 
  // We look for 'featured' articles. If none are marked featured, we just take the next 4.
  let popular = allArticles.filter((a: any) => a.featured && !recentIds.includes(a.id));
  
  if (popular.length === 0) {
    // Failsafe: If no featured articles, just take the next available ones
    popular = allArticles.filter((a: any) => !recentIds.includes(a.id)).slice(0, 4);
  } else {
    popular = popular.slice(0, 4);
  }
  const popularIds = popular.map((a: any) => a.id);

  // 4. LOGIC: Discovery Mixed
  // We take articles that aren't already shown. 
  // If we run out of unique ones, we just show a random sample of all of them.
  let mixed = allArticles.filter((a: any) => !recentIds.includes(a.id) && !popularIds.includes(a.id));
  
  if (mixed.length < 5) {
    // Failsafe: If not enough unique articles, just show a random mix of everything
    mixed = [...allArticles].sort(() => 0.5 - Math.random()).slice(0, 5);
  } else {
    mixed = mixed.sort(() => 0.5 - Math.random()).slice(0, 5);
  }

  return (
    <main className="bg-white min-h-screen">
      <HomeHero />

      {/* TRANSITION BAR */}
      <div className="border-y border-gray-100 bg-gray-50/50 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-8">
          <div className="flex gap-10">
            {['Healthy', 'Traveling', 'Solo-Living', 'Sport', 'Recipes'].map((cat) => (
              <Link 
                key={cat} 
                href={`/category/${cat.toLowerCase().replace(' ', '-')}`}
                className="text-xs font-black uppercase tracking-[0.2em] text-brand-muted hover:text-brand-orange transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2 text-brand-deep font-bold text-sm">
            <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></span>
            Sovereign Strategies for the Independent Life
          </div>
        </div>
      </div>

      {/* RECENT SECTION */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute top-10 left-0 text-[15rem] font-black text-gray-50 select-none -z-10 leading-none">
          NEW
        </div>
        <RecentArticles articles={recent} />
      </section>

      {/* POPULAR SECTION - Only shows if we have enough articles */}
      {popular.length > 0 && (
        <div className="px-0 md:px-6">
          <div className="rounded-none md:rounded-[5rem] overflow-hidden shadow-2xl">
            <PopularArticles articles={popular} />
          </div>
        </div>
      )}

      {/* DISCOVERY SECTION */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-black text-brand-deep leading-tight">
                Curated for <br />
                <span className="text-brand-orange">Independent Minds</span>
              </h2>
            </div>
          </div>
          
          <DiscoveryGrid articles={mixed} />
          
          {/* Newsletter Footer Teaser */}
          <div className="mt-32 p-12 md:p-20 bg-gray-50 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-md">
              <h3 className="text-3xl font-black text-brand-deep mb-4">The Solo Edit</h3>
              <p className="text-brand-muted">Get a weekly curation of the 5 most important strategies for solo living.</p>
            </div>
            <div className="flex w-full md:w-auto gap-4">
              <input type="email" placeholder="email@example.com" className="flex-grow md:w-80 p-5 rounded-2xl border border-gray-200" />
              <button className="bg-brand-deep text-white px-8 py-5 rounded-2xl font-bold hover:bg-brand-orange transition-colors">Join</button>
            </div>
          </div>
        </div>
      </section>
      <div className="pb-20"></div>
    </main>
  );
}