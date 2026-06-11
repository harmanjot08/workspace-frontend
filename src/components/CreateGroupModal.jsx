import { useState } from 'react';
import { X } from 'lucide-react';
const TEAM_MEMBERS = ['Rohan', 'Akansha', 'Priya', 'Vikram', 'John'];
export default function CreateGroupModal({ isOpen, onClose, onSubmit }) {
    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [error, setError] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!groupName.trim()) {
            setError('Group name required');
            return;
        }
        if (selectedMembers.length === 0) {
            setError('Select at least one member');
            return;
        }
        onSubmit({ name: groupName, members: selectedMembers });
        setGroupName('');
        setSelectedMembers([]);
        setError('');
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Create Group</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Group Name</label>
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => { setGroupName(e.target.value); setError(''); }}
                            placeholder="e.g., Engineering Team"
                            className="w-full px-4 py-2 bg-slate-100 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-3">Members</label>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {TEAM_MEMBERS.map(member => (
                                <label key={member} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedMembers.includes(member)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedMembers([...selectedMembers, member]);
                                            } else {
                                                setSelectedMembers(selectedMembers.filter(m => m !== member));
                                            }
                                            setError('');
                                        }}
                                        className="w-4 h-4 rounded border-slate-300" />
                                    <span className="text-sm text-slate-900">{member}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}