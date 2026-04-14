import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function PopularArticles({ articles }: { articles: any[] }) {
  const featured = articles[0];
  const list = articles.slice(1, 4);

  return (
    <section className="bg-brand-deep py-24 px-6 my-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-12 text-white">
          <TrendingUp className="text-brand-orange" size={32} />
          <h2 className="text-4xl font-black">Most Popular</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Big Featured Card */}
          <Link href={`/article/${featured?.slug}`} className="group relative h-[500px] rounded-[3rem] overflow-hidden block">
            <img src={featured?.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-transparent to-transparent opacity-90"></div>
            <div className="absolute bottom-10 left-10 right-10">
              <span className="bg-brand-orange text-white px-4 py-1 rounded-full text-xs font-bold uppercase mb-4 inline-block">
                {featured?.category.name}
              </span>
              <h3 className="text-3xl font-bold text-white leading-tight">{featured?.title}</h3>
            </div>
          </Link>

          {/* Side List */}
          <div className="space-y-6">
            {list.map((item, idx) => (
              <Link key={item.id} href={`/article/${item.slug}`} className="flex gap-6 group">
                <span className="text-5xl font-black text-white/10 group-hover:text-brand-orange transition-colors">0{idx + 2}</span>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">{item.title}</h4>
                  <p className="text-blue-100/60 text-sm line-clamp-2">{item.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}