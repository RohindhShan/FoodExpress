from rest_framework import serializers
from .models import RestaurantProfile, MenuItem

# 1. MenuItem Serializer
class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['id', 'restaurant', 'name', 'description', 'price', 'category', 'image', 'is_available', 'created_at']
        read_only_fields = ['restaurant', 'created_at']


# 2. Restaurant Profile Serializer (Includes nested Menu Items)
class RestaurantProfileSerializer(serializers.ModelSerializer):
    menu_items = MenuItemSerializer(many=True, read_only=True)
    owner_username = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = RestaurantProfile
        fields = ['id', 'owner', 'owner_username', 'name', 'cuisine_type', 'address', 'rating', 'image', 'is_open', 'created_at', 'menu_items']
        read_only_fields = ['owner', 'created_at']