import Link from "next/link";

export default function DiscoveryGrid({ articles }: { articles: any[] }) {
  return (
    <section className="max-w-7xl mx-auto py-24 px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-brand-deep mb-4">Discover Something New</h2>
        <p className="text-brand-muted">A handpicked mix from our 5 lifestyle pillars.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[600px]">
        {/* Large Bento Item */}
        <Link href={`/article/${articles[0]?.slug}`} className="md:col-span-2 md:row-span-2 relative rounded-[2.5rem] overflow-hidden group">
          <img src={articles[0]?.thumbnail} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
          <div className="absolute top-8 left-8">
             <span className="text-white font-bold text-xs uppercase tracking-widest bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
               {articles[0]?.category.name}
             </span>
          </div>
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h3 className="text-2xl font-bold">{articles[0]?.title}</h3>
          </div>
        </Link>

        {/* Small Bento Items */}
        {articles.slice(1, 5).map((article) => (
          <Link key={article.id} href={`/article/${article.slug}`} className="relative rounded-[2rem] overflow-hidden group h-64 md:h-full">
            <img src={article?.thumbnail} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-brand-deep/60 group-hover:bg-brand-deep/20 transition-all"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-[10px] font-bold uppercase text-brand-orange mb-1">{article?.category.name}</p>
              <h4 className="text-sm font-bold leading-tight line-clamp-2">{article?.title}</h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}