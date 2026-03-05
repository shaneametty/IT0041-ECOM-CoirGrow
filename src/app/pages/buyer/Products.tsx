import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Search, SlidersHorizontal, ShoppingCart, Star, X } from 'lucide-react';
import { BuyerNav } from '../../components/BuyerNav';
import { Footer } from '../../components/Footer';
import { useApp } from '../../context/AppContext';

const CATEGORIES = ['All', 'Pots & Containers', 'Growing Media', 'Seedling Supplies', 'Garden Accessories'];
const TAGS = ['all', 'new', 'trending', 'bestseller'];
const SORT_OPTIONS = [
  { label: 'Default', value: 'default' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Best Selling', value: 'sold' },
  { label: 'Newest', value: 'newest' },
];

export function Products() {
  const { products, addToCart } = useApp();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [tag, setTag] = useState(searchParams.get('tag') || 'all');
  const [sort, setSort] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || 'All');
    setTag(searchParams.get('tag') || 'all');
  }, [searchParams]);

  const handleAddToCart = (productId: string) => {
    addToCart(productId, 1);
    setAddedId(productId);
    setTimeout(() => setAddedId(null), 1500);
  };

  const filtered = products
    .filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || p.category === category;
      const matchTag = tag === 'all' || p.tags.includes(tag);
      return matchSearch && matchCategory && matchTag;
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'sold') return b.sold - a.sold;
      if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

  const clearFilters = () => { setSearch(''); setCategory('All'); setTag('all'); setSort('default'); };

  const hasFilters = search || category !== 'All' || tag !== 'all' || sort !== 'default';

  return (
    <div style={{ backgroundColor: '#f9f5f0' }} className="min-h-screen flex flex-col">
      <BuyerNav />

      {/* Page Header */}
      <div style={{ backgroundColor: '#2d6a4f' }} className="py-10 text-center">
        <h1 className="text-white text-3xl font-bold">Our Products</h1>
        <p style={{ color: '#95d5b2' }} className="mt-2 text-sm">Browse our complete collection of eco-friendly coir gardening products</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              style={{ borderColor: '#d1d5db' }}
              className="w-full border rounded-xl pl-10 pr-4 py-3 text-sm outline-none bg-white"
            />
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border rounded-xl px-4 py-3 text-sm outline-none bg-white"
            style={{ borderColor: '#d1d5db' }}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{ backgroundColor: showFilters ? '#2d6a4f' : 'white', color: showFilters ? 'white' : '#2d6a4f', borderColor: '#2d6a4f' }}
            className="flex items-center gap-2 border rounded-xl px-4 py-3 text-sm font-medium"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          {hasFilters && (
            <button onClick={clearFilters} style={{ color: '#2d6a4f' }} className="flex items-center gap-1 text-sm hover:underline">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <p style={{ color: '#1a3a2a' }} className="text-sm font-semibold mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      style={{
                        backgroundColor: category === cat ? '#2d6a4f' : '#f3f4f6',
                        color: category === cat ? 'white' : '#374151',
                      }}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ color: '#1a3a2a' }} className="text-sm font-semibold mb-2">Product Tag</p>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map(t => (
                    <button
                      key={t}
                      onClick={() => setTag(t)}
                      style={{
                        backgroundColor: tag === t ? '#f4a261' : '#f3f4f6',
                        color: tag === t ? 'white' : '#374151',
                      }}
                      className="px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-5">
          <p style={{ color: '#2d6a4f' }} className="text-sm font-medium">
            Showing <span className="font-bold">{filtered.length}</span> of {products.length} products
          </p>
          {category !== 'All' && (
            <span style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f' }} className="text-xs px-3 py-1 rounded-full font-medium">
              {category}
            </span>
          )}
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌱</div>
            <h3 style={{ color: '#1a3a2a' }} className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
            <button onClick={clearFilters} style={{ backgroundColor: '#2d6a4f' }} className="mt-4 text-white px-6 py-2 rounded-full text-sm">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(product => (
              <div key={product.id} className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-xl transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {product.tags.map(t => (
                      <span
                        key={t}
                        style={{ backgroundColor: t === 'bestseller' ? '#f4a261' : t === 'new' ? '#52b788' : '#2d6a4f' }}
                        className="text-white text-xs px-2 py-0.5 rounded-full capitalize"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-500 text-white text-sm px-4 py-1 rounded-full">Out of Stock</span>
                    </div>
                  )}
                  {product.stock > 0 && product.stock < 20 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Only {product.stock} left
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-gray-400 text-xs mb-1">{product.category}</p>
                  <h3 style={{ color: '#1a3a2a' }} className="font-semibold text-sm mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-xs mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" style={{ color: '#f4a261' }} />
                    ))}
                    <span className="text-gray-400 text-xs ml-1">({product.sold} sold)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: '#2d6a4f' }} className="text-lg font-bold">₱{product.price}</span>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock === 0}
                      style={{
                        backgroundColor: addedId === product.id ? '#52b788' : product.stock === 0 ? '#d1d5db' : '#2d6a4f',
                      }}
                      className="flex items-center gap-1 text-white text-xs px-3 py-2 rounded-full transition-colors disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      {addedId === product.id ? 'Added!' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
