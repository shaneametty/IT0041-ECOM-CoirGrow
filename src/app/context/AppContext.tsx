import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  address: string;
  mobile: string;
  role: 'buyer' | 'seller';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  tags: string[];
  featured: boolean;
  sold: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  deliveryMethod: string;
  address: string;
  status: string;
  createdAt: string;
}

export interface StorefrontSettings {
  bannerTitle: string;
  bannerSubtitle: string;
  bannerCta: string;
  announcement: string;
  showAnnouncement: boolean;
  featuredTags: string[];
  heroImage: string;
}

interface AppContextType {
  users: User[];
  currentUser: User | null;
  currentSeller: User | null;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  storefrontSettings: StorefrontSettings;
  login: (email: string, password: string) => boolean;
  sellerLogin: (email: string, password: string) => boolean;
  logout: () => void;
  sellerLogout: () => void;
  register: (data: Omit<User, 'id' | 'role' | 'createdAt'>) => { success: boolean; message: string };
  addToCart: (productId: string, quantity: number) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (orderData: Omit<Order, 'id' | 'userId' | 'createdAt' | 'status'>) => string;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'sold'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStorefront: (settings: Partial<StorefrontSettings>) => void;
  getProductById: (id: string) => Product | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Coir Pot (Small)',
    description: '100% natural coconut coir small pot, perfect for seedlings and succulents. Biodegradable and eco-friendly.',
    price: 45,
    category: 'Pots & Containers',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1574483078807-f1c78259e290?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    tags: ['new', 'featured'],
    featured: true,
    sold: 320,
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'p2',
    name: 'Coir Pot (Medium)',
    description: 'Medium-sized coir pot ideal for herbs, flowers and small shrubs. Plant directly in the ground — pot decomposes naturally.',
    price: 75,
    category: 'Pots & Containers',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1768700583700-969654256d27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    tags: ['bestseller', 'featured'],
    featured: true,
    sold: 890,
    createdAt: '2025-11-10T00:00:00.000Z',
  },
  {
    id: 'p3',
    name: 'Coir Pot (Large)',
    description: 'Large coir pot for bigger plants, vegetables, and ornamentals. Excellent water retention and aeration.',
    price: 120,
    category: 'Pots & Containers',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1744659747310-39564f92c25b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    tags: ['bestseller'],
    featured: true,
    sold: 540,
    createdAt: '2025-10-05T00:00:00.000Z',
  },
  {
    id: 'p4',
    name: 'Hanging Coir Basket',
    description: 'Beautiful woven coir hanging basket for trailing plants and ferns. Natural look, strong and durable.',
    price: 150,
    category: 'Pots & Containers',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1658600850748-79feefeb18f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    tags: ['trending', 'featured'],
    featured: true,
    sold: 410,
    createdAt: '2026-01-20T00:00:00.000Z',
  },
  {
    id: 'p5',
    name: 'Coco Peat Block (5kg)',
    description: 'Compressed coco peat block that expands with water. Excellent soil amendment for better drainage and aeration.',
    price: 89,
    category: 'Growing Media',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1729368630046-8f0051467115?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    tags: ['new', 'trending'],
    featured: true,
    sold: 670,
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 'p6',
    name: 'Coco Fiber Mulch (1kg)',
    description: 'Natural coir fiber mulch to protect soil moisture, reduce weeds, and improve garden aesthetics.',
    price: 65,
    category: 'Growing Media',
    stock: 180,
    image: 'https://images.unsplash.com/photo-1752775312083-1cefe2f93358?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    tags: ['trending'],
    featured: false,
    sold: 380,
    createdAt: '2025-12-01T00:00:00.000Z',
  },
  {
    id: 'p7',
    name: 'Coir Seedling Tray (12-cell)',
    description: '12-cell biodegradable seedling tray made from compressed coir. Transplant directly into soil without disturbing roots.',
    price: 110,
    category: 'Seedling Supplies',
    stock: 95,
    image: 'https://images.unsplash.com/photo-1763038922944-c6199c299f30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    tags: ['new'],
    featured: false,
    sold: 215,
    createdAt: '2026-02-10T00:00:00.000Z',
  },
  {
    id: 'p8',
    name: 'Coco Peat + Compost Mix (10L)',
    description: 'Ready-to-use growing mix combining premium coco peat and organic compost. Perfect for potted plants.',
    price: 135,
    category: 'Growing Media',
    stock: 110,
    image: 'https://images.unsplash.com/photo-1574483078807-f1c78259e290?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    tags: ['bestseller'],
    featured: false,
    sold: 760,
    createdAt: '2025-09-15T00:00:00.000Z',
  },
  {
    id: 'p9',
    name: 'Coir Weed Control Mat',
    description: 'Natural weed barrier mat made from coconut fiber. Prevents weed growth while allowing water and nutrients through.',
    price: 200,
    category: 'Garden Accessories',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1744659747310-39564f92c25b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    tags: ['trending'],
    featured: false,
    sold: 180,
    createdAt: '2026-01-05T00:00:00.000Z',
  },
  {
    id: 'p10',
    name: 'Coir Grow Bag (Large)',
    description: 'Large coir grow bag for vegetables, tomatoes, and root crops. Reusable and fully biodegradable at end of life.',
    price: 95,
    category: 'Pots & Containers',
    stock: 70,
    image: 'https://images.unsplash.com/photo-1658600850748-79feefeb18f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    tags: ['new', 'trending'],
    featured: false,
    sold: 290,
    createdAt: '2026-02-15T00:00:00.000Z',
  },
];

const DEFAULT_STOREFRONT: StorefrontSettings = {
  bannerTitle: 'Grow Green, Grow Natural',
  bannerSubtitle: 'Eco-friendly 100% coconut coir gardening products for the modern Filipino plant lover. Sustainable, biodegradable, and made with care.',
  bannerCta: 'Shop Now',
  announcement: '🌿 Free shipping on orders over ₱500! Use code COIRGROW at checkout.',
  showAnnouncement: true,
  featuredTags: ['new', 'trending', 'bestseller'],
  heroImage: 'https://images.unsplash.com/photo-1763038922944-c6199c299f30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
};

const DEFAULT_SELLER: User = {
  id: 'seller1',
  email: 'seller@coirgrow.ph',
  password: 'seller123',
  name: 'CoirGrow PH Admin',
  address: 'Quezon City, Metro Manila, Philippines',
  mobile: '09171234567',
  role: 'seller',
  createdAt: '2025-01-01T00:00:00.000Z',
};

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ord-001',
    userId: 'demo-buyer',
    items: [
      { productId: 'p2', productName: 'Coir Pot (Medium)', price: 75, quantity: 3 },
      { productId: 'p5', productName: 'Coco Peat Block (5kg)', price: 89, quantity: 2 },
    ],
    subtotal: 403,
    shippingFee: 80,
    total: 483,
    paymentMethod: 'GCash',
    deliveryMethod: 'delivery',
    address: '123 Sampaguita St., Quezon City',
    status: 'Delivered',
    createdAt: '2026-02-10T09:30:00.000Z',
  },
  {
    id: 'ord-002',
    userId: 'demo-buyer',
    items: [
      { productId: 'p4', productName: 'Hanging Coir Basket', price: 150, quantity: 2 },
    ],
    subtotal: 300,
    shippingFee: 80,
    total: 380,
    paymentMethod: 'Cash on Delivery',
    deliveryMethod: 'delivery',
    address: '123 Sampaguita St., Quezon City',
    status: 'Delivered',
    createdAt: '2026-02-20T14:00:00.000Z',
  },
  {
    id: 'ord-003',
    userId: 'demo-buyer',
    items: [
      { productId: 'p1', productName: 'Coir Pot (Small)', price: 45, quantity: 5 },
      { productId: 'p6', productName: 'Coco Fiber Mulch (1kg)', price: 65, quantity: 1 },
    ],
    subtotal: 290,
    shippingFee: 0,
    total: 290,
    paymentMethod: 'Maya',
    deliveryMethod: 'pickup',
    address: 'Store Pickup',
    status: 'Completed',
    createdAt: '2026-03-01T11:00:00.000Z',
  },
  // Extra orders for reports
  {
    id: 'ord-004',
    userId: 'user-x',
    items: [{ productId: 'p8', productName: 'Coco Peat + Compost Mix (10L)', price: 135, quantity: 2 }],
    subtotal: 270, shippingFee: 80, total: 350,
    paymentMethod: 'GCash', deliveryMethod: 'delivery', address: 'Makati City',
    status: 'Delivered', createdAt: '2026-03-02T10:00:00.000Z',
  },
  {
    id: 'ord-005',
    userId: 'user-y',
    items: [{ productId: 'p3', productName: 'Coir Pot (Large)', price: 120, quantity: 3 }],
    subtotal: 360, shippingFee: 80, total: 440,
    paymentMethod: 'Cash on Delivery', deliveryMethod: 'delivery', address: 'Pasig City',
    status: 'Delivered', createdAt: '2026-03-03T15:00:00.000Z',
  },
  {
    id: 'ord-006',
    userId: 'user-z',
    items: [{ productId: 'p7', productName: 'Coir Seedling Tray (12-cell)', price: 110, quantity: 4 }],
    subtotal: 440, shippingFee: 0, total: 440,
    paymentMethod: 'Maya', deliveryMethod: 'pickup', address: 'Store Pickup',
    status: 'Processing', createdAt: '2026-03-04T08:00:00.000Z',
  },
];

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* noop */ }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    const stored = loadFromStorage<User[]>('cg_users', []);
    const hasSeller = stored.some(u => u.role === 'seller');
    if (!hasSeller) return [...stored, DEFAULT_SELLER];
    return stored;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadFromStorage('cg_currentUser', null)
  );
  const [currentSeller, setCurrentSeller] = useState<User | null>(() =>
    loadFromStorage('cg_currentSeller', null)
  );
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = loadFromStorage<Product[]>('cg_products', []);
    return stored.length > 0 ? stored : DEFAULT_PRODUCTS;
  });
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadFromStorage('cg_cart', [])
  );
  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = loadFromStorage<Order[]>('cg_orders', []);
    return stored.length > 0 ? stored : DEFAULT_ORDERS;
  });
  const [storefrontSettings, setStorefrontSettings] = useState<StorefrontSettings>(() =>
    loadFromStorage('cg_storefront', DEFAULT_STOREFRONT)
  );

  useEffect(() => { saveToStorage('cg_users', users); }, [users]);
  useEffect(() => { saveToStorage('cg_currentUser', currentUser); }, [currentUser]);
  useEffect(() => { saveToStorage('cg_currentSeller', currentSeller); }, [currentSeller]);
  useEffect(() => { saveToStorage('cg_products', products); }, [products]);
  useEffect(() => { saveToStorage('cg_cart', cart); }, [cart]);
  useEffect(() => { saveToStorage('cg_orders', orders); }, [orders]);
  useEffect(() => { saveToStorage('cg_storefront', storefrontSettings); }, [storefrontSettings]);

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password && u.role === 'buyer');
    if (user) { setCurrentUser(user); return true; }
    return false;
  };

  const sellerLogin = (email: string, password: string): boolean => {
    const seller = users.find(u => u.email === email && u.password === password && u.role === 'seller');
    if (seller) { setCurrentSeller(seller); return true; }
    return false;
  };

  const logout = () => setCurrentUser(null);
  const sellerLogout = () => setCurrentSeller(null);

  const register = (data: Omit<User, 'id' | 'role' | 'createdAt'>): { success: boolean; message: string } => {
    if (users.some(u => u.email === data.email)) {
      return { success: false, message: 'Email already registered.' };
    }
    const newUser: User = {
      ...data,
      id: `user-${Date.now()}`,
      role: 'buyer',
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, message: 'Registration successful!' };
  };

  const addToCart = (productId: string, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { productId, quantity }];
    });
  };

  const updateCartItem = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (orderData: Omit<Order, 'id' | 'userId' | 'createdAt' | 'status'>): string => {
    const orderId = `ord-${Date.now()}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      userId: currentUser?.id || 'guest',
      status: 'Processing',
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [...prev, newOrder]);
    // Update stock
    orderData.items.forEach(item => {
      setProducts(prev => prev.map(p =>
        p.id === item.productId
          ? { ...p, stock: Math.max(0, p.stock - item.quantity), sold: p.sold + item.quantity }
          : p
      ));
    });
    clearCart();
    return orderId;
  };

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'sold'>) => {
    const newProduct: Product = {
      ...product,
      id: `p-${Date.now()}`,
      sold: 0,
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateStorefront = (settings: Partial<StorefrontSettings>) => {
    setStorefrontSettings(prev => ({ ...prev, ...settings }));
  };

  const getProductById = (id: string) => products.find(p => p.id === id);

  return (
    <AppContext.Provider value={{
      users, currentUser, currentSeller, products, cart, orders, storefrontSettings,
      login, sellerLogin, logout, sellerLogout, register,
      addToCart, updateCartItem, removeFromCart, clearCart, placeOrder,
      addProduct, updateProduct, deleteProduct, updateStorefront, getProductById,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
