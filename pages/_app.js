// pages/_app.js
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "highlight.js/styles/github-dark.css";
import "../styles/globals.css"; // make sure you have global styles

export default function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a short loading delay (e.g., auth/session check)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5s

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loader"
          className="flex items-center justify-center h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Spinner */}
          <motion.div
            className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 0.6 }}
          />
          <motion.h1
            className="ml-4 text-2xl font-bold text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
          </motion.h1>
        </motion.div>
      ) : (
        <Component {...pageProps} />
      )}
    </AnimatePresence>
  );
}
