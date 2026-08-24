import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { MapPin, Phone, Store, Search } from "lucide-react";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("restaurants/");
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];
        setRestaurants(data);
      } catch (err) {
        setError("Failed to load restaurants.");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(
    (res) =>
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.address &&
        res.address.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  if (loading) {
    return (
      <div className="text-center py-20 font-semibold text-gray-500">
        Loading restaurants...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">
            Explore Restaurants
          </h1>
          <p className="text-gray-500 mt-1">
            Discover popular places and delicious meals nearby.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants or location..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition shadow-sm"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
      )}

      {/* Restaurant Grid */}
      {filteredRestaurants.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-500">
          No restaurants match your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((res) => (
            <Link
              key={res.id}
              to={`/restaurants/${res.id}`}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-200 overflow-hidden transition duration-200 flex flex-col justify-between group"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {res.name}
                    </h2>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Open Now
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mt-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{res.address || "Address not listed"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{res.phone || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-orange-500 font-semibold text-sm group-hover:bg-orange-50 transition">
                <span>View Menu</span>
                <span>&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
