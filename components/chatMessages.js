import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Copy, ArrowDown } from "lucide-react";

export default function ChatMessages({ messages, endRef, motion }) {
  const [copied, setCopied] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const containerRef = useRef(null);

  // 📌 Handle copy code
  const handleCopy = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  // 📌 Detect scroll for scroll-to-bottom button
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      setShowScrollButton(!atBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main ref={containerRef} className="flex-1 overflow-y-auto bg-[#212121] relative">
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`flex px-6 py-4 ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`px-4 py-3 rounded-lg max-w-3xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-[#444444] text-[#ececf1]"
                : "bg-[#212121] text-[#ffffff]"
            }`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  if (!inline) {
                    return (
                      <div className="relative group">
                        <pre className="bg-black text-gray-100 p-3 rounded-md overflow-x-auto">
                          <code {...props} className={className}>
                            {children}
                          </code>
                        </pre>
                        <button
                          onClick={() => handleCopy(String(children).trim(), i)}
                          className="absolute top-2 right-2 p-1 rounded-md bg-gray-800 text-gray-300 hover:text-white text-xs"
                        >
                          {copied === i ? "Copied!" : <Copy size={14} />}
                        </button>
                      </div>
                    );
                  }
                  return <code className="bg-gray-800 px-1 rounded">{children}</code>;
                },
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        </motion.div>
      ))}

      <div ref={endRef} />

      {showScrollButton && (
        <button
          onClick={() => endRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-4 right-4 p-2 bg-[#2f2f2f] hover:bg-[#3f3f3f] text-white rounded-full shadow"
        >
          <ArrowDown size={20} />
        </button>
      )}
    </main>
  );
}
