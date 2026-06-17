import { Trash2, X } from 'lucide-react';

export default function DeleteMessageModal({ message, onDeleteForEveryone, onDeleteForMe, onCancel, loading }) {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
        }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                width: '90%',
                maxWidth: '300px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Delete message</h3>
                    <button
                        onClick={onCancel}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        <X size={20} style={{ color: '#6b7280' }} />
                    </button>
                </div>

                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '1.5rem' }}>
                    "{message?.content?.substring(0, 50)}..."
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                        onClick={onDeleteForEveryone}
                        disabled={loading}
                        style={{
                            padding: '10px',
                            background: '#dc2626',
                            color: 'white',
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
                        }}>
                        <Trash2 size={16} />
                        Delete for everyone
                    </button>

                    <button
                        onClick={onDeleteForMe}
                        disabled={loading}
                        style={{
                            padding: '10px',
                            background: '#f59e0b',
                            color: 'white',
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
                        }}>
                        <Trash2 size={16} />
                        Delete for me
                    </button>

                    <button
                        onClick={onCancel}
                        disabled={loading}
                        style={{
                            padding: '10px',
                            background: '#e5e7eb',
                            color: '#374151',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}