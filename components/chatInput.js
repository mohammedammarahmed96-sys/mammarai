// components/ChatInput.js
import { useRef, useEffect } from "react";
import { SendHorizonal, StopCircle, Sparkles } from "lucide-react";

export default function ChatInput({
  input,
  setInput,
  handleSend,
  isGenerating,
  handleStop,
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // ✨ Enhance prompt function
  const handleEnhance = async () => {
    if (!input.trim()) return;
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      if (data.enhanced) {
        setInput(data.enhanced);
      }
    } catch (err) {
      console.error("Enhance failed:", err);
    }
  };

  return (
    <footer className="border-t border-[#212121] bg-[#212121] px-4 py-3">
      <form
        onSubmit={handleSend}
        className="flex items-end max-w-3xl mx-auto w-full"
      >
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              const el = e.target;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 200) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            className={`w-full resize-none bg-[#303030] text-[#ffffff] 
                       border border-[#303030] px-4 py-3 pr-20
                       focus:outline-none focus:ring-1 focus:ring-[#303030]
                       placeholder-gray leading-relaxed
                       scrollbar-thin scrollbar-thumb-[#565869] scrollbar-track-transparent
                       ${input.trim() ? "rounded-md" : "rounded-full"}`}
            style={{
              minHeight: "44px",
              maxHeight: "200px",
              lineHeight: "1.2rem",
            }}
          />

          {/* ✨ Enhance Button */}
          <button
            type="button"
            onClick={handleEnhance}
            disabled={!input.trim()}
            className="absolute right-12 bottom-5 p-2 rounded-lg 
                       bg-[#3f3f3f] hover:bg-[#3f3f3f] text-[#A4A4A4] transition"
            title="Enhance prompt"
          >
            <Sparkles size={18} />
          </button>

          {/* ✅ Stop / Send buttons */}
          {isGenerating ? (
            <button
              type="button"
              onClick={handleStop}
              className="absolute right-2 bottom-5 p-2 rounded-md
                         bg-[#ffffff] hover:bg-[#e5e5e5] text-black 
                         shadow-md transition"
              title="Stop generating"
            >
              <StopCircle size={18} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className={`absolute right-2 bottom-5 p-2 rounded-full transition
              ${
                input.trim()
                  ? "bg-[#ffffff] hover:bg-[#e5e5e5] text-black"
                  : "bg-[#3f3f3f] text-[#A4A4A4] cursor-not-allowed"
              }`}
              title="Send message"
            >
              <SendHorizonal size={18} />
            </button>
          )}
        </div>
      </form>

      <p className="text-xs text-gray-400 text-center mt-2">
        ammarAI can make mistakes. Check important info.
      </p>
    </footer>
  );
}
