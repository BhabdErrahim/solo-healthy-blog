# blog/views.py

from rest_framework import generics, permissions, filters
from .models import Article, Category
from .serializers import ArticleSerializer, CategorySerializer, ArticleListSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class ArticleListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]

    # ✅ NEW: Use lightweight serializer for GET, heavy serializer for POST
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ArticleSerializer
        return ArticleListSerializer

    def get_queryset(self):
        # Staff/admin see ALL articles (including drafts). Public sees only published.
        qs = Article.objects.select_related('category', 'author').prefetch_related('related_articles')
        if self.request.user and self.request.user.is_staff:
            return qs.all()
        
        return qs.filter(status="published")

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ArticleDetailUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    # Detail view always uses the heavy serializer because you need the full HTML content
    serializer_class = ArticleSerializer
    lookup_field = "slug"
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = Article.objects.select_related('category', 'author').prefetch_related('related_articles')
        if self.request.user and self.request.user.is_staff:
            return qs.all()
        return qs.filter(status="published")


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class CategoryDetailUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'id' # We use ID for internal admin editing