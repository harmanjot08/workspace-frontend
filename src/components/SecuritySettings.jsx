import { useState } from 'react';
import { Lock } from 'lucide-react';
export default function SecuritySettings() {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const validate = () => {
        const err = {};
        if (!passwordData.currentPassword) err.currentPassword = 'Required';
        if (!passwordData.newPassword) err.newPassword = 'Required';
        if (passwordData.newPassword.length < 6) err.newPassword = 'Min 6 characters';
        if (passwordData.newPassword !== passwordData.confirmPassword) err.confirmPassword = 'Passwords do not match';
        setErrors(err);
        return Object.keys(err).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 300));
        setSuccess('Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setLoading(false);
        setTimeout(() => setSuccess(''), 3000);
    };
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-red-600" />
                <h2 className="text-2xl font-bold text-slate-900">Security Settings</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">Current Password</label>
                    <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.currentPassword ? 'border-red-500' : 'border-slate-300'}`} />
                    {errors.currentPassword && <p className="text-red-600 text-xs mt-1">{errors.currentPassword}</p>}
                </div>
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">New Password</label>
                    <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.newPassword ? 'border-red-500' : 'border-slate-300'}`} />
                    {errors.newPassword && <p className="text-red-600 text-xs mt-1">{errors.newPassword}</p>}
                </div>
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">Confirm Password</label>
                    <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-300'}`} />
                    {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
                {success && <p className="text-green-600 text-sm">{success}</p>}
                <button
                    type="submit"
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
                    disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    );
}