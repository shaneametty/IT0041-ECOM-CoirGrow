import { useNavigate } from 'react-router';
import { Package, ShoppingBag, BarChart2, TrendingUp, AlertCircle, DollarSign, Users, FileText } from 'lucide-react';
import { SellerNav } from '../../components/SellerNav';
import { Footer } from '../../components/Footer';
import { useApp } from '../../context/AppContext';

export function SellerDashboard() {
  const { currentSeller, products, orders } = useApp();
  const navigate = useNavigate();

  if (!currentSeller) { navigate('/seller/login'); return null; }

  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
  const todaySales = todayOrders.reduce((s, o) => s + o.total, 0);
  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const lowStockProducts = products.filter(p => p.stock < 20 && p.stock > 0);
  const outOfStock = products.filter(p => p.stock === 0);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);

  const STATUS_COLORS: Record<string, string> = {
    Processing: '#dbeafe',
    Shipped: '#fef3c7',
    Delivered: '#d8f3dc',
    Completed: '#d8f3dc',
    Cancelled: '#fee2e2',
  };
  const STATUS_TEXT: Record<string, string> = {
    Processing: '#1d4ed8',
    Shipped: '#92400e',
    Delivered: '#1a3a2a',
    Completed: '#2d6a4f',
    Cancelled: '#dc2626',
  };

  return (
    <div style={{ backgroundColor: '#f0f4f1' }} className="min-h-screen flex flex-col">
      <SellerNav />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Welcome */}
        <div className="mb-8">
          <h1 style={{ color: '#1a3a2a' }} className="text-2xl font-bold">Welcome back, {currentSeller.name.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening with your store today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Today's Sales", value: `₱${todaySales.toFixed(2)}`, icon: DollarSign, color: '#2d6a4f', bg: '#d8f3dc', sub: `${todayOrders.length} orders today` },
            { label: 'Total Revenue', value: `₱${totalSales.toFixed(2)}`, icon: TrendingUp, color: '#1d4ed8', bg: '#dbeafe', sub: `All time` },
            { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: '#92400e', bg: '#fef3c7', sub: `All time` },
            { label: 'Products', value: products.length, icon: Package, color: '#9d174d', bg: '#fce7f3', sub: `${outOfStock.length} out of stock` },
          ].map(({ label, value, icon: Icon, color, bg, sub }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-400 text-xs">{label}</p>
                  <p style={{ color: '#1a3a2a' }} className="text-xl font-bold mt-1">{value}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
                </div>
                <div style={{ backgroundColor: bg }} className="p-2.5 rounded-xl">
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ color: '#1a3a2a' }} className="font-bold">Recent Orders</h2>
              <button onClick={() => navigate('/seller/reports')} style={{ color: '#2d6a4f' }} className="text-xs hover:underline">View All</button>
            </div>
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} style={{ borderColor: '#f3f4f6' }} className="border rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p style={{ color: '#1a3a2a' }} className="text-sm font-medium">#{order.id}</p>
                    <p className="text-xs text-gray-400">{order.items.length} item(s) · {new Date(order.createdAt).toLocaleDateString('en-PH')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      style={{ backgroundColor: STATUS_COLORS[order.status] || '#f3f4f6', color: STATUS_TEXT[order.status] || '#374151' }}
                      className="text-xs px-2 py-0.5 rounded-full"
                    >
                      {order.status}
                    </span>
                    <span style={{ color: '#2d6a4f' }} className="font-bold text-sm">₱{order.total.toFixed(0)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ color: '#1a3a2a' }} className="font-bold">Top Selling Products</h2>
              <button onClick={() => navigate('/seller/inventory')} style={{ color: '#2d6a4f' }} className="text-xs hover:underline">Manage</button>
            </div>
            <div className="space-y-3">
              {topProducts.map((product, idx) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span style={{ color: idx === 0 ? '#f4a261' : '#9ca3af' }} className="text-sm font-bold w-5">#{idx + 1}</span>
                  <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p style={{ color: '#1a3a2a' }} className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-gray-400 text-xs">{product.sold} sold</p>
                  </div>
                  <div className="text-right">
                    <p style={{ color: '#2d6a4f' }} className="font-bold text-sm">₱{product.price}</p>
                    <p className="text-xs text-gray-400">{product.stock} left</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts */}
        {(lowStockProducts.length > 0 || outOfStock.length > 0) && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" /> Inventory Alerts
            </h2>
            <div className="space-y-2">
              {outOfStock.map(p => (
                <div key={p.id} style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5' }} className="border rounded-xl px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p style={{ color: '#dc2626' }} className="font-medium text-sm">{p.name}</p>
                      <p className="text-red-400 text-xs">Out of stock!</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/seller/inventory')} className="text-xs text-red-600 hover:underline">Restock</button>
                </div>
              ))}
              {lowStockProducts.map(p => (
                <div key={p.id} style={{ backgroundColor: '#fef3c7', borderColor: '#fcd34d' }} className="border rounded-xl px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p style={{ color: '#92400e' }} className="font-medium text-sm">{p.name}</p>
                      <p className="text-yellow-600 text-xs">Only {p.stock} left</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/seller/inventory')} className="text-xs text-yellow-700 hover:underline">Update</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Manage Storefront', to: '/seller/storefront', icon: ShoppingBag, color: '#2d6a4f', bg: '#d8f3dc' },
            { label: 'Manage Inventory', to: '/seller/inventory', icon: Package, color: '#1d4ed8', bg: '#dbeafe' },
            { label: 'View Reports', to: '/seller/reports', icon: BarChart2, color: '#92400e', bg: '#fef3c7' },
            { label: 'Inventory Report', to: '/seller/inventory-report', icon: FileText, color: '#9d174d', bg: '#fce7f3' },
          ].map(({ label, to, icon: Icon, color, bg }) => (
            <button
              key={label}
              onClick={() => navigate(to)}
              className="bg-white rounded-2xl p-5 shadow-sm flex flex-col items-center gap-3 hover:shadow-md transition-shadow text-center"
            >
              <div style={{ backgroundColor: bg }} className="p-3 rounded-xl">
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <p style={{ color: '#1a3a2a' }} className="font-medium text-sm">{label}</p>
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
