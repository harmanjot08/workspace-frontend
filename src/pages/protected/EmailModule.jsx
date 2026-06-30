import { useEffect, useState } from 'react';
import EmailCard from '../../components/email/EmailCard';
import {
    Mail,
    Pencil,
    Inbox,
    Send,
    FileText,
    Tag,
    Trash2,
    ShieldAlert,
    Star,
    ArrowLeft,
    Reply,
    Forward,
    Calendar,
    User,
    RotateCcw,
} from 'lucide-react';
import {
    getInboxEmails,
    getSentEmails,
    getDraftEmails,
    getPromotionEmails,
    getSpamEmails,
    getStarredEmails,
    getTrashEmails,
    getStarredEmailIds,
    toggleStarredEmail,
    moveToTrash,
    restoreEmail,
    sendEmail,
    getEmailById,
    saveDraft,
    deleteEmail,
    searchEmails,
} from '../../api/emailApi';

export function EmailDashboard() {
    const [activeTab, setActiveTab] = useState('inbox');
    const [emails, setEmails] = useState([]);
    const [showCompose, setShowCompose] = useState(false);
    const [starredIds, setStarredIds] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [showEmailView, setShowEmailView] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);

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
            } else if (activeTab === 'drafts') {
                response = await getDraftEmails();
            } else if (activeTab === 'promotions') {
                response = await getPromotionEmails();
            } else if (activeTab === 'spam') {
                response = await getSpamEmails();
            } else if (activeTab === 'starred') {
                response = await getStarredEmails();
            } else if (activeTab === 'trash') {
                response = await getTrashEmails();
            }

            setEmails(response.data || []);
        } catch (error) {
            console.error(error);
        }
    };



    const loadStarredIds = async () => {
        try {
            const response = await getStarredEmailIds();
            setStarredIds(response.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadEmails();
        loadStarredIds();
    }, [activeTab]);

    useEffect(() => {
        const trimmedQuery = searchQuery.trim();

        if (!trimmedQuery) {
            setSearchResults(null);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setSearchLoading(true);

                const response = await searchEmails(trimmedQuery);

                if (response.success) {
                    setSearchResults(response);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setSearchLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer);

    }, [searchQuery]);

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

    const handleToggleStar = async (emailId) => {
        try {
            await toggleStarredEmail(emailId);
            loadEmails();
        } catch (error) {
            console.error(error);
        }
    };

    const handleMoveToTrash = async (emailId) => {
        try {
            await moveToTrash(emailId);

            loadEmails();
        } catch (error) {
            console.error(error);
        }
    };

    const handleRestoreEmail = async (emailId) => {
        try {
            await restoreEmail(emailId);

            loadEmails();
        } catch (error) {
            console.error(error);
        }
    };

    const handlePermanentDelete = async (emailId) => {
        try {
            const confirmed = window.confirm(
                'Are you sure you want to permanently delete this email? This action cannot be undone.'
            );

            if (!confirmed) return;

            await deleteEmail(emailId);

            loadEmails();
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenEmail = async (emailId) => {
        try {
            const response = await getEmailById(emailId);

            setSelectedEmail(response.data);
            setShowEmailView(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleReply = () => {
        if (!selectedEmail) return;

        setForm({
            to: selectedEmail.fromUser?.email || '',
            subject: `Re: ${selectedEmail.subject || ''}`,
            body: '',
        });

        setShowEmailView(false);
        setShowCompose(true);
    };

    const handleForward = () => {
        if (!selectedEmail) return;

        setForm({
            to: '',
            subject: `Fwd: ${selectedEmail.subject || ''}`,
            body: `--- Forwarded Message ---

From: ${selectedEmail.fromUser?.email || ''}

Subject: ${selectedEmail.subject || ''}

Date: ${selectedEmail.createdAt
                    ? new Date(selectedEmail.createdAt).toLocaleString()
                    : ''
                }

${selectedEmail.body || ''}`,
        });

        setShowEmailView(false);
        setShowCompose(true);
    };

    const handleSaveDraft = async () => {
        try {
            await saveDraft(form);

            setShowCompose(false);

            setForm({
                to: '',
                subject: '',
                body: '',
            });

            if (activeTab === 'drafts') {
                loadEmails();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const renderSearchSection = (title, emails) => {
        if (!emails || emails.length === 0) return null;

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="text-lg font-semibold text-slate-800">
                        {title}
                    </h3>

                    <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700">
                        {emails.length}
                    </span>
                </div>

                <div className="space-y-4">
                    {emails.map((email) => (
                        <EmailCard
                            key={email.id}
                            email={email}
                            activeTab={title.toLowerCase()}
                            starredIds={starredIds}
                            loadStarredIds={loadStarredIds}
                            handleToggleStar={handleToggleStar}
                            handleMoveToTrash={handleMoveToTrash}
                            handleRestoreEmail={handleRestoreEmail}
                            handlePermanentDelete={handlePermanentDelete}
                            handleOpenEmail={handleOpenEmail}
                            setForm={setForm}
                            setShowCompose={setShowCompose}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="rounded-3xl bg-slate-50 p-6">
            <div className="mb-6 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 p-6 text-white shadow-lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-white/15 p-3 backdrop-blur">
                            <Mail className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold">
                                Emails
                            </h1>

                            <p className="text-sm text-violet-100">
                                Manage all your email conversations
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowCompose(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-violet-700 shadow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                    >
                        <Pencil className="h-4 w-4" />
                        Compose Email
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
            </div>

            <div className="mb-6 flex items-center gap-3 overflow-x-auto">
                <button
                    onClick={() => setActiveTab("inbox")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium transition-all duration-200 ${activeTab === "inbox"
                        ? "bg-violet-600 text-white shadow-lg"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                >
                    <Inbox className="h-4 w-4" />
                    Inbox
                </button>

                <button
                    onClick={() => setActiveTab("sent")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium transition-all duration-200 ${activeTab === "sent"
                        ? "bg-violet-600 text-white shadow-lg"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                >
                    <Send className="h-4 w-4" />
                    Sent
                </button>

                <button
                    onClick={() => setActiveTab("drafts")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium transition-all duration-200 ${activeTab === "drafts"
                        ? "bg-violet-600 text-white shadow-lg"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                >
                    <FileText className="h-4 w-4" />
                    Drafts
                </button>

                <button
                    onClick={() => setActiveTab("promotions")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium transition-all duration-200 ${activeTab === "promotions"
                        ? "bg-violet-600 text-white shadow-lg"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                >
                    <Tag className="h-4 w-4" />
                    Promotions
                </button>

                <button
                    onClick={() => setActiveTab("spam")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium transition-all duration-200 ${activeTab === "spam"
                        ? "bg-violet-600 text-white shadow-lg"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                >
                    <ShieldAlert className="h-4 w-4" />
                    Spam
                </button>

                <button
                    onClick={() => setActiveTab("starred")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium transition-all duration-200 ${activeTab === "starred"
                        ? "bg-violet-600 text-white shadow-lg"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                >
                    <Star className="h-4 w-4" />
                    Starred
                </button>

                <button
                    onClick={() => setActiveTab("trash")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium transition-all duration-200 ${activeTab === "trash"
                        ? "bg-violet-600 text-white shadow-lg"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                >
                    <Trash2 className="h-4 w-4" />
                    Trash
                </button>

            </div>

            {searchQuery.trim() && searchResults ? (

                <div className="space-y-8">

                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800">
                            Search Results
                        </h2>

                        <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700">
                            {searchResults.total} Results
                        </span>
                    </div>

                    {renderSearchSection('Inbox', searchResults.results.inbox)}
                    {renderSearchSection('Sent', searchResults.results.sent)}
                    {renderSearchSection('Drafts', searchResults.results.drafts)}
                    {renderSearchSection('Promotions', searchResults.results.promotions)}
                    {renderSearchSection('Spam', searchResults.results.spam)}
                    {renderSearchSection('Starred', searchResults.results.starred)}
                    {renderSearchSection('Trash', searchResults.results.trash)}

                </div>

            ) : (

                <div className="space-y-4">
                    {emails.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                            <Mail className="mx-auto h-12 w-12 text-slate-300" />

                            <h3 className="mt-4 text-lg font-semibold text-slate-800">
                                No emails found
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                Emails in this folder will appear here.
                            </p>
                        </div>
                    ) : (
                        emails.map((email) => (
                            <EmailCard
                                key={email.id}
                                email={email}
                                activeTab={activeTab}
                                starredIds={starredIds}
                                loadStarredIds={loadStarredIds}
                                handleToggleStar={handleToggleStar}
                                handleMoveToTrash={handleMoveToTrash}
                                handleRestoreEmail={handleRestoreEmail}
                                handlePermanentDelete={handlePermanentDelete}
                                handleOpenEmail={handleOpenEmail}
                                setForm={setForm}
                                setShowCompose={setShowCompose}
                            />
                        ))
                    )}
                </div>
            )}

            {showEmailView && selectedEmail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col">

                        <div className="border-b border-slate-200 px-6 py-4">
                            <div className="flex items-center justify-between">

                                <button
                                    onClick={() => {
                                        setShowEmailView(false);
                                        setSelectedEmail(null);
                                    }}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 hover:bg-slate-50"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back
                                </button>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleReply}
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 hover:bg-slate-50"
                                    >
                                        <Reply className="h-4 w-4" />
                                        Reply
                                    </button>

                                    <button
                                        onClick={handleForward}
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 hover:bg-slate-50"
                                    >
                                        <Forward className="h-4 w-4" />
                                        Forward
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8">

                            <h2 className="mb-6 text-3xl font-bold text-slate-900">
                                {selectedEmail.subject || "No Subject"}
                            </h2>

                            <div className="mb-6 rounded-2xl bg-slate-50 p-5">

                                <div className="flex items-center gap-3 mb-3">
                                    <User className="h-5 w-5 text-slate-500" />
                                    <span className="font-medium">
                                        {selectedEmail.fromUser?.name || "Unknown"}
                                    </span>
                                </div>

                                <div className="mb-2 text-sm text-slate-600">
                                    <strong>From:</strong>{" "}
                                    {selectedEmail.fromUser?.email || "-"}
                                </div>

                                <div className="mb-2 text-sm text-slate-600">
                                    <strong>To:</strong>{" "}
                                    {selectedEmail.recipients?.[0]?.recipientEmail || "-"}
                                </div>

                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Calendar className="h-4 w-4" />
                                    {selectedEmail.createdAt
                                        ? new Date(selectedEmail.createdAt).toLocaleString()
                                        : "-"}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 p-6">
                                <p className="whitespace-pre-wrap text-slate-700 leading-7">
                                    {selectedEmail.body}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {showCompose && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col">
                        <div className="border-b border-slate-200 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-violet-100 p-2">
                                    <Pencil className="h-5 w-5 text-violet-600" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Compose Email
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Create and send a new email
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">

                            <input
                                placeholder="To"
                                value={form.to}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        to: e.target.value,
                                    })
                                }
                                className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
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
                                className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
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
                                className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:border-violet-500 focus:ring-4 focus:ring-violet-100 resize-none"
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowCompose(false)}
                                    className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSaveDraft}
                                    className="rounded-xl border border-violet-300 px-5 py-2.5 font-medium text-violet-700 transition hover:bg-violet-50"
                                >
                                    Save Draft
                                </button>

                                <button
                                    onClick={handleSend}
                                    className="rounded-xl bg-violet-600 px-5 py-2.5 font-medium text-white shadow-lg transition hover:bg-violet-700"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}