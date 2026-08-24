import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Utensils, Plus, Check } from "lucide-react";

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedItem, setAddedItem] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const resDetail = await api.get(`restaurants/${id}/`);
        const menuDetail = await api.get(`restaurants/${id}/menu/`);
        setRestaurant(resDetail.data);
        setMenu(menuDetail.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleAddToCart = async (dish) => {
    try {
      await api.post("orders/cart/", {
        menu_item: dish.id,
        quantity: 1,
      });
      setAddedItem(dish.id);
      setTimeout(() => setAddedItem(null), 1500);
    } catch (err) {
      console.error("Cart error:", err.response?.data);
      alert(JSON.stringify(err.response?.data) || "Failed to add item");
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 font-semibold text-gray-500">
        Loading Menu...
      </div>
    );

  return (
    <div className="space-y-6">
      {restaurant && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h1 className="text-3xl font-extrabold text-gray-800">
            {restaurant.name}
          </h1>
          <p className="text-gray-500 mt-1">{restaurant.address}</p>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800">Menu Dishes</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menu.map((dish) => (
          <div
            key={dish.id}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold text-lg text-gray-800">{dish.name}</h3>
              <p className="text-gray-500 text-sm">
                {dish.description || "Delicious meal"}
              </p>
              <p className="text-orange-600 font-bold mt-2">₹{dish.price}</p>
            </div>

            <button
              onClick={() => handleAddToCart(dish)}
              className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                addedItem === dish.id
                  ? "bg-green-500 text-white"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {addedItem === dish.id ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantDetail;
