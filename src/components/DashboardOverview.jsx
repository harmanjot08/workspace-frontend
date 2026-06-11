import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';

export default function DashboardOverview({ tasks, meetings, userName }) {
    const user = userName || JSON.parse(localStorage.getItem('user'))?.name || 'User';

    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(t => t.status !== 'done').length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const upcomingMeetings = meetings.length;

    return (
        <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-1">Welcome back, {user}!</h1>
            <p className="text-slate-600 mb-8">Here's what's happening in your workspace</p>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-600 text-sm">Total Tasks</p>
                            <p className="text-3xl font-bold text-slate-900">{totalTasks}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-600 text-sm">Pending</p>
                            <p className="text-3xl font-bold text-orange-600">{pendingTasks}</p>
                        </div>
                        <Clock className="w-8 h-8 text-orange-600" />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-600 text-sm">Completed</p>
                            <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-green-600" />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-600 text-sm">Upcoming Meetings</p>
                            <p className="text-3xl font-bold text-purple-600">{upcomingMeetings}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-purple-600" />
                    </div>
                </div>
            </div>

            {/* Upcoming Meetings */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Upcoming Meetings</h2>
                <div className="space-y-3">
                    {meetings.slice(0, 3).map(meeting => (
                        <div key={meeting.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                            <div>
                                <p className="font-semibold text-slate-900">{meeting.title}</p>
                                <p className="text-sm text-slate-600">{meeting.date} at {meeting.time}</p>
                            </div>
                            <a
                                href={meeting.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                            >
                                Join
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}