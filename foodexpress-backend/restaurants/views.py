from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied, ValidationError
from .models import RestaurantProfile, MenuItem
from .serializers import RestaurantProfileSerializer, MenuItemSerializer
from .permissions import IsRestaurantOwnerOrReadOnly
from rest_framework import generics, permissions

class RestaurantListView(generics.ListAPIView):
    # ... unga existing code ...
    permission_classes = [permissions.AllowAny]  # <-- Anyone can view restaurants

class RestaurantDetailView(generics.RetrieveAPIView):
    # ... unga existing code ...
    permission_classes = [permissions.AllowAny]  # <-- Anyone can view detail & menu

# 1. List all restaurants or Create own restaurant (For Restaurant Owners)
class RestaurantListCreateView(generics.ListCreateAPIView):
    queryset = RestaurantProfile.objects.all()
    serializer_class = RestaurantProfileSerializer
    permission_classes = [IsRestaurantOwnerOrReadOnly]

    def perform_create(self, serializer):
        # Prevent 1 user from creating multiple restaurant profiles
        if RestaurantProfile.objects.filter(owner=self.request.user).exists():
            raise ValidationError({"error": "You already have a registered restaurant profile."})
        serializer.save(owner=self.request.user)


# 2. Retrieve, Update or Delete single Restaurant Profile
class RestaurantDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RestaurantProfile.objects.all()
    serializer_class = RestaurantProfileSerializer
    permission_classes = [IsRestaurantOwnerOrReadOnly]


# 3. List all menu items of a specific restaurant / Add a menu item
class MenuItemListCreateView(generics.ListCreateAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [IsRestaurantOwnerOrReadOnly]

    def get_queryset(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        return MenuItem.objects.filter(restaurant_id=restaurant_id)

    def perform_create(self, serializer):
        restaurant_id = self.kwargs.get('restaurant_id')
        try:
            restaurant = RestaurantProfile.objects.get(id=restaurant_id)
        except RestaurantProfile.DoesNotExist:
            raise ValidationError({"error": "Restaurant not found."})

        # Security check: User must own this restaurant
        if restaurant.owner != self.request.user:
            raise PermissionDenied("You can only add menu items to your own restaurant.")

        serializer.save(restaurant=restaurant)


# 4. Update or Delete specific Menu Item
class MenuItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsRestaurantOwnerOrReadOnly]