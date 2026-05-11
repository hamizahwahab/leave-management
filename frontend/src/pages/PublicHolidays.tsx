import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Loader2, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import Header from '../components/Header';

// 1. Interface for the holiday data
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

  useEffect(() => {
    const fetchHolidays = async () => {
      setLoading(true);
      try {
        const res = await api.get('/holidays');
        setHolidays(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load holidays');
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
  }, []);

  // 2. Date formatter (Month DD, YYYY)
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="h-screen bg-pastel-purple font-sans flex flex-col overflow-hidden">
      <Header showBackButton />

      <main className="flex-1 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-6">

          {/* 3. Breadcrumb Card */}
          <div className="bg-purple-50 p-6 rounded-4xl shadow-sm border border-purple-100/50 mb-4">
            <h4 className="text-2xl font-black tracking-tight text-gray-900">
              Public Holidays
            </h4>
            <ol className="flex items-center whitespace-nowrap">
              <li>
                <Link to="/dashboard" className="text-sm font-medium text-slate-500 hover:text-purple-600">
                  Dashboard
                </Link>
                <span className="mx-2 w-1 h-1 rounded-full bg-slate-300 inline-block"></span>
              </li>
              <li>
                <span className="text-sm font-bold text-slate-400">Holidays</span>
              </li>
            </ol>
          </div>

          {/* 4. Content Card */}
          <div className="bg-white p-6 md:p-8 rounded-4xl border border-purple-100 shadow-sm mb-8">

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-purple-600" size={24} />
                <span className="ml-3 font-bold text-gray-500">Loading holidays...</span>
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
            {!loading && !error && holidays.length === 0 && (
              <div className="text-center py-12">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="font-bold text-gray-500">No holidays set.</p>
              </div>
            )}

            {/* Holiday List */}
            {!loading && !error && holidays.length > 0 && (
              <div className="divide-y divide-gray-100">
                {holidays.map((holiday) => (
                  <div key={holiday.id} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{holiday.name}</p>
                      <p className="text-sm text-gray-500">{formatDate(holiday.date)}</p>
                    </div>
                    {holiday.is_replacement && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                        Replacement
                      </span>
                    )}
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

export default PublicHolidays;
