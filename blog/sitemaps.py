from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import Article, Category

# 1. STATIC PAGES SITEMAP
# This handles all pages that don't change based on the database
class StaticViewSitemap(Sitemap):
    priority = 0.8
    changefreq = 'monthly'

    def items(self):
        # These correspond to your Next.js routes
        return ['home', 'about', 'privacy', 'terms']

    def location(self, item):
        mapping = {
            'home': '/',
            'about': '/about/',
            'privacy': '/privacy/',
            'terms': '/terms/',
        }
        return mapping.get(item)

# 2. DYNAMIC ARTICLES SITEMAP
class ArticleSitemap(Sitemap):
    changefreq = "weekly"
    priority = 1.0 # Highest priority for search engines

    def items(self):
        # Only index published content
        return Article.objects.filter(status='published')

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        # Added trailing slash to match Next.js config
        return f"/article/{obj.slug}/"

# 3. DYNAMIC CATEGORIES SITEMAP
class CategorySitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.7

    def items(self):
        return Category.objects.all()

    def location(self, obj):
        # Added trailing slash to match Next.js config
        return f"/category/{obj.slug}/"