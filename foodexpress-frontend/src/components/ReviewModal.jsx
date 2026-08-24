import React, { useState } from "react";
import { Star, X } from "lucide-react";

const ReviewModal = ({ isOpen, onClose, order, onSubmitReview }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);

  if (!isOpen || !order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitReview(order.id, { rating, comment });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
              Feedback
            </span>
            <h2 className="text-2xl font-extrabold text-gray-800 mt-1">
              Rate Your Food
            </h2>
            <p className="text-sm text-gray-500">
              How was your meal from{" "}
              {order.restaurant_name ||
                order.restaurant?.name ||
                "the restaurant"}
              ?
            </p>
          </div>

          {/* Star Rating Select */}
          <div className="flex justify-center space-x-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="p-1 transition transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    (hover || rating) >= star
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Feedback input */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Write your review (optional)
            </label>
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about food quality, taste, and delivery..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
