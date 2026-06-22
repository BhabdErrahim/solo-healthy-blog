# blog/views.py
#
# ✅ FIX: get_queryset() now filters by status='published' for unauthenticated
# public requests on BOTH the list view and the detail view.
#
# Previously, Article.objects.all() was used everywhere, which returned DRAFT
# articles too.  This caused a subtle bug:
#   - Home page showed draft cards (all articles returned in list)
#   - Clicking a draft card → API returned 200 with that draft data
#     BUT: after adding the status filter below, drafts are hidden from the
#     public correctly.  Staff/admin users still see everything.

from rest_framework import generics, permissions
from .models import Article, Category
from .serializers import ArticleSerializer, CategorySerializer
from rest_framework import filters

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class ArticleListCreateView(generics.ListCreateAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]
    permission_classes = [IsAdminOrReadOnly]
    def get_queryset(self):
        # ✅ Staff/admin see ALL articles (including drafts) so the admin panel
        # still lists and edits unpublished work.
        # Public (unauthenticated or non-staff) only sees published articles.
        qs = Article.objects.select_related('category',
                                            'author').prefetch_related('related_articles')
        if self.request.user and self.request.user.is_staff:
            return qs.all()
        
        return qs.filter(status="published")

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ArticleDetailUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ArticleSerializer
    lookup_field = "slug"
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        # Same logic: public can only fetch published articles.
        qs = Article.objects.select_related('category',
                                            'author').prefetch_related('related_articles')
        if self.request.user and self.request.user.is_staff:
            return qs.all9
        return qs.filter(status = "published")

# blog/views.py

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class CategoryDetailUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'id' # We use ID for internal admin editing
    
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    
    
