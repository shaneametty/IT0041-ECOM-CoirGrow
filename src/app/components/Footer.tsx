import { Leaf, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router';

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a3a2a' }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div style={{ backgroundColor: '#52b788' }} className="p-2 rounded-full">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-semibold">CoirGrow</span>
                <span style={{ color: '#95d5b2' }} className="text-xl font-semibold"> PH</span>
              </div>
            </div>
            <p style={{ color: '#95d5b2' }} className="text-sm leading-relaxed mb-4">
              100% coconut coir-based gardening products. Eco-friendly, biodegradable, and sustainably crafted for the modern Filipino gardener.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" style={{ backgroundColor: '#2d6a4f' }} className="p-2 rounded-full hover:opacity-80 transition-opacity">
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'Products', to: '/products' },
                { label: 'Storefront', to: '/storefront' },
                { label: 'Cart', to: '/cart' },
                { label: 'My Account', to: '/profile' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} style={{ color: '#95d5b2' }} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Categories</h4>
            <ul className="space-y-2">
              {['Pots & Containers', 'Growing Media', 'Seedling Supplies', 'Garden Accessories'].map(cat => (
                <li key={cat}>
                  <Link to="/products" style={{ color: '#95d5b2' }} className="text-sm hover:text-white transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin style={{ color: '#95d5b2' }} className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span style={{ color: '#95d5b2' }} className="text-sm">123 Coir St., Quezon City, Metro Manila, Philippines</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone style={{ color: '#95d5b2' }} className="w-4 h-4 flex-shrink-0" />
                <span style={{ color: '#95d5b2' }} className="text-sm">+63 917 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail style={{ color: '#95d5b2' }} className="w-4 h-4 flex-shrink-0" />
                <span style={{ color: '#95d5b2' }} className="text-sm">hello@coirgrow.ph</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ borderColor: '#2d6a4f' }} className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p style={{ color: '#95d5b2' }} className="text-sm">
            © {new Date().getFullYear()} CoirGrow PH. All rights reserved.
          </p>
          <p style={{ color: '#52b788' }} className="text-xs text-center italic">
            For educational purposes only, and no copyright infringement is intended.
          </p>
        </div>
      </div>
    </footer>
  );
}
