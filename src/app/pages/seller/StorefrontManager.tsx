import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Save, Eye, ShoppingBag, Image, Bell, Tag } from 'lucide-react';
import { SellerNav } from '../../components/SellerNav';
import { Footer } from '../../components/Footer';
import { useApp } from '../../context/AppContext';

export function StorefrontManager() {
  const { currentSeller, storefrontSettings, updateStorefront } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({ ...storefrontSettings });
  const [saved, setSaved] = useState(false);

  if (!currentSeller) { navigate('/seller/login'); return null; }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const toggleTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      featuredTags: prev.featuredTags.includes(tag)
        ? prev.featuredTags.filter(t => t !== tag)
        : [...prev.featuredTags, tag],
    }));
  };

  const handleSave = () => {
    updateStorefront(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ backgroundColor: '#f0f4f1' }} className="min-h-screen flex flex-col">
      <SellerNav />
      <div className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ color: '#1a3a2a' }} className="text-2xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" style={{ color: '#2d6a4f' }} /> Storefront Manager
            </h1>
            <p className="text-gray-500 text-sm mt-1">Customize how your store looks to buyers</p>
          </div>
          <div className="flex gap-3">
            <a href="/storefront" target="_blank" rel="noreferrer"
              style={{ borderColor: '#2d6a4f', color: '#2d6a4f' }}
              className="flex items-center gap-2 border-2 rounded-full px-4 py-2 text-sm font-medium hover:bg-green-50"
            >
              <Eye className="w-4 h-4" /> Preview
            </a>
            <button
              onClick={handleSave}
              style={{ backgroundColor: '#2d6a4f' }}
              className="flex items-center gap-2 text-white rounded-full px-5 py-2 text-sm font-semibold hover:opacity-90"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>

        {saved && (
          <div style={{ backgroundColor: '#d8f3dc', borderColor: '#52b788', color: '#2d6a4f' }} className="border rounded-2xl p-4 mb-5 text-sm font-medium text-center">
            ✓ Storefront settings saved successfully!
          </div>
        )}

        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-4 flex items-center gap-2">
              <Image className="w-5 h-5" style={{ color: '#2d6a4f' }} /> Hero Banner
            </h2>
            <div className="space-y-4">
              <div>
                <label style={{ color: '#374151' }} className="block text-sm font-medium mb-1.5">Banner Title</label>
                <input
                  type="text" name="bannerTitle" value={form.bannerTitle} onChange={handleChange}
                  style={{ borderColor: '#d1d5db' }}
                  className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label style={{ color: '#374151' }} className="block text-sm font-medium mb-1.5">Banner Subtitle</label>
                <textarea
                  name="bannerSubtitle" value={form.bannerSubtitle} onChange={handleChange}
                  rows={3}
                  style={{ borderColor: '#d1d5db' }}
                  className="w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none focus:border-green-500"
                />
              </div>
              <div>
                <label style={{ color: '#374151' }} className="block text-sm font-medium mb-1.5">CTA Button Text</label>
                <input
                  type="text" name="bannerCta" value={form.bannerCta} onChange={handleChange}
                  style={{ borderColor: '#d1d5db' }}
                  className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label style={{ color: '#374151' }} className="block text-sm font-medium mb-1.5">Hero Image URL</label>
                <input
                  type="url" name="heroImage" value={form.heroImage} onChange={handleChange}
                  style={{ borderColor: '#d1d5db' }}
                  className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
                  placeholder="https://..."
                />
              </div>
              {/* Image Preview */}
              {form.heroImage && (
                <div className="rounded-xl overflow-hidden h-48">
                  <img src={form.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Announcement Banner */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" style={{ color: '#2d6a4f' }} /> Announcement Banner
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showAnnouncement"
                  name="showAnnouncement"
                  checked={form.showAnnouncement}
                  onChange={handleCheckbox}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#2d6a4f' }}
                />
                <label htmlFor="showAnnouncement" style={{ color: '#374151' }} className="text-sm font-medium">
                  Show announcement banner on store pages
                </label>
              </div>
              <div>
                <label style={{ color: '#374151' }} className="block text-sm font-medium mb-1.5">Announcement Text</label>
                <input
                  type="text" name="announcement" value={form.announcement} onChange={handleChange}
                  style={{ borderColor: '#d1d5db' }}
                  className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
                  placeholder="e.g. Free shipping on orders over ₱500!"
                />
              </div>
              {/* Preview */}
              {form.showAnnouncement && form.announcement && (
                <div style={{ backgroundColor: '#52b788' }} className="rounded-xl py-2 px-4 text-center">
                  <p className="text-white text-sm">{form.announcement}</p>
                </div>
              )}
            </div>
          </div>

          {/* Featured Sections */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" style={{ color: '#2d6a4f' }} /> Featured Product Sections
            </h2>
            <p className="text-gray-400 text-sm mb-4">Choose which product sections to display on the storefront page:</p>
            <div className="flex flex-wrap gap-3">
              {[
                { tag: 'new', label: '🌱 New Arrivals', color: '#52b788', bg: '#d8f3dc' },
                { tag: 'trending', label: '🔥 Trending Now', color: '#1d4ed8', bg: '#dbeafe' },
                { tag: 'bestseller', label: '⭐ Best Sellers', color: '#92400e', bg: '#fef3c7' },
              ].map(({ tag, label, color, bg }) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    backgroundColor: form.featuredTags.includes(tag) ? bg : '#f9fafb',
                    borderColor: form.featuredTags.includes(tag) ? color : '#e5e7eb',
                    color: form.featuredTags.includes(tag) ? color : '#6b7280',
                  }}
                  className="border-2 rounded-full px-4 py-2 text-sm font-medium transition-all"
                >
                  {label} {form.featuredTags.includes(tag) ? '✓' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-4">Live Preview</h2>
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#e5e7eb' }}>
              <div className="relative h-40">
                <img src={form.heroImage} alt="preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex flex-col justify-center px-6" style={{ background: 'rgba(26,58,42,0.75)' }}>
                  <h3 className="text-white font-bold text-xl mb-1">{form.bannerTitle || 'Banner Title'}</h3>
                  <p style={{ color: '#d8f3dc' }} className="text-xs line-clamp-2">{form.bannerSubtitle || 'Banner subtitle text...'}</p>
                  <button style={{ backgroundColor: '#f4a261' }} className="mt-2 text-white text-xs px-4 py-1.5 rounded-full w-fit">
                    {form.bannerCta || 'Shop Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
