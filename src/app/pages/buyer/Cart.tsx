import { Link, useNavigate } from 'react-router';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { BuyerNav } from '../../components/BuyerNav';
import { Footer } from '../../components/Footer';
import { useApp } from '../../context/AppContext';

export function Cart() {
  const { cart, products, updateCartItem, removeFromCart, currentUser } = useApp();
  const navigate = useNavigate();

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product!.price * item.quantity), 0);
  const shippingFee = subtotal >= 500 ? 0 : 80;
  const total = subtotal + shippingFee;

  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ backgroundColor: '#f9f5f0' }} className="min-h-screen flex flex-col">
        <BuyerNav />
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <div style={{ backgroundColor: '#d8f3dc' }} className="w-28 h-28 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-14 h-14" style={{ color: '#2d6a4f' }} />
          </div>
          <h2 style={{ color: '#1a3a2a' }} className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mb-8">Looks like you haven't added any products yet.</p>
          <Link
            to="/products"
            style={{ backgroundColor: '#2d6a4f' }}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold hover:opacity-90"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
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
          <ShoppingCart className="w-7 h-7" /> Shopping Cart
        </h1>
        <p style={{ color: '#95d5b2' }} className="mt-1 text-sm">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {cartItems.map((item, idx) => (
                <div key={item.productId}>
                  <div className="p-5 flex items-center gap-4">
                    <img src={item.product!.image} alt={item.product!.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-400 text-xs">{item.product!.category}</p>
                      <h3 style={{ color: '#1a3a2a' }} className="font-semibold text-sm">{item.product!.name}</h3>
                      <p style={{ color: '#2d6a4f' }} className="font-bold mt-1">₱{item.product!.price}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      {/* Quantity */}
                      <div style={{ borderColor: '#d1d5db' }} className="flex items-center border rounded-full overflow-hidden">
                        <button
                          onClick={() => updateCartItem(item.productId, item.quantity - 1)}
                          style={{ color: '#2d6a4f' }}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span style={{ color: '#1a3a2a' }} className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItem(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.product!.stock}
                          style={{ color: '#2d6a4f' }}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p style={{ color: '#1a3a2a' }} className="font-bold text-sm">₱{(item.product!.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {idx < cartItems.length - 1 && <div style={{ borderColor: '#f3f4f6' }} className="border-b mx-5" />}
                </div>
              ))}
            </div>

            <Link to="/products" style={{ color: '#2d6a4f' }} className="inline-flex items-center gap-2 mt-4 text-sm hover:underline">
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 style={{ color: '#1a3a2a' }} className="font-bold mb-5 text-lg">Order Summary</h2>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({cartItems.length} items)</span>
                  <span style={{ color: '#1a3a2a' }} className="font-medium">₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping Fee</span>
                  <span style={{ color: shippingFee === 0 ? '#52b788' : '#1a3a2a' }} className="font-medium">
                    {shippingFee === 0 ? 'FREE' : `₱${shippingFee}`}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p style={{ color: '#52b788' }} className="text-xs">
                    Add ₱{(500 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>
              <div style={{ borderColor: '#f3f4f6' }} className="border-t pt-4 mb-5">
                <div className="flex justify-between">
                  <span style={{ color: '#1a3a2a' }} className="font-bold">Total</span>
                  <span style={{ color: '#2d6a4f' }} className="font-bold text-xl">₱{total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                style={{ backgroundColor: '#f4a261' }}
                className="w-full text-white py-3 rounded-full font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
              {!currentUser && (
                <p className="text-xs text-center mt-3 text-gray-400">You need to log in to checkout.</p>
              )}
            </div>

            {/* Free shipping promo */}
            <div style={{ backgroundColor: '#d8f3dc', borderColor: '#52b788' }} className="border rounded-2xl p-4 mt-4">
              <p style={{ color: '#1a3a2a' }} className="text-sm font-medium mb-1">🌿 Free Shipping Promo</p>
              <p style={{ color: '#2d6a4f' }} className="text-xs">Orders ₱500 and above get FREE shipping nationwide!</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
