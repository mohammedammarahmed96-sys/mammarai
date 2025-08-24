import { useState } from "react";
import { supabase } from "../lib/supabase";
import PopupMessage from "../components/PopupMessage";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("⚠️ Please enter your email.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`, // ✅ redirect link
    });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("📩 Password reset email sent! Check your inbox.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <PopupMessage message={message} onClose={() => setMessage("")} />

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Reset your password
        </h1>

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
