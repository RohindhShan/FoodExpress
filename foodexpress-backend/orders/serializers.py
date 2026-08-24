from rest_framework import serializers
from .models import CartItem, Order, OrderItem
from restaurants.serializers import MenuItemSerializer

# 1. Cart Item Serializer
class CartItemSerializer(serializers.ModelSerializer):
    menu_item_details = MenuItemSerializer(source='menu_item', read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'menu_item', 'menu_item_details', 'quantity', 'total_price']


# 2. Order Item Serializer
class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source='menu_item.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'menu_item_name', 'price', 'quantity']


# 3. Full Order Serializer
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_username = serializers.CharField(source='user.username', read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'customer_username', 'restaurant', 'restaurant_name', 'delivery_address', 'total_amount', 'status', 'created_at', 'items']
        read_only_fields = ['user', 'total_amount', 'status', 'created_at']