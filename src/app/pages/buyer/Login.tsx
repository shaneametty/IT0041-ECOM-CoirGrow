import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Leaf, Eye, EyeOff, LogIn } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Footer } from '../../components/Footer';
import { BuyerNav } from '../../components/BuyerNav';

export function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password. Please try again.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ backgroundColor: '#f9f5f0' }} className="min-h-screen flex flex-col">
      <BuyerNav />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header */}
            <div style={{ backgroundColor: '#2d6a4f' }} className="px-8 py-8 text-center">
              <div style={{ backgroundColor: '#52b788' }} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-white text-2xl font-bold">Welcome Back!</h1>
              <p style={{ color: '#95d5b2' }} className="mt-1 text-sm">Sign in to your CoirGrow PH account</p>
            </div>

            {/* Form */}
            <div className="px-8 py-8">
              {error && (
                <div style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5', color: '#dc2626' }} className="border rounded-xl p-3 mb-5 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label style={{ color: '#1a3a2a' }} className="block text-sm font-medium mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    style={{ borderColor: '#d1d5db' }}
                    className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 transition-all"
                    onFocus={e => e.target.style.borderColor = '#52b788'}
                    onBlur={e => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div>
                  <label style={{ color: '#1a3a2a' }} className="block text-sm font-medium mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      style={{ borderColor: '#d1d5db' }}
                      className="w-full border rounded-xl px-4 py-3 text-sm outline-none pr-11 transition-all"
                      onFocus={e => e.target.style.borderColor = '#52b788'}
                      onBlur={e => e.target.style.borderColor = '#d1d5db'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: loading ? '#95d5b2' : '#2d6a4f' }}
                  className="w-full text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  {loading ? 'Signing in...' : <><LogIn className="w-4 h-4" /> Sign In</>}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  Don't have an account?{' '}
                  <Link to="/register" style={{ color: '#2d6a4f' }} className="font-semibold hover:underline">
                    Register here
                  </Link>
                </p>
              </div>

              <div style={{ borderColor: '#d8f3dc' }} className="border-t mt-6 pt-6">
                <p className="text-gray-400 text-xs text-center mb-3">Demo Buyer Account</p>
                <div style={{ backgroundColor: '#f0fdf4', borderColor: '#86efac' }} className="border rounded-xl p-3 text-xs text-center">
                  <p className="text-gray-500">Register a new account to try the buyer experience.</p>
                  <p style={{ color: '#2d6a4f' }} className="mt-1 font-medium">Or use: <span className="font-mono">buyer@demo.com / demo123</span> (after registering)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Link */}
          <p className="text-center mt-6 text-gray-500 text-sm">
            Are you a seller?{' '}
            <Link to="/seller/login" style={{ color: '#2d6a4f' }} className="font-semibold hover:underline">
              Seller Login →
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
