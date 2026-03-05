import { Link, useNavigate } from 'react-router';
import { History, Package, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { BuyerNav } from '../../components/BuyerNav';
import { Footer } from '../../components/Footer';
import { useApp } from '../../context/AppContext';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Processing: { bg: '#dbeafe', color: '#1d4ed8' },
  Shipped: { bg: '#fef3c7', color: '#92400e' },
  Delivered: { bg: '#d8f3dc', color: '#1a3a2a' },
  Completed: { bg: '#d8f3dc', color: '#2d6a4f' },
  Cancelled: { bg: '#fee2e2', color: '#dc2626' },
};

export function TransactionHistory() {
  const { orders, currentUser } = useApp();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const userOrders = orders
    .filter(o => o.userId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ backgroundColor: '#f9f5f0' }} className="min-h-screen flex flex-col">
      <BuyerNav />

      <div style={{ backgroundColor: '#2d6a4f' }} className="py-8 text-center">
        <h1 className="text-white text-3xl font-bold flex items-center justify-center gap-3">
          <History className="w-7 h-7" /> Transaction History
        </h1>
        <p style={{ color: '#95d5b2' }} className="mt-1 text-sm">Your past and current orders</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 flex-1 w-full">
        {userOrders.length === 0 ? (
          <div className="text-center py-20">
            <div style={{ backgroundColor: '#d8f3dc' }} className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12" style={{ color: '#2d6a4f' }} />
            </div>
            <h3 style={{ color: '#1a3a2a' }} className="text-xl font-bold mb-2">No transactions yet</h3>
            <p className="text-gray-500 text-sm mb-6">You haven't placed any orders yet.</p>
            <Link
              to="/products"
              style={{ backgroundColor: '#2d6a4f' }}
              className="text-white px-6 py-3 rounded-full font-semibold hover:opacity-90"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map(order => {
              const isExpanded = expandedId === order.id;
              const statusStyle = STATUS_COLORS[order.status] || { bg: '#f3f4f6', color: '#374151' };

              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div
                    className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div style={{ backgroundColor: '#d8f3dc' }} className="p-2.5 rounded-xl flex-shrink-0">
                        <Package className="w-5 h-5" style={{ color: '#2d6a4f' }} />
                      </div>
                      <div>
                        <p style={{ color: '#1a3a2a' }} className="font-semibold">Order #{order.id}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{formatDate(order.createdAt)}</p>
                        <p className="text-gray-500 text-xs mt-1">{order.items.length} item{order.items.length !== 1 ? 's' : ''} · {order.paymentMethod} · {order.deliveryMethod === 'pickup' ? 'Store Pickup' : 'Delivery'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <span style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }} className="text-xs px-3 py-1 rounded-full font-medium">
                        {order.status}
                      </span>
                      <p style={{ color: '#2d6a4f' }} className="font-bold text-lg">₱{order.total.toFixed(2)}</p>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div style={{ borderColor: '#f3f4f6' }} className="border-t px-5 py-5">
                      <h4 style={{ color: '#1a3a2a' }} className="font-semibold mb-3 text-sm">Items Ordered</h4>
                      <div className="space-y-3 mb-5">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <div>
                              <p style={{ color: '#1a3a2a' }} className="text-sm font-medium">{item.productName}</p>
                              <p className="text-gray-400 text-xs">₱{item.price} × {item.quantity}</p>
                            </div>
                            <p style={{ color: '#2d6a4f' }} className="font-semibold text-sm">₱{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>

                      <div style={{ backgroundColor: '#f9fafb', borderColor: '#f3f4f6' }} className="border rounded-xl p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Subtotal</span>
                          <span style={{ color: '#1a3a2a' }}>₱{order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Shipping Fee</span>
                          <span style={{ color: '#1a3a2a' }}>{order.shippingFee === 0 ? 'FREE' : `₱${order.shippingFee}`}</span>
                        </div>
                        <div style={{ borderColor: '#e5e7eb' }} className="border-t pt-2 flex justify-between font-bold">
                          <span style={{ color: '#1a3a2a' }}>Total</span>
                          <span style={{ color: '#2d6a4f' }}>₱{order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-gray-400 mb-0.5">Payment Method</p>
                          <p style={{ color: '#1a3a2a' }} className="font-medium">{order.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-0.5">Delivery Method</p>
                          <p style={{ color: '#1a3a2a' }} className="font-medium capitalize">{order.deliveryMethod === 'pickup' ? 'Store Pickup' : 'Home Delivery'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-400 mb-0.5">Address</p>
                          <p style={{ color: '#1a3a2a' }} className="font-medium">{order.address}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
