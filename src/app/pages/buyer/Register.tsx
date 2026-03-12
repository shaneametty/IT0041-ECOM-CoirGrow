import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Leaf, Eye, EyeOff, UserPlus, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Footer } from '../../components/Footer';
import { BuyerNav } from '../../components/BuyerNav';

export function Register() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '', name: '', address: '', mobile: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required.';
    if (!form.email.trim()) newErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Please enter a valid email.';
    if (!form.password) newErrors.password = 'Password is required.';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    if (!form.address.trim()) newErrors.address = 'Address is required.';
    if (!form.mobile.trim()) newErrors.mobile = 'Mobile number is required.';
    else if (!/^(09|\+639)\d{9}$/.test(form.mobile.replace(/\s/g, ''))) newErrors.mobile = 'Enter a valid PH mobile number (e.g. 09171234567).';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const result = await register({
        email: form.email,
        password: form.password,
        name: form.name,
        address: form.address,
        mobile: form.mobile,
      });
      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate('/'), 1500);
      } else {
        setServerError(result.message);
      }
    } catch (err: any) {
      setServerError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all ${errors[field] ? 'border-red-400' : 'border-gray-300'}`;

  if (success) {
    return (
      <div style={{ backgroundColor: '#f9f5f0' }} className="min-h-screen flex flex-col">
        <BuyerNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div style={{ backgroundColor: '#d8f3dc' }} className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12" style={{ color: '#2d6a4f' }} />
            </div>
            <h2 style={{ color: '#1a3a2a' }} className="text-2xl font-bold mb-2">Registration Successful!</h2>
            <p className="text-gray-500">Redirecting you to the home page...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f9f5f0' }} className="min-h-screen flex flex-col">
      <BuyerNav />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header */}
            <div style={{ backgroundColor: '#2d6a4f' }} className="px-8 py-8 text-center">
              <div style={{ backgroundColor: '#52b788' }} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-white text-2xl font-bold">Create Your Account</h1>
              <p style={{ color: '#95d5b2' }} className="mt-1 text-sm">Join the CoirGrow PH community</p>
            </div>

            {/* Form */}
            <div className="px-8 py-8">
              {serverError && (
                <div style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5', color: '#dc2626' }} className="border rounded-xl p-3 mb-5 text-sm text-center">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label style={{ color: '#1a3a2a' }} className="block text-sm font-medium mb-1.5">
                    Complete Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="Juan dela Cruz"
                    className={inputClass('name')}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label style={{ color: '#1a3a2a' }} className="block text-sm font-medium mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="juan@example.com"
                    className={inputClass('email')}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label style={{ color: '#1a3a2a' }} className="block text-sm font-medium mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                      placeholder="At least 6 characters"
                      className={inputClass('password') + ' pr-11'}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{ color: '#1a3a2a' }} className="block text-sm font-medium mb-1.5">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                      placeholder="Re-enter your password"
                      className={inputClass('confirmPassword') + ' pr-11'}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Address */}
                <div>
                  <label style={{ color: '#1a3a2a' }} className="block text-sm font-medium mb-1.5">
                    Complete Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address" value={form.address} onChange={handleChange}
                    placeholder="House No., Street, Barangay, City, Province"
                    rows={2}
                    style={{ borderColor: errors.address ? '#f87171' : '#d1d5db' }}
                    className="w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                {/* Mobile */}
                <div>
                  <label style={{ color: '#1a3a2a' }} className="block text-sm font-medium mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel" name="mobile" value={form.mobile} onChange={handleChange}
                    placeholder="09171234567"
                    className={inputClass('mobile')}
                  />
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: loading ? '#95d5b2' : '#2d6a4f' }}
                  className="w-full text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-2"
                >
                  {loading ? 'Creating Account...' : <><UserPlus className="w-4 h-4" /> Create Account</>}
                </button>
              </form>

              <p className="text-center mt-6 text-gray-500 text-sm">
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#2d6a4f' }} className="font-semibold hover:underline">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
