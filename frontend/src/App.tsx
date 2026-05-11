import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ApplyLeave from './pages/ApplyLeave';
import LeaveHistory from './pages/LeaveHistory';
import MyBalances from './pages/MyBalances';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Protected Route Component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const authContext = useContext(AuthContext);
  if (!authContext) return <div>Loading...</div>;

  // THIS IS CRITICAL:
  if (authContext.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return authContext.user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
            path="/dashboard"
            element={
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route
            path="/leave-history"
            element={
                <PrivateRoute>
                    <LeaveHistory />
                </PrivateRoute>
            }
        />
        <Route
            path="/apply-leave"
            element={
                <PrivateRoute>
                    <ApplyLeave />
                </PrivateRoute>
            }
        />
        <Route
            path="/my-balances"
            element={
                <PrivateRoute>
                    <MyBalances />
                </PrivateRoute>
            }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
