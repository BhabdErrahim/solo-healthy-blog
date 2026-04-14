from rest_framework import serializers
from .models import Article, Category
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class CategorySerializer(serializers.ModelSerializer):
    article_count = serializers.IntegerField(source='articles.count', read_only=True)
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'article_count']

# Minimal data for internal links to avoid infinite loops
class RelatedArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['id', 'title', 'slug', 'thumbnail', 'category']

class ArticleSerializer(serializers.ModelSerializer):
    category_details = CategorySerializer(source='category', read_only=True)
    # author is read-only because we set it in the view
    #author = UserSerializer(read_only=True)
    related_articles_details = RelatedArticleSerializer(source='related_articles', many=True, read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    author = UserSerializer(read_only=True)

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'author', 'category', 'category_details',
            'thumbnail', 'content', 'excerpt', 'related_articles', 
            'related_articles_details', 'created_at', 'featured', 'status'
        ]
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['category'] = CategorySerializer(instance.category).data
        return representation