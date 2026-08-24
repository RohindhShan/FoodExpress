from django.urls import path
from .views import (
    RestaurantListCreateView,
    RestaurantDetailView,
    MenuItemListCreateView,
    MenuItemDetailView
)

urlpatterns = [
    # Restaurants Endpoints
    path('', RestaurantListCreateView.as_view(), name='restaurant-list-create'),
    path('<int:pk>/', RestaurantDetailView.as_view(), name='restaurant-detail'),

    # Menu Items Endpoints
    path('<int:restaurant_id>/menu/', MenuItemListCreateView.as_view(), name='menu-list-create'),
    path('menu/<int:pk>/', MenuItemDetailView.as_view(), name='menu-detail'),
]