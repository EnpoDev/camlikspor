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
  studentLogin: '/tr/student-login',
  parentLogin: '/tr/parent-login',
  studentDashboard: '/tr/student/student',
  parentDashboard: '/tr/parent/parent',
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
  student: {
    email: 'student@camlikspor.com',
    password: 'Student123!',
  },
  parent: {
    email: 'parent@camlikspor.com',
    password: 'Parent123!',
  },
} as const;

export const CART_STORAGE_KEY = 'shop-cart';
