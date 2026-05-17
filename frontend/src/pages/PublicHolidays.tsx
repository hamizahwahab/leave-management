/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import Header from '../components/Header';

interface Holiday {
    id: number;
    name: string;
    date: string;
    year: number;
    is_replacement: boolean;
}

const PublicHolidays = () => {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedYear, setSelectedYear] = useState(2026);

    useEffect(() => {
        const fetchHolidays = async () => {
            setLoading(true);
            try {
                const res = await api.get('/holidays');
                setHolidays(res.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load holidays');
            } finally {
                setLoading(false);
            }
        };
        fetchHolidays();
    }, []);

    // Group holidays by month (0 = Jan, 1 = Feb, etc.)
    const grouped = holidays.reduce<Record<number, Holiday[]>>((acc, holiday) => {
        const month = new Date(holiday.date).getMonth();
        if (!acc[month]) acc[month] = [];
        acc[month].push(holiday);
        return acc;
    }, {});

    // Month data array with all 12 months
    const MONTH_DATA = [
        { label: "JAN", full: "January" },
        { label: "FEB", full: "February" },
        { label: "MAR", full: "March" },
        { label: "APR", full: "April" },
        { label: "MAY", full: "May" },
        { label: "JUN", full: "June" },
        { label: "JUL", full: "July" },
        { label: "AUG", full: "August" },
        { label: "SEP", full: "September" },
        { label: "OCT", full: "October" },
        { label: "NOV", full: "November" },
        { label: "DEC", full: "December" },
    ];

    // Extract day name from date string
    const getDayName = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
    };

    // Extract day number from date string
    const getDayNumber = (dateStr: string) => {
        return new Date(dateStr).getDate().toString().padStart(2, '0');
    };

    return (
        <div className="h-screen bg-pastel-purple font-sans flex flex-col overflow-hidden">
            <Header showBackButton />

            <main className="flex-1 flex flex-col items-center justify-start p-4 overflow-y-auto">
                <div className="w-full max-w-7xl py-2">

                    {/* Breadcrumb */}
                    <div className="relative overflow-hidden bg-purple-50 p-6 py-4 rounded-4xl shadow-sm border border-purple-100/50 mb-6">
                        <h4 className="mb-2 text-2xl font-black tracking-tight text-gray-900">
                            Public Holidays
                        </h4>
                        <ol className="flex items-center whitespace-nowrap" aria-label="Breadcrumb">
                            <li className="flex items-center">
                                <Link to="/dashboard" className="text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors">
                                    Dashboard
                                </Link>
                                <span className="mx-2 w-1 h-1 rounded-full bg-slate-300"></span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-sm font-bold text-slate-400" aria-current="page">Holidays</span>
                            </li>
                        </ol>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-4xl border border-purple-100 shadow-sm p-6 md:p-8">

                        {/* Loading */}
                        {loading && (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="animate-spin text-purple-600" size={24} />
                                <span className="ml-3 font-bold text-gray-500">Loading holidays...</span>
                            </div>
                        )}

                        {/* Error */}
                        {error && !loading && (
                            <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-red-600 flex items-center gap-2 mb-6">
                                <AlertCircle size={16} />
                                <span className="font-bold">{error}</span>
                            </div>
                        )}

                        {/* Empty */}
                        {!loading && !error && holidays.length === 0 && (
                            <div className="text-center py-20">
                                <CalendarIcon size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="font-bold text-gray-500">No holidays set for {selectedYear}.</p>
                            </div>
                        )}

                        {/* Holiday Calendar Grid */}
                        {!loading && !error && holidays.length > 0 && (
                            <>
                                {/* Top Bar: Title and Year Selector */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                                    <div>
                                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Holiday Calendar</h1>
                                        <p className="text-purple-500 font-bold text-xs uppercase tracking-widest mt-1">
                                            Public Holidays {selectedYear}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-center bg-purple-50 border border-purple-100 p-1.5 rounded-2xl shadow-sm">
                                        <button
                                            onClick={() => setSelectedYear(prev => prev - 1)}
                                            className="p-2 hover:bg-purple-100 rounded-xl transition-colors text-slate-400"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <span className="px-6 font-black text-slate-700 tracking-tighter">{selectedYear}</span>
                                        <button
                                            onClick={() => setSelectedYear(prev => prev + 1)}
                                            className="p-2 hover:bg-purple-100 rounded-xl transition-colors text-slate-400"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* 12-Month Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {MONTH_DATA.map((month, idx) => {
                                        const monthHolidays = grouped[idx]?.filter(
                                            h => new Date(h.date).getFullYear() === selectedYear
                                        ) || [];

                                        return (
                                            <div
                                                key={idx}
                                                className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-lg hover:shadow-purple-900/5 transition-all group"
                                            >
                                                {/* Month Header */}
                                                <div className="border-b border-slate-50 pb-4 mb-4 flex justify-between items-center">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                                        {month.label} {selectedYear}
                                                    </span>
                                                    <CalendarIcon size={14} className="text-purple-200 group-hover:text-purple-400 transition-colors" />
                                                </div>

                                                {/* Holidays List */}
                                                <div className="space-y-3 min-h-25">
                                                    {monthHolidays.length > 0 ? (
                                                        monthHolidays.map((h) => (
                                                            <div key={h.id} className="flex items-start justify-between group/item">
                                                                <div className="flex items-start gap-3">
                                                                    <div className="flex flex-col items-center min-w-8">
                                                                        <span className="text-lg font-black text-slate-800 leading-none">
                                                                            {getDayNumber(h.date)}
                                                                        </span>
                                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                                            {getDayName(h.date)}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-col pt-0.5">
                                                                        <span className="text-sm font-bold text-slate-600 leading-tight">
                                                                            {h.name}
                                                                        </span>
                                                                        {h.is_replacement && (
                                                                            <span className="text-[9px] font-black uppercase tracking-widest text-purple-500 mt-0.5">
                                                                                Replacement
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center pt-6">
                                                            <span className="text-[10px] font-black text-slate-300 uppercase italic">
                                                                No Holidays
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Footer Legend */}
                                <div className="mt-10 flex items-center justify-center gap-6 py-5 border-t border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-purple-600" />
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            National Holiday
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <span>•</span>
                                        <span className="text-xs font-medium italic">
                                            Subject to change based on official announcement
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PublicHolidays;
