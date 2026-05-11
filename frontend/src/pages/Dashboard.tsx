import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, MoreVertical, Plus, type LucideIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
}

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
            <button
              onClick={() => navigate('/apply-leave')}
              className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-purple-200 transition-all flex items-center gap-2"
            >
              <Plus size={18} /> Apply for Leave
            </button>
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

          {/* Quick Stats/Activity (1 Col) */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-purple-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8">System Status</h3>
            <div className="space-y-8 relative before:absolute before:left-2.75 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-50">
              <ActivityItem text="Server Online" sub="Uptime 99.9%" color="bg-green-500" />
              <ActivityItem text="DB Connected" sub="Latentcy 24ms" color="bg-purple-500" />
              <ActivityItem text="Auth Sync" sub="Last check 1m ago" color="bg-blue-500" />
            </div>
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

const ActivityItem = ({ text, sub, color }: { text: string; sub: string; color: string }) => (
  <div className="flex items-start gap-5 relative z-10">
    <div className={`w-3 h-3 rounded-full mt-1.5 ring-4 ring-white ${color}`}></div>
    <div>
      <p className="text-sm font-bold text-gray-800">{text}</p>
      <p className="text-xs text-gray-400 font-medium">{sub}</p>
    </div>
  </div>
);

export default Dashboard;
