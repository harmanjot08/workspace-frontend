import { Search } from 'lucide-react';
export default function UserChatSidebar({
    conversations,
    selectedChat,
    onSelectChat,
    onSearchChange,
    searchTerm,
}) {
    return (
        <div className="w-72 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-200">
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none text-sm" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-4 text-center text-slate-500">
                        <p className="text-sm">No conversations yet</p>
                    </div>
                ) : (
                    conversations.map(chat => (
                        <button
                            key={chat.id}
                            onClick={() => onSelectChat(chat)}
                            className={`w-full p-4 border-b border-slate-100 text-left transition hover:bg-slate-50 ${selectedChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                                }`}>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-slate-300 text-slate-900 rounded-full flex items-center justify-center font-bold text-sm">
                                        {chat.avatar}
                                    </div>
                                    {chat.online && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-slate-900 text-sm truncate">{chat.name}</p>
                                        <span className="text-xs text-slate-500 ml-2 whitespace-nowrap">{chat.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-slate-600 truncate flex-1">{chat.lastMessage || 'No messages'}</p>
                                        {chat.unread > 0 && (
                                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-bold whitespace-nowrap">
                                                {chat.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}