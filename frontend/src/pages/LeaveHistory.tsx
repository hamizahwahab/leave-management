/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import Header from '../components/Header';

interface LeaveRequest {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const LeaveHistory = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('AuthContext must be used within AuthProvider');

  useEffect(() => {
    const fetchLeaveRequests = async () => {
        try {
          setLoading(true);
          const response = await api.get('/leave-requests');
          const transformedData = response.data.map((item: any) => ({
              id: item.id,
              leaveType: item.leave_type?.name || 'unknown',
              startDate: item.start_date,
              endDate: item.end_date,
              reason: item.reason,
              status: item.status,
              createdAt: item.created_at,
          }));
          setLeaveRequests(transformedData);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to fetch leave requests');
        } finally {
          setLoading(false);
        }
    };
    fetchLeaveRequests();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusBadge = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"><CheckCircle size={14} /> Approved</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700"><Clock size={14} /> Pending</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"><XCircle size={14} /> Rejected</span>;
      default: return null;
    }
  };

  const formatLeaveType = (type: string) => type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="h-screen bg-pastel-purple font-sans flex flex-col overflow-hidden">
        <Header showBackButton />

        <main className="flex-1 flex flex-col items-center justify-start p-4 overflow-y-auto">

            {/* 1. Breadcrumb Card - Changed max-w-2xl to max-w-5xl */}
            <div className="w-full max-w-5xl mb-4">
                <div className="relative overflow-hidden bg-purple-50 p-6 py-4 rounded-4xl shadow-sm border border-purple-100/50">
                    <h4 className="mb-2 text-2xl font-black tracking-tight text-gray-900">
                        Leave History
                    </h4>
                    <ol className="flex items-center whitespace-nowrap" aria-label="Breadcrumb">
                        <li className="flex items-center">
                            <Link to="/dashboard" className="text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors">Dashboard</Link>
                            <span className="mx-2 w-1 h-1 rounded-full bg-slate-300"></span>
                        </li>
                        <li className="flex items-center">
                            <span className="text-sm font-bold text-slate-400" aria-current="page">Leave History</span>
                        </li>
                    </ol>
                </div>
            </div>

            {/* 2. Content Card (Table) - Changed max-w-2xl to max-w-5xl */}
            <div className="w-full max-w-5xl bg-white rounded-4xl border border-purple-100 shadow-sm p-6 md:p-8 relative">

                {loading && (
                    <div className="text-center py-20">
                        <div className="inline-block w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-500 font-medium">Loading your leave history...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-700 text-sm flex items-center gap-2">
                        <AlertCircle size={16} />
                        <span className="font-bold">{error}</span>
                    </div>
                )}

                {!loading && !error && leaveRequests.length === 0 && (
                    <div className="text-center py-16">
                        <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900">No leave requests yet</h3>
                        <p className="text-gray-500 mt-2 text-sm">Submit your first leave request to see it here!</p>
                        <button
                            onClick={() => navigate('/apply-leave')}
                            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-purple-100"
                        >
                            Apply for Leave
                        </button>
                    </div>
                )}

                {!loading && !error && leaveRequests.length > 0 && (
                    <div className="bg-white rounded-3xl border border-purple-50 overflow-hidden">
                        {/* Desktop View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-purple-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Dates</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Submitted</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {leaveRequests.map((request) => (
                                        <tr key={request.id} className="hover:bg-purple-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-gray-800 text-sm">{formatLeaveType(request.leaveType)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-gray-500 whitespace-nowrap">
                                                {formatDate(request.startDate)} - {formatDate(request.endDate)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                                                {request.reason || 'No reason provided'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(request.status)}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-gray-400 whitespace-nowrap">
                                                {formatDate(request.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden divide-y divide-gray-50">
                            {leaveRequests.map((request) => (
                                <div key={request.id} className="p-6 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <span className="font-bold text-gray-800">{formatLeaveType(request.leaveType)}</span>
                                        {getStatusBadge(request.status)}
                                    </div>   
                                    <p className="text-xs font-bold text-gray-500">
                                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {request.reason || 'No reason provided'}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Submitted: {formatDate(request.createdAt)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    </div>
  );
};

export default LeaveHistory;