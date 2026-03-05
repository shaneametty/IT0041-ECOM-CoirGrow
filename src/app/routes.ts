import { createBrowserRouter } from 'react-router';
import { Home } from './pages/buyer/Home';
import { Login } from './pages/buyer/Login';
import { Register } from './pages/buyer/Register';
import { Storefront } from './pages/buyer/Storefront';
import { Products } from './pages/buyer/Products';
import { Cart } from './pages/buyer/Cart';
import { Checkout } from './pages/buyer/Checkout';
import { TransactionHistory } from './pages/buyer/TransactionHistory';
import { Profile } from './pages/buyer/Profile';
import { SellerLogin } from './pages/seller/SellerLogin';
import { SellerDashboard } from './pages/seller/SellerDashboard';
import { StorefrontManager } from './pages/seller/StorefrontManager';
import { Inventory } from './pages/seller/Inventory';
import { Reports } from './pages/seller/Reports';
import { InventoryReport } from './pages/seller/InventoryReport';

export const router = createBrowserRouter([
  { path: '/', Component: Home },
  { path: '/login', Component: Login },
  { path: '/register', Component: Register },
  { path: '/storefront', Component: Storefront },
  { path: '/products', Component: Products },
  { path: '/cart', Component: Cart },
  { path: '/checkout', Component: Checkout },
  { path: '/transactions', Component: TransactionHistory },
  { path: '/profile', Component: Profile },
  // Seller Routes
  { path: '/seller/login', Component: SellerLogin },
  { path: '/seller/dashboard', Component: SellerDashboard },
  { path: '/seller/storefront', Component: StorefrontManager },
  { path: '/seller/inventory', Component: Inventory },
  { path: '/seller/reports', Component: Reports },
  { path: '/seller/inventory-report', Component: InventoryReport },
]);
