import { useState, useEffect } from 'react';
import { chatAPI } from '../../api/chatApi.js';
import {
    initSocket, joinChat, sendMessage,
    onReceiveMessage, onUserTyping, onUserStoppedTyping
} from '../../services/socketService.js';


export default function ManagerChatPage() {
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [showNewChat, setShowNewChat] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);

    const token = localStorage.getItem('accessToken');
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const socket = initSocket(token);

        fetchChats();
        fetchUsers();

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

            /// Unread badge
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
        onUserTyping((data) => {
            setTypingUsers(prev => {
                if (prev.find(u => u.userId === data.userId)) return prev;
                return [...prev, data];
            });
        });

        onUserStoppedTyping((data) => {
            setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
        });

        // restore selected chat on refresh
        const savedChat = localStorage.getItem('selectedChat');
        if (savedChat) {
            const chat = JSON.parse(savedChat);
            handleSelectChat(chat);
        }
    }, []);

    const fetchChats = async () => {
        try {
            setLoading(true);
            const response = await chatAPI.getAllChats(token);
            if (response.chats) {
                setChats(response.chats);
                // auto join all rooms
                response.chats.forEach(chat => joinChat(chat.id));
            }
        } catch (err) {
            console.error('fetchChats error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await chatAPI.getUsers(token);
            if (response.users) setUsers(response.users);
        } catch (err) {
            console.error('fetchUsers error:', err);
        }
    };

    const getChatName = (chat) => {
        if (!chat) return '';
        if (chat.isGroup) return chat.name || 'Group Chat';
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
        } catch (err) {
            console.error('handleSelectChat error:', err);
        }
    };

    const handleCreateChat = async (otherUserId) => {
        try {
            const response = await chatAPI.createChat(token, {
                memberIds: [otherUserId],
                isGroup: false,
            });
            if (response.chat) {
                setShowNewChat(false);
                await fetchChats();
                handleSelectChat(response.chat);
            }
        } catch (err) {
            console.error('handleCreateChat error:', err);
        }
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim() || selectedMembers.length === 0) {
            alert('Group name and members required');
            return;
        }
        try {
            const response = await chatAPI.createChat(token, {
                memberIds: selectedMembers,
                isGroup: true,
                chatName: groupName,
            });
            if (response.chat) {
                setShowGroupModal(false);
                setGroupName('');
                setSelectedMembers([]);
                setChats(prev => [...prev, response.chat]);
                await fetchChats();
                handleSelectChat(response.chat);
            }
        } catch (err) {
            console.error('handleCreateGroup error:', err);
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
                id: res.data.id,  // real DB id
                content: res.data.content,
                chatId: selectedChat.id,
                userId: currentUser.id,
                userName: currentUser.name,
                createdAt: res.data.createdAt,
            });
        }
    };

    if (loading) return <div className="p-8">Loading chats...</div>;

    return (
        <div className="flex h-screen bg-slate-100">
            {/* Chat list */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-4 flex justify-between items-center border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900">Chats</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowNewChat(!showNewChat)}
                            className="text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600">
                            + New
                        </button>
                        <button
                            onClick={() => setShowGroupModal(true)}
                            className="text-sm bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600">
                            + Group
                        </button>
                    </div>
                </div>

                {/* New chat user list */}
                {showNewChat && (
                    <div className="border-b border-slate-200 bg-slate-50">
                        <p className="text-xs text-slate-500 px-3 pt-2 pb-1 font-semibold">Start chat with:</p>
                        {users.length === 0 && (
                            <p className="text-xs text-slate-400 px-3 pb-2">No users found</p>
                        )}
                        {users
                            .filter(u => u.id !== currentUser.id)
                            .map(user => (
                                <button
                                    key={user.id}
                                    onClick={() => handleCreateChat(user.id)}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 text-slate-700">
                                    {user.name} <span className="text-xs text-slate-400">({user.role})</span>
                                </button>
                            ))}
                    </div>
                )}

                {/* Chats list */}
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
            </div>

            {/* Chat window */}
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
                                    <div className={`max-w-xs ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                        <p className="text-xs text-slate-500 mb-1">
                                            {isMe ? 'You' : (msg.user?.name || msg.userName)}
                                        </p>
                                        <p className={`text-sm rounded-lg px-3 py-2 ${isMe
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-slate-100 text-slate-700'}`}>
                                            {msg.content}
                                        </p>
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

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 flex gap-2">
                        <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                            Send
                        </button>
                    </form>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500">
                    Select a chat to start messaging
                </div>
            )}

            {/* Create Group Modal */}
            {showGroupModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Create Group</h3>
                        <input
                            type="text"
                            placeholder="Group name*"
                            value={groupName}
                            onChange={e => setGroupName(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
                        />
                        <p className="text-sm text-slate-600 mb-2">Select members:</p>
                        <div className="border border-slate-300 rounded-lg p-3 max-h-48 overflow-y-auto mb-4">
                            {users
                                .filter(u => u.id !== currentUser.id)
                                .map(user => (
                                    <label key={user.id} className="flex items-center gap-2 mb-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedMembers.includes(user.id)}
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    setSelectedMembers([...selectedMembers, user.id]);
                                                } else {
                                                    setSelectedMembers(selectedMembers.filter(id => id !== user.id));
                                                }
                                            }}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm text-slate-700">{user.name}</span>
                                    </label>
                                ))}
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowGroupModal(false);
                                    setGroupName('');
                                    setSelectedMembers([]);
                                }}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateGroup}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                Create Group
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}