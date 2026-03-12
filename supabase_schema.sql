-- Create profiles (users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  address TEXT,
  mobile TEXT,
  role TEXT DEFAULT 'buyer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Create products
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone."
  ON products FOR SELECT
  USING ( true );

CREATE POLICY "Only sellers can insert/update/delete products"
  ON products FOR ALL
  USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'seller' );

-- Create orders
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT NOT NULL,
  delivery_option TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders."
  ON orders FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Sellers can view all orders."
  ON orders FOR SELECT
  USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'seller' );

CREATE POLICY "Users can insert their own orders."
  ON orders FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Sellers can update orders."
  ON orders FOR UPDATE
  USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'seller' );

-- Create order items
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items through orders."
  ON order_items FOR SELECT
  USING ( EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()) );

CREATE POLICY "Sellers can view all order items."
  ON order_items FOR SELECT
  USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'seller' );

CREATE POLICY "Users can insert their own order items through orders."
  ON order_items FOR INSERT
  WITH CHECK ( EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()) );

-- Insert initial dummy data for products
INSERT INTO products (name, description, price, stock, category, is_featured, image_url) VALUES 
('Coconut Coir Blocks (5kg)', 'Premium quality coconut coir blocks for gardening. Expands up to 75 liters.', 350.00, 50, 'Growing Media', true, 'https://images.unsplash.com/photo-1592424005688-57357c1e5401?w=800&q=80'),
('Coir Seedling Starter Pots (10pcs)', 'Biodegradable coir pots perfect for starting seeds and cuttings.', 120.00, 100, 'Pots', true, 'https://images.unsplash.com/photo-1416879598555-46e2f183cf99?w=800&q=80'),
('Coco Chips/Husk (2kg)', 'Chunky coconut husks ideal for orchids and aroids.', 180.00, 30, 'Growing Media', false, 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=800&q=80'),
('Coir Climbing Pole (1m)', 'Sturdy coir pole for climbing plants like Monstera and Pothos.', 250.00, 25, 'Accessories', true, 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80');

-- Create trigger to automatically create profile on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'role', 'buyer')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create storefront_settings
CREATE TABLE storefront_settings (
  id INTEGER PRIMARY KEY DEFAULT 1, -- single row
  banner_title TEXT,
  banner_subtitle TEXT,
  banner_cta TEXT,
  announcement TEXT,
  show_announcement BOOLEAN DEFAULT true,
  featured_tags TEXT[] DEFAULT '{}',
  hero_image TEXT
);

ALTER TABLE storefront_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Storefront settings are readable by everyone"
  ON storefront_settings FOR SELECT USING (true);
  
CREATE POLICY "Storefront settings can be updated by sellers"
  ON storefront_settings FOR UPDATE USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'seller'
  );

INSERT INTO storefront_settings (banner_title, banner_subtitle, banner_cta, announcement, show_announcement, featured_tags, hero_image)
VALUES (
  'Grow Green, Grow Natural',
  'Eco-friendly 100% coconut coir gardening products for the modern Filipino plant lover. Sustainable, biodegradable, and made with care.',
  'Shop Now',
  '🌿 Free shipping on orders over ₱500! Use code COIRGROW at checkout.',
  true,
  '{"new", "trending", "bestseller"}',
  'https://images.unsplash.com/photo-1763038922944-c6199c299f30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200'
);

