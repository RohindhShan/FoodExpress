from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, PermissionDenied
from .models import CartItem, Order, OrderItem
from .serializers import CartItemSerializer, OrderSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderSerializer



# 1. Cart List & Add to Cart View
class CartListCreateView(generics.ListCreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        menu_item = serializer.validated_data['menu_item']
        existing_item = CartItem.objects.filter(user=self.request.user, menu_item=menu_item).first()
        
        if existing_item:
            existing_item.quantity += serializer.validated_data.get('quantity', 1)
            existing_item.save()
        else:
            serializer.save(user=self.request.user)


# 2. Cart Item Update/Delete View
class CartItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)


# 3. Checkout View (Converts Cart into Confirmed Order)
class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart_items = CartItem.objects.filter(user=request.user)
        if not cart_items.exists():
            return Response({"error": "Your cart is empty!"}, status=status.HTTP_400_BAD_REQUEST)

        delivery_address = request.data.get('delivery_address')
        if not delivery_address:
            return Response({"error": "Delivery address is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if all items belong to same restaurant
        first_restaurant = cart_items.first().menu_item.restaurant
        for item in cart_items:
            if item.menu_item.restaurant != first_restaurant:
                return Response({"error": "You can only order from one restaurant at a time."}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate Total Amount
        total_amount = sum(item.total_price for item in cart_items)

        # Create Order
        order = Order.objects.create(
            user=request.user,
            restaurant=first_restaurant,
            delivery_address=delivery_address,
            total_amount=total_amount,
            status='Pending'
        )

        # Create Snapshot Order Items
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                menu_item=item.menu_item,
                price=item.menu_item.price,
                quantity=item.quantity
            )

        # Empty User's Cart
        cart_items.delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# 4. List User's Orders & Hotel's Incoming Orders
class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'restaurant' and hasattr(user, 'restaurant_profile'):
            return Order.objects.filter(restaurant=user.restaurant_profile).order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')


# 5. Order Status Update (For Restaurant Admins)
class OrderStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        return self.update_order_status(request, pk)

    def post(self, request, pk):
        return self.update_order_status(request, pk)

    def put(self, request, pk):
        return self.update_order_status(request, pk)

    def update_order_status(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
            new_status = request.data.get('status')
            if not new_status:
                return Response({'error': 'Status field required'}, status=status.HTTP_400_BAD_REQUEST)
            
            order.status = new_status
            order.save()
            return Response({'message': 'Status updated', 'status': order.status}, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'restaurant':
            # Returns all orders or restaurant specific orders
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')

    def partial_update(self, request, *args, **kwargs):
        order = self.get_object()
        new_status = request.data.get('status')
        if new_status:
            order.status = new_status
            order.save()
            return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)
        return super().partial_update(request, *args, **kwargs)
    