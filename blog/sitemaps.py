from django.contrib.sitemaps import Sitemap
from .models import Article, Category

class ArticleSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.9 # High priority for articles

    def items(self):
        # Only index published articles
        return Article.objects.filter(status='published')

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        # CRITICAL: Point to your Next.js frontend URL, not the backend
        return f"/article/{obj.slug}"

class CategorySitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.7

    def items(self):
        return Category.objects.all()

    def location(self, obj):
        return f"/category/{obj.slug}"