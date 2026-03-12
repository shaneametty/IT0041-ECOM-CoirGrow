import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';

export interface User {
  id: string;
  email: string;
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
  users: User[]; // keeping for compat if needed, better to fetch per need.
  currentUser: User | null;
  currentSeller: User | null;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  storefrontSettings: StorefrontSettings;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  sellerLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  sellerLogout: () => Promise<void>;
  register: (data: any) => Promise<{ success: boolean; message: string }>;
  addToCart: (productId: string, quantity: number) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (orderData: any) => Promise<string | null>;
  addProduct: (product: any) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateStorefront: (settings: Partial<StorefrontSettings>) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSeller, setCurrentSeller] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage('cg_cart', []));
  const [orders, setOrders] = useState<Order[]>([]);
  const [storefrontSettings, setStorefrontSettings] = useState<StorefrontSettings>({
    bannerTitle: 'Grow Green, Grow Natural',
    bannerSubtitle: 'Eco-friendly 100% coconut coir gardening products for the modern Filipino plant lover.',
    bannerCta: 'Shop Now',
    announcement: '🌿 Free shipping on orders over ₱500!',
    showAnnouncement: true,
    featuredTags: ['new', 'trending', 'bestseller'],
    heroImage: ''
  });

  useEffect(() => { saveToStorage('cg_cart', cart); }, [cart]);

  // Load initial data from Supabase
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch Products
      const { data: pData } = await supabase.from('products').select('*');
      if (pData) {
        setProducts(pData.map(p => {
          const defaultTags = [];
          if (p.is_featured) defaultTags.push('featured');
          // For demo purposes, add tags so they appear in the storefront sections
          if (p.name.includes('Blocks') || p.name.includes('Starter')) defaultTags.push('bestseller');
          if (p.name.includes('Pole') || p.name.includes('Chips')) defaultTags.push('trending');
          if (p.name.includes('Pots')) defaultTags.push('new');

          // Also merge in the tags stored in the database
          const dbTags = p.tags || [];

          return {
            ...p,
            image: p.image_url,
            featured: p.is_featured,
            createdAt: p.created_at,
            sold: p.sold || 0,
            tags: [...new Set([...dbTags, ...defaultTags, p.category.toLowerCase()])].filter(Boolean)
          };
        }));
      }

      // Fetch Storefront Settings
      const { data: sData } = await supabase.from('storefront_settings').select('*').single();
      if (sData) {
        setStorefrontSettings({
          bannerTitle: sData.banner_title,
          bannerSubtitle: sData.banner_subtitle,
          bannerCta: sData.banner_cta,
          announcement: sData.announcement,
          showAnnouncement: sData.show_announcement,
          featuredTags: sData.featured_tags || [],
          heroImage: sData.hero_image
        });
      }

      // Check auth session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        fetchProfileAndSetUser(session.user.id);
      }
    };

    fetchInitialData();

    // Listen to Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        fetchProfileAndSetUser(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setCurrentSeller(null);
        setOrders([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfileAndSetUser = async (userId: string) => {
    console.log("Fetching profile for user:", userId);
    let { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    
    // Auto-heal: If the profile is missing (e.g., user created manually in dashboard without trigger)
    if (error) {
      console.warn("Profile missing/error! Attempting to auto-create...", error);
      const { data: sessionData } = await supabase.auth.getSession();
      const newEmail = sessionData?.session?.user?.email || `user-${userId}@example.com`;
      const fallbackName = sessionData?.session?.user?.user_metadata?.full_name || 'New User';
      const fallbackRole = sessionData?.session?.user?.user_metadata?.role || 'buyer';
      
      const { data: newProfile, error: insertError } = await supabase.from('profiles').upsert({
        id: userId,
        email: newEmail,
        full_name: fallbackName,
        role: fallbackRole
      }).select().single();

      if (!insertError && newProfile) {
        data = newProfile;
        error = null;
        console.log("Auto-created profile successfully.");
      } else {
        console.error("Failed to auto-create profile:", insertError);
      }
    }
    
    if (data && !error) {
      console.log("Profile found:", data);
      const u: User = {
        id: data.id,
        email: data.email,
        name: data.full_name || '',
        address: data.address || '',
        mobile: data.mobile || '',
        role: data.role as 'buyer' | 'seller',
        createdAt: data.created_at
      };
      if (u.role === 'buyer') {
        setCurrentUser(u);
        fetchOrders(u.id);
      } else {
        setCurrentSeller(u);
        fetchAllOrders();
      }
    } else {
        console.error("No profile found for user, currentUser will remain null.");
    }
  };

  const fetchOrders = async (userId: string) => {
    const { data } = await supabase.from('orders').select('*, order_items(*, products(*))').eq('user_id', userId);
    if (data) processOrders(data);
  };

  const fetchAllOrders = async () => {
    const { data } = await supabase.from('orders').select('*, order_items(*, products(*))');
    if (data) processOrders(data);
  };

  const processOrders = (data: any[]) => {
    const formatted: Order[] = data.map(o => ({
      id: o.id,
      userId: o.user_id,
      total: Number(o.total_amount),
      subtotal: Number(o.total_amount) - 80, // rough calc if shipping isn't detailed, or derive from items
      shippingFee: 80,
      status: o.status,
      paymentMethod: o.payment_method,
      deliveryMethod: o.delivery_option,
      address: '',
      createdAt: o.created_at,
      items: o.order_items.map((i: any) => ({
        productId: i.product_id,
        productName: i.products?.name || 'Unknown',
        price: Number(i.price_at_time),
        quantity: i.quantity
      }))
    }));
    setOrders(formatted);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Login Error:", error);
      return { success: false, message: error.message };
    }
    return { success: true };
  };

  const sellerLogin = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return false;
    
    // Verify role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
    if (profile?.role === 'seller') {
      return true;
    } else {
      await supabase.auth.signOut();
      return false;
    }
  };

  const logout = async () => { await supabase.auth.signOut(); };
  const sellerLogout = async () => { await supabase.auth.signOut(); };

  const register = async (data: any): Promise<{ success: boolean; message: string }> => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.name,
          role: 'buyer'
        }
      }
    });
    if (error) return { success: false, message: error.message };
    
    // Auth trigger should create the profile, but let's upsert to be safe since it seems to be failing
    if (authData?.user) {
      const { error: upsertError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: data.email,
        full_name: data.name,
        address: data.address,
        mobile: data.mobile,
        role: 'buyer'
      });
      if (upsertError) {
          console.error("Failed to upsert profile during registration:", upsertError);
      }
    }
    
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

  const placeOrder = async (orderData: any): Promise<string | null> => {
    if (!currentUser) return null;

    const { data: order, error } = await supabase.from('orders').insert({
      user_id: currentUser.id,
      total_amount: orderData.total,
      payment_method: orderData.paymentMethod,
      delivery_option: orderData.deliveryMethod,
      status: 'Processing'
    }).select().single();

    if (error || !order) return null;

    const itemsToInsert = orderData.items.map((i: any) => ({
      order_id: order.id,
      product_id: i.productId,
      quantity: i.quantity,
      price_at_time: i.price
    }));

    await supabase.from('order_items').insert(itemsToInsert);

    // Provide optimistic UX
    setOrders(prev => [...prev, { ...orderData, id: order.id, userId: currentUser.id, status: 'Processing', createdAt: new Date().toISOString() }]);
    
    // Optimistically update stock and sold count in local state
    setProducts(prev => prev.map(p => {
      const orderedItem = orderData.items.find((i: any) => i.productId === p.id);
      if (orderedItem) {
        return { ...p, stock: p.stock - orderedItem.quantity, sold: (p.sold || 0) + orderedItem.quantity };
      }
      return p;
    }));

    clearCart();
    
    return order.id;
  };

  const addProduct = async (product: any) => {
    const { data, error } = await supabase.from('products').insert({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      is_featured: product.featured || false,
      image_url: product.image,
      tags: product.tags || []
    }).select().single();

    if (data && !error) {
      const newP: Product = {
        ...product,
        id: data.id,
        image: data.image_url,
        featured: data.is_featured,
        createdAt: data.created_at,
        sold: 0
      };
      setProducts(prev => [...prev, newP]);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.featured !== undefined) dbUpdates.is_featured = updates.featured;
    if (updates.image !== undefined) dbUpdates.image_url = updates.image;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;

    const { error } = await supabase.from('products').update(dbUpdates).eq('id', id);
    if (!error) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }
  };

  const deleteProduct = async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateStorefront = async (settings: Partial<StorefrontSettings>) => {
    const dbUpdates: any = {};
    if (settings.bannerTitle !== undefined) dbUpdates.banner_title = settings.bannerTitle;
    if (settings.bannerSubtitle !== undefined) dbUpdates.banner_subtitle = settings.bannerSubtitle;
    if (settings.bannerCta !== undefined) dbUpdates.banner_cta = settings.bannerCta;
    if (settings.announcement !== undefined) dbUpdates.announcement = settings.announcement;
    if (settings.showAnnouncement !== undefined) dbUpdates.show_announcement = settings.showAnnouncement;
    if (settings.featuredTags !== undefined) dbUpdates.featured_tags = settings.featuredTags;
    if (settings.heroImage !== undefined) dbUpdates.hero_image = settings.heroImage;

    await supabase.from('storefront_settings').update(dbUpdates).eq('id', 1);
    setStorefrontSettings(prev => ({ ...prev, ...settings }));
  };

  const getProductById = (id: string) => products.find(p => p.id === id);

  return (
    <AppContext.Provider value={{
      users: [], currentUser, currentSeller, products, cart, orders, storefrontSettings,
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
