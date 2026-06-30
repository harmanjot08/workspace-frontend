import { Mail, Star, Trash2, RotateCcw } from 'lucide-react';

export default function EmailCard({
    email,
    activeTab,
    starredIds,
    loadStarredIds,
    handleToggleStar,
    handleMoveToTrash,
    handleRestoreEmail,
    handlePermanentDelete,
    handleOpenEmail,
    setForm,
    setShowCompose,
}) {
    return (
        <div
            onClick={() => {
                if (activeTab === 'drafts') {
                    setForm({
                        to: email.recipients?.[0]?.recipientEmail || '',
                        subject: email.subject || '',
                        body: email.body || '',
                    });

                    setShowCompose(true);
                } else {
                    handleOpenEmail(email.id);
                }
            }}
            className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600">
                        <Mail className="h-5 w-5 text-white" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold text-slate-900">
                            {email.subject || 'No Subject'}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                            {email.body}
                        </p>
                    </div>
                </div>

                <button
                    onClick={async (e) => {
                        e.stopPropagation();

                        await handleToggleStar(email.id);
                        loadStarredIds();
                    }}
                    className="rounded-lg p-2 transition hover:bg-slate-100"
                >
                    <Star
                        className={`h-5 w-5 transition-colors ${starredIds.includes(email.id)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-400 hover:text-yellow-500'
                            }`}
                    />
                </button>

                {activeTab === 'trash' ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                await handleRestoreEmail(email.id);
                            }}
                            className="rounded-lg p-2 transition hover:bg-green-50"
                            title="Restore"
                        >
                            <RotateCcw className="h-5 w-5 text-slate-400 transition-colors hover:text-green-600" />
                        </button>

                        <button
                            onClick={async (e) => {
                                e.stopPropagation();

                                const confirmed = window.confirm(
                                    'Are you sure you want to permanently delete this email? This action cannot be undone.'
                                );

                                if (!confirmed) return;

                                await handlePermanentDelete(email.id);
                            }}
                            className="rounded-lg p-2 transition hover:bg-red-50"
                            title="Delete Permanently"
                        >
                            <Trash2 className="h-5 w-5 text-red-500 transition-colors hover:text-red-700" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={async (e) => {
                            e.stopPropagation();

                            await handleMoveToTrash(email.id);
                        }}
                        className="rounded-lg p-2 transition hover:bg-red-50"
                        title="Move to Trash"
                    >
                        <Trash2 className="h-5 w-5 text-slate-400 transition-colors hover:text-red-600" />
                    </button>
                )}
            </div>
        </div>
    );
}