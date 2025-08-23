import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import PopupMessage from "../components/PopupMessage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage("❌ Invalid email or password.");
    } else {
      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => router.replace("/"), 1500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <PopupMessage message={message} onClose={() => setMessage("")} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white border border-gray-200 shadow-md p-10 rounded-lg w-[400px]"
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-center mb-6 text-gray-900"
        >
          Welcome Back
        </motion.h1>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 bg-black text-white rounded-lg font-semibold shadow hover:bg-gray-800 transition"
          >
            Login
          </motion.button>
        </form>

        {/* Forgot Password */}
        <div className="mt-3 text-right">
          <a
            href="/forgot-password"
            className="text-sm text-gray-600 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        {/* Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-black font-medium hover:underline">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
}
