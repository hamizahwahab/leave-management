import { useState, useContext, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarPlus, AlertCircle, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import Header from '../components/Header';
import { CalendarPlusIcon } from '../components/icons/CalendarPlusIcon';

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    leaveTypeId: 0,
    startDate: '',
    endDate: '',
    reason: ''
  });

    const getLeaveIcon = (name: string) => {
    const icons: Record<string, string> = {
        'Annual Leave': '🏖️',
        'Sick Leave': '🏥',
        'Maternity Leave': '👶',
        'Paternity Leave': '👨‍👶',
        'Unpaid Leave': '💰',
        'Emergency Leave': '🚨',
        'Compassionate Leave': '🤍',
        'Replacement Leave': '🔄',
        'Public Holidays': '🎉',
    };
    return icons[name] || '📅';
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [leaveTypes, setLeaveTypes] = useState<Array<{id: number, name: string}>>([]);

    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error('AuthContext must be used within AuthProvider');

    useEffect(() => {
        const fetchLeaveTypes = async () => {
        try {
            const response = await api.get('/leave-types');
            setLeaveTypes(response.data.data);
        } catch (err) { console.error(err); }
        };
        fetchLeaveTypes();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData.leaveTypeId || !formData.startDate || !formData.endDate || !formData.reason) {
        setError('Please fill in all fields.');
        return;
        }
        setLoading(true);
        try {

            const payload = {
                leave_type_id: Number(formData.leaveTypeId),
                start_date: formData.startDate,
                end_date: formData.endDate,
                reason: formData.reason,
                userId: authContext.user?.id
            };

        await api.post('/leave-requests', payload );
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 1500);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || 'Submission failed');
        } finally { setLoading(false); }
    };

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    const toDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
    };

    const getCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay();
    const days: Date[] = [];
    for (let i = startPad - 1; i >= 0; i--) days.push(new Date(year, month, -i));
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    while (days.length < 42) {
        const last = days[days.length - 1];
        days.push(new Date(year, month, last.getDate() + 1));
    }
    return days;
    };

    const isPastDate = (d: Date) => toDateStr(d) < toDateStr(today);

    const isInRange = (d: Date) => {
    if (!formData.startDate || !formData.endDate) return false;
    const ds = toDateStr(d);
    return ds >= formData.startDate && ds <= formData.endDate;
    };

    const handleDayClick = (d: Date) => {
    if (isPastDate(d)) return;
    const ds = toDateStr(d);
    if (!formData.startDate || (formData.startDate && formData.endDate)) {
        setFormData(prev => ({ ...prev, startDate: ds, endDate: '' }));
    } else {
        if (ds < formData.startDate) {
        setFormData(prev => ({ ...prev, startDate: ds, endDate: prev.startDate }));
        } else {
        setFormData(prev => ({ ...prev, endDate: ds }));
        }
    }
    };

    const calculateWorkdays = () => {
    if (!formData.startDate) return 0;
    const start = new Date(formData.startDate);
    const end = formData.endDate ? new Date(formData.endDate) : new Date(formData.startDate);
    let count = 0;
    const cur = new Date(start);
    while (cur <= end) {
        const day = cur.getDay();
        if (day !== 0 && day !== 6) count++;
        cur.setDate(cur.getDate() + 1);
    }
    return Math.max(1, count);
    };

    const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const DAY_HEADERS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return (
    // h-screen and overflow-hidden on large screens prevents laptop scrolling
    <div className="h-screen bg-pastel-purple font-sans flex flex-col lg:overflow-hidden">

      <Header showBackButton />

      {/*
          This container expands to fill available space.
          overflow-y-auto allows scrolling ONLY if content is taller than the screen (mobile).
      */}
      <main className="flex-1 flex flex-col items-center justify-start p-4 overflow-y-auto">
        <div className="w-full max-w-2xl py-2">

          {/* 1. Breadcrumb Card - Reduced bottom margin for laptop fit */}
          <div className="relative w-full overflow-hidden bg-purple-50 p-6 py-4 rounded-4xl shadow-sm mb-4">
            <div className="relative z-10">
              <p className="mb-1 text-lg font-black tracking-tight text-gray-900">
                Apply for Leave
              </p>

              <ol className="flex items-center whitespace-nowrap" aria-label="Breadcrumb">
                <li className="flex items-center">
                  <Link to="/dashboard" className="text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors">Dashboard</Link>
                  <span className="mx-2 w-1 h-1 rounded-full bg-slate-300"></span>
                </li>
                <li className="flex items-center">
                  <span className="text-sm font-bold text-slate-400" aria-current="page">Apply Leave</span>
                </li>
              </ol>
            </div>

            {/* Illustration - Using absolute for cleaner laptop layout */}
            <div className="absolute right-6 bottom-0 opacity-20 hidden sm:block">
               <CalendarPlusIcon className="w-16 h-16" />
            </div>
          </div>

          {/* 2. Form Card */}
          <div className="w-full bg-white rounded-4xl border border-purple-100 shadow-sm p-6 md:p-8 relative">

            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircleIcon />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Submitted!</h2>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-red-600 text-xs flex items-center gap-2">
                    <AlertCircle size={14} /> <span className="font-bold">{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                    {leaveTypes.map((type) => (
                        <button
                        key={type.id}
                        onClick={() => setFormData(prev => ({ ...prev, leaveTypeId: type.id }))}
                        className={`
                            flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all
                            ${formData.leaveTypeId === type.id
                            ? 'border-purple-500 bg-purple-50 shadow-md'
                            : 'border-gray-100 bg-gray-50 hover:border-purple-200'
                            }
                        `}
                        >
                        {/* Emoji icon */}
                        <span className="text-2xl">{getLeaveIcon(type.name)}</span>
                        {/* Name */}
                        <span className="text-xs font-bold text-gray-700 text-center">
                            {type.name}
                        </span>
                        {/* Check mark when selected */}
                        {formData.leaveTypeId === type.id && (
                            <CheckCircleIcon />
                        )}
                        </button>
                    ))}
                    </div>

                {/* Visual Calendar */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-1.5">
                        <CalendarIcon size={12} /> Select Dates
                    </label>

                    {/* Month Navigator */}
                    <div className="flex items-center justify-between">
                        <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                        className="text-purple-600 hover:text-purple-800 font-bold text-lg px-2">
                        ◀
                        </button>
                        <span className="font-bold text-gray-700">
                        {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </span>
                        <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                        className="text-purple-600 hover:text-purple-800 font-bold text-lg px-2">
                        ▶
                        </button>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400">
                        {DAY_HEADERS.map(d => <span key={d}>{d}</span>)}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {getCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth()).map((d, i) => {
                        if (!d) return <div key={i} />;
                        const isCurrentMonth = d.getMonth() === currentMonth.getMonth();
                        const disabled = isPastDate(d);
                        const isStart = toDateStr(d) === formData.startDate;
                        const isEnd = toDateStr(d) === formData.endDate;
                        const inRange = isInRange(d);
                        return (
                            <button type="button" key={i} disabled={disabled} onClick={() => handleDayClick(d)}
                            className={`p-2 text-sm rounded-xl font-bold transition-all
                                ${!isCurrentMonth ? 'text-gray-200' : ''}
                                ${disabled ? 'text-gray-200 cursor-not-allowed' : 'hover:bg-purple-100'}
                                ${isStart || isEnd ? 'bg-purple-600 text-white hover:bg-purple-700' : ''}
                                ${inRange && !isStart && !isEnd ? 'bg-purple-100 text-purple-700' : ''}`}>
                            {d.getDate()}
                            </button>
                        );
                        })}
                    </div>

                    {/* Summary Bar */}
                    <div className="flex items-center justify-between bg-purple-50 rounded-2xl p-3">
                        {formData.startDate ? (
                        <>
                            <span className="text-sm font-bold text-purple-700">
                            📅 {formatDisplayDate(formData.startDate)}
                            {formData.endDate ? ` — ${formatDisplayDate(formData.endDate)}` : ''}
                            </span>
                            <span className="text-sm font-black text-purple-600">
                            {calculateWorkdays()} day{calculateWorkdays() > 1 ? 's' : ''}
                            </span>
                        </>
                        ) : (
                        <span className="text-sm font-bold text-gray-400">Select your leave dates</span>
                        )}
                    </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-1.5">
                    <FileText size={12} /> Reason
                  </label>
                  <textarea
                    name="reason"
                    rows={2}
                    onChange={handleChange}
                    placeholder="Keep it brief..."
                    value={formData.reason}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-purple-200 focus:bg-white rounded-2xl px-4 py-3 outline-none transition-all font-bold text-gray-700 text-sm resize-none shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-purple-100 transition-all flex items-center justify-center gap-2 text-sm mt-1"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                    <><CalendarPlus size={16} /> Submit Request</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const CheckCircleIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
  </svg>
);

export default ApplyLeave;
