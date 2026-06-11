import { useEffect, useRef, useState } from 'react';
import { Send, Trash2, Archive, Smile, Image as ImageIcon } from 'lucide-react';
import EmojiPicker from './EmojiPicker';
export default function UserChatWindow({
    chat,
    messages,
    messageInput,
    onMessageChange,
    onSendMessage,
    onDeleteMessage,
    onAddReaction,
    onArchiveChat,
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
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const fileName = file.name;
        const isImage = file.type.startsWith('image');
        console.log('File uploaded:', fileName, 'Type:', file.type);
    };
    return (
        <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 bg-slate-300 text-slate-900 rounded-full flex items-center justify-center font-bold text-sm">
                            {chat.avatar}
                        </div>
                        {chat.online && (
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">{chat.name}</h2>
                        <p className="text-xs text-slate-600">
                            {chat.online ? '🟢 Online' : '⚪ Offline'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => onArchiveChat(chat.id)}
                    className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                    title="Archive chat">
                    <Archive className="w-5 h-5" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50 to-white">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className="text-slate-500 text-sm">No messages yet</p>
                            <p className="text-slate-400 text-xs mt-1">Start the conversation!</p>
                        </div>
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
                                    className={`px-4 py-2 rounded-lg shadow-sm ${msg.isSent
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                                        }`}>
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
                                                className="px-2 py-0.5 bg-white border border-slate-200 rounded-full text-xs hover:bg-slate-100 shadow-sm">
                                                {reaction.emoji} {reaction.count}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {hoveredMessageId === msg.id && (
                                    <div className="flex gap-2 mt-2 justify-end">
                                        <button
                                            onClick={() => setShowEmojiPicker(msg.id)}
                                            className="p-1 hover:bg-slate-200 rounded-lg transition"
                                            title="Add reaction">
                                            <Smile className="w-4 h-4 text-slate-600" />
                                        </button>
                                        {msg.isSent && (
                                            <button
                                                onClick={() => onDeleteMessage(msg.id)}
                                                className="p-1 hover:bg-red-100 rounded-lg transition"
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
                                        onClose={() => setShowEmojiPicker(false)} />
                                )}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={onSendMessage} className="border-t border-slate-200 p-4 bg-white">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => onMessageChange(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 bg-slate-100 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none text-sm" />
                    <div className="relative">
                        <input
                            type="file"
                            id="file-upload"
                            onChange={handleFileUpload}
                            className="hidden"
                            accept="image/*,.pdf,.doc,.docx" />
                        <label
                            htmlFor="file-upload"
                            className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer text-slate-600 transition inline-block"
                            title="Upload file">
                            <ImageIcon className="w-5 h-5" />
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium text-sm transition">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
}