import { Search, Plus, Archive } from 'lucide-react';
export default function ChatSidebar({
    conversations,
    selectedChat,
    onSelectChat,
    onSearchChange,
    searchTerm,
    onCreateGroup,
}) {
    return (
        <div className="w-80 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Messages</h2>
                    <button
                        onClick={onCreateGroup}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        title="Create group">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none text-sm" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {conversations.map(chat => (
                    <button
                        key={chat.id}
                        onClick={() => onSelectChat(chat)}
                        className={`w-full p-4 border-b border-slate-100 text-left transition hover:bg-slate-50 ${selectedChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                            }`}>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                    {chat.avatar}
                                </div>
                                {chat.online && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <p className="font-semibold text-slate-900 truncate">{chat.name}</p>
                                    <span className="text-xs text-slate-500 ml-2 whitespace-nowrap">{chat.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-slate-600 truncate flex-1">{chat.lastMessage || 'No messages'}</p>
                                    {chat.unread > 0 && (
                                        <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-bold whitespace-nowrap">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {chat.locked && <Archive className="w-4 h-4 text-orange-600" />}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}