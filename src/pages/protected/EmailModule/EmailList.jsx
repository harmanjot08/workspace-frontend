export default function EmailList({ emails, selectedEmail, onSelectEmail, loading }) {
    return (
        <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
            {loading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : emails.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No emails</div>
            ) : (
                emails.map(email => (
                    <div
                        key={email.id}
                        onClick={() => onSelectEmail(email)}
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
    );
}