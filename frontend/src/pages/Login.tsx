import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import LoginIllustration from '../components/illustrations/LoginIllustration';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('AuthContext must be used within AuthProvider');

  const { login } = authContext;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  // Show Spinner while loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-purple-50">
        <Spinner size="8" />
        <span className="ml-4 text-lg text-purple-600">Signing in...</span>
      </div>
    );
  }

  return (
      <div className="flex min-h-screen bg-white">
          {/* Left Side: Illustration (2/3) - Purple Pastel Theme */}
          <div className="hidden lg:flex lg:w-2/3 bg-purple-400 items-center justify-center p-12">
              <div className="max-w-md text-center">
                  <h1 className="text-3xl font-bold text-white mb-6">
                      Manage your team effortlessly.
                  </h1>
                  <p className="text-purple-100 text-lg mb-8">
                      The all-in-one platform for leave management, employee
                      tracking, and HR operations.
                  </p>

                  <div className="relative z-10 w-full transform hover:scale-105 transition-transform duration-500">
                      <LoginIllustration className="w-full h-auto drop-shadow-2xl opacity-90" />
                  </div>

              </div>
          </div>

          {/* Right Side: Login Form (1/3) - Light Purple Background */}
          <div className="w-full lg:w-1/3 flex items-center justify-center py-8 px-12 bg-purple-50">
              <div className="w-full max-w-sm">
                  <div className="mb-10 text-center lg:text-left">
                      <h2 className="text-3xl font-bold text-gray-900">
                          Welcome Back
                      </h2>
                      <p className="text-gray-500 mt-2">
                          Please enter your details to sign in.
                      </p>
                  </div>

                  {error && (
                      <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                          {error}
                      </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-6">
                      <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Email Address
                          </label>
                          <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                  <Mail size={18} />
                              </span>
                              <input
                                  type="email"
                                  required
                                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
                                  placeholder="admin@example.com"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                              />
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Password
                          </label>
                          <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                  <Lock size={18} />
                              </span>
                              <input
                                  type="password"
                                  required
                                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
                                  placeholder="••••••••"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                              />
                          </div>
                      </div>

                      <div className="flex items-center justify-between">
                          <label className="flex items-center">
                              <input
                                  type="checkbox"
                                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="ml-2 text-sm text-gray-600">
                                  Remember me
                              </span>
                          </label>
                          <a
                              href="#"
                              className="text-sm font-semibold text-purple-600 hover:text-purple-700"
                          >
                              Forgot password?
                          </a>
                      </div>

                      <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                      >
                          {loading ? (
                              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                              "Sign In"
                          )}
                      </button>
                  </form>

                  <p className="mt-8 text-center text-sm text-gray-500">
                      Don't have an account?{" "}
                      <span className="text-purple-600 font-semibold cursor-pointer">
                          Contact HR
                      </span>
                  </p>
              </div>
          </div>
      </div>
  );
};

export default Login;
