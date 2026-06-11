import { Search } from 'lucide-react';
export default function SearchBar({ value, onChange, placeholder }) {
    return (
        <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none" />
        </div>
    );
}