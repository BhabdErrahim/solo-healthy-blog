import { getArticles } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import { Heart, Globe, Home, Activity, Utensils } from "lucide-react";

// This is where we define the "Unique Style" for each page
const categoryStyles: any = {
  healthy: {
    title: "Healthy Habits",
    subtitle: "Nourish your body and mind for a better solo life.",
    bgColor: "bg-emerald-50",
    accentColor: "text-emerald-600",
    icon: <Heart className="w-12 h-12 text-emerald-500" />,
    heroImage:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80",
  },
  traveling: {
    title: "Solo Traveling",
    subtitle: "The world is yours to explore, one destination at a time.",
    bgColor: "bg-blue-50",
    accentColor: "text-brand-deep",
    icon: <Globe className="w-12 h-12 text-brand-deep" />,
    heroImage:
      "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&q=80",
  },
  "solo-living": {
    title: "Solo Living",
    subtitle: "Mastering the art of independence and home organization.",
    bgColor: "bg-orange-50",
    accentColor: "text-brand-orange",
    icon: <Home className="w-12 h-12 text-brand-orange" />,
    heroImage:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80",
  },
  sport: {
    title: "Sport & Fitness",
    subtitle: "Fuel your solo journey with strength, endurance, and energy.",
    bgColor: "bg-slate-100",
    accentColor: "text-brand-deep",
    icon: <Activity className="w-12 h-12 text-brand-orange" />,
    heroImage:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80",
  },
  "food-recipes": {
    title: "Food for One",
    subtitle: "Gourmet meals designed specifically for the solo table.",
    bgColor: "bg-amber-50",
    accentColor: "text-orange-800",
    icon: <Utensils className="w-12 h-12 text-orange-600" />,
    heroImage:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80",
  },
};

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const articles = await getArticles();
  
  // 1. SAFE FILTERING LOGIC
  const filteredArticles = articles.filter((a: any) => {
    // Check if article, category, and slug all exist before using them
    const articleSlug = a?.category?.slug;
    
    if (!articleSlug) {
      console.warn(`Article ID ${a.id} is missing a category slug.`);
      return false; 
    }

    const urlSlug = slug.toLowerCase();
    const dbSlug = articleSlug.toLowerCase();
    
    return dbSlug === urlSlug || dbSlug.includes(urlSlug) || urlSlug.includes(dbSlug);
  });

  // 2. SAFE STYLE LOOKUP
  // Fallback to 'healthy' if the slug doesn't match any style key
  const style = categoryStyles[slug] || categoryStyles.healthy;

  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className={`${style?.bgColor || 'bg-gray-50'} py-20 px-6 overflow-hidden relative`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1">
            <div className="mb-4">{style?.icon}</div>
            <h1 className={`text-6xl font-black ${style?.accentColor || 'text-brand-deep'} mb-6 leading-tight`}>
              {style?.title || slug}
            </h1>
            <p className="text-xl text-brand-muted max-w-lg leading-relaxed mb-8">
               {filteredArticles.length} Specialized Insights
            </p>
          </div>
          <div className="flex-1 w-full h-[400px]">
            <img 
              src={style?.heroImage} 
              className="w-full h-full object-cover rounded-[3rem] shadow-2xl" 
              alt={style?.title}
            />
          </div>
        </div>
      </section>

      {/* ARTICLE GRID SECTION */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredArticles.map((article: any) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border-2 border-dashed border-gray-100 rounded-[4rem] bg-gray-50/50">
            <h2 className="text-3xl font-black text-brand-deep opacity-20">Pillar Empty</h2>
            <p className="text-brand-muted mt-2">We are currently drafting new strategies for this category.</p>
          </div>
        )}
      </section>
    </main>
  );
}