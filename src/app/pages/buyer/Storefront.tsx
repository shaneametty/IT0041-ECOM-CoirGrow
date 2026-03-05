import { Link } from 'react-router';
import { ArrowRight, Sparkles, TrendingUp, Award, ShoppingCart, Star } from 'lucide-react';
import { BuyerNav } from '../../components/BuyerNav';
import { Footer } from '../../components/Footer';
import { useApp } from '../../context/AppContext';

export function Storefront() {
  const { products, storefrontSettings, addToCart } = useApp();

  const newProducts = products.filter(p => p.tags.includes('new'));
  const trendingProducts = products.filter(p => p.tags.includes('trending'));
  const bestsellerProducts = products.filter(p => p.tags.includes('bestseller'));

  const tagConfig: Record<string, { label: string; icon: typeof Sparkles; color: string; bg: string }> = {
    new: { label: 'New Arrivals', icon: Sparkles, color: '#2d6a4f', bg: '#d8f3dc' },
    trending: { label: 'Trending Now', icon: TrendingUp, color: '#1e40af', bg: '#dbeafe' },
    bestseller: { label: 'Best Sellers', icon: Award, color: '#92400e', bg: '#fef3c7' },
  };

  const sections = [
    { tag: 'new', items: newProducts },
    { tag: 'trending', items: trendingProducts },
    { tag: 'bestseller', items: bestsellerProducts },
  ].filter(s => storefrontSettings.featuredTags.includes(s.tag));

  return (
    <div style={{ backgroundColor: '#f9f5f0' }} className="min-h-screen flex flex-col">
      <BuyerNav />

      {/* Announcement */}
      {storefrontSettings.showAnnouncement && (
        <div style={{ backgroundColor: '#52b788' }} className="py-2 text-center">
          <p className="text-white text-sm">{storefrontSettings.announcement}</p>
        </div>
      )}

      {/* Hero Banner */}
      <section className="relative overflow-hidden" style={{ minHeight: '450px' }}>
        <img
          src={storefrontSettings.heroImage}
          alt="Storefront Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(26,58,42,0.9) 40%, rgba(26,58,42,0.3))' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 flex flex-col justify-center" style={{ minHeight: '450px' }}>
          <p style={{ color: '#95d5b2' }} className="text-sm uppercase tracking-widest mb-3 font-medium">Welcome to</p>
          <h1 className="text-white text-4xl md:text-5xl font-bold max-w-xl mb-4">
            {storefrontSettings.bannerTitle}
          </h1>
          <p style={{ color: '#d8f3dc' }} className="max-w-lg mb-8 leading-relaxed">
            {storefrontSettings.bannerSubtitle}
          </p>
          <Link
            to="/products"
            style={{ backgroundColor: '#f4a261' }}
            className="inline-flex items-center gap-2 w-fit px-8 py-3 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
          >
            {storefrontSettings.bannerCta} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Pots & Containers', emoji: '🪴', desc: 'Coir pots & baskets' },
            { name: 'Growing Media', emoji: '🌱', desc: 'Coco peat & fiber' },
            { name: 'Seedling Supplies', emoji: '🌿', desc: 'Trays & starters' },
            { name: 'Garden Accessories', emoji: '🧰', desc: 'Mats & essentials' },
          ].map(cat => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-center group"
            >
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <h3 style={{ color: '#1a3a2a' }} className="font-semibold text-sm mb-1">{cat.name}</h3>
              <p className="text-gray-400 text-xs">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Sections */}
      {sections.map(({ tag, items }) => {
        const config = tagConfig[tag];
        const Icon = config.icon;
        return (
          <section key={tag} className="max-w-7xl mx-auto px-4 pb-14">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div style={{ backgroundColor: config.bg }} className="p-2 rounded-xl">
                  <Icon className="w-5 h-5" style={{ color: config.color }} />
                </div>
                <div>
                  <h2 style={{ color: '#1a3a2a' }} className="text-2xl font-bold">{config.label}</h2>
                  <p className="text-gray-400 text-sm">{items.length} products</p>
                </div>
              </div>
              <Link to={`/products?tag=${tag}`} style={{ color: '#2d6a4f' }} className="flex items-center gap-1 text-sm hover:underline font-medium">
                See all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {items.slice(0, 4).map(product => (
                <div key={product.id} className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-xl transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                      {product.tags.map(t => (
                        <span key={t} style={{ backgroundColor: t === 'bestseller' ? '#f4a261' : t === 'new' ? '#52b788' : '#2d6a4f' }} className="text-white text-xs px-2 py-0.5 rounded-full capitalize">
                          {t}
                        </span>
                      ))}
                    </div>
                    {product.stock < 20 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Low Stock
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-gray-400 text-xs mb-1">{product.category}</p>
                    <h3 style={{ color: '#1a3a2a' }} className="font-semibold mb-1">{product.name}</h3>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" style={{ color: '#f4a261' }} />
                      ))}
                      <span className="text-gray-400 text-xs ml-1">({product.sold})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span style={{ color: '#2d6a4f' }} className="text-lg font-bold">₱{product.price}</span>
                        <p className="text-gray-400 text-xs">{product.stock} in stock</p>
                      </div>
                      <button
                        onClick={() => addToCart(product.id, 1)}
                        style={{ backgroundColor: '#2d6a4f' }}
                        className="flex items-center gap-1 text-white text-xs px-3 py-2 rounded-full hover:opacity-90 transition-opacity"
                      >
                        <ShoppingCart className="w-3 h-3" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section style={{ backgroundColor: '#d8f3dc' }} className="py-16 text-center">
        <h2 style={{ color: '#1a3a2a' }} className="text-3xl font-bold mb-3">Ready to Go Green?</h2>
        <p style={{ color: '#2d6a4f' }} className="max-w-lg mx-auto mb-6 text-sm">Browse our complete catalog of sustainable coconut coir products and start your eco-friendly gardening journey today.</p>
        <Link
          to="/products"
          style={{ backgroundColor: '#2d6a4f' }}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Browse All Products <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <Footer />
    </div>
  );
}
