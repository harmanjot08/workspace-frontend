import { useState, useEffect } from 'react';
import { Mail, Send, Trash2, Plus, X } from 'lucide-react';
import { emailApi } from '../../api/emailApi.js';

export default function EmailPage() {
    const [emails, setEmails] = useState([]);
    const [activeFolder, setActiveFolder] = useState('inbox');
    const [showCompose, setShowCompose] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchEmails();
    }, [activeFolder]);

    const fetchEmails = async () => {
        try {
            setLoading(true);
            let response;
            if (activeFolder === 'inbox') {
                response = await emailApi.getInbox(token);
            } else if (activeFolder === 'sent') {
                response = await emailApi.getSentEmails(token);
            } else if (activeFolder === 'drafts') {
                response = await emailApi.getDrafts(token);
            }
            setEmails(response.data || []);
        } catch (error) {
            console.error('Fetch emails error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-8">
                    <Mail size={28} className="text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-900">Email</h1>
                </div>

                <button
                    onClick={() => setShowCompose(true)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 mb-6 hover:bg-blue-700">
                    <Plus size={20} />
                    Compose
                </button>

                <nav className="space-y-2">
                    {['inbox', 'sent', 'drafts'].map(folder => (
                        <button
                            key={folder}
                            onClick={() => {
                                setActiveFolder(folder);
                                setSelectedEmail(null);
                            }}
                            className={`w-full text-left px-4 py-2 rounded-lg capitalize font-medium transition ${activeFolder === folder
                                ? 'bg-blue-100 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}>
                            {folder}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
                {/* Email List */}
                <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Loading...</div>
                    ) : emails.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No emails</div>
                    ) : (
                        emails.map(email => (
                            <div
                                key={email.id}
                                onClick={() => setSelectedEmail(email)}
                                className={`border-b border-gray-200 p-4 cursor-pointer transition ${selectedEmail?.id === email.id
                                    ? 'bg-blue-50'
                                    : 'hover:bg-gray-50'
                                    }`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">
                                            {email.fromUser?.name || 'Unknown'}
                                        </p>
                                        <p className="text-sm text-gray-600 truncate">
                                            {email.subject}
                                        </p>
                                    </div>
                                    {!email.isRead && (
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(email.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                {/* Email Detail */}
                {selectedEmail ? (
                    <div className="flex-1 bg-white overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {selectedEmail.subject}
                                    </h2>
                                    <p className="text-gray-600 mt-1">
                                        From: {selectedEmail.fromUser?.email}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(selectedEmail.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={async () => {
                                        await emailApi.deleteEmail(token, selectedEmail.id);
                                        setSelectedEmail(null);
                                        fetchEmails();
                                    }}
                                    className="text-red-600 hover:bg-red-50 p-2 rounded">
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <div className="prose max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {selectedEmail.body}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 bg-gray-50 flex items-center justify-center">
                        <p className="text-gray-500">Select an email to read</p>
                    </div>
                )}
            </div>

            {/* Compose Modal */}
            {showCompose && (
                <ComposeModal
                    onClose={() => setShowCompose(false)}
                    onSent={() => {
                        setShowCompose(false);
                        fetchEmails();
                    }}
                />
            )}
        </div>
    );
}

function ComposeModal({ onClose, onSent }) {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('accessToken');

    const handleSend = async () => {
        if (!to || !subject || !body) {
            alert('All fields required');
            return;
        }

        try {
            setLoading(true);
            await emailApi.sendEmail(token, { to, subject, body });
            alert('Email sent!');
            onSent();
        } catch (error) {
            console.error('Send error:', error);
            alert('Failed to send email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">New Email</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            To:
                        </label>
                        <input
                            type="email"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            placeholder="recipient@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subject:
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Email subject"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Message:
                        </label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Type your message..."
                            rows="10"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Cancel
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50">
                            <Send size={18} />
                            {loading ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}