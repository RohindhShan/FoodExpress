import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  UtensilsCrossed,
  ShoppingBag,
  ListOrdered,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isRestaurant = user?.role === "restaurant";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-orange-600 font-extrabold text-2xl tracking-tight"
          >
            <UtensilsCrossed className="w-7 h-7" />
            <span>FoodExpress</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-orange-600 font-medium transition text-sm"
            >
              Restaurants
            </Link>

            {user ? (
              <>
                {/* Customer specific links */}
                {!isRestaurant && (
                  <>
                    <Link
                      to="/cart"
                      className="flex items-center space-x-1 text-gray-600 hover:text-orange-600 font-medium transition text-sm"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Cart</span>
                    </Link>
                    <Link
                      to="/my-orders"
                      className="flex items-center space-x-1 text-gray-600 hover:text-orange-600 font-medium transition text-sm"
                    >
                      <ListOrdered className="w-4 h-4" />
                      <span>My Orders</span>
                    </Link>
                  </>
                )}

                {/* Restaurant Owner specific links */}
                {isRestaurant && (
                  <Link
                    to="/restaurant/dashboard"
                    className="flex items-center space-x-1 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-orange-100 transition text-sm border border-orange-200"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Manage Orders</span>
                  </Link>
                )}

                {/* User Info & Logout */}
                <div className="flex items-center space-x-3 border-l pl-5 border-gray-200">
                  <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
                    {user.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 font-medium text-sm px-3 py-2 rounded-lg"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm px-4 py-2 rounded-xl transition shadow"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
