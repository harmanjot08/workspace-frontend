import { useEffect, useState } from 'react';
import {
    getInboxEmails,
    getSentEmails,
    getDraftEmails,
    sendEmail,
} from '../../api/emailApi';

export function EmailDashboard() {
    const [activeTab, setActiveTab] = useState('inbox');
    const [emails, setEmails] = useState([]);
    const [showCompose, setShowCompose] = useState(false);

    const [form, setForm] = useState({
        to: '',
        subject: '',
        body: '',
    });

    const loadEmails = async () => {
        try {
            let response;

            if (activeTab === 'inbox') {
                response = await getInboxEmails();
            } else if (activeTab === 'sent') {
                response = await getSentEmails();
            } else {
                response = await getDraftEmails();
            }

            setEmails(response.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadEmails();
    }, [activeTab]);

    const handleSend = async () => {
        try {
            await sendEmail(form);

            setForm({
                to: '',
                subject: '',
                body: '',
            });

            setShowCompose(false);

            loadEmails();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Emails</h1>

                <button
                    onClick={() => setShowCompose(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                    Compose
                </button>
            </div>

            <div className="flex gap-6 mb-6">
                <button onClick={() => setActiveTab('inbox')}>
                    Inbox
                </button>

                <button onClick={() => setActiveTab('sent')}>
                    Sent
                </button>

                <button onClick={() => setActiveTab('drafts')}>
                    Drafts
                </button>
            </div>

            <div className="space-y-3">
                {emails.map((email) => (
                    <div
                        key={email.id}
                        className="border rounded-lg p-4"
                    >
                        <h3 className="font-semibold">
                            {email.subject}
                        </h3>

                        <p className="text-sm text-slate-600">
                            {email.body}
                        </p>
                    </div>
                ))}
            </div>

            {showCompose && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-[600px]">
                        <h2 className="text-xl font-bold mb-4">
                            Compose Email
                        </h2>

                        <input
                            placeholder="To"
                            value={form.to}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    to: e.target.value,
                                })
                            }
                            className="w-full border p-3 rounded mb-3"
                        />

                        <input
                            placeholder="Subject"
                            value={form.subject}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    subject: e.target.value,
                                })
                            }
                            className="w-full border p-3 rounded mb-3"
                        />

                        <textarea
                            rows="8"
                            placeholder="Message"
                            value={form.body}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    body: e.target.value,
                                })
                            }
                            className="w-full border p-3 rounded mb-4"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowCompose(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSend}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}