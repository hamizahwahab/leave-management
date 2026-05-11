import { useState, useEffect, useContext  } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import Header from '../components/Header';
import { AlertCircle, Calendar, Link } from 'lucide-react';

interface Balance {
    id: number;
    leaveType: string;
    balance: number;
    used: number;
    total: number;
    remaining: number;
}

const getBalanceIcon = (name: string) => {
  const icons: Record<string, string> = {
    'Annual Leave': '☀️',
    'Sick Leave': '🤒',
    'Public Holidays': '🏛️',
    'Maternity Leave': '👶',
    'Paternity Leave': '👨',
    'Unpaid Leave': '💸',
    'Emergency Leave': '🚨',
    'Compassionate Leave': '💔',
    'Replacement Leave': '🔄',
  };
  return icons[name] || '📅';
};

const MyBalances = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error('AuthContext must be used within AuthProvider');

    const [balances, setBalances] = useState<Balance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const response = await api.get('/leave-balances');
                setBalances(response.data.data);
            } catch (err) {
                console.error('Error fetching balances:', err);
                setError('Failed to load balances');
            } finally {
                setLoading(false);
            }

        };
        fetchBalances();
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center">

            <Header showBackButton />

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl py-2">
                    {/* Breadcrumb */}
                    <div className="relative overflow-hidden bg-purple-50 p-6 py-4 rounded-4xl shadow-sm mb-4">
                        <h4 className="mb-1 text-lg font-black tracking-tight text-gray-900">
                            Leave Balances
                        </h4>
                        <ol className="flex items-center" aria-label="Breadcrumb">
                            <li className="flex items-center">
                                <Link
                                    to="/dashboard"
                                    className="text-sm font-medium text-slate-500 hover:text-purple-600"
                                >
                                    Dashboard
                                </Link>
                                <span className="mx-2 w-1 h-1 rounded-full bg-slate-300"></span>
                            </li>
                            <li>
                                <span
                                    className="text-sm font-bold text-slate-400"
                                    aria-current="page"
                                >
                                    Leave Balances
                                </span>
                            </li>
                        </ol>
                    </div>
                </div>

                <div className="w-full bg-white rounded-4xl border border-purple-100 shadow-sm p-6 md:p-8 relative">

                    {loading && (
                      <div className="text-center py-20">
                          <div className="inline-block w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                          <p className="mt-4 text-gray-500 font-medium">
                              Loading...
                          </p>
                      </div>
                    )}

                    {/* Error */}
                    {error && !loading && (
                    <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-red-600 flex items-center gap-2">
                        <AlertCircle size={16} />
                        <span className="font-bold">{error}</span>
                    </div>
                    )}

                    {/* Empty */}
                    {!loading && !error && balances.length === 0 && (
                    <div className="text-center py-12">
                        <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="font-bold text-gray-500">No leave balances available.</p>
                    </div>
                    )}

                    {!loading && balances.length > 0 && (
                      <div className="text-center py-20">
                        {/* Balance Cards Stack */}
                        <div className="space-y-4">
                            {balances.map((balance) => (
                            <div
                                key={balance.id}
                                className="bg-white border border-slate-100 rounded-4xl p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Top Row: Icon, Name & Year */}
                                <div className="flex justify-between items-center mb-5">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-2xl`}>
                                        {getBalanceIcon(balance.leaveType)}
                                    </div>
                                    <div>
                                    <h3 className="font-black text-slate-800 text-lg leading-tight">{balance.leaveType}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company Standard</p>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-slate-300 tracking-widest">2026</span>
                                </div>

                                {/* Middle Row: The Progress Bar */}
                                <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                                <div
                                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out`}
                                    style={{ width: `${(balance.used / balance.total) * 100}%` }}
                                />
                                </div>

                                {/* Bottom Row: The Data Labels */}
                                <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-500">Used:</span>
                                    <span className="text-sm font-black text-slate-800">{balance.used} / {balance.total}</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-xl">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Remaining:</span>
                                    <span className={`text-sm font-black text-purple-600`}>
                                    {balance.remaining} Days
                                    </span>
                                </div>
                                </div>
                            </div>
                            ))}
                        </div>
                      </div>
                  )}

                </div>

            </main>

        </div>
    );
}

export default MyBalances;
