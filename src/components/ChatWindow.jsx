import { useEffect, useRef, useState } from 'react';
import { Send, Trash2, Lock, Archive, Smile } from 'lucide-react';
import EmojiPicker from './EmojiPicker';
export default function ChatWindow({
    chat,
    messages,
    messageInput,
    onMessageChange,
    onSendMessage,
    onDeleteMessage,
    onAddReaction,
    onArchiveChat,
    onLockChat,
}) {
    const messagesEndRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    const handleEmojiSelect = (messageId, emoji) => {
        onAddReaction(messageId, emoji);
        setShowEmojiPicker(false);
    };
    return (
        <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">{chat.name}</h2>
                    <p className="text-sm text-slate-600">
                        {chat.type === 'group' ? `${chat.members} members` : chat.online ? 'Online' : 'Offline'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onLockChat(chat.id)}
                        className={`p-2 rounded-lg transition ${chat.locked
                                ? 'bg-orange-100 text-orange-600'
                                : 'hover:bg-slate-100 text-slate-600'
                            }`}
                        title={chat.locked ? 'Unlock chat' : 'Lock chat'}>
                        <Lock className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => onArchiveChat(chat.id)}
                        className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg"
                        title="Archive chat">
                        <Archive className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-slate-500">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.isSent ? 'justify-end' : 'justify-start'}`}
                            onMouseEnter={() => setHoveredMessageId(msg.id)}
                            onMouseLeave={() => setHoveredMessageId(null)}>
                            <div className="max-w-xs group">
                                <div
                                    className={`px-4 py-2 rounded-lg ${msg.isSent
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-slate-900 border border-slate-200'
                                        }`}>
                                    {!msg.isSent && <p className="text-xs font-semibold opacity-75 mb-1">{msg.sender}</p>}
                                    <p className="text-sm break-words">{msg.message}</p>
                                    <div className="flex items-center justify-between mt-1">
                                        <p className={`text-xs ${msg.isSent ? 'text-blue-100' : 'text-slate-600'}`}>
                                            {msg.time}
                                        </p>
                                        {msg.isSent && msg.read && (
                                            <span className="text-xs ml-2" title="Read">
                                                ✓✓
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {msg.reactions.length > 0 && (
                                    <div className="flex gap-1 mt-2 flex-wrap">
                                        {msg.reactions.map(reaction => (
                                            <button
                                                key={reaction.emoji}
                                                className="px-2 py-1 bg-white border border-slate-200 rounded-full text-xs hover:bg-slate-100">
                                                {reaction.emoji} {reaction.count}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {hoveredMessageId === msg.id && (
                                    <div className="flex gap-2 mt-2 justify-end">
                                        <button
                                            onClick={() => setShowEmojiPicker(msg.id)}
                                            className="p-1 hover:bg-slate-200 rounded-lg"
                                            title="Add reaction">
                                            <Smile className="w-4 h-4 text-slate-600" />
                                        </button>
                                        {msg.isSent && (
                                            <button
                                                onClick={() => onDeleteMessage(msg.id)}
                                                className="p-1 hover:bg-red-100 rounded-lg"
                                                title="Delete message">
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        )}
                                    </div>
                                )}
                                {showEmojiPicker === msg.id && (
                                    <EmojiPicker
                                        onSelectEmoji={(emoji) => {
                                            handleEmojiSelect(msg.id, emoji);
                                        }}
                                        onClose={() => setShowEmojiPicker(false)}
                                    />
                                )}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            {!chat.locked ? (
                <form onSubmit={onSendMessage} className="border-t border-slate-200 p-4 flex gap-3">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => onMessageChange(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 bg-slate-100 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none" />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            ) : (
                <div className="border-t border-slate-200 p-4 bg-orange-50">
                    <p className="text-sm text-orange-800 font-medium">🔒 This chat is locked - read only</p>
                </div>
            )}
        </div>
    );
}