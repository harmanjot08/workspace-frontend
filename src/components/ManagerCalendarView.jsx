import { ChevronLeft, ChevronRight } from 'lucide-react';
export default function ManagerCalendarView({ events, viewType, currentDate, onDateChange, onEventClick }) {
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const handlePrevMonth = () => {
        onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };
    const handleNextMonth = () => {
        onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };
    const getEventsForDate = (day) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(e => e.date === dateStr);
    };
    if (viewType === 'month') {
        return (
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
                                            onClick={() => onEventClick(event)}
                                            className="text-xs px-2 py-1 rounded text-white truncate hover:opacity-90"
                                            style={{ backgroundColor: event.color }}
                                            title={event.title}>
                                            {event.title}
                                        </div>
                                    ))}
                                    {dayEvents.length > 2 && (
                                        <p className="text-xs text-slate-600">+{dayEvents.length - 2} more</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
    if (viewType === 'week') {
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekDays = Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + i);
            return date;
        });
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Week of {weekStart.toLocaleDateString()}
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-lg">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-lg">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {weekDays.map(date => {
                        const dateStr = date.toISOString().split('T')[0];
                        const dayEvents = events.filter(e => e.date === dateStr);

                        return (
                            <div key={dateStr} className="border border-slate-200 rounded-lg p-3 min-h-96">
                                <p className="font-semibold text-slate-900 mb-3">
                                    {date.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </p>
                                <div className="space-y-2">
                                    {dayEvents.map(event => (
                                        <div
                                            key={event.id}
                                            onClick={() => onEventClick(event)}
                                            className="p-2 rounded text-white text-xs cursor-pointer hover:opacity-90"
                                            style={{ backgroundColor: event.color }}>
                                            <p className="font-semibold">{event.title}</p>
                                            {event.startTime && <p>{event.startTime}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
    if (viewType === 'day') {
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayEvents = events.filter(e => e.date === dateStr);
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {currentDate.toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-lg">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-lg">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="space-y-3">
                    {dayEvents.length === 0 ? (
                        <p className="text-slate-500">No events scheduled</p>
                    ) : (
                        dayEvents.map(event => (
                            <div
                                key={event.id}
                                onClick={() => onEventClick(event)}
                                className="border-l-4 p-4 rounded-lg cursor-pointer hover:shadow-md transition"
                                style={{ borderColor: event.color, backgroundColor: event.color + '10' }}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{event.title}</h3>
                                        <p className="text-sm text-slate-600">{event.description}</p>
                                        {event.startTime && <p className="text-xs text-slate-500 mt-2">{event.startTime} - {event.endTime}</p>}
                                        {event.type === 'task' && <p className="text-xs font-semibold text-slate-700 mt-2">Priority: {event.priority}</p>}
                                    </div>
                                    <span className="px-2 py-1 bg-slate-200 text-xs rounded font-semibold">
                                        {event.type}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }
}