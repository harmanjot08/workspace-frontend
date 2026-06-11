import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { calendarAPI } from '../api/calendarApi.js';

export default function UserCalendarPage() {
    const [events, setEvents] = useState([]);
    const [viewType, setViewType] = useState('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await calendarAPI.getUserEvents(token);
            if (response.events) {
                setEvents(response.events);
            }
        } catch (err) {
            console.error('fetchEvents error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const getEventsForDate = (day) => {
        return events.filter(e => {
            const eventDate = new Date(e.startTime);
            return eventDate.getDate() === day &&
                eventDate.getMonth() === currentDate.getMonth() &&
                eventDate.getFullYear() === currentDate.getFullYear();
        });
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-1">My Calendar</h1>
            <p className="text-slate-600 mb-8">View your events and meetings</p>

            <div className="flex gap-2 mb-6">
                {['month'].map(view => (
                    <button
                        key={view}
                        onClick={() => setViewType(view)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${viewType === view
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}>
                        {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                ))}
            </div>

            {viewType === 'month' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">{monthName}</h2>
                        <div className="flex gap-2">
                            <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-lg">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-lg">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center font-semibold text-slate-600 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square" />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dayEvents = getEventsForDate(day);
                            return (
                                <div
                                    key={day}
                                    className="aspect-square border border-slate-200 rounded-lg p-2 hover:bg-slate-50 cursor-pointer">
                                    <p className="text-sm font-semibold text-slate-900 mb-1">{day}</p>
                                    <div className="space-y-1">
                                        {dayEvents.slice(0, 2).map(event => (
                                            <div
                                                key={event.id}
                                                className="text-xs px-2 py-1 rounded text-white truncate bg-blue-600"
                                                title={event.title}>
                                                {event.title}
                                            </div>
                                        ))}
                                        {dayEvents.length > 2 && (
                                            <p className="text-xs text-slate-600">+{dayEvents.length - 2}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {events.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Upcoming Events</h3>
                            <div className="space-y-2">
                                {events.slice(0, 5).map(event => (
                                    <div key={event.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                        <p className="font-semibold text-slate-900">{event.title}</p>
                                        <p className="text-sm text-slate-600">
                                            {new Date(event.startTime).toLocaleDateString()} - {new Date(event.startTime).toLocaleTimeString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}