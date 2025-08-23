// components/PopupMessage.js
import { motion } from "framer-motion";

export default function PopupMessage({ message, onClose }) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="bg-white text-black px-6 py-3 rounded-lg shadow-lg border border-gray-300 flex items-center gap-3">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-sm font-bold text-red-600 hover:text-red-800"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}
