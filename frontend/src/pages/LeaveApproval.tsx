/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, AlertCircle, FileText } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import Header from '../components/Header';

interface LeaveRequest {
  id: number;
  user: { id: number; name: string; email: string };
  leave_type: { id: number; name: string };
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const getLeaveIcon = (name: string) => {
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

const LeaveApproval = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('AuthContext must be used within AuthProvider');

  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Reject modal
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  const fetchRequests = async (page: number, status: string, search: string) => {
    try {
        setLoading(true);
        const res = await api.get(`/leave-requests?page=${page}&status=${status}&search=${search}`);
        setRequests(res.data.data);
        setCurrentPage(res.data.current_page);
        setLastPage(res.data.last_page);
    } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch requests');
    } finally {
        setLoading(false);
    }
  };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchRequests(currentPage, filter, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, filter]);

  const filteredRequests = requests.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (searchQuery && !r.user.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
});

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    setSuccessMsg('');
    try {
      await api.put(`/leave-requests/${id}/status`, { status: 'approved' });
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
      setSuccessMsg('Leave request approved!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Approval failed');
      setTimeout(() => setError(''), 3000);
    } finally {
      setActionLoading(null);
    }
  };

  const openReject = (id: number) => {
    setRejectId(id);
    setRejectReason('');
    setRejectError('');
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setRejectError('Please provide a reason for rejection');
      return;
    }
    if (rejectId === null) return;
    setActionLoading(rejectId);
    try {
      await api.put(`/leave-requests/${rejectId}/status`, {
        status: 'rejected',
        remarks: rejectReason.trim(),
      });
      setRequests(prev => prev.map(r => r.id === rejectId ? { ...r, status: 'rejected' } : r));
      setRejectId(null);
      setRejectReason('');
      setSuccessMsg('Leave request rejected');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Rejection failed');
      setTimeout(() => setError(''), 3000);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-green-100 text-green-700"><CheckCircle size={12} /> Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-700"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-yellow-100 text-yellow-700"><Clock size={12} /> Pending</span>;
    }
  };

  return (
      <div className="h-screen bg-pastel-purple font-sans flex flex-col overflow-hidden">
          <Header showBackButton />

          <main className="flex-1 flex flex-col items-center justify-start p-4 overflow-y-auto">
              <div className="w-full max-w-4xl py-2">
                  {/* Breadcrumb */}
                  <div className="relative overflow-hidden bg-purple-50 p-6 py-4 rounded-4xl shadow-sm mb-4">
                      <h4 className="mb-1 text-lg font-black tracking-tight text-gray-900">
                          Approve Leaves
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
                                  Approve Leaves
                              </span>
                          </li>
                      </ol>
                  </div>

                  {/* Success / Error toasts */}
                  {successMsg && (
                      <div className="mb-4 p-3 bg-green-50 rounded-2xl border border-green-100 text-green-700 text-xs font-bold flex items-center gap-2">
                          <CheckCircle size={14} /> {successMsg}
                      </div>
                  )}
                  {error && (
                      <div className="mb-4 p-3 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-xs font-bold flex items-center gap-2">
                          <AlertCircle size={14} /> {error}
                      </div>
                  )}

                  {/* Filter Tabs */}
                  <div className="flex gap-2 mb-4">
                      {(
                          ["pending", "all", "approved", "rejected"] as const
                      ).map((f) => (
                          <button
                              key={f}
                              onClick={() => {
                                  setFilter(f);
                                  setCurrentPage(1);
                              }}
                              className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
                                  filter === f
                                      ? "bg-purple-600 text-white shadow-md"
                                      : "bg-white text-gray-500 hover:bg-purple-50 border border-purple-100"
                              }`}
                          >
                              {f === "all" ? "All" : f}
                          </button>
                      ))}
                  </div>

                  {/* Search */}
                  <div className="relative mb-4">
                      <svg
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                      >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                      </svg>
                      <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search by employee name..."
                          className="w-full bg-white border-2 border-purple-100 focus:border-purple-300 rounded-2xl pl-10 pr-4 py-3 outline-none transition-all text-sm font-bold text-gray-700 shadow-sm"
                      />
                  </div>

                  {/* Loading */}
                  {loading && (
                      <div className="text-center py-20">
                          <div className="inline-block w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                          <p className="mt-4 text-gray-500 font-medium">
                              Loading requests...
                          </p>
                      </div>
                  )}

                  {/* Empty state */}
                  {!loading && filteredRequests.length === 0 && (
                      <div className="text-center py-16 bg-white rounded-4xl border border-purple-100 shadow-sm">
                          <FileText
                              size={48}
                              className="mx-auto text-gray-300 mb-4"
                          />
                          <h3 className="text-lg font-bold text-gray-900">
                              No requests found
                          </h3>
                          <p className="text-gray-500 mt-2 text-sm">
                              {filter === "pending"
                                  ? "All caught up! No pending requests."
                                  : `No ${filter} requests.`}
                          </p>
                      </div>
                  )}

                  {/* Request Cards */}
                  {!loading && filteredRequests.length > 0 && (
                      <div className="space-y-3">
                          {filteredRequests.map((req) => (
                              <div
                                  key={req.id}
                                  className="bg-white rounded-3xl border border-purple-100 shadow-sm p-5 transition-all hover:shadow-md"
                              >
                                  <div className="flex items-start justify-between gap-4">
                                      {/* Left: User info + leave details */}
                                      <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-3 mb-2">
                                              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-black text-sm shrink-0">
                                                  {req.user.name
                                                      .charAt(0)
                                                      .toUpperCase()}
                                              </div>
                                              <div>
                                                  <p className="font-bold text-gray-900 text-sm">
                                                      {req.user.name}
                                                  </p>
                                                  <p className="text-[11px] text-gray-400">
                                                      {req.user.email}
                                                  </p>
                                              </div>
                                          </div>

                                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                                              <span className="flex items-center gap-1">
                                                  <span className="text-base">
                                                      {getLeaveIcon(
                                                          req.leave_type.name,
                                                      )}
                                                  </span>
                                                  <span className="font-bold text-gray-800">
                                                      {req.leave_type.name}
                                                  </span>
                                              </span>
                                              <span>
                                                  📅{" "}
                                                  {formatDate(req.start_date)} -{" "}
                                                  {formatDate(req.end_date)}
                                              </span>
                                              <span className="font-bold text-purple-600">
                                                  ⏳ {req.total_days} day
                                                  {req.total_days !== 1
                                                      ? "s"
                                                      : ""}
                                              </span>
                                          </div>

                                          {req.reason && (
                                              <p className="text-xs text-gray-500 mt-2 italic bg-gray-50 px-3 py-2 rounded-xl">
                                                  "{req.reason}"
                                              </p>
                                          )}

                                          <div className="flex items-center gap-3 mt-2">
                                              {statusBadge(req.status)}
                                              <span className="text-[10px] text-gray-400">
                                                  Applied:{" "}
                                                  {formatDate(req.created_at)}
                                              </span>
                                          </div>
                                      </div>

                                      {/* Right: Action buttons (only for pending) */}
                                      {req.status === "pending" && (
                                          <div className="flex flex-col gap-2 shrink-0">
                                              <button
                                                  onClick={() =>
                                                      handleApprove(req.id)
                                                  }
                                                  disabled={
                                                      actionLoading === req.id
                                                  }
                                                  className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-2xl text-xs font-black transition-all shadow-sm"
                                              >
                                                  {actionLoading === req.id ? (
                                                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                  ) : (
                                                      <>
                                                          <CheckCircle
                                                              size={14}
                                                          />{" "}
                                                          Approve
                                                      </>
                                                  )}
                                              </button>
                                              <button
                                                  onClick={() =>
                                                      openReject(req.id)
                                                  }
                                                  disabled={
                                                      actionLoading === req.id
                                                  }
                                                  className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-2xl text-xs font-black transition-all shadow-sm"
                                              >
                                                  <XCircle size={14} /> Reject
                                              </button>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          ))}
                          {lastPage > 1 && (
                              <div className="flex justify-center gap-2 mt-6">
                                  <button
                                      onClick={() =>
                                          setCurrentPage((p) => p - 1)
                                      }
                                      disabled={currentPage <= 1}
                                      className="px-4 py-2 rounded-2xl bg-white border border-purple-100 text-sm font-bold
                                    disabled:opacity-40 hover:bg-purple-50 transition-all"
                                  >
                                      ← Previous
                                  </button>
                                  <span className="px-4 py-2 text-sm font-bold text-gray-500">
                                      Page {currentPage} of {lastPage}
                                  </span>
                                  <button
                                      onClick={() =>
                                          setCurrentPage((p) => p + 1)
                                      }
                                      disabled={currentPage >= lastPage}
                                      className="px-4 py-2 rounded-2xl bg-white border border-purple-100 text-sm font-bold
                                    disabled:opacity-40 hover:bg-purple-50 transition-all"
                                  >
                                      Next →
                                  </button>
                              </div>
                          )}
                      </div>
                  )}
              </div>
          </main>

          {/* Reject Modal Overlay */}
          {rejectId !== null && (
              <div
                  className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                  onClick={() => setRejectId(null)}
              >
                  <div
                      className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                  >
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                          Reject Leave Request
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                          Provide a reason for rejection — this will be visible
                          to the employee.
                      </p>

                      <textarea
                          value={rejectReason}
                          onChange={(e) => {
                              setRejectReason(e.target.value);
                              setRejectError("");
                          }}
                          rows={3}
                          placeholder="e.g. Insufficient team coverage this period..."
                          className="w-full bg-gray-50 border-2 border-gray-100 focus:border-red-200 rounded-2xl px-4 py-3 outline-none transition-all text-sm font-bold text-gray-700 resize-none"
                      />
                      {rejectError && (
                          <p className="text-red-500 text-xs font-bold mt-1">
                              {rejectError}
                          </p>
                      )}

                      <div className="flex gap-3 mt-4">
                          <button
                              onClick={() => setRejectId(null)}
                              className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
                          >
                              Cancel
                          </button>
                          <button
                              onClick={handleReject}
                              disabled={actionLoading !== null}
                              className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                          >
                              {actionLoading !== null ? (
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                  "Confirm Rejection"
                              )}
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );
};

export default LeaveApproval;
