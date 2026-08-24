import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from orders.models import Order
from .models import Payment
from .serializers import PaymentSerializer

class ProcessPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        if hasattr(order, 'payment') and order.payment.status == 'Success':
            return Response({"error": "Payment already completed for this order."}, status=status.HTTP_400_BAD_REQUEST)

        payment_method = request.data.get('payment_method', 'UPI')
        
        # Payment Simulation
        payment, created = Payment.objects.get_or_create(
            order=order,
            defaults={
                'user': request.user,
                'amount': order.total_amount,
                'payment_method': payment_method,
                'transaction_id': f"TXN_{uuid.uuid4().hex[:10].upper()}",
                'status': 'Success'
            }
        )

        if not created:
            payment.status = 'Success'
            payment.payment_method = payment_method
            payment.save()

        # Update order status to Accepted on successful payment
        order.status = 'Accepted'
        order.save()

        return Response({
            "message": "Payment successful!",
            "payment": PaymentSerializer(payment).data
        }, status=status.HTTP_200_OK)