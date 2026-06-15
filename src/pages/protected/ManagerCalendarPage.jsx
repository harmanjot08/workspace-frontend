import { useState, useEffect } from 'react';
import ManagerLayout from '../../components/ManagerLayout';
import { calendarAPI } from '../../api/calendarApi.js';
import { Plus, Trash2, Pencil, Calendar } from 'lucide-react';

export default function ManagerCalendarPage() {
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
        attendees: [],
    });

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchEvents();
        fetchUsers();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await calendarAPI.getEvents(token);
            if (response.events) setEvents(response.events);
        } catch (err) {
            console.error('fetchEvents error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('https://workspace-backend-pyb2.onrender.com/api/users', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.users) setUsers(data.users);
        } catch (err) {
            console.error('fetchUsers error:', err);
        }
    };

    const handleCreateEvent = async () => {
        if (!form.title || !form.startTime || !form.endTime) return;

        const response = await calendarAPI.createEvent(token, {
            ...form,
            attendees: form.attendees.length > 0 ? form.attendees : undefined,
        });

        if (response.event) {
            setEvents(prev => [...prev, response.event]);
            resetForm();
            setShowModal(false);
        }
    };

    const handleUpdateEvent = async () => {
        if (!editingEvent) return;

        const response = await calendarAPI.updateEvent(token, editingEvent.id, {
            title: form.title,
            description: form.description,
            startTime: form.startTime,
            endTime: form.endTime,
            location: form.location,
        });

        if (response.event) {
            setEvents(prev => prev.map(e => e.id === editingEvent.id ? response.event : e));
            resetForm();
            setShowModal(false);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!confirm('Delete this event?')) return;
        await calendarAPI.deleteEvent(token, eventId);
        setEvents(prev => prev.filter(e => e.id !== eventId));
    };

    const resetForm = () => {
        setForm({
            title: '',
            description: '',
            startTime: '',
            endTime: '',
            location: '',
            attendees: [],
        });
        setEditingEvent(null);
    };

    const openEditModal = (event) => {
        setEditingEvent(event);
        setForm({
            title: event.title,
            description: event.description || '',
            startTime: event.startTime.split('.')[0],
            endTime: event.endTime.split('.')[0],
            location: event.location || '',
            attendees: event.attendees.map(a => a.userId),
        });
        setShowModal(true);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) return <ManagerLayout><div className="p-8">Loading...</div></ManagerLayout>;

    return (
        <ManagerLayout>
            <div>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Calendar</h1>
                        <p className="text-slate-600">Manage team events and meetings</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New Event
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 className="text-slate-500 text-sm mb-2">Total Events</h3>
                        <p className="text-3xl font-bold text-slate-900">{events.length}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 className="text-slate-500 text-sm mb-2">Upcoming</h3>
                        <p className="text-3xl font-bold text-blue-600">
                            {events.filter(e => new Date(e.startTime) > new Date()).length}
                        </p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 className="text-slate-500 text-sm mb-2">Past Events</h3>
                        <p className="text-3xl font-bold text-slate-400">
                            {events.filter(e => new Date(e.startTime) <= new Date()).length}
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Events</h2>
                    {events.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                            <p className="text-slate-500">No events yet. Create your first event!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {events.map(event => (
                                <div key={event.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900">{event.title}</h3>
                                            <p className="text-sm text-slate-600 mt-1">{formatDate(event.startTime)} - {formatDate(event.endTime)}</p>
                                            {event.location && <p className="text-sm text-slate-600">📍 {event.location}</p>}
                                            {event.description && <p className="text-sm text-slate-600 mt-1">{event.description}</p>}
                                            {event.attendees.length > 0 && (
                                                <div className="flex gap-2 mt-2">
                                                    {event.attendees.map(a => (
                                                        <span key={a.userId} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                            {a.user.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(event)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEvent(event.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">
                            {editingEvent ? 'Edit Event' : 'Create Event'}
                        </h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Event title*"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <textarea
                                placeholder="Description"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 h-20 resize-none"
                            />
                            <input
                                type="datetime-local"
                                value={form.startTime}
                                onChange={e => setForm({ ...form, startTime: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />

                            <input
                                type="datetime-local"
                                value={form.endTime}
                                onChange={e => setForm({ ...form, endTime: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                value={form.location}
                                onChange={e => setForm({ ...form, location: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <select
                                multiple
                                value={form.attendees}
                                onChange={e => setForm({ ...form, attendees: Array.from(e.target.selectedOptions, o => o.value) })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500">
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-3 justify-end mt-4">
                            <button
                                onClick={() => { resetForm(); setShowModal(false); }}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                                Cancel
                            </button>
                            <button
                                onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ManagerLayout>
    );
}