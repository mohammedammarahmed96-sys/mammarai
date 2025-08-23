import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";

import Sidebar from "../components/sidebar";
import ChatMessages from "../components/chatMessages";
import ChatInput from "../components/chatInput";

export default function Dashboard() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [input, setInput] = useState("");
  const [controller, setController] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [typingInterval, setTypingInterval] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const endRef = useRef(null);

  // Auto-scroll down on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📌 Format chat section titles (Today / Yesterday / Earlier)
  const formatChatDate = (dateString) => {
    const chatDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (chatDate.toDateString() === today.toDateString()) return "Today";
    if (chatDate.toDateString() === yesterday.toDateString()) return "Yesterday";

    return chatDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year:
        today.getFullYear() === chatDate.getFullYear() ? undefined : "numeric",
    });
  };

  // Load session + chats
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
        return;
      }
      setSession(data.session);

      const { data: chatsData } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", data.session.user.id)
        .order("created_at", { ascending: false });

      if (chatsData) setChats(chatsData);
    };
    init();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const startNewChat = () => {
    setCurrentChat("new");
    setMessages([]);
  };

  const switchChat = (chatId) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setCurrentChat(chat.id);
      setMessages(chat.messages || []);
    }
  };

  // Save or update messages in Supabase
  const saveMessagesToChat = async (chatId, newMessages, updateTitle = null) => {
    if (chatId === "new") {
      const { data, error } = await supabase
        .from("chats")
        .insert([
          {
            user_id: session.user.id,
            title: "New Chat", // temp title
            messages: newMessages,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        setChats((prev) => [data, ...prev]);
        setCurrentChat(data.id);
        return data.id;
      } else {
        console.error("Error saving new chat:", error);
        return null;
      }
    } else {
      let updateData = { messages: newMessages };
      if (updateTitle) updateData.title = updateTitle;

      await supabase.from("chats").update(updateData).eq("id", chatId);
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, ...updateData } : c))
      );
      return chatId;
    }
  };

  // Handle Send
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    const chatIdToUse = await saveMessagesToChat(
      currentChat || "new",
      updatedMessages
    );

    const prompt = [...updatedMessages].map(m => `${m.role}: ${m.content}`).join("\n");
    setInput("");

    const abortController = new AbortController();
    setController(abortController);
    setIsGenerating(true);

    try {
      // Keep only the last 20 messages when sending to Gemini
const MAX_HISTORY = 20;

const res = await fetch("/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: updatedMessages.slice(-MAX_HISTORY), // ✅ send last 20 msgs only
  }),
  signal: abortController.signal,
});



      const data = await res.json();
      const fullText = data?.text || "❌ No response";

      // Typing effect like ChatGPT (~25ms per char)
      const typingDelay = 2;
      const aiMessage = { role: "ai", content: "" };
      setMessages((prev) => [...prev, aiMessage]);

      let i = 0;
      const interval = setInterval(async () => {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "ai",
            content: fullText.slice(0, i),
          };
          return next;
        });
        i++;

        if (i > fullText.length) {
          clearInterval(interval);
          setTypingInterval(null);
          setIsGenerating(false);
          setController(null);

          const finalMessages = [
            ...updatedMessages,
            { role: "ai", content: fullText },
          ];

          // Rename only once
          const current = chats.find((c) => c.id === chatIdToUse);
          let newTitle = null;
          if (current && current.title === "New Chat") {
            newTitle = fullText.split(" ").slice(0, 6).join(" ");
          }

          await saveMessagesToChat(chatIdToUse, finalMessages, newTitle);
        }
      }, typingDelay);

      setTypingInterval(interval);
    } catch (err) {
      const errorMsg =
        err.name === "AbortError"
          ? " "
          : "❌ Error fetching AI response";

      const newMessages = [...messages, { role: "ai", content: errorMsg }];
      setMessages(newMessages);
      await saveMessagesToChat(currentChat, newMessages);

      setIsGenerating(false);
      setController(null);
    }
  };

  // 🛑 Stop AI Response
  const handleStop = () => {
    if (controller) controller.abort();
    if (typingInterval) clearInterval(typingInterval);

    setTypingInterval(null);
    setIsGenerating(false);
    setController(null);

    setMessages((prev) => {
      const next = [...prev];
      if (next.length > 0 && next[next.length - 1].role === "ai") {
        next[next.length - 1].content += " ";
      }
      saveMessagesToChat(currentChat, next);
      return next;
    });
  };


  const handleDeleteChat = async (chatId) => {
    await supabase.from("chats").delete().eq("id", chatId);
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (currentChat === chatId) {
      setCurrentChat(null);
      setMessages([]);
    }
  };

  return (
    <div className="flex h-screen bg-[#212121] text-white">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        chats={chats}
        currentChat={currentChat}
        switchChat={switchChat}
        startNewChat={startNewChat}
        handleDeleteChat={handleDeleteChat}
        handleLogout={handleLogout}
        editingChatId={editingChatId}
        setEditingChatId={setEditingChatId}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        formatChatDate={formatChatDate}
      />

      <div className="flex flex-col flex-1">
  {messages.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-full text-gray-300 px-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Mohammed Ammar Ahmed AI</h1>
      <p className="text-gray-400 mb-6">Ask me anything or try these examples:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full">
        <button className="p-4 rounded-xl bg-[#2f2f2f] hover:bg-[#3f3f3f] transition">
          💡 Explain a concept in simple terms
        </button>
        <button className="p-4 rounded-xl bg-[#2f2f2f] hover:bg-[#3f3f3f] transition">
          📝 Generate product descriptions
        </button>
        <button className="p-4 rounded-xl bg-[#2f2f2f] hover:bg-[#3f3f3f] transition">
          🚀 Improve my pitch
        </button>
      </div>
    </div>
  ) : (
    <ChatMessages messages={messages} endRef={endRef} motion={motion} />
  )}
  <ChatInput
    input={input}
    setInput={setInput}
    handleSend={handleSend}
    isGenerating={isGenerating}
    handleStop={handleStop}
  />
</div>

    </div>
  );
}
