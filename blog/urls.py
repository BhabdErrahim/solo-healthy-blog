from django.urls import path
from .views import ArticleListCreateView, ArticleDetailUpdateDeleteView, CategoryListView

urlpatterns = [
    path('articles/', ArticleListCreateView.as_view(), name='article-list-create'),
    path('articles/<slug:slug>/', ArticleDetailUpdateDeleteView.as_view(), name='article-detail-manage'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
]