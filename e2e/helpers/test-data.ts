export const URLS = {
  home: '/tr',
  shop: '/tr/shop',
  cart: '/tr/cart',
  checkout: '/tr/checkout',
  checkoutSuccess: '/tr/checkout/success',
  login: '/tr/login',
  dashboard: '/tr/dashboard',
  products: '/tr/products',
  orders: '/tr/orders',
  groups: '/tr/groups',
  users: '/tr/users',
  settings: '/tr/settings',
} as const;

export const CREDENTIALS = {
  dealerAdmin: {
    email: 'admin@camlikspor.com',
    password: 'Dealer123!',
  },
  superAdmin: {
    email: 'admin@futbolokullari.com',
    password: 'Admin123!',
  },
} as const;

export const CART_STORAGE_KEY = 'shop-cart';
