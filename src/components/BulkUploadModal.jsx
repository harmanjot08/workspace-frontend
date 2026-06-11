import { useState } from 'react';
import { X, Download, Upload as UploadIcon } from 'lucide-react';
const CSV_TEMPLATE = `Name,Email,Role,Department,JoinedDate
Rohan,rohan@company.com,Developer,Engineering,2024-01-15
Akansha,akansha@company.com,Designer,Design,2023-02-20
Arpit,arpit@company.com,Manager,Management,2025-03-10`;

const REQUIRED_HEADERS = ['Name', 'Email', 'Role', 'Department', 'JoinedDate'];

export default function BulkUploadModal({ isOpen, onClose, onSubmit }) {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [preview, setPreview] = useState(null);

    const downloadTemplate = () => {
        const element = document.createElement('a');
        element.href = URL.createObjectURL(new Blob([CSV_TEMPLATE], { type: 'text/csv' }));
        element.download = 'user_template.csv';
        element.click();
    };

    const parseCSV = (csv) => {
        const lines = csv.split('\n').filter(l => l.trim());
        const headers = lines[0].split(',').map(h => h.trim());

        const missingHeaders = REQUIRED_HEADERS.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
            throw new Error(`Missing columns: ${missingHeaders.join(', ')}`);
        }

        const rows = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            return {
                name: values[0],
                email: values[1],
                role: values[2],
                department: values[3],
            };
        });
        return { headers, rows, total: rows.length };
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!selectedFile.name.endsWith('.csv')) {
            setErrors(['Please upload a CSV file']);
            setFile(null);
            setFileName('');
            setPreview(null);
            return;
        }

        setFile(selectedFile);
        setFileName(selectedFile.name);
        setErrors([]);

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = parseCSV(event.target?.result || '');
                setPreview({
                    headers: data.headers,
                    rows: data.rows.slice(0, 5),
                    total: data.total,
                });
            } catch (error) {
                setErrors([error.message]);
                setFile(null);
                setFileName('');
                setPreview(null);
            }
        };

        reader.readAsText(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || errors.length > 0) return;

        setLoading(true);
        try {
            const csv = await file.text();
            const { rows } = parseCSV(csv);
            await onSubmit(rows);
            setFile(null);
            setFileName('');
            setPreview(null);
            setErrors([]);
            onClose();
        } catch (error) {
            setErrors([error.message]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Bulk Upload Users</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-900 text-sm">Upload a CSV file with user data. Download the template to see the required format.</p>
                </div>

                <button
                    onClick={downloadTemplate}
                    type="button"
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 font-medium mb-6">
                    <Download className="w-4 h-4" />
                    Download Template
                </button>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Select CSV File</label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                            id="csv-file"
                            disabled={loading} />
                        <label
                            htmlFor="csv-file"
                            className="block border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                            <UploadIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-slate-900 font-medium">{fileName || 'Click to select or drag and drop'}</p>
                            <p className="text-slate-500 text-sm mt-1">CSV files only</p>
                        </label>
                    </div>

                    {errors.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            {errors.map((err, i) => (
                                <p key={i} className="text-red-700 text-sm">• {err}</p>
                            ))}
                        </div>
                    )}

                    {preview && (
                        <div className="bg-slate-50 rounded-lg p-4">
                            <p className="text-slate-900 font-semibold mb-3">Preview ({preview.total} users)</p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-200">
                                            {preview.headers.map(h => (
                                                <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {preview.rows.map((row, i) => (
                                            <tr key={i} className="border-b border-slate-200">
                                                <td className="px-3 py-2">{row.name}</td>
                                                <td className="px-3 py-2 text-slate-600">{row.email}</td>
                                                <td className="px-3 py-2 text-slate-600">{row.role}</td>
                                                <td className="px-3 py-2 text-slate-600">{row.department}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {preview.total > 5 && <p className="text-slate-500 text-xs mt-2">... and {preview.total - 5} more</p>}
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
                            disabled={loading || !preview}>
                            {loading ? 'Uploading...' : 'Upload Users'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}