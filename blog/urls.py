# blog/urls.py
from django.urls import path
from .views import ArticleListCreateView, ArticleDetailUpdateDeleteView, CategoryListView

urlpatterns = [
    # Remove the trailing slashes here to match the new strict frontend calls
    path('articles', ArticleListCreateView.as_view(), name='article-list-create'),
    path('articles/<slug:slug>', ArticleDetailUpdateDeleteView.as_view(), name='article-detail-manage'),
    path('categories', CategoryListView.as_view(), name='category-list'),
]