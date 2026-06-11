import { useState } from 'react';
import { X } from 'lucide-react';
const CONFIG = {
    types: ['event', 'meeting', 'task'],
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
    priorities: ['low', 'medium', 'high'],
    reminders: ['15 min', '30 min', '1 hour', '1 day'],
    members: ['Rohan', 'Akansha', 'Priya', 'Vikram', 'John'],
};
const FIELD_CONFIG = {
    title: { type: 'text', label: 'Title', required: true },
    description: { type: 'textarea', label: 'Description', rows: 2 },
    date: { type: 'date', label: 'Date', required: true },
    startTime: { type: 'time', label: 'Start Time' },
    endTime: { type: 'time', label: 'End Time' },
    invitees: { type: 'select-multi', label: 'Invitees', options: CONFIG.members },
    meetingLink: { type: 'url', label: 'Meeting Link', required: true, when: 'meeting' },
    assignee: { type: 'select', label: 'Assignee', options: CONFIG.members, required: true, when: 'task' },
    priority: { type: 'select', label: 'Priority', options: CONFIG.priorities, when: 'task', default: 'medium' },
    reminder: { type: 'select', label: 'Reminder', options: CONFIG.reminders, default: '30 min' },
};
export default function CreateCalendarEventModal({ isOpen, onClose, onSubmit }) {
    const [eventType, setEventType] = useState('event');
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', startTime: '', endTime: '', color: '#3b82f6',
        invitees: '', meetingLink: '', priority: 'medium', assignee: '', reminder: '30 min',
    });
    const [errors, setErrors] = useState({});
    const validate = () => {
        const err = {};
        Object.entries(FIELD_CONFIG).forEach(([key, config]) => {
            if (config.required && (!formData[key]?.trim())) {
                if (!config.when || config.when === eventType) err[key] = `${config.label} required`;
            }
        });
        setErrors(err);
        return Object.keys(err).length === 0;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit({ ...formData, type: eventType });
        setFormData({
            title: '', description: '', date: '', startTime: '', endTime: '', color: '#3b82f6',
            invitees: '', meetingLink: '', priority: 'medium', assignee: '', reminder: '30 min',
        });
        onClose();
    };
    const shouldShowField = (key) => {
        const config = FIELD_CONFIG[key];
        return !config.when || config.when === eventType;
    };
    const renderField = (key, config) => {
        if (!shouldShowField(key)) return null;
        const value = formData[key];
        const error = errors[key];
        if (config.type === 'text' || config.type === 'url') {
            return (
                <div key={key}>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">{config.label}</label>
                    <input
                        type={config.type === 'url' ? 'url' : 'text'}
                        value={value}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        placeholder={config.type === 'url' ? 'https://zoom.us/j/123456' : ''}
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${error ? 'border-red-500' : 'border-slate-300'}`} />
                    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
                </div>
            );
        }
        if (config.type === 'textarea') {
            return (
                <div key={key}>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">{config.label}</label>
                    <textarea
                        value={value}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        rows={config.rows}
                        className="w-full px-4 py-2 bg-slate-100 rounded-lg border border-slate-300 resize-none" />
                </div>
            );
        }
        if (config.type === 'date' || config.type === 'time') {
            return (
                <div key={key}>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">{config.label}</label>
                    <input
                        type={config.type}
                        value={value}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${error ? 'border-red-500' : 'border-slate-300'}`} />
                    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
                </div>
            );
        }
        if (config.type === 'select' || config.type === 'select-multi') {
            return (
                <div key={key}>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">{config.label}</label>
                    <select
                        multiple={config.type === 'select-multi'}
                        value={config.type === 'select-multi' ? (value ? value.split(',') : []) : value}
                        onChange={(e) => {
                            if (config.type === 'select-multi') {
                                setFormData({ ...formData, [key]: Array.from(e.target.selectedOptions, opt => opt.value).join(',') });
                            } else {
                                setFormData({ ...formData, [key]: e.target.value });
                            }
                        }}
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${error ? 'border-red-500' : 'border-slate-300'}`}>
                        {!config.options?.includes('') && <option value="">Select {config.label.toLowerCase()}</option>}
                        {config.options?.map(opt => (
                            <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                        ))}
                    </select>
                    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
                </div>
            );
        }
        return null;
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Create {eventType.charAt(0).toUpperCase() + eventType.slice(1)}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Type Selection */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Type</label>
                        <div className="flex gap-2">
                            {CONFIG.types.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setEventType(type)}
                                    className={`flex-1 py-2 rounded-lg font-medium transition ${eventType === type
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                        }`}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    {Object.entries(FIELD_CONFIG).map(([key, config]) => renderField(key, config))}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Color</label>
                        <div className="flex gap-2">
                            {CONFIG.colors.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`w-8 h-8 rounded-lg border-2 ${formData.color === color ? 'border-slate-900' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }} />
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}