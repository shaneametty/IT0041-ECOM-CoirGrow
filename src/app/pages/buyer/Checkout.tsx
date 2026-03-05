import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CreditCard, Truck, Store, CheckCircle, MapPin, Phone } from 'lucide-react';
import { BuyerNav } from '../../components/BuyerNav';
import { Footer } from '../../components/Footer';
import { useApp } from '../../context/AppContext';

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
  { id: 'gcash', label: 'GCash', icon: '📱', desc: 'Pay via GCash e-wallet' },
  { id: 'maya', label: 'Maya', icon: '💳', desc: 'Pay via Maya digital wallet' },
  { id: 'bank', label: 'Bank Transfer', icon: '🏦', desc: 'Transfer to BPI / BDO / UnionBank' },
];

export function Checkout() {
  const { cart, products, currentUser, placeOrder } = useApp();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [mobile, setMobile] = useState(currentUser?.mobile || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product!.price * item.quantity, 0);
  const shippingFee = deliveryMethod === 'pickup' ? 0 : subtotal >= 500 ? 0 : 80;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = () => {
    if (!address.trim() && deliveryMethod === 'delivery') { alert('Please enter your delivery address.'); return; }
    setLoading(true);
    setTimeout(() => {
      const id = placeOrder({
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.product!.name,
          price: item.product!.price,
          quantity: item.quantity,
        })),
        subtotal,
        shippingFee,
        total,
        paymentMethod: PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label || paymentMethod,
        deliveryMethod,
        address: deliveryMethod === 'pickup' ? 'Store Pickup – 123 Coir St., Quezon City' : address,
      });
      setOrderId(id);
      setSuccess(true);
      setLoading(false);
    }, 1000);
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  if (cart.length === 0 && !success) {
    navigate('/cart');
    return null;
  }

  if (success) {
    return (
      <div style={{ backgroundColor: '#f9f5f0' }} className="min-h-screen flex flex-col">
        <BuyerNav />
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-md">
            <div style={{ backgroundColor: '#d8f3dc' }} className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-14 h-14" style={{ color: '#2d6a4f' }} />
            </div>
            <h2 style={{ color: '#1a3a2a' }} className="text-3xl font-bold mb-2">Order Placed!</h2>
            <p style={{ color: '#2d6a4f' }} className="font-medium mb-2">Thank you for your purchase, {currentUser.name.split(' ')[0]}!</p>
            <p className="text-gray-500 text-sm mb-2">Order ID: <span className="font-mono font-bold" style={{ color: '#2d6a4f' }}>{orderId}</span></p>
            <p className="text-gray-400 text-sm mb-8">Your order is now being processed. You can track it in your transaction history.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/transactions')}
                style={{ backgroundColor: '#2d6a4f' }}
                className="text-white px-6 py-3 rounded-full font-semibold hover:opacity-90"
              >
                View Transactions
              </button>
              <button
                onClick={() => navigate('/products')}
                style={{ borderColor: '#2d6a4f', color: '#2d6a4f' }}
                className="border-2 px-6 py-3 rounded-full font-semibold hover:bg-green-50"
              >
                Shop More
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f9f5f0' }} className="min-h-screen flex flex-col">
      <BuyerNav />

      <div style={{ backgroundColor: '#2d6a4f' }} className="py-8 text-center">
        <h1 className="text-white text-3xl font-bold flex items-center justify-center gap-3">
          <CreditCard className="w-7 h-7" /> Checkout
        </h1>
        <p style={{ color: '#95d5b2' }} className="mt-1 text-sm">Complete your order</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left – Checkout Form */}
          <div className="flex-1 space-y-5">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" style={{ color: '#2d6a4f' }} /> Contact Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Full Name</label>
                  <div style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }} className="border rounded-xl px-4 py-3 text-sm text-gray-700">
                    {currentUser.name}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Mobile Number *</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    style={{ borderColor: '#d1d5db' }}
                    className="w-full border rounded-xl px-4 py-3 text-sm outline-none"
                    placeholder="09171234567"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" style={{ color: '#2d6a4f' }} /> Delivery Method
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'delivery', label: 'Home Delivery', icon: Truck, desc: 'Ships to your address' },
                  { id: 'pickup', label: 'Store Pickup', icon: Store, desc: '123 Coir St., QC' },
                ].map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    onClick={() => setDeliveryMethod(id)}
                    style={{
                      borderColor: deliveryMethod === id ? '#2d6a4f' : '#e5e7eb',
                      backgroundColor: deliveryMethod === id ? '#f0fdf4' : 'white',
                    }}
                    className="border-2 rounded-xl p-4 text-left transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4" style={{ color: deliveryMethod === id ? '#2d6a4f' : '#9ca3af' }} />
                      <span style={{ color: deliveryMethod === id ? '#2d6a4f' : '#1a3a2a' }} className="font-medium text-sm">{label}</span>
                    </div>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </button>
                ))}
              </div>

              {deliveryMethod === 'delivery' && (
                <div className="mt-4">
                  <label className="text-sm text-gray-500 mb-1 block flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Delivery Address *
                  </label>
                  <textarea
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    rows={3}
                    style={{ borderColor: '#d1d5db' }}
                    className="w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none"
                    placeholder="Enter your complete delivery address"
                  />
                </div>
              )}
              {deliveryMethod === 'pickup' && (
                <div style={{ backgroundColor: '#d8f3dc' }} className="mt-4 rounded-xl p-4 text-sm">
                  <p style={{ color: '#1a3a2a' }} className="font-medium mb-1">📍 Pickup Location</p>
                  <p style={{ color: '#2d6a4f' }}>CoirGrow PH Store</p>
                  <p className="text-gray-500">123 Coir Street, Quezon City, Metro Manila</p>
                  <p className="text-gray-500">Monday – Saturday, 8:00 AM – 6:00 PM</p>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" style={{ color: '#2d6a4f' }} /> Payment Method
              </h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map(pm => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    style={{
                      borderColor: paymentMethod === pm.id ? '#2d6a4f' : '#e5e7eb',
                      backgroundColor: paymentMethod === pm.id ? '#f0fdf4' : 'white',
                    }}
                    className="w-full border-2 rounded-xl p-4 flex items-center gap-4 text-left transition-all"
                  >
                    <span className="text-2xl">{pm.icon}</span>
                    <div>
                      <p style={{ color: paymentMethod === pm.id ? '#2d6a4f' : '#1a3a2a' }} className="font-medium text-sm">{pm.label}</p>
                      <p className="text-xs text-gray-400">{pm.desc}</p>
                    </div>
                    <div className="ml-auto">
                      <div style={{ borderColor: '#2d6a4f' }} className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                        {paymentMethod === pm.id && <div style={{ backgroundColor: '#2d6a4f' }} className="w-2.5 h-2.5 rounded-full" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-3">Order Notes (Optional)</h2>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                style={{ borderColor: '#d1d5db' }}
                className="w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none"
                placeholder="Any special instructions for your order..."
              />
            </div>
          </div>

          {/* Right – Order Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                {cartItems.map(item => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <img src={item.product!.image} alt={item.product!.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p style={{ color: '#1a3a2a' }} className="text-xs font-medium truncate">{item.product!.name}</p>
                      <p className="text-gray-400 text-xs">x{item.quantity}</p>
                    </div>
                    <p style={{ color: '#2d6a4f' }} className="text-sm font-semibold flex-shrink-0">₱{(item.product!.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div style={{ borderColor: '#f3f4f6' }} className="border-t pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span style={{ color: '#1a3a2a' }}>₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span style={{ color: shippingFee === 0 ? '#52b788' : '#1a3a2a' }}>{shippingFee === 0 ? 'FREE' : `₱${shippingFee}`}</span>
                </div>
              </div>
              <div style={{ borderColor: '#f3f4f6' }} className="border-t pt-4 mb-5">
                <div className="flex justify-between">
                  <span style={{ color: '#1a3a2a' }} className="font-bold">Total</span>
                  <span style={{ color: '#2d6a4f' }} className="font-bold text-xl">₱{total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                style={{ backgroundColor: loading ? '#95d5b2' : '#f4a261' }}
                className="w-full text-white py-3 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : '🌿 Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
