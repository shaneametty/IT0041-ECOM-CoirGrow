import { useNavigate } from 'react-router';
import { FileText, AlertCircle, Package, TrendingUp, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SellerNav } from '../../components/SellerNav';
import { Footer } from '../../components/Footer';
import { useApp } from '../../context/AppContext';

export function InventoryReport() {
  const { currentSeller, products } = useApp();
  const navigate = useNavigate();

  if (!currentSeller) { navigate('/seller/login'); return null; }

  const totalItems = products.reduce((s, p) => s + p.stock, 0);
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const totalSoldItems = products.reduce((s, p) => s + p.sold, 0);
  const outOfStock = products.filter(p => p.stock === 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock < 20);
  const healthy = products.filter(p => p.stock >= 20);

  // Category breakdown
  const categoryData = products.reduce((acc, p) => {
    const cat = p.category;
    if (!acc[cat]) acc[cat] = { name: cat, stock: 0, value: 0, items: 0 };
    acc[cat].stock += p.stock;
    acc[cat].value += p.price * p.stock;
    acc[cat].items += 1;
    return acc;
  }, {} as Record<string, { name: string; stock: number; value: number; items: number }>);
  const categoryChartData = Object.values(categoryData);

  const handlePrint = () => window.print();

  return (
    <div style={{ backgroundColor: '#f0f4f1' }} className="min-h-screen flex flex-col">
      <SellerNav />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ color: '#1a3a2a' }} className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6" style={{ color: '#2d6a4f' }} /> Inventory Report
            </h1>
            <p className="text-gray-500 text-sm mt-1">Comprehensive overview of your current stock</p>
          </div>
          <button
            onClick={handlePrint}
            style={{ backgroundColor: '#2d6a4f' }}
            className="flex items-center gap-2 text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:opacity-90"
          >
            <Download className="w-4 h-4" /> Print / Export
          </button>
        </div>

        {/* Report Date */}
        <div style={{ backgroundColor: '#d8f3dc', borderColor: '#52b788' }} className="border rounded-2xl px-5 py-3 mb-6 flex items-center gap-2">
          <FileText className="w-4 h-4" style={{ color: '#2d6a4f' }} />
          <p style={{ color: '#1a3a2a' }} className="text-sm font-medium">
            Report generated on: {new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total SKUs', value: products.length, sub: 'Product lines', color: '#2d6a4f', bg: '#d8f3dc', icon: Package },
            { label: 'Total Stock Units', value: totalItems.toLocaleString(), sub: 'Items in inventory', color: '#1d4ed8', bg: '#dbeafe', icon: Package },
            { label: 'Inventory Value', value: `₱${totalValue.toLocaleString()}`, sub: 'At current price', color: '#92400e', bg: '#fef3c7', icon: TrendingUp },
            { label: 'Total Units Sold', value: totalSoldItems.toLocaleString(), sub: 'All time', color: '#9d174d', bg: '#fce7f3', icon: TrendingUp },
          ].map(({ label, value, sub, color, bg, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
              <div style={{ backgroundColor: bg }} className="p-2.5 rounded-xl w-fit mb-3">
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <p style={{ color: '#1a3a2a' }} className="text-xl font-bold">{value}</p>
              <p className="text-gray-400 text-xs">{label}</p>
              <p style={{ color }} className="text-xs mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Stock Status Overview */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Healthy Stock', count: healthy.length, color: '#2d6a4f', bg: '#d8f3dc', desc: '20+ units' },
            { label: 'Low Stock', count: lowStock.length, color: '#92400e', bg: '#fef3c7', desc: '1–19 units' },
            { label: 'Out of Stock', count: outOfStock.length, color: '#dc2626', bg: '#fee2e2', desc: '0 units' },
          ].map(({ label, count, color, bg, desc }) => (
            <div key={label} style={{ backgroundColor: bg }} className="rounded-2xl p-5 flex items-center gap-4">
              <div style={{ backgroundColor: color }} className="w-12 h-12 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">{count}</span>
              </div>
              <div>
                <p style={{ color }} className="font-bold">{label}</p>
                <p style={{ color }} className="text-sm opacity-70">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Category Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-4">Stock by Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryChartData} margin={{ top: 5, right: 5, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} angle={-20} textAnchor="end" />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip />
              <Bar dataKey="stock" fill="#52b788" radius={[6, 6, 0, 0]} name="Stock Units" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts */}
        {(outOfStock.length > 0 || lowStock.length > 0) && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" /> Stock Alerts
            </h2>
            {outOfStock.length > 0 && (
              <div className="mb-4">
                <h3 className="text-red-500 font-semibold text-sm mb-2">❌ Out of Stock ({outOfStock.length})</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {outOfStock.map(p => (
                    <div key={p.id} style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5' }} className="border rounded-xl p-3 flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p style={{ color: '#dc2626' }} className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-red-400">0 units remaining</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {lowStock.length > 0 && (
              <div>
                <h3 className="text-orange-500 font-semibold text-sm mb-2">⚠️ Low Stock ({lowStock.length})</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {lowStock.map(p => (
                    <div key={p.id} style={{ backgroundColor: '#fef3c7', borderColor: '#fcd34d' }} className="border rounded-xl p-3 flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p style={{ color: '#92400e' }} className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-yellow-600">Only {p.stock} units remaining</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Full Inventory Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-4">Complete Inventory Listing ({products.length} products)</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  {['#', 'Product', 'Category', 'Price', 'Stock', 'Stock Value', 'Units Sold', 'Tags', 'Status'].map(h => (
                    <th key={h} style={{ color: '#6b7280' }} className="text-left text-xs font-semibold px-3 py-3 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => {
                  const stockValue = p.price * p.stock;
                  const status = p.stock === 0 ? { label: 'Out of Stock', bg: '#fee2e2', color: '#dc2626' }
                    : p.stock < 20 ? { label: 'Low Stock', bg: '#fef3c7', color: '#92400e' }
                    : { label: 'In Stock', bg: '#d8f3dc', color: '#2d6a4f' };
                  return (
                    <tr key={p.id} style={{ backgroundColor: idx % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td className="px-3 py-3 text-xs text-gray-400">{idx + 1}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                          <span style={{ color: '#1a3a2a' }} className="text-sm font-medium">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-500">{p.category}</td>
                      <td className="px-3 py-3 text-sm font-semibold" style={{ color: '#2d6a4f' }}>₱{p.price}</td>
                      <td className="px-3 py-3 text-sm font-bold" style={{ color: p.stock === 0 ? '#dc2626' : p.stock < 20 ? '#92400e' : '#1a3a2a' }}>{p.stock}</td>
                      <td className="px-3 py-3 text-sm" style={{ color: '#1a3a2a' }}>₱{stockValue.toLocaleString()}</td>
                      <td className="px-3 py-3 text-sm text-gray-500">{p.sold}</td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1">
                          {p.tags.map(t => (
                            <span key={t} style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f' }} className="text-xs px-1.5 py-0.5 rounded-full capitalize">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span style={{ backgroundColor: status.bg, color: status.color }} className="text-xs px-2 py-0.5 rounded-full font-medium">{status.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot style={{ backgroundColor: '#f0fdf4' }}>
                <tr>
                  <td colSpan={3} className="px-3 py-3 text-sm font-bold" style={{ color: '#1a3a2a' }}>TOTALS</td>
                  <td className="px-3 py-3"></td>
                  <td className="px-3 py-3 text-sm font-bold" style={{ color: '#1a3a2a' }}>{totalItems}</td>
                  <td className="px-3 py-3 text-sm font-bold" style={{ color: '#2d6a4f' }}>₱{totalValue.toLocaleString()}</td>
                  <td className="px-3 py-3 text-sm font-bold" style={{ color: '#1a3a2a' }}>{totalSoldItems}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
