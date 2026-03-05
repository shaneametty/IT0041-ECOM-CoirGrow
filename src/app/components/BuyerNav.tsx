import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Leaf, ShoppingCart, User, Menu, X, Search, LogOut, History } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function BuyerNav() {
  const { currentUser, logout, cart } = useApp();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Storefront', to: '/storefront' },
    { label: 'Products', to: '/products' },
  ];

  return (
    <nav style={{ backgroundColor: '#2d6a4f' }} className="sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div style={{ backgroundColor: '#52b788' }} className="p-1.5 rounded-full">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-lg font-semibold">CoirGrow <span style={{ color: '#95d5b2' }}>PH</span></span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <Link key={l.label} to={l.to} style={{ color: '#d8f3dc' }} className="text-sm hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ backgroundColor: '#1a4733', borderColor: '#52b788', color: 'white' }}
                className="rounded-l-full pl-4 pr-4 py-1.5 text-sm border outline-none placeholder:text-gray-400 w-52"
              />
              <button type="submit" style={{ backgroundColor: '#52b788' }} className="rounded-r-full px-3 py-1.5">
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </form>

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
              <ShoppingCart className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <span style={{ backgroundColor: '#f4a261' }} className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/10">
                  <div style={{ backgroundColor: '#52b788' }} className="w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{currentUser.name.charAt(0).toUpperCase()}</span>
                  </div>
                </Link>
                <Link to="/transactions" style={{ color: '#d8f3dc' }} className="p-2 rounded-full hover:bg-white/10">
                  <History className="w-5 h-5" />
                </Link>
                <button onClick={handleLogout} style={{ color: '#d8f3dc' }} className="p-2 rounded-full hover:bg-white/10">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" style={{ color: '#d8f3dc' }} className="text-sm hover:text-white">Login</Link>
                <Link to="/register" style={{ backgroundColor: '#f4a261' }} className="text-sm text-white px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ backgroundColor: '#1a4733' }} className="md:hidden px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ backgroundColor: '#2d6a4f', color: 'white', borderColor: '#52b788' }}
              className="flex-1 rounded-l-full pl-4 py-2 text-sm border outline-none placeholder:text-gray-400"
            />
            <button type="submit" style={{ backgroundColor: '#52b788' }} className="rounded-r-full px-3">
              <Search className="w-4 h-4 text-white" />
            </button>
          </form>
          {navLinks.map(l => (
            <Link key={l.label} to={l.to} onClick={() => setMenuOpen(false)} style={{ color: '#d8f3dc' }} className="block py-2 text-sm hover:text-white">
              {l.label}
            </Link>
          ))}
          <Link to="/cart" onClick={() => setMenuOpen(false)} style={{ color: '#d8f3dc' }} className="flex items-center gap-2 py-2 text-sm">
            <ShoppingCart className="w-4 h-4" /> Cart {cartCount > 0 && `(${cartCount})`}
          </Link>
          {currentUser ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ color: '#d8f3dc' }} className="flex items-center gap-2 py-2 text-sm">
                <User className="w-4 h-4" /> {currentUser.name}
              </Link>
              <Link to="/transactions" onClick={() => setMenuOpen(false)} style={{ color: '#d8f3dc' }} className="flex items-center gap-2 py-2 text-sm">
                <History className="w-4 h-4" /> Transaction History
              </Link>
              <button onClick={handleLogout} style={{ color: '#f4a261' }} className="flex items-center gap-2 py-2 text-sm">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ color: '#d8f3dc' }} className="text-sm hover:text-white">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{ backgroundColor: '#f4a261' }} className="text-sm text-white px-4 py-1.5 rounded-full">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
