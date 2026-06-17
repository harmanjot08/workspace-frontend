import { useState } from 'react';
import { User, Camera } from 'lucide-react';
import { userApi } from '../../api/userApi.js';
export default function ManagerProfile({ data, onSave }) {
    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [profilePicture, setProfilePicture] = useState(data.profilePicture || null);
    const [uploading, setUploading] = useState(false);
    const token = localStorage.getItem('accessToken');

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64 = event.target.result;
            setUploading(true);
            try {
                const res = await userApi.uploadProfilePicture(token, base64);
                if (res.user) {
                    setProfilePicture(base64);
                    setFormData({ ...formData, profilePicture: base64 });
                }
            } catch (err) {
                console.error('Upload error:', err);
            } finally {
                setUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };
    const validate = () => {
        const err = {};
        if (!formData.name.trim()) err.name = 'Name is required';
        if (!formData.email.trim()) err.email = 'Email is required';
        if (!formData.jobTitle.trim()) err.jobTitle = 'Job title is required';
        setErrors(err);
        return Object.keys(err).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 300));
        onSave(formData);
        setLoading(false);
    };
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-green-600" />
                <h2 className="text-2xl font-bold text-slate-900">Manager Profile</h2>
            </div>

            <div className="mb-6 flex items-center gap-4">
                {profilePicture ? (
                    <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-2 border-slate-300"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center border-2 border-slate-300">
                        <span className="text-2xl font-bold text-green-700">
                            {getInitials(formData.name)}
                        </span>
                    </div>
                )}
                <div>
                    <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                        <Camera className="w-4 h-4" />
                        {uploading ? 'Uploading...' : 'Change Picture'}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            disabled={uploading}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">Full Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.name ? 'border-red-500' : 'border-slate-300'}`} />
                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.email ? 'border-red-500' : 'border-slate-300'}`} />
                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">Job Title</label>
                    <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.jobTitle ? 'border-red-500' : 'border-slate-300'}`} />
                    {errors.jobTitle && <p className="text-red-600 text-xs mt-1">{errors.jobTitle}</p>}
                </div>
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">Phone</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-100 rounded-lg border border-slate-300" />
                </div>
                <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                    disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}