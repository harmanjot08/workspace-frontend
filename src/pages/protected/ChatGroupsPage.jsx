import { useState } from 'react';
import ManagerLayout from '../../components/ManagerLayout';
import ChatList from '../../components/ChatList';
import ChatWindow from '../../components/ChatWindow';
import CreateGroupModal from '../../components/CreateGroupModal';
import { Plus, Send } from 'lucide-react';
const INITIAL_CHATS = [
  { id: 1, type: 'direct', name: 'Rohan', avatar: 'R', lastMessage: 'Thanks for the feedback', unread: 0 },
  { id: 2, type: 'direct', name: 'Akansha', avatar: 'A', lastMessage: 'Meeting at 3 PM', unread: 2 },
  { id: 3, type: 'group', name: 'Engineering Team', avatar: 'E', lastMessage: 'Sprint planning done', unread: 0 },
  { id: 4, type: 'group', name: 'Design Team', avatar: 'D', lastMessage: 'New mockups ready', unread: 1 },
];
const INITIAL_MESSAGES = {
    1: [
        { id: 1, sender: 'Rohan', message: 'Hi Manager', time: '10:00 AM', isSent: false },
        { id: 2, sender: 'You', message: 'Hello Rohan!', time: '10:05 AM', isSent: true },
        { id: 3, sender: 'Rohan', message: 'Thanks for the feedback', time: '10:10 AM', isSent: false },
    ],
    2: [
        { id: 1, sender: 'Akansha', message: 'When is the design review?', time: '2:00 PM', isSent: false },
        { id: 2, sender: 'You', message: 'Meeting at 3 PM', time: '2:05 PM', isSent: true },
        { id: 3, sender: 'Akansha', message: 'Got it!', time: '2:06 PM', isSent: false },
    ],
    3: [
        { id: 1, sender: 'Rohan', message: 'Sprint planning completed', time: '11:00 AM', isSent: false },
        { id: 2, sender: 'Vikram', message: 'All tasks assigned', time: '11:05 AM', isSent: false },
        { id: 3, sender: 'You', message: 'Great! Let us start coding', time: '11:10 AM', isSent: true },
    ],
    4: [
        { id: 1, sender: 'Akansha', message: 'Mockups are ready', time: '1:00 PM', isSent: false },
        { id: 2, sender: 'Priya', message: 'Looks amazing!', time: '1:05 PM', isSent: false },
    ],
};
export default function ChatGroupsPage() {
    const [chats, setChats] = useState(INITIAL_CHATS);
    const [selectedChat, setSelectedChat] = useState(INITIAL_CHATS[0]);
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [messageInput, setMessageInput] = useState('');
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedChat) return;
        const newMessage = {
            id: (messages[selectedChat.id]?.length || 0) + 1,
            sender: 'You',
            message: messageInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSent: true,
        };
        setMessages(prev => ({
            ...prev,
            [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage],
        }));
        setMessageInput('');
    };
    const handleCreateGroup = (groupData) => {
        const newGroup = {
            id: Math.max(...chats.map(c => c.id), 0) + 1,
            type: 'group',
            name: groupData.name,
            avatar: '👥',
            lastMessage: '',
            unread: 0,
        };
        setChats([...chats, newGroup]);
        setMessages(prev => ({ ...prev, [newGroup.id]: [] }));
        setSelectedChat(newGroup);
        setIsCreateGroupOpen(false);
    };
    const currentMessages = messages[selectedChat?.id] || [];
    return (
        <ManagerLayout>
            <div className="h-screen flex flex-col">
                <div className="mb-6">
                    <h1 className="text-4xl font-bold text-slate-900 mb-1">Chat Groups</h1>
                    <p className="text-slate-600">Connect with your team</p>
                </div>
                <div className="flex gap-6 flex-1 min-h-0">
                    <div className="w-72 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-200">
                            <button
                                onClick={() => setIsCreateGroupOpen(true)}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium text-sm">
                                <Plus className="w-4 h-4" />
                                New Group
                            </button>
                        </div>
                        <ChatList
                            chats={chats}
                            selectedChat={selectedChat}
                            onSelectChat={setSelectedChat} />
                    </div>
                    <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
                        {selectedChat && (
                            <>
                                <ChatWindow
                                    chat={selectedChat}
                                    messages={currentMessages} />
                                <form onSubmit={handleSendMessage} className="border-t border-slate-200 p-4 flex gap-3">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 px-4 py-2 bg-slate-100 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none" />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
                <CreateGroupModal
                    isOpen={isCreateGroupOpen}
                    onClose={() => setIsCreateGroupOpen(false)}
                    onSubmit={handleCreateGroup} />
            </div>
        </ManagerLayout>
    );
}