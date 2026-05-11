import { useNavigate } from 'react-router-dom';
import { Moon, Bell, LogOut, ArrowLeft, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const Header = ({ title, showBackButton }: HeaderProps) => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { user, logout } = authContext || {};

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-purple-100 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {showBackButton ? (
          <button onClick={() => navigate(-1)} className="p-2 text-gray-500 hover:bg-purple-50 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
        ) : (
          <div className="flex items-center flex-1 max-w-md bg-gray-100/50 rounded-xl px-3 py-2">
            <Search size={18} className="text-gray-400" />
            <input type="text" placeholder="Search tasks..." className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full" />
          </div>
        )}
      </div>

      <h1 className="text-xl font-bold text-gray-900 hidden md:block">{title}</h1>

      <div className="flex items-center space-x-3 md:space-x-5">
        <button className="p-2 text-gray-500 hover:bg-purple-50 rounded-full transition-colors"><Moon size={20} /></button>
        <button className="p-2 text-gray-500 hover:bg-purple-50 rounded-full relative transition-colors">
          <Bell size={20} /><span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-gray-200 mx-2"></div>
        <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 transition-colors"><LogOut size={20} /></button>
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} className="w-9 h-9 rounded-full border border-purple-200 bg-purple-50" alt="profile" />
      </div>
    </header>
  );
};

export default Header;
