from django.urls import path
from .views import (
    CartListCreateView,
    CartItemDetailView,
    CheckoutView,
    OrderListView,
    OrderStatusUpdateView,
)

urlpatterns = [
    # 1. Orders Listing endpoint: /api/orders/
    path('', OrderListView.as_view(), name='order-list'),
    
    # 2. Cart Endpoints: /api/orders/cart/ and /api/orders/cart/<id>/
    path('cart/', CartListCreateView.as_view(), name='cart-list-create'),
    path('cart/<int:pk>/', CartItemDetailView.as_view(), name='cart-item-detail'),
    
    # 3. Checkout: /api/orders/checkout/
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    
    # 4. Status Update: /api/orders/<id>/status/
    path('<int:pk>/status/', OrderStatusUpdateView.as_view(), name='order-status-update'),
]