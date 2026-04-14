import ArticleCard from "./ArticleCard";

export default function RecentArticles({ articles }: { articles: any[] }) {
  return (
    <section className="max-w-7xl mx-auto py-20 px-6">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-4xl font-black text-brand-deep">Just In</h2>
        <div className="h-[2px] flex-grow bg-gray-100"></div>
        <span className="text-brand-orange font-bold uppercase tracking-tighter">New Stories</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {articles.slice(0, 3).map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}