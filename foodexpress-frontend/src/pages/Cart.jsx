import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PaymentModal from "../components/PaymentModal";
import { ShoppingBag, ArrowRight, Plus, Minus, Trash2 } from "lucide-react";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("123, Main Street, Chennai");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get("orders/cart/");
      const cartData = Array.isArray(res.data)
        ? res.data
        : res.data.items || [];
      setItems(cartData);
    } catch (err) {
      console.error("Fetch Cart Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, newQty) => {
    if (newQty <= 0) {
      deleteCartItem(itemId);
      return;
    }
    try {
      await api.patch(`orders/cart/${itemId}/`, { quantity: newQty });
      fetchCart();
    } catch (err) {
      console.error("Update Qty Error:", err);
    }
  };

  const deleteCartItem = async (itemId) => {
    try {
      await api.delete(`orders/cart/${itemId}/`);
      fetchCart();
    } catch (err) {
      console.error("Delete Item Error:", err);
    }
  };

  const handleOpenPayment = () => {
    if (!address.trim()) {
      alert("Please enter delivery address!");
      return;
    }
    setIsModalOpen(true);
  };

  const finalizeOrder = async () => {
    try {
      await api.post("orders/checkout/", { delivery_address: address });
      setIsModalOpen(false);
      navigate("/my-orders");
    } catch (err) {
      console.error("Checkout Error:", err.response?.data);
      alert(err.response?.data?.error || "Checkout failed.");
      setIsModalOpen(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 font-semibold text-gray-500">
        Loading Cart...
      </div>
    );

  const totalAmount = items.reduce((sum, item) => {
    const price = Number(
      item.price || item.menu_item_price || item.total_price || 0,
    );
    const qty = Number(item.quantity || 1);
    return sum + (item.total_price ? Number(item.total_price) : price * qty);
  }, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 mt-6 shadow-sm">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700">Your Cart is Empty</h2>
        <p className="text-gray-500 mt-1 mb-6">
          Add delicious meals from restaurants to get started!
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition shadow"
        >
          Explore Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-800">Your Food Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-gray-800 text-base sm:text-lg">
                  {item.menu_item_name || item.name || "Food Item"}
                </h3>
                <p className="text-orange-600 font-bold text-sm mt-0.5">
                  ₹{item.total_price || item.price * item.quantity}
                </p>
              </div>

              <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
                  title="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-sm text-gray-800 w-4 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
                  title="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteCartItem(item.id)}
                  className="p-1 text-red-400 hover:text-red-600 rounded ml-2 transition"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit space-y-4">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3">
            Bill Details
          </h2>

          <div className="flex justify-between text-gray-600 text-sm">
            <span>Item Total</span>
            <span className="font-semibold text-gray-800">₹{totalAmount}</span>
          </div>
          <div className="flex justify-between text-gray-600 text-sm">
            <span>Delivery Fee</span>
            <span className="text-green-600 font-semibold">FREE</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-3">
            <span>To Pay</span>
            <span className="text-orange-600">₹{totalAmount}</span>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Delivery Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="Enter delivery address"
            />
          </div>

          <button
            onClick={handleOpenPayment}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition shadow flex items-center justify-center space-x-2"
          >
            <span>Proceed to Payment</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Payment Modal Component */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        totalAmount={totalAmount}
        onPaymentSuccess={finalizeOrder}
      />
    </div>
  );
};

export default Cart;
