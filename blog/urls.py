# blog/urls.py
from django.urls import path
from .views import (
    ArticleListCreateView, 
    ArticleDetailUpdateDeleteView, 
    CategoryListCreateView, # Make sure this is imported
    CategoryDetailUpdateDeleteView
)

urlpatterns = [
    path('articles/', ArticleListCreateView.as_view(), name='article-list-create'),
    path('articles/<slug:slug>/', ArticleDetailUpdateDeleteView.as_view(), name='article-detail-manage'),
    
    # DELETE the old CategoryListView line and KEEP only this one:
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    
    path('categories/<int:id>/', CategoryDetailUpdateDeleteView.as_view(), name='category-detail-manage'),
]