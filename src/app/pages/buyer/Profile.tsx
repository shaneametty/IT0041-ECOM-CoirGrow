import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Mail, Phone, MapPin, History, ShoppingCart, LogOut, Edit2, Save, X } from 'lucide-react';
import { BuyerNav } from '../../components/BuyerNav';
import { Footer } from '../../components/Footer';
import { useApp } from '../../context/AppContext';

export function Profile() {
  const { currentUser, logout, orders, cart } = useApp();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || '',
    address: currentUser?.address || '',
    mobile: currentUser?.mobile || '',
  });
  const [saved, setSaved] = useState(false);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const userOrders = orders.filter(o => o.userId === currentUser.id);
  const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = () => {
    // In a real app, this would update the user in the database
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const memberSince = new Date(currentUser.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'long' });

  return (
    <div style={{ backgroundColor: '#f9f5f0' }} className="min-h-screen flex flex-col">
      <BuyerNav />

      {/* Profile Header */}
      <div style={{ backgroundColor: '#2d6a4f' }} className="py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div style={{ backgroundColor: '#52b788' }} className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-4xl font-bold">{currentUser.name.charAt(0).toUpperCase()}</span>
          </div>
          <h1 className="text-white text-2xl font-bold">{currentUser.name}</h1>
          <p style={{ color: '#95d5b2' }} className="text-sm mt-1">{currentUser.email}</p>
          <p style={{ color: '#95d5b2' }} className="text-xs mt-0.5">Member since {memberSince}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Orders', value: userOrders.length, icon: History, color: '#2d6a4f', bg: '#d8f3dc' },
            { label: 'Cart Items', value: cartCount, icon: ShoppingCart, color: '#1e40af', bg: '#dbeafe' },
            { label: 'Total Spent', value: `₱${totalSpent.toFixed(0)}`, icon: User, color: '#92400e', bg: '#fef3c7' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <div style={{ backgroundColor: bg }} className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <p style={{ color: '#1a3a2a' }} className="font-bold text-lg">{value}</p>
              <p className="text-gray-400 text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <h2 style={{ color: '#1a3a2a' }} className="font-bold text-lg flex items-center gap-2">
              <User className="w-5 h-5" style={{ color: '#2d6a4f' }} /> Account Information
            </h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                style={{ color: '#2d6a4f', borderColor: '#2d6a4f' }}
                className="flex items-center gap-1.5 text-sm border rounded-full px-4 py-1.5 hover:bg-green-50"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  style={{ backgroundColor: '#2d6a4f' }}
                  className="flex items-center gap-1.5 text-white text-sm rounded-full px-4 py-1.5"
                >
                  <Save className="w-3 h-3" /> Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-1.5 text-gray-500 text-sm border border-gray-200 rounded-full px-4 py-1.5"
                >
                  <X className="w-3 h-3" /> Cancel
                </button>
              </div>
            )}
          </div>

          {saved && (
            <div style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f' }} className="rounded-xl p-3 text-sm text-center mb-4">
              ✓ Profile updated successfully!
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div className="flex items-start gap-4">
              <div style={{ backgroundColor: '#d8f3dc' }} className="p-2.5 rounded-xl flex-shrink-0">
                <User className="w-4 h-4" style={{ color: '#2d6a4f' }} />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-xs mb-1">Full Name</p>
                {editing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    style={{ borderColor: '#52b788' }}
                    className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
                  />
                ) : (
                  <p style={{ color: '#1a3a2a' }} className="font-medium">{currentUser.name}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div style={{ backgroundColor: '#dbeafe' }} className="p-2.5 rounded-xl flex-shrink-0">
                <Mail className="w-4 h-4" style={{ color: '#1d4ed8' }} />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-xs mb-1">Email Address</p>
                <p style={{ color: '#1a3a2a' }} className="font-medium">{currentUser.email}</p>
                <p className="text-xs text-gray-400">(Email cannot be changed)</p>
              </div>
            </div>

            {/* Mobile */}
            <div className="flex items-start gap-4">
              <div style={{ backgroundColor: '#fef3c7' }} className="p-2.5 rounded-xl flex-shrink-0">
                <Phone className="w-4 h-4" style={{ color: '#92400e' }} />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-xs mb-1">Mobile Number</p>
                {editing ? (
                  <input
                    type="tel"
                    value={editForm.mobile}
                    onChange={e => setEditForm(prev => ({ ...prev, mobile: e.target.value }))}
                    style={{ borderColor: '#52b788' }}
                    className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
                  />
                ) : (
                  <p style={{ color: '#1a3a2a' }} className="font-medium">{currentUser.mobile}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div style={{ backgroundColor: '#fce7f3' }} className="p-2.5 rounded-xl flex-shrink-0">
                <MapPin className="w-4 h-4" style={{ color: '#9d174d' }} />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-xs mb-1">Address</p>
                {editing ? (
                  <textarea
                    value={editForm.address}
                    onChange={e => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                    rows={2}
                    style={{ borderColor: '#52b788' }}
                    className="w-full border rounded-xl px-3 py-2 text-sm outline-none resize-none"
                  />
                ) : (
                  <p style={{ color: '#1a3a2a' }} className="font-medium">{currentUser.address}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <button
            onClick={() => navigate('/transactions')}
            className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow text-left"
          >
            <div style={{ backgroundColor: '#d8f3dc' }} className="p-2.5 rounded-xl">
              <History className="w-5 h-5" style={{ color: '#2d6a4f' }} />
            </div>
            <div>
              <p style={{ color: '#1a3a2a' }} className="font-semibold text-sm">My Orders</p>
              <p className="text-gray-400 text-xs">{userOrders.length} orders</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow text-left"
          >
            <div style={{ backgroundColor: '#dbeafe' }} className="p-2.5 rounded-xl">
              <ShoppingCart className="w-5 h-5" style={{ color: '#1d4ed8' }} />
            </div>
            <div>
              <p style={{ color: '#1a3a2a' }} className="font-semibold text-sm">My Cart</p>
              <p className="text-gray-400 text-xs">{cartCount} items</p>
            </div>
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{ borderColor: '#fca5a5', color: '#dc2626' }}
          className="w-full bg-white border-2 rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>

      <Footer />
    </div>
  );
}
