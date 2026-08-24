import React, { useEffect, useState } from "react";
import api from "../api/axios";
import jsPDF from "jspdf";
import ReviewModal from "../components/ReviewModal";
import {
  CheckCircle2,
  Clock,
  Truck,
  CookingPot,
  Download,
  Star,
} from "lucide-react";

const STEPS = [
  { label: "Pending", icon: Clock },
  { label: "Preparing", icon: CookingPot },
  { label: "Out for Delivery", icon: Truck },
  { label: "Delivered", icon: CheckCircle2 },
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
  const [reviewsMap, setReviewsMap] = useState({});

  const fetchOrders = async () => {
    try {
      const res = await api.get("orders/");
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setOrders(data);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStepIndex = (status) => {
    const s = status?.toLowerCase();
    if (s === "accepted" || s === "preparing") return 1;
    if (s === "out for delivery") return 2;
    if (s === "delivered") return 3;
    return 0;
  };

  // PDF Invoice Generator
  const downloadInvoice = (order) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(234, 88, 12); // Orange
    doc.text("FoodExpress Receipt", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Invoice ID: #INV-${order.id}-${Date.now().toString().slice(-4)}`,
      20,
      35,
    );
    doc.text(
      `Order Date: ${new Date(order.created_at || Date.now()).toLocaleString()}`,
      20,
      42,
    );
    doc.text(
      `Restaurant: ${order.restaurant_name || order.restaurant?.name || "A2B Veg Restaurant"}`,
      20,
      49,
    );
    doc.text(`Delivery Address: ${order.delivery_address}`, 20, 56);

    doc.setDrawColor(220, 220, 220);
    doc.line(20, 62, 190, 62);

    // Items
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text("Items Ordered", 20, 72);

    let y = 82;
    order.items?.forEach((item) => {
      doc.setFontSize(10);
      doc.text(
        `${item.menu_item_name || item.name || "Food Item"} x ${item.quantity}`,
        20,
        y,
      );
      doc.text(
        `Rs. ${item.price * item.quantity || item.total_price}`,
        180,
        y,
        { align: "right" },
      );
      y += 8;
    });

    // Total
    doc.line(20, y + 4, 190, y + 4);
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Total Paid:", 20, y + 14);
    doc.text(`Rs. ${order.total_amount}`, 180, y + 14, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Thank you for ordering with FoodExpress!", 105, y + 30, {
      align: "center",
    });

    doc.save(`FoodExpress_Order_${order.id}.pdf`);
  };

  const handleReviewSubmit = (orderId, reviewData) => {
    setReviewsMap((prev) => ({
      ...prev,
      [orderId]: reviewData,
    }));
    alert(`Thank you! Rated ${reviewData.rating} Stars! ⭐`);
  };

  if (loading)
    return (
      <div className="text-center py-20 font-semibold text-gray-500">
        Loading Orders...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-800">Track Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-500">
          No orders placed yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStep = getStepIndex(order.status);
            const isDelivered =
              currentStep === 3 || order.status?.toLowerCase() === "delivered";
            const reviewed = reviewsMap[order.id];

            return (
              <div
                key={order.id}
                className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6"
              >
                {/* Header */}
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      Order #{order.id}
                    </span>
                    <h3 className="text-xl font-extrabold text-gray-800 mt-0.5">
                      {order.restaurant_name ||
                        order.restaurant?.name ||
                        "A2B Veg Restaurant"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(
                        order.created_at || Date.now(),
                      ).toLocaleString()}
                    </p>
                  </div>

                  <span className="px-3 py-1 bg-orange-50 text-orange-600 border border-orange-200 rounded-full text-xs font-bold uppercase tracking-wide">
                    {order.status || "Pending"}
                  </span>
                </div>

                {/* Progress Stepper */}
                <div className="py-2">
                  <div className="relative flex justify-between">
                    <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-gray-200 z-0">
                      <div
                        className="h-full bg-orange-500 transition-all duration-500"
                        style={{
                          width: `${(currentStep / (STEPS.length - 1)) * 100}%`,
                        }}
                      ></div>
                    </div>

                    {STEPS.map((step, idx) => {
                      const Icon = step.icon;
                      const isDone = idx <= currentStep;
                      return (
                        <div
                          key={step.label}
                          className="relative z-10 flex flex-col items-center"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              isDone
                                ? "bg-orange-500 text-white shadow-md shadow-orange-200 scale-105"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <span
                            className={`text-xs mt-2 font-semibold ${isDone ? "text-orange-600 font-bold" : "text-gray-400"}`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items */}
                <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>
                        {item.menu_item_name || item.name || "Ghee Roast Dosa"}{" "}
                        × {item.quantity}
                      </span>
                      <span className="font-semibold text-gray-900">
                        ₹{item.price * item.quantity || item.total_price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer with Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-2 text-sm border-t border-gray-100">
                  <span className="text-gray-500">
                    Address:{" "}
                    <strong className="text-gray-800">
                      {order.delivery_address}
                    </strong>
                  </span>

                  <div className="flex items-center space-x-3">
                    {/* Invoice Download Button */}
                    <button
                      onClick={() => downloadInvoice(order)}
                      className="flex items-center space-x-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Invoice</span>
                    </button>

                    {/* Review Button for Completed Orders */}
                    {isDelivered &&
                      (reviewed ? (
                        <span className="flex items-center space-x-1 text-xs font-bold text-amber-500 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>Rated {reviewed.rating}★</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedOrderForReview(order)}
                          className="flex items-center space-x-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold transition"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>Rate Order</span>
                        </button>
                      ))}

                    <span className="text-xl font-extrabold text-orange-600 pl-2">
                      ₹{order.total_amount}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={Boolean(selectedOrderForReview)}
        onClose={() => setSelectedOrderForReview(null)}
        order={selectedOrderForReview}
        onSubmitReview={handleReviewSubmit}
      />
    </div>
  );
};

export default Orders;
