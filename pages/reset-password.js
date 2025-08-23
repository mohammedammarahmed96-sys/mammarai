// pages/reset-password.js
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Password updated! Redirecting to login...");
      setTimeout(() => router.replace("/login"), 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white border border-gray-200 shadow-md p-10 rounded-lg w-[400px]">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Reset Password
        </h1>

        <form onSubmit={handleResetPassword} className="space-y-5">
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-lg font-semibold shadow hover:bg-gray-800 transition"
          >
            Reset Password
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
