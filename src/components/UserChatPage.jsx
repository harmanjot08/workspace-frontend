import { useState, useEffect } from 'react';
import { chatApi } from '../api/chatApi.js';
import { initSocket, joinChat, sendMessage, onReceiveMessage } from '../services/socketService.js';
import { MessageSquare } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import DeleteMessageModal from './DeleteMessageModal.jsx';

export default function UserChatPage() {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(true);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedMessageForReaction, setSelectedMessageForReaction] = useState(null);
    const [typingUsers, setTypingUsers] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

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
            chatApi.getChat(token, chat.id).then(response => {
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
            const response = await chatApi.getAllChats(token);
            if (response.chats) {
                // Pinned chats pehle, phir baaki
                const sorted = response.chats.sort((a, b) => {
                    if (a.isPinned === b.isPinned) return 0;
                    return a.isPinned ? -1 : 1;
                });
                setChats(sorted);
                sorted.forEach(chat => joinChat(chat.id));
            }
        } catch (err) {
            console.error('fetchChats error:', err);
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
            const response = await chatApi.getChat(token, chat.id);
            if (response.chat) setMessages(response.chat.messages);
        } catch (error) {
            console.error('handleSelectChat error:', error);
        }
    };

    const handlePinChat = async (chatId) => {
        try {
            const res = await chatApi.pinChat(token, chatId);
            if (res.chat) {
                setChats(prev => prev.map(c => c.id === chatId ? res.chat : c));
            }
        } catch (err) {
            console.error('Pin chat error:', err);
        }
    };

    const handleUnpinChat = async (chatId) => {
        try {
            const res = await chatApi.unpinChat(token, chatId);
            if (res.chat) {
                setChats(prev => prev.map(c => c.id === chatId ? res.chat : c));
            }
        } catch (err) {
            console.error('Unpin chat error:', err);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const reader = new FileReader();
            reader.onload = async () => {
                setSelectedFile({
                    fileUrl: reader.result,
                    fileName: file.name,
                    fileType: file.type,
                });
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error('File read error:', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!messageText.trim() && !selectedFile) || !selectedChat) return;

        const content = messageText;
        setMessageText('');

        const res = await chatApi.sendMessage(token, selectedChat.id, content, selectedFile);

        if (res.data) {
            sendMessage({
                id: res.data.id,
                content: res.data.content,
                chatId: selectedChat.id,
                userId: currentUser.id,
                userName: currentUser.name,
                fileUrl: res.data.fileUrl,
                fileName: res.data.fileName,
                fileType: res.data.fileType,
                createdAt: res.data.createdAt,
            });
            setSelectedFile(null);
        }
    };

    const handleEmojiClick = (emojiObject) => {
        if (selectedMessageForReaction) {
            // Reaction add karo
            chatApi.addReaction(token, selectedMessageForReaction.id, emojiObject.emoji)
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

    const handleDeleteClick = (message) => {
        setSelectedMessage(message);
        setDeleteModal(true);
    };

    const handleDeleteForEveryone = async () => {
        if (!selectedMessage) return;

        try {
            await chatApi.deleteMessage(token, selectedMessage.id);
            setMessages(prev => prev.filter(m => m.id !== selectedMessage.id));
            setDeleteModal(false);
            setSelectedMessage(null);
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const handleDeleteForMe = async () => {
        if (!selectedMessage) return;

        try {
            await chatApi.deleteMessage(token, selectedMessage.id, 'me');
            setMessages(prev =>
                prev.map(m =>
                    m.id === selectedMessage.id
                        ? { ...m, content: '[This message was deleted]', isDeleted: true }
                        : m
                )
            );
            setDeleteModal(false);
            setSelectedMessage(null);
        } catch (err) {
            console.error('Delete error:', err);
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
                        {chats.map(chat => {
                            const otherUser = chat.chatMembers?.find(m => m.user.id !== currentUser.id)?.user;
                            const getInitials = (name) => {
                                return name
                                    .split(' ')
                                    .map(word => word[0])
                                    .join('')
                                    .toUpperCase();
                            };

                            return (
                                <button
                                    key={chat.id}
                                    onClick={() => handleSelectChat(chat)}
                                    className={`w-full text-left px-4 py-3 border-b border-slate-100 transition flex items-center gap-3 group ${selectedChat?.id === chat.id
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-slate-700 hover:bg-slate-50'}`}>

                                    {otherUser?.profilePicture ? (
                                        <img
                                            src={otherUser.profilePicture}
                                            alt={otherUser.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                                            {otherUser ? getInitials(otherUser.name) : '?'}
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-sm">{getChatName(chat)}</p>
                                            {unreadCounts[chat.id] > 0 && (
                                                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {unreadCounts[chat.id]}
                                                </span>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    chat.isPinned ? handleUnpinChat(chat.id) : handlePinChat(chat.id);
                                                }}
                                                className="text-sm text-slate-400 hover:text-slate-600">
                                                {chat.isPinned ? '📌' : '📍'}
                                            </button>
                                        </div>
                                        {chat.messages?.length > 0 && (
                                            <p className="text-xs text-slate-500 truncate mt-0.5">
                                                {chat.messages[chat.messages.length - 1].content}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
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

                            const getInitials = (name) => {
                                return name
                                    .split(' ')
                                    .map(word => word[0])
                                    .join('')
                                    .toUpperCase();
                            };

                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2 group`}>
                                    {!isMe && (
                                        <div>
                                            {msg.user?.profilePicture ? (
                                                <img
                                                    src={msg.user.profilePicture}
                                                    alt={msg.user?.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                                                    {getInitials(msg.user?.name || msg.userName || 'U')}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className={`max-w-xs flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <p className="text-xs text-slate-500 mb-1">
                                            {isMe ? 'You' : (msg.user?.name || msg.userName)}
                                        </p>
                                        <div className="relative">
                                            {msg.content.includes('Meeting Link:') ? (
                                                <a
                                                    href={msg.content.split('https://')[1] ? `https://${msg.content.split('https://')[1]}` : '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`text-sm rounded-lg px-3 py-2 underline cursor-pointer inline-block font-semibold ${isMe ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                                                    📞 Click to join meeting
                                                </a>
                                            ) : (
                                                <p className={`text-sm rounded-lg px-3 py-2 ${msg.isDeleted ? 'bg-red-50 text-red-600 italic' : (isMe ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700')}`}>
                                                    {msg.content}
                                                </p>
                                            )}
                                            {msg.fileUrl && (
                                                <div className="mt-2">
                                                    {msg.fileType?.startsWith('image/') ? (
                                                        <img src={msg.fileUrl} alt={msg.fileName} className="max-w-xs rounded-lg" />
                                                    ) : msg.fileType?.startsWith('video/') ? (
                                                        <video src={msg.fileUrl} controls className="max-w-xs rounded-lg" />
                                                    ) : (
                                                        <a
                                                            href={msg.fileUrl}
                                                            download={msg.fileName}
                                                            className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg text-blue-600 hover:bg-blue-100">
                                                            📄 {msg.fileName}
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                            {msg.reactions && msg.reactions.length > 0 && (
                                                <div className="flex gap-1 mt-1 flex-wrap">
                                                    {Array.from(new Set(msg.reactions.map(r => r.emoji))).map((emoji) => (
                                                        <button
                                                            key={emoji}
                                                            onClick={() => {
                                                                setSelectedMessageForReaction(msg);
                                                                setShowEmojiPicker(true);
                                                            }}
                                                            className="text-sm hover:scale-125 cursor-pointer">
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 mt-1">
                                                <button
                                                    onClick={() => {
                                                        setSelectedMessageForReaction(msg);
                                                        setShowEmojiPicker(true);
                                                    }}
                                                    className="text-xs text-slate-400 hover:text-slate-600">
                                                    😊
                                                </button>
                                                {isMe && !msg.isDeleted && (
                                                    <button
                                                        onClick={() => handleDeleteClick(msg)}
                                                        className="opacity-0 group-hover:opacity-100 text-xs text-red-600 hover:text-red-700">
                                                        🗑️
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {typingUsers.length > 0 && (
                            <p className="text-xs text-slate-400 italic">
                                {typingUsers[0].userName} is typing...
                            </p>
                        )}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 flex gap-2 relative">
                        <button
                            type="button"
                            onClick={async () => {
                                const res = await chatApi.sendMeetingLink(token, selectedChat.id);
                                if (res.data) {
                                    sendMessage({
                                        id: res.data.id,
                                        content: res.data.content,
                                        chatId: selectedChat.id,
                                        userId: currentUser.id,
                                        userName: currentUser.name,
                                        createdAt: res.data.createdAt,
                                        user: {
                                            id: currentUser.id,
                                            name: currentUser.name,
                                        }
                                    });
                                }
                            }}
                            className="px-3 py-2 hover:bg-slate-100 rounded-lg cursor-pointer text-lg">
                            📞
                        </button>
                        <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <label className="px-3 py-2 hover:bg-slate-100 rounded-lg cursor-pointer">
                            📁
                            <input
                                type="file"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </label>
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
            {deleteModal && (
                <DeleteMessageModal
                    message={selectedMessage}
                    onDeleteForEveryone={handleDeleteForEveryone}
                    onDeleteForMe={handleDeleteForMe}
                    onCancel={() => {
                        setDeleteModal(false);
                        setSelectedMessage(null);
                    }}
                    loading={false}
                />
            )}
        </div>
    );
}