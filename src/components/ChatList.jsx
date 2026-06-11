export default function ChatList({ chats, selectedChat, onSelectChat }) {
    return (
        <div className="overflow-y-auto flex-1">
            {chats.map(chat => (
                <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat)}
                    className={`w-full p-4 border-b border-slate-100 text-left transition hover:bg-slate-50 ${selectedChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                        }`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {chat.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 truncate">{chat.name}</p>
                            <p className="text-sm text-slate-600 truncate">{chat.lastMessage || 'No messages yet'}</p>
                        </div>
                        {chat.unread > 0 && (
                            <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full font-bold">
                                {chat.unread}
                            </span>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
}