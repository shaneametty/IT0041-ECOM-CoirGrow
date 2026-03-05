import { Link } from 'react-router';
import { Leaf, ArrowRight, Recycle, Droplets, Star, ShieldCheck, Truck, HeadphonesIcon } from 'lucide-react';
import { BuyerNav } from '../../components/BuyerNav';
import { Footer } from '../../components/Footer';
import { useApp } from '../../context/AppContext';

export function Home() {
  const { products, storefrontSettings, addToCart } = useApp();
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  return (
    <div style={{ backgroundColor: '#f9f5f0' }} className="min-h-screen flex flex-col">
      <BuyerNav />

      {/* Announcement Banner */}
      {storefrontSettings.showAnnouncement && (
        <div style={{ backgroundColor: '#52b788' }} className="py-2 text-center">
          <p className="text-white text-sm">{storefrontSettings.announcement}</p>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ minHeight: '600px' }}>
        <img
          src={storefrontSettings.heroImage}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(26,58,42,0.88) 0%, rgba(26,58,42,0.5) 100%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-28 flex flex-col items-start justify-center" style={{ minHeight: '600px' }}>
          <div style={{ backgroundColor: '#52b788' }} className="flex items-center gap-2 px-3 py-1 rounded-full mb-6">
            <Leaf className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">100% Eco-Friendly Products</span>
          </div>
          <h1 className="text-white text-5xl md:text-6xl font-bold max-w-2xl leading-tight mb-6">
            {storefrontSettings.bannerTitle}
          </h1>
          <p style={{ color: '#d8f3dc' }} className="text-lg max-w-xl mb-8 leading-relaxed">
            {storefrontSettings.bannerSubtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/storefront"
              style={{ backgroundColor: '#f4a261' }}
              className="flex items-center gap-2 px-8 py-3 rounded-full text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              {storefrontSettings.bannerCta} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/products"
              style={{ borderColor: '#d8f3dc', color: '#d8f3dc' }}
              className="flex items-center gap-2 px-8 py-3 rounded-full border-2 font-semibold hover:bg-white/10 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ backgroundColor: '#2d6a4f' }} className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Recycle, title: '100% Biodegradable', desc: 'All products return to Earth naturally' },
              { icon: Droplets, title: 'Superior Moisture', desc: 'Coir retains water 8x its weight' },
              { icon: ShieldCheck, title: 'pH Neutral', desc: 'Safe for all types of plants' },
              { icon: Leaf, title: 'Eco-Certified', desc: 'Sustainably sourced coconut products' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3">
                <div style={{ backgroundColor: '#52b788' }} className="p-3 rounded-full">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold">{title}</h3>
                <p style={{ color: '#95d5b2' }} className="text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 style={{ color: '#1a3a2a' }} className="text-3xl font-bold">Featured Products</h2>
            <p style={{ color: '#52b788' }} className="mt-1">Handpicked favorites from our collection</p>
          </div>
          <Link to="/products" style={{ color: '#2d6a4f' }} className="flex items-center gap-1 hover:underline font-medium">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="relative overflow-hidden h-52">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                  {product.tags.map(tag => (
                    <span key={tag} style={{ backgroundColor: tag === 'bestseller' ? '#f4a261' : tag === 'new' ? '#52b788' : '#2d6a4f' }} className="text-white text-xs px-2 py-0.5 rounded-full capitalize">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <h3 style={{ color: '#1a3a2a' }} className="font-semibold mb-1">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span style={{ color: '#2d6a4f' }} className="text-xl font-bold">₱{product.price}</span>
                  <button
                    onClick={() => addToCart(product.id, 1)}
                    style={{ backgroundColor: '#2d6a4f' }}
                    className="text-white text-sm px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Coir Section */}
      <section style={{ backgroundColor: '#d8f3dc' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 style={{ color: '#1a3a2a' }} className="text-3xl font-bold mb-4">Why Choose Coir?</h2>
              <p style={{ color: '#2d6a4f' }} className="mb-6 leading-relaxed">
                Coconut coir is a revolutionary natural fiber extracted from coconut husks — a byproduct that would otherwise go to waste. It's the Philippines' answer to sustainable urban gardening.
              </p>
              <ul className="space-y-3">
                {[
                  'Biodegrades in 3–5 years, leaving zero plastic waste',
                  'Holds moisture 8x its weight, reducing watering frequency',
                  'pH neutral — safe for vegetables, herbs, and ornamentals',
                  'Improves soil aeration and root development',
                  'Locally sourced, supporting Filipino coconut farmers',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <div style={{ backgroundColor: '#52b788' }} className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span style={{ color: '#1a3a2a' }} className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/products"
                style={{ backgroundColor: '#2d6a4f' }}
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full text-white font-semibold hover:opacity-90"
              >
                Shop All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1752775312083-1cefe2f93358?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
                alt="Eco gardening"
                className="rounded-2xl shadow-xl w-full object-cover h-80"
              />
              <div style={{ backgroundColor: '#2d6a4f' }} className="absolute -bottom-4 -left-4 p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <Leaf className="w-8 h-8 text-white" />
                  <div>
                    <p className="text-white font-semibold">100% Natural</p>
                    <p style={{ color: '#95d5b2' }} className="text-sm">No synthetic materials</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 style={{ color: '#1a3a2a' }} className="text-3xl font-bold text-center mb-2">What Gardeners Say</h2>
        <p style={{ color: '#52b788' }} className="text-center mb-10">Loved by plant parents across the Philippines</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Maria Santos', location: 'Quezon City', text: 'The coir pots are amazing! My succulents have never been healthier. Love that I can plant them directly into the ground.', stars: 5 },
            { name: 'Jose Reyes', location: 'Makati City', text: 'Coco peat block is a game-changer for my vegetable garden. Excellent water retention and my plants love it!', stars: 5 },
            { name: 'Ana Cruz', location: 'Cebu City', text: 'Fast delivery and great packaging. The hanging baskets look beautiful on my balcony. Will order again!', stars: 5 },
          ].map(({ name, location, text, stars }) => (
            <div key={name} className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex mb-3">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#f4a261' }} />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed italic">"{text}"</p>
              <div className="flex items-center gap-3">
                <div style={{ backgroundColor: '#2d6a4f' }} className="w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{name.charAt(0)}</span>
                </div>
                <div>
                  <p style={{ color: '#1a3a2a' }} className="font-semibold text-sm">{name}</p>
                  <p className="text-gray-400 text-xs">{location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section style={{ backgroundColor: '#2d6a4f' }} className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: 'Nationwide Delivery', desc: 'We ship across the Philippines with reliable logistics partners.' },
              { icon: Recycle, title: 'Free Returns', desc: 'Not satisfied? Return any unopened product within 7 days.' },
              { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Our team is here to help with your gardening questions anytime.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div style={{ backgroundColor: '#52b788' }} className="p-3 rounded-full flex-shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{title}</h3>
                  <p style={{ color: '#95d5b2' }} className="text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
