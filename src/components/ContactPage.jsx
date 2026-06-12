import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { contactAPI } from '../api/contactApi.js';
export default function ContactPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        companyName: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        if (!form.name || !form.email || !form.companyName || !form.message) {
            setError('All fields are required');
            return;
        }
        if (form.message.trim().length < 10) {
            setError('Message must be at least 10 characters');
            return;
        }
        setLoading(true);
        try {
            const response = await contactAPI.sendMessage(form);
            if (response.message) {
                setSuccess(true);
                setForm({
                    name: '',
                    email: '',
                    companyName: '',
                    message: '',
                });
                setTimeout(() => setSuccess(false), 5000);
            }
        } catch (err) {
            setError('Failed to send message. Please try again.');
            console.error('Contact form error:', err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div style={{ padding: '2rem 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 0, border: '0.5px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                {/* Left Section - Contact Info */}
                <div style={{ background: '#f9fafb', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 500, margin: '0 0 6px', color: '#1f2937' }}>Contact us</h2>
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Have questions? We'd love to hear from you.</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Mail size={18} style={{ color: '#6b7280' }} />
                            <span style={{ fontSize: '13px', color: '#6b7280' }}>admin@workspace.com</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Phone size={18} style={{ color: '#6b7280' }} />
                            <span style={{ fontSize: '13px', color: '#6b7280' }}>+91 98765 43210</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MapPin size={18} style={{ color: '#6b7280' }} />
                            <span style={{ fontSize: '13px', color: '#6b7280' }}>India</span>
                        </div>
                    </div>
                </div>
                {/* Right Section - Form */}
                <div style={{ background: '#ffffff', padding: '2rem' }}>
                    {success && (
                        <div style={{ marginBottom: '1rem', padding: '12px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '8px', color: '#166534', fontSize: '14px' }}>
                            ✅ Message sent successfully! We will get back to you soon.
                        </div>
                    )}
                    {error && (
                        <div style={{ marginBottom: '1rem', padding: '12px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#991b1b', fontSize: '14px' }}>
                            ❌ {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full name"
                            value={form.name}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                padding: '10px 12px',
                                border: '0.5px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                            }}
                            disabled={loading} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Work email"
                            value={form.email}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                padding: '10px 12px',
                                border: '0.5px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                            }}
                            disabled={loading} />
                        <input
                            type="text"
                            name="companyName"
                            placeholder="Company name"
                            value={form.companyName}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                padding: '10px 12px',
                                border: '0.5px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                            }}
                            disabled={loading} />
                        <textarea
                            name="message"
                            placeholder="Your message..."
                            rows="4"
                            value={form.message}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                padding: '10px 12px',
                                border: '0.5px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px',
                                resize: 'none',
                                outline: 'none',
                                fontFamily: 'inherit',
                            }}
                            disabled={loading} />
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: '#2563eb',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                            }}
                            disabled={loading}>
                            <Send size={16} />
                            {loading ? 'Sending...' : 'Send message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}