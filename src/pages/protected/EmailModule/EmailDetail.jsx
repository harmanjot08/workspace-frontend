import { Trash2 } from 'lucide-react';

export default function EmailDetail({ email, onDelete }) {
    return (
        <div className="flex-1 bg-white overflow-y-auto">
            <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {email.subject}
                        </h2>
                        <p className="text-gray-600 mt-1">
                            From: {email.fromUser?.email}
                        </p>
                        <p className="text-sm text-gray-500">
                            {new Date(email.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={onDelete}
                        className="text-red-600 hover:bg-red-50 p-2 rounded">
                        <Trash2 size={20} />
                    </button>
                </div>

                <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">
                        {email.body}
                    </p>
                </div>
            </div>
        </div>
    );
}