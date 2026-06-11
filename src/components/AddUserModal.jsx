import { useState } from 'react';
import { X } from 'lucide-react';
const ROLES = ['Employee', 'Manager', 'Team Lead', 'Developer', 'Designer'];
const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance'];

const INITIAL_FORM_DATA = {
    name: '',
    email: '',
    role: 'Employee',
    department: '',
    joinedDate: new Date().toISOString().split('T')[0],
};

const FIELD_CONFIG = [
    {
        name: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'Enter user name',
        validation: (value) => value.trim() ? '' : 'Name is required',
    },
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Enter email address',
        validation: (value) => {
            if (!value.trim()) return 'Email is required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
            return '';
        },
    },
    {
        name: 'role',
        label: 'Role',
        type: 'select',
        options: ROLES,
        validation: (value) => value ? '' : 'Role is required',
    },
    {
        name: 'department',
        label: 'Department',
        type: 'select',
        options: DEPARTMENTS,
        placeholder: 'Select department',
        validation: (value) => value ? '' : 'Department is required',
    },
    {
        name: 'joinedDate',
        label: 'Joined Date',
        type: 'date',
        validation: (value) => value ? '' : 'Joined date is required',
    },
];

export default function AddUserModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        FIELD_CONFIG.forEach(field => {
            const error = field.validation(formData[field.name]);
            if (error) newErrors[field.name] = error;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            await onSubmit(formData);
            setFormData(INITIAL_FORM_DATA);
            onClose();
        } catch (error) {
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Add New User</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-lg">
                        <X className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {FIELD_CONFIG.map((field) => (
                        <FormField
                            key={field.name}
                            field={field}
                            value={formData[field.name]}
                            error={errors[field.name]}
                            onChange={handleChange}
                            disabled={loading} />
                    ))}

                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {errors.submit}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium disabled:opacity-50"
                            disabled={loading}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                            disabled={loading}>
                            {loading ? 'Adding...' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function FormField({ field, value, error, onChange, disabled }) {
    const getInputClass = (hasError) => `
    w-full px-4 py-2 bg-slate-100 text-slate-900 rounded-lg border transition focus:outline-none
    ${hasError
            ? 'border-red-500 focus:border-red-500'
            : 'border-slate-300 focus:border-blue-500'
        }`;
    return (
        <div>
            <label className="block text-slate-700 text-sm font-semibold mb-2">
                {field.label}
            </label>
            {field.type === 'select' ? (
                <select
                    name={field.name}
                    value={value}
                    onChange={onChange}
                    className={`${getInputClass(!!error)} appearance-none cursor-pointer`}
                    disabled={disabled}>
                    {field.placeholder && <option value="">{field.placeholder}</option>}
                    {field.options.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={field.type}
                    name={field.name}
                    value={value}
                    onChange={onChange}
                    placeholder={field.placeholder}
                    className={getInputClass(!!error)}
                    disabled={disabled}
                />
            )}
            {error && (
                <p className="text-red-600 text-sm mt-1">{error}</p>
            )}
        </div>
    );
}