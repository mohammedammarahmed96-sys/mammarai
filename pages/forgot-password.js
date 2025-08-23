// pages/forgot-password.js
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password", // change for production
    });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("📩 Password reset email sent! Check your inbox.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white border border-gray-200 shadow-md p-10 rounded-lg w-[400px]"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Forgot Password
        </h1>

        <form onSubmit={handleForgotPassword} className="space-y-5">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-lg font-semibold shadow hover:bg-gray-800 transition"
          >
            Send Reset Link
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          <a href="/login" className="text-black font-medium hover:underline">
            Back to login
          </a>
        </p>
      </motion.div>
    </div>
  );
}
