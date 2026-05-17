import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, MoreVertical, Plus, type LucideIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import api from '../api/axios';

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    color: string;
}

interface Holiday {
    id: number;
    name: string;
    date: string;
}

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [currentTimestamp] = useState<number>(() => Date.now());

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const response = await api.get('/holidays');
                const allHolidays = response.data;
                const upcoming = allHolidays.filter(
                    (h: Holiday) => new Date(h.date) >= new Date()
                );
                setHolidays(upcoming);
            } catch (err) { console.error(err); }
        };
        fetchHolidays();
    }, []);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDaysLeft = (dateStr: string) => {
        const diff = Math.ceil((new Date(dateStr).getTime() - currentTimestamp) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'Today!';
        if (diff === 1) return 'Tomorrow';
        return `${diff} days left`;
    };


    return (
        <div className="min-h-screen bg-purple-50 font-sans">
            {/* 1. TOP NAVIGATION (Themed) */}
            <Header />

            <main className="p-4 md:p-8 max-w-400 mx-auto">
                {/* 2. WELCOME BANNER (Matches image_afc75b.png) */}
                <section className="bg-white rounded-4xl p-8 md:p-10 mb-8 border border-purple-100 shadow-sm flex justify-between items-center relative overflow-hidden">
                    <div className="z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} className="w-16 h-16 rounded-full bg-purple-100 shadow-inner" alt="avatar" />
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    Welcome back, <span className="text-purple-600">{user?.name}</span>
                                </h1>
                                <p className="text-gray-500 font-medium">You have 3 leave requests awaiting approval.</p>
                            </div>
                        </div>

                        {/* Apply for Leave & View Balances Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/apply-leave')}
                                className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-purple-200 transition-all flex items-center gap-2"
                            >
                                <Plus size={18} /> Apply for Leave
                            </button>
                            <button
                                onClick={() => navigate('/my-balances')}
                                className="mt-2 ml-3 bg-purple-100 hover:bg-purple-200 text-purple-700 px-6 py-3 rounded-2xl font-bold transition-all"
                            >
                                View Balances
                            </button>
                        </div>

                    </div>
                    <div className="hidden lg:block opacity-10 absolute right-10 top-0 translate-y-4">
                        <Calendar size={200} strokeWidth={1} />
                    </div>
                </section>

                {/* 3. STATS GRID (Pastel Squares) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard icon={Calendar} label="Balance" value="14 Days" color="bg-blue-50 text-blue-500" />
                    <StatCard icon={Clock} label="Pending" value="3" color="bg-orange-50 text-orange-500" />
                    <StatCard icon={CheckCircle} label="Approved" value="12" color="bg-purple-50 text-purple-600" />
                    <StatCard icon={Calendar} label="Used" value="6" color="bg-pink-50 text-pink-500" />
                </div>

                {/* 4. MAIN LAYOUT SPLIT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent History Table (2 Cols) */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-purple-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-8 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Leave History</h3>
                            <button onClick={() => navigate('/leave-history')} className="text-purple-600 font-bold text-sm hover:underline">View Full Report</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase font-black tracking-widest">
                                    <tr>
                                        <th className="px-8 py-4 text-left">Type</th>
                                        <th className="px-8 py-4 text-left">Period</th>
                                        <th className="px-8 py-4 text-left">Status</th>
                                        <th className="px-8 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    <TableRow type="Annual Leave" date="May 10 - 12" status="Approved" sColor="bg-purple-600" />
                                    <TableRow type="Sick Leave" date="April 20" status="Pending" sColor="bg-orange-400" />
                                    <TableRow type="Personal" date="March 15" status="Approved" sColor="bg-purple-600" />
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Upcoming Holidays Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-purple-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Upcoming Holidays</h3>
                            <button onClick={() => navigate('/public-holidays')}
                                className="text-purple-600 font-bold text-sm hover:underline">
                                View More →
                            </button>
                        </div>

                        {holidays.length === 0 ? (
                            <p className="text-gray-400 font-bold text-center py-8">No upcoming holidays</p>
                        ) : (
                            <div className="space-y-4">
                                {holidays.slice(0, 5).map((holiday) => (
                                    <div key={holiday.id} className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-800">{holiday.name}</p>
                                            <p className="text-sm text-gray-400 font-medium">
                                                {formatDate(holiday.date)}
                                            </p>
                                        </div>
                                        <span className="text-xs font-black text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full">
                                            {getDaysLeft(holiday.date)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

// --- Sub-Components ---
const StatCard = ({ icon: Icon, label, value, color }: StatCardProps) => (
    <div className="bg-white p-6 rounded-4xl border border-purple-50 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all">
        <div className={`p-4 rounded-2xl ${color} mb-3 shadow-inner`}>
            <Icon size={24} />
        </div>
        <span className="text-gray-400 text-xs font-black uppercase tracking-tighter">
            {label}
        </span>
        <span className="text-gray-900 text-xl font-bold mt-1">
            {value}
        </span>
    </div>
);

const TableRow = ({ type, date, status, sColor }: { type: string; date: string; status: string; sColor: string }) => (
    <tr className="hover:bg-purple-50/20 transition-colors">
        <td className="px-8 py-5 text-sm font-bold text-gray-900">{type}</td>
        <td className="px-8 py-5 text-sm text-gray-500 font-medium">{date}</td>
        <td className="px-8 py-5">
            <span className={`px-3 py-2 rounded-full text-[10px] font-black text-white uppercase ${sColor} shadow-sm`}>{status}</span>
        </td>
        <td className="px-8 py-5 text-right"><button className="text-gray-300 hover:text-purple-600"><MoreVertical size={18} /></button></td>
    </tr>
);

export default Dashboard;
