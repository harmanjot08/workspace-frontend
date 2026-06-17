import { useState, useEffect } from 'react';
import { chatAPI } from '../api/chatApi.js';
import { initSocket, joinChat, sendMessage, onReceiveMessage } from '../services/socketService.js';
import { MessageSquare } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

export default function UserChatPage() {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(true);
    const [unreadCounts, setUnreadCounts] = useState({});

    const token = localStorage.getItem('accessToken');
    const currentUser = JSON.parse(localStorage.getItem('user'));
    console.log('Current user:', currentUser);

    useEffect(() => {
        const socket = initSocket(token);

        const setupChat = async () => {
            await fetchChats();
        };

        // Wait for socket to connect first, then join rooms
        if (socket.connected) {
            setupChat();
        } else {
            socket.on('connect', () => {
                setupChat();
            });
        }

        onReceiveMessage((data) => {
            setMessages(prev => {
                if (prev.find(m => m.id === data.id)) return prev;
                return [...prev, data];
            });

            // Sidebar last message update karo
            setChats(prev => prev.map(chat => {
                if (chat.id === data.chatId) {
                    return {
                        ...chat,
                        messages: [{ content: data.content, createdAt: data.createdAt }]
                    };
                }
                return chat;
            }));

            // Unread badge
            setSelectedChat(current => {
                if (!current || current.id !== data.chatId) {
                    // Sirf tabhi count karo jab message kisi aur ne bheja ho
                    if (data.userId !== currentUser.id) {
                        setUnreadCounts(prev => ({
                            ...prev,
                            [data.chatId]: (prev[data.chatId] || 0) + 1,
                        }));
                    }
                }
                return current;
            });
        });
        const savedChat = localStorage.getItem('selectedChat');
        if (savedChat) {
            const chat = JSON.parse(savedChat);
            setSelectedChat(chat);
            joinChat(chat.id);
            chatAPI.getChat(token, chat.id).then(response => {
                if (response.chat) setMessages(response.chat.messages);
            });
        }

        return () => {
            socket.off('connect');
        };
    }, []);

    const fetchChats = async () => {
        try {
            setLoading(true);
            const response = await chatAPI.getAllChats(token);
            if (response.chats) {
                setChats(response.chats);
                response.chats.forEach(chat => joinChat(chat.id));
            }
        } catch (error) {
            console.error('fetchChats error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getChatName = (chat) => {
        if (!chat) return '';
        if (chat.isGroup) return chat.name;
        const otherMember = chat.chatMembers?.find(m => m.user.id !== currentUser.id);
        return otherMember?.user.name || 'Unknown';
    };

    const handleSelectChat = async (chat) => {
        setSelectedChat(chat);
        setUnreadCounts(prev => ({ ...prev, [chat.id]: 0 }));
        localStorage.setItem('selectedChat', JSON.stringify(chat));
        joinChat(chat.id);
        try {
            const response = await chatAPI.getChat(token, chat.id);
            if (response.chat) setMessages(response.chat.messages);
        } catch (error) {
            console.error('handleSelectChat error:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedChat) return;

        const content = messageText;
        setMessageText('');

        // Pehle DB mein save karo — real ID milegi
        const res = await chatAPI.sendMessage(token, selectedChat.id, content);

        // DB se mila real message socket se bhejo
        if (res.data) {
            sendMessage({
                id: res.data.id,
                content: res.data.content,
                chatId: selectedChat.id,
                userId: currentUser.id,  // Ye sahi hai?
                userName: currentUser.name,
                createdAt: res.data.createdAt,
            });
        }
    };

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedMessageForReaction, setSelectedMessageForReaction] = useState(null);

    const handleEmojiClick = (emojiObject) => {
        if (selectedMessageForReaction) {
            // Reaction add karo
            chatAPI.addReaction(token, selectedMessageForReaction.id, emojiObject.emoji)
                .then(() => {
                    setMessages(prev => prev.map(msg => {
                        if (msg.id === selectedMessageForReaction.id) {
                            return {
                                ...msg,
                                reactions: [...(msg.reactions || []), { emoji: emojiObject.emoji, userId: currentUser.id }]
                            };
                        }
                        return msg;
                    }));
                    setShowEmojiPicker(false);
                    setSelectedMessageForReaction(null);
                })
                .catch(err => console.error('Reaction error:', err));
        } else {
            // Message mein emoji type karo
            setMessageText(prev => prev + emojiObject.emoji);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading chats...</div>;

    return (
        <div className="flex h-full bg-slate-100 rounded-lg overflow-hidden">
            {/* Chat List */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900">Messages</h2>
                </div>

                {chats.length === 0 ? (
                    <div className="p-4 text-center text-slate-600">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No conversations yet</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        {chats.map(chat => (
                            <button
                                key={chat.id}
                                onClick={() => handleSelectChat(chat)}
                                className={`w-full text-left px-4 py-3 border-b border-slate-100 transition ${selectedChat?.id === chat.id
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-slate-700 hover:bg-slate-50'}`}>
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-sm">{getChatName(chat)}</p>
                                    {unreadCounts[chat.id] > 0 && (
                                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {unreadCounts[chat.id]}
                                        </span>
                                    )}
                                </div>
                                {chat.messages?.length > 0 && (
                                    <p className="text-xs text-slate-500 truncate mt-0.5">
                                        {chat.messages[chat.messages.length - 1].content}
                                    </p>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Chat Window */}
            {selectedChat ? (
                <div className="flex-1 flex flex-col bg-white">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-900">{getChatName(selectedChat)}</h2>
                        <button
                            onClick={() => {
                                setSelectedChat(null);
                                setMessages([]);
                                localStorage.removeItem('selectedChat');
                            }}
                            className="text-slate-400 hover:text-slate-600 text-xl font-bold">
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map(msg => {
                            const isMe = msg.userId === currentUser.id || msg.user?.id === currentUser.id;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <p className="text-xs text-slate-500 mb-1">
                                            {isMe ? 'You' : (msg.user?.name || msg.userName)}
                                        </p>
                                        <div className="relative">
                                            <p className={`text-sm rounded-lg px-3 py-2 ${isMe ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700'}`}>
                                                {msg.content}
                                            </p>
                                            {msg.reactions && msg.reactions.length > 0 && (
                                                <div className="flex gap-1 mt-1 flex-wrap">
                                                    {msg.reactions.map((reaction, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => {
                                                                setSelectedMessageForReaction(msg);
                                                                setShowEmojiPicker(true);
                                                            }}
                                                            className="text-sm hover:scale-125 cursor-pointer">
                                                            {reaction.emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setSelectedMessageForReaction(msg);
                                                    setShowEmojiPicker(true);
                                                }}
                                                className="text-xs text-slate-400 hover:text-slate-600 ml-1">
                                                👍
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 flex gap-2 relative">
                        <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="px-3 py-2 text-xl hover:bg-slate-100 rounded-lg">
                            😊
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                            Send
                        </button>
                        {showEmojiPicker && (
                            <div className="absolute bottom-16 right-0 z-50">
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )}
                    </form>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-slate-600">
                    Select a chat to start messaging
                </div>
            )}
        </div>
    );
}