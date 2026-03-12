import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Leaf, Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Footer } from '../../components/Footer';

export function SellerLogin() {
  const { sellerLogin } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await sellerLogin(email, password);
      if (success) {
        navigate('/seller/dashboard');
      } else {
        setError('Invalid seller credentials. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0f2419' }} className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div style={{ backgroundColor: '#1a3a2a' }} className="px-8 py-10 text-center">
              <div style={{ backgroundColor: '#52b788' }} className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Leaf className="w-5 h-5" style={{ color: '#95d5b2' }} />
                <span className="text-white text-xl font-bold">CoirGrow PH</span>
              </div>
              <h1 className="text-white text-2xl font-bold">Seller Portal</h1>
              <p style={{ color: '#95d5b2' }} className="mt-1 text-sm">Sign in to manage your store</p>
            </div>

            {/* Form */}
            <div style={{ backgroundColor: '#1f2937' }} className="px-8 py-8">
              {error && (
                <div style={{ backgroundColor: '#450a0a', borderColor: '#dc2626', color: '#fca5a5' }} className="border rounded-xl p-3 mb-5 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label style={{ color: '#d1d5db' }} className="block text-sm font-medium mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="seller@coirgrow.ph"
                    style={{ backgroundColor: '#111827', borderColor: '#374151', color: 'white' }}
                    className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 transition-colors"
                  />
                </div>

                <div>
                  <label style={{ color: '#d1d5db' }} className="block text-sm font-medium mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      style={{ backgroundColor: '#111827', borderColor: '#374151', color: 'white' }}
                      className="w-full border rounded-xl px-4 py-3 text-sm outline-none pr-11 focus:border-green-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: loading ? '#1a4733' : '#2d6a4f' }}
                  className="w-full text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  {loading ? 'Signing in...' : <><LogIn className="w-4 h-4" /> Seller Sign In</>}
                </button>
              </form>

              {/* Demo Credentials */}
              <div style={{ backgroundColor: '#111827', borderColor: '#374151' }} className="border rounded-xl p-4 mt-6">
                <p style={{ color: '#6b7280' }} className="text-xs text-center mb-2">Demo Seller Credentials</p>
                <p style={{ color: '#9ca3af' }} className="text-xs text-center font-mono">
                  seller@coirgrow.ph / seller123
                </p>
              </div>
            </div>
          </div>

          <p className="text-center mt-6" style={{ color: '#52b788' }}>
            <a href="/" className="text-sm hover:underline">← Back to Store</a>
          </p>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div style={{ backgroundColor: '#0a1a10' }} className="py-4 text-center">
        <p style={{ color: '#374151' }} className="text-xs italic">
          For educational purposes only, and no copyright infringement is intended.
        </p>
      </div>
    </div>
  );
}
