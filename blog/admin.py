# blog/admin.py
from django.contrib import admin
from .models import Category, Article

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'featured')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('related_articles',) # This makes the internal linking easy to manage!