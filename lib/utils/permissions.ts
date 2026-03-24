import { Permission, UserRole } from "@/lib/types";

// Permissions restricted for sub-dealer admins
export const SUB_DEALER_RESTRICTED_PERMISSIONS: Permission[] = [
  Permission.SUB_DEALERS_VIEW,
  Permission.SUB_DEALERS_CREATE,
  Permission.SUB_DEALERS_EDIT,
  Permission.SUB_DEALERS_DELETE,
  Permission.COMMISSIONS_VIEW,
  // Products - sub-dealers cannot manage products
  Permission.PRODUCTS_VIEW,
  Permission.PRODUCTS_CREATE,
  Permission.PRODUCTS_EDIT,
  Permission.PRODUCTS_DELETE,
  // Orders - sub-dealers cannot manage orders
  Permission.ORDERS_VIEW,
  Permission.ORDERS_EDIT,
  // Blog - sub-dealers cannot manage blog
  Permission.BLOG_VIEW,
  Permission.BLOG_CREATE,
  Permission.BLOG_EDIT,
  Permission.BLOG_DELETE,
];

// Role-based default permissions
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    // Only dealer management for Super Admin
    Permission.DEALERS_VIEW,
    Permission.DEALERS_CREATE,
    Permission.DEALERS_EDIT,
    Permission.DEALERS_DELETE,
  ],
  [UserRole.DEALER_ADMIN]: [
    // Pre-registration
    Permission.PRE_REGISTRATION_VIEW,
    Permission.PRE_REGISTRATION_CREATE,
    Permission.PRE_REGISTRATION_EDIT,
    Permission.PRE_REGISTRATION_DELETE,
    Permission.PRE_REGISTRATION_CONVERT,
    // Students
    Permission.STUDENTS_VIEW,
    Permission.STUDENTS_CREATE,
    Permission.STUDENTS_EDIT,
    Permission.STUDENTS_DELETE,
    // Trainers
    Permission.TRAINERS_VIEW,
    Permission.TRAINERS_CREATE,
    Permission.TRAINERS_EDIT,
    Permission.TRAINERS_DELETE,
    Permission.TRAINERS_SALARY,
    // Groups
    Permission.GROUPS_VIEW,
    Permission.GROUPS_CREATE,
    Permission.GROUPS_EDIT,
    Permission.GROUPS_DELETE,
    // Attendance
    Permission.ATTENDANCE_VIEW,
    Permission.ATTENDANCE_TAKE,
    // Accounting
    Permission.ACCOUNTING_PAYMENTS_VIEW,
    Permission.ACCOUNTING_PAYMENTS_CREATE,
    Permission.ACCOUNTING_CASH_REGISTER_VIEW,
    Permission.ACCOUNTING_CASH_REGISTER_CREATE,
    Permission.ACCOUNTING_DAILY_STATUS_VIEW,
    Permission.ACCOUNTING_ONLINE_PAYMENTS_VIEW,
    // Reports
    Permission.REPORTS_GENERAL,
    Permission.REPORTS_ATTENDANCE,
    Permission.REPORTS_STUDENTS,
    Permission.REPORTS_MATERIALS,
    Permission.REPORTS_SALARIES,
    Permission.REPORTS_BIRTHDAYS,
    // SMS
    Permission.SMS_VIEW,
    Permission.SMS_SEND,
    // Users
    Permission.USERS_VIEW,
    Permission.USERS_CREATE,
    Permission.USERS_EDIT,
    Permission.USERS_DELETE,
    // Settings
    Permission.SETTINGS_VIEW,
    Permission.SETTINGS_EDIT,
    // Products
    Permission.PRODUCTS_VIEW,
    Permission.PRODUCTS_CREATE,
    Permission.PRODUCTS_EDIT,
    Permission.PRODUCTS_DELETE,
    // Orders
    Permission.ORDERS_VIEW,
    Permission.ORDERS_EDIT,
    // Blog
    Permission.BLOG_VIEW,
    Permission.BLOG_CREATE,
    Permission.BLOG_EDIT,
    Permission.BLOG_DELETE,
    // Hero Slides
    Permission.HERO_SLIDES_VIEW,
    Permission.HERO_SLIDES_CREATE,
    Permission.HERO_SLIDES_EDIT,
    Permission.HERO_SLIDES_DELETE,
    // Gallery
    Permission.GALLERY_VIEW,
    Permission.GALLERY_CREATE,
    Permission.GALLERY_EDIT,
    Permission.GALLERY_DELETE,
    // Matches
    Permission.MATCHES_VIEW,
    Permission.MATCHES_CREATE,
    Permission.MATCHES_EDIT,
    Permission.MATCHES_DELETE,
    // Sponsors
    Permission.SPONSORS_VIEW,
    Permission.SPONSORS_CREATE,
    Permission.SPONSORS_EDIT,
    Permission.SPONSORS_DELETE,
    // Sub-dealers
    Permission.SUB_DEALERS_VIEW,
    Permission.SUB_DEALERS_CREATE,
    Permission.SUB_DEALERS_EDIT,
    Permission.SUB_DEALERS_DELETE,
    // Commissions
    Permission.COMMISSIONS_VIEW,
    // Training
    Permission.TRAINING_VIEW,
    Permission.TRAINING_CREATE,
    Permission.TRAINING_EDIT,
    Permission.TRAINING_DELETE,
    Permission.TACTICAL_BOARD_VIEW,
    Permission.TACTICAL_BOARD_CREATE,
    Permission.TACTICAL_BOARD_EDIT,
    Permission.TACTICAL_BOARD_DELETE,
    // Equipment/Materials
    Permission.EQUIPMENT_VIEW,
    Permission.EQUIPMENT_CREATE,
    Permission.EQUIPMENT_EDIT,
    Permission.EQUIPMENT_DELETE,
    // Student Development
    Permission.STUDENT_DEVELOPMENT_VIEW,
    Permission.STUDENT_DEVELOPMENT_CREATE,
    Permission.STUDENT_DEVELOPMENT_EDIT,
    Permission.STUDENT_DEVELOPMENT_DELETE,
    // Body Measurements
    Permission.BODY_MEASUREMENTS_VIEW,
    Permission.BODY_MEASUREMENTS_CREATE,
    Permission.BODY_MEASUREMENTS_EDIT,
    Permission.BODY_MEASUREMENTS_DELETE,
    // Personnel
    Permission.PERSONNEL_VIEW,
    Permission.PERSONNEL_CREATE,
    Permission.PERSONNEL_EDIT,
    Permission.PERSONNEL_DELETE,
    // Expense Items
    Permission.EXPENSE_ITEMS_VIEW,
    Permission.EXPENSE_ITEMS_CREATE,
    Permission.EXPENSE_ITEMS_EDIT,
    Permission.EXPENSE_ITEMS_DELETE,
    // Expenses
    Permission.EXPENSES_VIEW,
    Permission.EXPENSES_CREATE,
    Permission.EXPENSES_EDIT,
    Permission.EXPENSES_DELETE,
    // Income Items
    Permission.INCOME_ITEMS_VIEW,
    Permission.INCOME_ITEMS_CREATE,
    Permission.INCOME_ITEMS_EDIT,
    Permission.INCOME_ITEMS_DELETE,
    // Incomes
    Permission.INCOMES_VIEW,
    Permission.INCOMES_CREATE,
    Permission.INCOMES_EDIT,
    Permission.INCOMES_DELETE,
    // Task Definitions
    Permission.TASK_DEFINITIONS_VIEW,
    Permission.TASK_DEFINITIONS_CREATE,
    Permission.TASK_DEFINITIONS_EDIT,
    Permission.TASK_DEFINITIONS_DELETE,
    // Other Payment Types
    Permission.OTHER_PAYMENT_TYPES_VIEW,
    Permission.OTHER_PAYMENT_TYPES_CREATE,
    Permission.OTHER_PAYMENT_TYPES_EDIT,
    Permission.OTHER_PAYMENT_TYPES_DELETE,
    // Dues Types
    Permission.DUES_TYPES_VIEW,
    Permission.DUES_TYPES_CREATE,
    Permission.DUES_TYPES_EDIT,
    Permission.DUES_TYPES_DELETE,
  ],
  [UserRole.TRAINER]: [
    Permission.ATTENDANCE_VIEW,
    Permission.ATTENDANCE_TAKE,
    Permission.STUDENTS_VIEW,
    Permission.GROUPS_VIEW,
    Permission.TRAINING_VIEW,
    Permission.TRAINING_CREATE,
    Permission.TACTICAL_BOARD_VIEW,
    Permission.TACTICAL_BOARD_CREATE,
  ],
  [UserRole.PARENT]: [
    // Parents have no admin permissions - they only access their own parent panel
  ],
  [UserRole.STUDENT]: [
    // Students have no admin permissions - they only access their own student panel
  ],
};

export function hasPermission(
  userPermissions: string[],
  requiredPermission: Permission
): boolean {
  return userPermissions.includes(requiredPermission);
}

export function hasAnyPermission(
  userPermissions: string[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.some((p) => userPermissions.includes(p));
}

export function hasAllPermissions(
  userPermissions: string[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.every((p) => userPermissions.includes(p));
}

export function getDefaultPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// Menu items with required permissions
export interface MenuItem {
  key: string;
  labelKey: string; // i18n key
  href: string;
  icon?: string;
  permission?: Permission;
  children?: MenuItem[];
}

// Menu items for DEALER_ADMIN and TRAINER
export const MENU_ITEMS: MenuItem[] = [
  {
    key: "home",
    labelKey: "sidebar.home",
    href: "/",
  },
  {
    key: "dashboard",
    labelKey: "sidebar.dashboard",
    href: "/dashboard",
  },
  {
    key: "pre-registration",
    labelKey: "sidebar.preRegistration",
    href: "/pre-registration",
    permission: Permission.PRE_REGISTRATION_VIEW,
  },
  {
    key: "students",
    labelKey: "sidebar.students",
    href: "/students",
    permission: Permission.STUDENTS_VIEW,
  },
  {
    key: "trainers",
    labelKey: "sidebar.trainers",
    href: "/trainers",
    permission: Permission.TRAINERS_VIEW,
  },
  {
    key: "groups",
    labelKey: "sidebar.groups",
    href: "/groups",
    permission: Permission.GROUPS_VIEW,
  },
  {
    key: "attendance",
    labelKey: "sidebar.attendance",
    href: "/attendance",
    permission: Permission.ATTENDANCE_VIEW,
  },
  {
    key: "training",
    labelKey: "sidebar.training",
    href: "/training",
    permission: Permission.TRAINING_VIEW,
    children: [
      {
        key: "training-plans",
        labelKey: "sidebar.trainingPlans",
        href: "/training/plans",
        permission: Permission.TRAINING_VIEW,
      },
      {
        key: "tactical-board",
        labelKey: "sidebar.tacticalBoard",
        href: "/training/tactical-board",
        permission: Permission.TACTICAL_BOARD_VIEW,
      },
      {
        key: "training-calendar",
        labelKey: "sidebar.trainingCalendar",
        href: "/training/calendar",
        permission: Permission.TRAINING_VIEW,
      },
    ],
  },
  {
    key: "accounting",
    labelKey: "sidebar.accounting",
    href: "/accounting/payments",
    permission: Permission.ACCOUNTING_PAYMENTS_VIEW,
    children: [
      {
        key: "payments",
        labelKey: "sidebar.payments",
        href: "/accounting/payments",
        permission: Permission.ACCOUNTING_PAYMENTS_VIEW,
      },
      {
        key: "cash-register",
        labelKey: "sidebar.cashRegister",
        href: "/accounting/cash-register",
        permission: Permission.ACCOUNTING_CASH_REGISTER_VIEW,
      },
      {
        key: "daily-status",
        labelKey: "sidebar.dailyStatus",
        href: "/accounting/daily-status",
        permission: Permission.ACCOUNTING_DAILY_STATUS_VIEW,
      },
      {
        key: "online-payments",
        labelKey: "sidebar.onlinePayments",
        href: "/accounting/online-payments",
        permission: Permission.ACCOUNTING_ONLINE_PAYMENTS_VIEW,
      },
      {
        key: "incomes",
        labelKey: "sidebar.incomes",
        href: "/accounting/incomes",
        permission: Permission.INCOMES_VIEW,
      },
      {
        key: "expenses",
        labelKey: "sidebar.expenses",
        href: "/accounting/expenses",
        permission: Permission.EXPENSES_VIEW,
      },
    ],
  },
  {
    key: "reports",
    labelKey: "sidebar.reports",
    href: "/reports",
    permission: Permission.REPORTS_GENERAL,
  },
  {
    key: "sms",
    labelKey: "sidebar.sms",
    href: "/sms",
    permission: Permission.SMS_VIEW,
  },
  {
    key: "users",
    labelKey: "sidebar.users",
    href: "/users",
    permission: Permission.USERS_VIEW,
  },
  {
    key: "settings",
    labelKey: "sidebar.settings",
    href: "/settings",
    permission: Permission.SETTINGS_VIEW,
    children: [
      {
        key: "periods",
        labelKey: "sidebar.periods",
        href: "/settings/periods",
        permission: Permission.SETTINGS_VIEW,
      },
      {
        key: "branches",
        labelKey: "sidebar.branches",
        href: "/settings/branches",
        permission: Permission.SETTINGS_VIEW,
      },
      {
        key: "locations",
        labelKey: "sidebar.locations",
        href: "/settings/locations",
        permission: Permission.SETTINGS_VIEW,
      },
      {
        key: "facilities",
        labelKey: "sidebar.facilities",
        href: "/settings/facilities",
        permission: Permission.SETTINGS_VIEW,
      },
      {
        key: "equipment",
        labelKey: "sidebar.equipment",
        href: "/settings/equipment",
        permission: Permission.EQUIPMENT_VIEW,
      },
      {
        key: "student-development",
        labelKey: "sidebar.studentDevelopment",
        href: "/settings/student-development",
        permission: Permission.STUDENT_DEVELOPMENT_VIEW,
      },
      {
        key: "body-measurements",
        labelKey: "sidebar.bodyMeasurements",
        href: "/settings/body-measurements",
        permission: Permission.BODY_MEASUREMENTS_VIEW,
      },
      {
        key: "personnel",
        labelKey: "sidebar.personnel",
        href: "/settings/personnel",
        permission: Permission.PERSONNEL_VIEW,
      },
      {
        key: "expense-items",
        labelKey: "sidebar.expenseItems",
        href: "/settings/expense-items",
        permission: Permission.EXPENSE_ITEMS_VIEW,
      },
      {
        key: "income-items",
        labelKey: "sidebar.incomeItems",
        href: "/settings/income-items",
        permission: Permission.INCOME_ITEMS_VIEW,
      },
      {
        key: "task-definitions",
        labelKey: "sidebar.taskDefinitions",
        href: "/settings/task-definitions",
        permission: Permission.TASK_DEFINITIONS_VIEW,
      },
      {
        key: "other-payment-types",
        labelKey: "sidebar.otherPaymentTypes",
        href: "/settings/other-payment-types",
        permission: Permission.OTHER_PAYMENT_TYPES_VIEW,
      },
      {
        key: "dues-types",
        labelKey: "sidebar.duesTypes",
        href: "/settings/dues-types",
        permission: Permission.DUES_TYPES_VIEW,
      },
      {
        key: "discounts",
        labelKey: "sidebar.discounts",
        href: "/settings/discounts",
        permission: Permission.SETTINGS_VIEW,
      },
      {
        key: "legal-documents",
        labelKey: "sidebar.legalDocuments",
        href: "/settings/legal-documents",
        permission: Permission.SETTINGS_EDIT,
      },
    ],
  },
  {
    key: "products",
    labelKey: "sidebar.products",
    href: "/products",
    permission: Permission.PRODUCTS_VIEW,
  },
  {
    key: "orders",
    labelKey: "sidebar.orders",
    href: "/orders",
    permission: Permission.ORDERS_VIEW,
  },
  {
    key: "matches",
    labelKey: "sidebar.matches",
    href: "/matches",
    permission: Permission.MATCHES_VIEW,
  },
  {
    key: "sponsors",
    labelKey: "sidebar.sponsors",
    href: "/sponsors",
    permission: Permission.SPONSORS_VIEW,
  },
  {
    key: "blog",
    labelKey: "sidebar.blog",
    href: "/blog",
    permission: Permission.BLOG_VIEW,
  },
  {
    key: "hero-slides",
    labelKey: "sidebar.heroSlides",
    href: "/hero-slides",
    permission: Permission.HERO_SLIDES_VIEW,
  },
  {
    key: "gallery",
    labelKey: "sidebar.gallery",
    href: "/gallery",
    permission: Permission.GALLERY_VIEW,
  },
  {
    key: "sub-dealers",
    labelKey: "sidebar.subDealers",
    href: "/sub-dealers",
    permission: Permission.SUB_DEALERS_VIEW,
  },
  {
    key: "commissions",
    labelKey: "sidebar.commissions",
    href: "/commissions",
    permission: Permission.COMMISSIONS_VIEW,
  },
];

// Menu items for SUPER_ADMIN (only dealer management)
export const SUPER_ADMIN_MENU_ITEMS: MenuItem[] = [
  {
    key: "home",
    labelKey: "sidebar.home",
    href: "/",
  },
  {
    key: "dashboard",
    labelKey: "sidebar.dashboard",
    href: "/dashboard",
  },
  {
    key: "dealers",
    labelKey: "sidebar.dealers",
    href: "/dealers",
    permission: Permission.DEALERS_VIEW,
  },
  {
    key: "dealer-payments",
    labelKey: "sidebar.dealerPayments",
    href: "/dealers/payments",
    permission: Permission.DEALERS_VIEW,
  },
];

export function getAccessibleMenuItems(
  userPermissions: string[],
  role: UserRole
): MenuItem[] {
  // SUPER_ADMIN gets a special menu (only dealer management)
  if (role === UserRole.SUPER_ADMIN) {
    return SUPER_ADMIN_MENU_ITEMS;
  }

  // For other roles, filter based on permissions
  const filterItems = (items: MenuItem[]): MenuItem[] => {
    return items
      .filter((item) => {
        if (!item.permission) return true;
        return userPermissions.includes(item.permission);
      })
      .map((item) => ({
        ...item,
        children: item.children ? filterItems(item.children) : undefined,
      }))
      .filter((item) => !item.children || item.children.length > 0);
  };

  return filterItems(MENU_ITEMS);
}
