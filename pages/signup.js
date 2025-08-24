import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import PopupMessage from "../components/PopupMessage";
import Link from "next/link";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Account created! Please check your email for verification.");
      setTimeout(() => router.replace("/"), 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <PopupMessage message={message} onClose={() => setMessage("")} />

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-md p-8">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create your account
        </h1>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition"
          >
            Sign up
          </button>
        </form>

        {/* Link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-black hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
