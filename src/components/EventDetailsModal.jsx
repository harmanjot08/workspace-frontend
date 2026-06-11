import { X, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { useState } from 'react';
export default function EventDetailsModal({ isOpen, onClose, event, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(event || {});
    if (!isOpen || !event) return null;
    const handleSave = () => {
        onEdit(editData);
        setIsEditing(false);
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 truncate">{event.title}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {!isEditing ? (
                    <>
                        <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                            <div>
                                <p className="text-slate-600 text-sm">Type</p>
                                <span className="px-3 py-1 bg-slate-200 text-xs rounded-full font-semibold inline-block mt-1">
                                    {event.type}
                                </span>
                            </div>
                            <div>
                                <p className="text-slate-600 text-sm">Description</p>
                                <p className="text-slate-900 font-medium">{event.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-slate-600 text-sm">Date</p>
                                    <p className="text-slate-900 font-medium">{event.date}</p>
                                </div>
                                {event.startTime && (
                                    <div>
                                        <p className="text-slate-600 text-sm">Time</p>
                                        <p className="text-slate-900 font-medium">{event.startTime} - {event.endTime}</p>
                                    </div>
                                )}
                            </div>
                            {event.type === 'event' && event.invitees && (
                                <div>
                                    <p className="text-slate-600 text-sm">Invitees</p>
                                    <p className="text-slate-900 font-medium">{typeof event.invitees === 'string' ? event.invitees : event.invitees.join(', ')}</p>
                                </div>
                            )}

                            {event.type === 'meeting' && event.meetingLink && (
                                <div>
                                    <p className="text-slate-600 text-sm">Meeting Link</p>
                                    <a
                                        href={event.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center gap-2 font-medium text-sm">
                                        Join Meeting
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            )}
                            {event.type === 'task' && (
                                <>
                                    <div>
                                        <p className="text-slate-600 text-sm">Priority</p>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block mt-1 ${event.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {event.priority}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-slate-600 text-sm">Assigned To</p>
                                        <p className="text-slate-900 font-medium">{event.assignee}</p>
                                    </div>
                                </>
                            )}
                            <div>
                                <p className="text-slate-600 text-sm">Reminder</p>
                                <p className="text-slate-900 font-medium">{event.reminder}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium text-sm">
                                <Edit2 className="w-4 h-4" />
                                Edit
                            </button>
                            <button
                                onClick={() => { onDelete(event.id); onClose(); }}
                                className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2 font-medium text-sm">
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="space-y-3 mb-6">
                            <input
                                type="text"
                                value={editData.title}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-100 rounded-lg border border-slate-300 font-semibold" />
                            <textarea
                                value={editData.description}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                rows="2"
                                className="w-full px-4 py-2 bg-slate-100 rounded-lg border border-slate-300 resize-none" />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                                Save
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}