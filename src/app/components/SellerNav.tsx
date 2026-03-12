import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Leaf, LayoutDashboard, Package, BarChart2, ShoppingBag, LogOut, Menu, X, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function SellerNav() {
  const { currentSeller, sellerLogout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await sellerLogout();
    navigate('/seller/login');
  };

  const navLinks = [
    { label: 'Dashboard', to: '/seller/dashboard', icon: LayoutDashboard },
    { label: 'Storefront', to: '/seller/storefront', icon: ShoppingBag },
    { label: 'Inventory', to: '/seller/inventory', icon: Package },
    { label: 'Reports', to: '/seller/reports', icon: BarChart2 },
    { label: 'Inv. Report', to: '/seller/inventory-report', icon: FileText },
  ];

  const isActive = (to: string) => location.pathname === to;

  return (
    <nav style={{ backgroundColor: '#1a3a2a' }} className="sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/seller/dashboard" className="flex items-center gap-2">
            <div style={{ backgroundColor: '#52b788' }} className="p-1.5 rounded-full">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-lg font-semibold">CoirGrow <span style={{ color: '#95d5b2' }}>Seller</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, to, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive(to) ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                style={isActive(to) ? { backgroundColor: '#2d6a4f' } : {}}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
            {currentSeller && (
              <div className="flex items-center gap-2">
                <div style={{ backgroundColor: '#2d6a4f' }} className="px-3 py-1.5 rounded-full flex items-center gap-2">
                  <div style={{ backgroundColor: '#52b788' }} className="w-6 h-6 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">{currentSeller.name.charAt(0)}</span>
                  </div>
                  <span style={{ color: '#d8f3dc' }} className="text-sm">{currentSeller.name.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} style={{ color: '#95d5b2' }} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ backgroundColor: '#1a3a2a' }} className="md:hidden px-4 py-4 space-y-1 border-t border-white/10">
          {navLinks.map(({ label, to, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive(to) ? 'text-white' : 'text-gray-300'}`}
              style={isActive(to) ? { backgroundColor: '#2d6a4f' } : {}}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <button onClick={handleLogout} style={{ color: '#f4a261' }} className="flex items-center gap-2 px-3 py-2 text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
