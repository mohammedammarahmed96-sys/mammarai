import { Menu, X, Trash2, Plus, MessageSquare, LogOut } from "lucide-react";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  chats,
  currentChat,
  switchChat,
  startNewChat,
  handleDeleteChat,
  handleLogout,
  editingChatId,
  setEditingChatId,
  editTitle,
  setEditTitle,
  formatChatDate,
}) {
  const groupedChats = chats.reduce((groups, chat) => {
    const section = formatChatDate(chat.created_at);
    if (!groups[section]) groups[section] = [];
    groups[section].push(chat);
    return groups;
  }, {});

  return (
    <aside
  className={`${
    sidebarOpen ? "w-64" : "w-16"
  } transition-all duration-300 
     bg-[#181818] text-[#ececf1] 
     flex flex-col border-r border-[#181818]`}
>
  {/* Header */}
  <div className="flex items-center justify-between p-3 border-b border-[#181818]">
    {sidebarOpen && (
      <span className="font-bold text-sm text-[#ececf1]">
        Mohammed Ammar AI
      </span>
    )}
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="p-2 hover:bg-[#2d2f31] rounded"
    >
      {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
    </button>
  </div>

  {/* New Chat */}
  <div className="p-3 border-b border-[#181818]">
    <button
      onClick={startNewChat}
      className="w-full flex items-center gap-2 px-3 py-2 
                 bg-[#181818] hover:bg-[#282828] 
                 text-[#ececf1] rounded-md text-sm"
    >
      <Plus size={16} />
      {sidebarOpen && "New Chat"}
    </button>
  </div>

  {/* Chat History */}
  <nav className="flex-1 p-2 overflow-y-auto space-y-3">
    {Object.keys(groupedChats).map((section) => (
      <div key={section}>
        {sidebarOpen && (
          <h3 className="text-xs uppercase text-gray-400 px-2 mb-1">
            {section}
          </h3>
        )}
        {groupedChats[section].map((chat) => (
          <div key={chat.id} className="flex items-center group">
            {editingChatId === chat.id ? (
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => setEditingChatId(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setEditingChatId(null);
                }}
                autoFocus
                className="flex-1 px-2 py-1 rounded bg-[#181818] text-[#ececf1] text-sm"
              />
            ) : (
              <button
                onClick={() => switchChat(chat.id)}
                onDoubleClick={() => {
                  setEditingChatId(chat.id);
                  setEditTitle(chat.title);
                }}
                className={`flex items-center gap-2 flex-1 text-left px-3 py-2 rounded-md truncate text-sm ${
                  currentChat === chat.id
                    ? "bg-[#282828] text-[#ececf1]"
                    : "hover:bg-[#484848] text-[#ececf1]"
                }`}
              >
                <MessageSquare size={16} />
                {sidebarOpen ? chat.title : ""}
              </button>
            )}
            {sidebarOpen && (
              <button
                onClick={() => handleDeleteChat(chat.id)}
                className="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    ))}
  </nav>

  {/* Logout */}
  <div className="p-3 border-t border-[#181818]">
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-2 px-3 py-2 bg-[#181818] hover:bg-[#282828] rounded-md text-sm text-[#ececf1]"
    >
      <LogOut size={16} />
      {sidebarOpen && "Logout"}
    </button>
  </div>
</aside>

  );
}
