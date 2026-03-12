import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Package, Plus, Pencil, Trash2, Search, X, Save, AlertCircle } from 'lucide-react';
import { SellerNav } from '../../components/SellerNav';
import { Footer } from '../../components/Footer';
import { useApp } from '../../context/AppContext';
import { Product } from '../../context/AppContext';

const CATEGORIES = ['Pots & Containers', 'Growing Media', 'Seedling Supplies', 'Garden Accessories'];
const TAGS_OPTIONS = ['new', 'trending', 'bestseller'];

const EMPTY_FORM = {
  name: '', description: '', price: 0, category: 'Pots & Containers',
  stock: 0, image: '', tags: [] as string[], featured: false,
};

export function Inventory() {
  const { currentSeller, products, addProduct, updateProduct, deleteProduct } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  if (!currentSeller) { navigate('/seller/login'); return null; }

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const openAdd = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setForm({
      name: product.name, description: product.description, price: product.price,
      category: product.category, stock: product.stock, image: product.image,
      tags: [...product.tags], featured: product.featured,
    });
    setEditingId(product.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.description || form.price <= 0) {
      alert('Please fill in all required fields.'); return;
    }
    if (editingId) {
      await updateProduct(editingId, form);
    } else {
      await addProduct(form);
    }
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setDeleteConfirm(null);
  };

  const toggleTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag],
    }));
  };

  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock < 20).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  return (
    <div style={{ backgroundColor: '#f0f4f1' }} className="min-h-screen flex flex-col">
      <SellerNav />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ color: '#1a3a2a' }} className="text-2xl font-bold flex items-center gap-2">
              <Package className="w-6 h-6" style={{ color: '#2d6a4f' }} /> Inventory Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage your product listings</p>
          </div>
          <button
            onClick={openAdd}
            style={{ backgroundColor: '#2d6a4f' }}
            className="flex items-center gap-2 text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Products', value: products.length, color: '#2d6a4f', bg: '#d8f3dc' },
            { label: 'Inventory Value', value: `₱${totalValue.toLocaleString()}`, color: '#1d4ed8', bg: '#dbeafe' },
            { label: 'Low Stock', value: lowStock, color: '#92400e', bg: '#fef3c7' },
            { label: 'Out of Stock', value: outOfStock, color: '#dc2626', bg: '#fee2e2' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <p style={{ color }} className="text-2xl font-bold">{value}</p>
              <p className="text-gray-400 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              style={{ borderColor: '#d1d5db' }}
              className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none bg-white"
            />
          </div>
          <select
            value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="border rounded-xl px-4 py-2.5 text-sm outline-none bg-white"
            style={{ borderColor: '#d1d5db' }}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Tags', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ color: '#6b7280' }} className="text-left text-xs font-semibold px-4 py-3 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, idx) => (
                  <tr key={product.id} style={{ backgroundColor: idx % 2 === 0 ? 'white' : '#fafafa' }} className="hover:bg-green-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div>
                          <p style={{ color: '#1a3a2a' }} className="font-medium text-sm">{product.name}</p>
                          <p className="text-gray-400 text-xs line-clamp-1">{product.description.slice(0, 40)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f' }} className="text-xs px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ color: '#2d6a4f' }} className="font-bold text-sm">₱{product.price}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {product.stock === 0 ? (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        ) : product.stock < 20 ? (
                          <AlertCircle className="w-4 h-4 text-orange-400" />
                        ) : null}
                        <span style={{ color: product.stock === 0 ? '#dc2626' : product.stock < 20 ? '#92400e' : '#1a3a2a' }} className="text-sm font-medium">
                          {product.stock}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {product.tags.map(t => (
                          <span key={t}
                            style={{ backgroundColor: t === 'bestseller' ? '#fef3c7' : t === 'new' ? '#d8f3dc' : '#dbeafe', color: t === 'bestseller' ? '#92400e' : t === 'new' ? '#2d6a4f' : '#1d4ed8' }}
                            className="text-xs px-1.5 py-0.5 rounded-full capitalize">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ backgroundColor: product.stock === 0 ? '#fee2e2' : '#d8f3dc', color: product.stock === 0 ? '#dc2626' : '#2d6a4f' }} className="text-xs px-2 py-1 rounded-full">
                        {product.stock === 0 ? 'Out of Stock' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(product)} style={{ color: '#2d6a4f' }} className="p-1.5 hover:bg-green-50 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm(product.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div style={{ backgroundColor: '#2d6a4f' }} className="px-6 py-5 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-white font-bold text-lg">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Product Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    style={{ borderColor: '#d1d5db' }} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Price (₱) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))}
                    style={{ borderColor: '#d1d5db' }} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" min="0" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Stock Quantity *</label>
                  <input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: Number(e.target.value) }))}
                    style={{ borderColor: '#d1d5db' }} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" min="0" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Category *</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    style={{ borderColor: '#d1d5db' }} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none bg-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Image URL</label>
                  <input type="url" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
                    style={{ borderColor: '#d1d5db' }} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" placeholder="https://..." />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Description *</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    rows={3} style={{ borderColor: '#d1d5db' }} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Product Tags</label>
                  <div className="flex gap-3">
                    {TAGS_OPTIONS.map(tag => (
                      <button key={tag} type="button" onClick={() => toggleTag(tag)}
                        style={{ backgroundColor: form.tags.includes(tag) ? '#2d6a4f' : '#f3f4f6', color: form.tags.includes(tag) ? 'white' : '#374151' }}
                        className="px-4 py-2 rounded-full text-sm capitalize transition-colors">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                    className="w-4 h-4 rounded" style={{ accentColor: '#2d6a4f' }} />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">Feature on Home Page</label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} style={{ backgroundColor: '#2d6a4f' }}
                  className="flex-1 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90">
                  <Save className="w-4 h-4" /> {editingId ? 'Update Product' : 'Add Product'}
                </button>
                <button onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 style={{ color: '#1a3a2a' }} className="text-xl font-bold mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone. The product will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 py-3 rounded-xl text-gray-500 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
