import { useState, useEffect } from 'react';
import { Mail, Plus } from 'lucide-react';
import EmailList from './EmailList';
import EmailCompose from './EmailCompose';
import EmailDetail from './EmailDetail';

export default function EmailDashboard() {
    const [emails, setEmails] = useState([]);
    const [activeFolder, setActiveFolder] = useState('inbox');
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [showCompose, setShowCompose] = useState(false);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchEmails();
    }, [activeFolder]);

    const fetchEmails = async () => {
        try {
            setLoading(true);
            // API calls here
        } catch (error) {
            console.error('Fetch error:', error);
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
                <EmailList
                    emails={emails}
                    selectedEmail={selectedEmail}
                    onSelectEmail={setSelectedEmail}
                    loading={loading}
                />

                {selectedEmail ? (
                    <EmailDetail
                        email={selectedEmail}
                        onDelete={() => {
                            setSelectedEmail(null);
                            fetchEmails();
                        }}
                    />
                ) : (
                    <div className="flex-1 bg-gray-50 flex items-center justify-center">
                        <p className="text-gray-500">Select an email to read</p>
                    </div>
                )}
            </div>

            {/* Compose Modal */}
            {showCompose && (
                <EmailCompose
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