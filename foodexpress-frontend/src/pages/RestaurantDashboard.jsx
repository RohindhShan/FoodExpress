import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  LayoutDashboard,
  CheckCircle,
  Clock,
  Truck,
  CookingPot,
  AlertCircle,
} from "lucide-react";

const RestaurantDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOwnerOrders = async () => {
    try {
      // Fetch incoming orders for this restaurant
      const res = await api.get("orders/");
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setOrders(data);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerOrders();
    const interval = setInterval(fetchOwnerOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      // 1. Try PATCH to /api/orders/<id>/status/
      await api.patch(`orders/${orderId}/status/`, { status: newStatus });
      fetchOwnerOrders();
    } catch (err) {
      console.warn("PATCH failed, trying POST/PUT fallback:", err);
      try {
        // 2. Try POST fallback
        await api.post(`orders/${orderId}/status/`, { status: newStatus });
        fetchOwnerOrders();
      } catch (postErr) {
        try {
          // 3. Try PUT fallback
          await api.put(`orders/${orderId}/status/`, { status: newStatus });
          fetchOwnerOrders();
        } catch (finalErr) {
          console.error(
            "All status update methods failed:",
            finalErr?.response?.data || finalErr,
          );
          alert(
            finalErr?.response?.data?.error || "Failed to update order status.",
          );
        }
      }
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 font-semibold text-gray-500">
        Loading Restaurant Portal...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-orange-600 font-bold text-sm uppercase">
            <LayoutDashboard className="w-4 h-4" />
            <span>Live Kitchen Terminal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-1">
            Restaurant Management Dashboard
          </h1>
        </div>

        {/* Quick Stats Summary */}
        <div className="flex space-x-3">
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-gray-200 shadow-sm text-center">
            <span className="text-xs text-gray-400 font-bold uppercase">
              Total Orders
            </span>
            <p className="text-xl font-extrabold text-gray-800">
              {orders.length}
            </p>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3 shadow-sm">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-xl font-bold text-gray-700">
            No Orders Received Yet
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            When customers place orders from your restaurant, tickets will show
            up here live for you to accept and update.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <span className="text-xs font-bold text-orange-600">
                    Ticket #{order.id}
                  </span>
                  <h3 className="font-extrabold text-gray-800 text-lg">
                    {order.restaurant_name || "Restaurant Order"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {new Date(
                      order.created_at || Date.now(),
                    ).toLocaleTimeString()}
                  </p>
                </div>

                {/* Status Dropdown Selector */}
                <select
                  value={order.status || "Pending"}
                  disabled={updatingId === order.id}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              {/* Items List */}
              <div className="space-y-1.5 bg-gray-50 p-3.5 rounded-2xl">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-xs sm:text-sm font-medium text-gray-700"
                  >
                    <span>
                      {item.menu_item_name || item.name || "Dish Item"} ×{" "}
                      {item.quantity}
                    </span>
                    <span className="font-bold text-gray-900">
                      ₹{item.price * item.quantity || item.total_price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
                <span>
                  Deliver To:{" "}
                  <strong className="text-gray-700">
                    {order.delivery_address}
                  </strong>
                </span>
                <span className="text-base font-extrabold text-orange-600">
                  ₹{order.total_amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;
