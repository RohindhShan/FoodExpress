from django.urls import path
from .views import ProcessPaymentView

urlpatterns = [
    path('process/<int:order_id>/', ProcessPaymentView.as_view(), name='process-payment'),
]