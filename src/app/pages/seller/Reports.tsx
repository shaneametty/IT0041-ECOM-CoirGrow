import { useNavigate } from 'react-router';
import { BarChart2, DollarSign, ShoppingBag, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { SellerNav } from '../../components/SellerNav';
import { Footer } from '../../components/Footer';
import { useApp } from '../../context/AppContext';

export function Reports() {
  const { currentSeller, orders, products } = useApp();
  const navigate = useNavigate();

  if (!currentSeller) { navigate('/seller/login'); return null; }

  const today = new Date();
  const todayStr = today.toDateString();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === todayStr);
  const monthOrders = orders.filter(o => {
    const d = new Date(o.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const todaySales = todayOrders.reduce((s, o) => s + o.total, 0);
  const monthSales = monthOrders.reduce((s, o) => s + o.total, 0);
  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = orders.length > 0 ? totalSales / orders.length : 0;

  // Monthly breakdown for chart (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today);
    d.setMonth(d.getMonth() - (5 - i));
    const m = d.getMonth();
    const y = d.getFullYear();
    const monthOrds = orders.filter(o => {
      const od = new Date(o.createdAt);
      return od.getMonth() === m && od.getFullYear() === y;
    });
    const sales = monthOrds.reduce((s, o) => s + o.total, 0);
    return {
      name: d.toLocaleDateString('en-PH', { month: 'short' }),
      sales: parseFloat(sales.toFixed(2)),
      orders: monthOrds.length,
    };
  });

  // Payment method breakdown
  const paymentBreakdown = orders.reduce((acc, o) => {
    acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + o.total;
    return acc;
  }, {} as Record<string, number>);

  const paymentData = Object.entries(paymentBreakdown).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
  const PIE_COLORS = ['#2d6a4f', '#52b788', '#f4a261', '#95d5b2', '#1d4ed8'];

  // Top products by revenue
  const productRevenue = orders.flatMap(o => o.items).reduce((acc, item) => {
    acc[item.productId] = (acc[item.productId] || 0) + item.price * item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const topByRevenue = Object.entries(productRevenue)
    .map(([id, revenue]) => ({ product: products.find(p => p.id === id), revenue }))
    .filter(x => x.product)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Delivery method breakdown
  const deliveryBreakdown = orders.reduce((acc, o) => {
    const key = o.deliveryMethod === 'pickup' ? 'Store Pickup' : 'Home Delivery';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    Processing: { bg: '#dbeafe', color: '#1d4ed8' },
    Shipped: { bg: '#fef3c7', color: '#92400e' },
    Delivered: { bg: '#d8f3dc', color: '#2d6a4f' },
    Completed: { bg: '#d8f3dc', color: '#2d6a4f' },
    Cancelled: { bg: '#fee2e2', color: '#dc2626' },
  };

  return (
    <div style={{ backgroundColor: '#f0f4f1' }} className="min-h-screen flex flex-col">
      <SellerNav />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="mb-6">
          <h1 style={{ color: '#1a3a2a' }} className="text-2xl font-bold flex items-center gap-2">
            <BarChart2 className="w-6 h-6" style={{ color: '#2d6a4f' }} /> Sales Reports
          </h1>
          <p className="text-gray-500 text-sm mt-1">Track your store's sales performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Today's Sales", value: `₱${todaySales.toFixed(2)}`, sub: `${todayOrders.length} orders`, icon: Calendar, color: '#2d6a4f', bg: '#d8f3dc' },
            { label: "This Month's Sales", value: `₱${monthSales.toFixed(2)}`, sub: `${monthOrders.length} orders`, icon: DollarSign, color: '#1d4ed8', bg: '#dbeafe' },
            { label: 'Total Revenue', value: `₱${totalSales.toFixed(2)}`, sub: `${orders.length} total orders`, icon: TrendingUp, color: '#9d174d', bg: '#fce7f3' },
            { label: 'Avg. Order Value', value: `₱${avgOrderValue.toFixed(2)}`, sub: 'Per order', icon: ShoppingBag, color: '#92400e', bg: '#fef3c7' },
          ].map(({ label, value, sub, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div style={{ backgroundColor: bg }} className="p-2.5 rounded-xl">
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
              </div>
              <p style={{ color: '#1a3a2a' }} className="text-xl font-bold">{value}</p>
              <p className="text-gray-400 text-xs">{label}</p>
              <p style={{ color }} className="text-xs font-medium mt-1">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Sales Chart */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-4">Monthly Sales (Last 6 Months)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(v) => `₱${v}`} />
                <Tooltip formatter={(v: number) => [`₱${v}`, 'Sales']} />
                <Bar dataKey="sales" fill="#2d6a4f" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Method Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-4">Sales by Payment Method</h2>
            {paymentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={paymentData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {paymentData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(v: number) => `₱${v}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data available</div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Top Products by Revenue */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-4">Top Products by Revenue</h2>
            <div className="space-y-3">
              {topByRevenue.map(({ product, revenue }, idx) => (
                <div key={product!.id} className="flex items-center gap-3">
                  <span style={{ color: idx === 0 ? '#f4a261' : '#9ca3af' }} className="font-bold text-sm w-5">#{idx + 1}</span>
                  <img src={product!.image} alt={product!.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p style={{ color: '#1a3a2a' }} className="text-sm font-medium truncate">{product!.name}</p>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                      <div
                        style={{ backgroundColor: '#2d6a4f', width: `${(revenue / (topByRevenue[0]?.revenue || 1)) * 100}%` }}
                        className="h-1.5 rounded-full"
                      />
                    </div>
                  </div>
                  <span style={{ color: '#2d6a4f' }} className="font-bold text-sm flex-shrink-0">₱{revenue.toFixed(0)}</span>
                </div>
              ))}
              {topByRevenue.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No sales data yet</p>}
            </div>
          </div>

          {/* Delivery Method & Recent Transactions */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-3">Delivery Method Breakdown</h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(deliveryBreakdown).map(([method, count]) => (
                  <div key={method} style={{ backgroundColor: '#f9fafb' }} className="rounded-xl p-4 text-center">
                    <p style={{ color: '#2d6a4f' }} className="text-2xl font-bold">{count}</p>
                    <p className="text-gray-400 text-xs mt-1">{method}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-3">Today's Orders</h2>
              {todayOrders.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No orders today yet</p>
              ) : (
                <div className="space-y-2">
                  {todayOrders.map(order => {
                    const st = STATUS_COLORS[order.status] || { bg: '#f3f4f6', color: '#374151' };
                    return (
                      <div key={order.id} style={{ borderColor: '#f3f4f6' }} className="border rounded-xl p-3 flex justify-between items-center">
                        <div>
                          <p style={{ color: '#1a3a2a' }} className="text-sm font-medium">#{order.id}</p>
                          <p className="text-gray-400 text-xs">{order.paymentMethod}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ backgroundColor: st.bg, color: st.color }} className="text-xs px-2 py-0.5 rounded-full">{order.status}</span>
                          <span style={{ color: '#2d6a4f' }} className="font-bold text-sm">₱{order.total}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* This Month's Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-4">
            This Month's Orders ({monthOrders.length} total — ₱{monthSales.toFixed(2)})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  {['Order ID', 'Date', 'Items', 'Payment', 'Delivery', 'Status', 'Total'].map(h => (
                    <th key={h} style={{ color: '#6b7280' }} className="text-left text-xs font-semibold px-3 py-2 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order, idx) => {
                  const st = STATUS_COLORS[order.status] || { bg: '#f3f4f6', color: '#374151' };
                  return (
                    <tr key={order.id} style={{ backgroundColor: idx % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td className="px-3 py-2.5 text-xs font-mono" style={{ color: '#1a3a2a' }}>#{order.id}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-PH')}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-500">{order.items.length}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-500">{order.paymentMethod}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-500 capitalize">{order.deliveryMethod === 'pickup' ? 'Pickup' : 'Delivery'}</td>
                      <td className="px-3 py-2.5">
                        <span style={{ backgroundColor: st.bg, color: st.color }} className="text-xs px-2 py-0.5 rounded-full">{order.status}</span>
                      </td>
                      <td className="px-3 py-2.5 font-bold text-sm" style={{ color: '#2d6a4f' }}>₱{order.total.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {monthOrders.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-sm">No orders this month</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
