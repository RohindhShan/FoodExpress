import React, { useState } from "react";
import {
  CreditCard,
  Smartphone,
  CheckCircle,
  ShieldCheck,
  X,
} from "lucide-react";

const PaymentModal = ({ isOpen, onClose, totalAmount, onPaymentSuccess }) => {
  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onPaymentSuccess();
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        {!processing && !success && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {success ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
            <h3 className="text-2xl font-extrabold text-gray-800">
              Payment Successful!
            </h3>
            <p className="text-gray-500 text-sm">
              Placing your delicious order...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
                Fast & Secure
              </span>
              <h2 className="text-2xl font-extrabold text-gray-800">
                Select Payment Method
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Amount to pay:{" "}
                <strong className="text-orange-600 font-bold">
                  ₹{totalAmount}
                </strong>
              </p>
            </div>

            {/* Payment Mode Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod("upi")}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center space-y-2 transition ${
                  method === "upi"
                    ? "border-orange-500 bg-orange-50/50 text-orange-600 font-bold"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <Smartphone className="w-6 h-6" />
                <span className="text-sm">UPI / GPay</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod("card")}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center space-y-2 transition ${
                  method === "card"
                    ? "border-orange-500 bg-orange-50/50 text-orange-600 font-bold"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <CreditCard className="w-6 h-6" />
                <span className="text-sm">Credit / Debit Card</span>
              </button>
            </div>

            {/* Dynamic Inputs */}
            {method === "upi" ? (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-600 uppercase">
                  UPI ID / VPA
                </label>
                <input
                  type="text"
                  placeholder="username@okaxis"
                  defaultValue="rohindh@upi"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="4532 •••• •••• 8921"
                    defaultValue="4532 8821 9012 8921"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="12/28"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                  />
                  <input
                    type="password"
                    maxLength="3"
                    placeholder="CVV"
                    defaultValue="782"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={processing}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center space-x-2"
            >
              {processing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Transaction...</span>
                </div>
              ) : (
                <span>Pay ₹{totalAmount}</span>
              )}
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>256-bit Encrypted Mock Payment Gateway</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
