// User roles
export const UserRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
  DEALER_ADMIN: "DEALER_ADMIN",
  TRAINER: "TRAINER",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// Permissions
export const Permission = {
  // Pre-registration
  PRE_REGISTRATION_VIEW: "PRE_REGISTRATION_VIEW",
  PRE_REGISTRATION_CREATE: "PRE_REGISTRATION_CREATE",
  PRE_REGISTRATION_EDIT: "PRE_REGISTRATION_EDIT",
  PRE_REGISTRATION_DELETE: "PRE_REGISTRATION_DELETE",
  PRE_REGISTRATION_CONVERT: "PRE_REGISTRATION_CONVERT",

  // Students
  STUDENTS_VIEW: "STUDENTS_VIEW",
  STUDENTS_CREATE: "STUDENTS_CREATE",
  STUDENTS_EDIT: "STUDENTS_EDIT",
  STUDENTS_DELETE: "STUDENTS_DELETE",

  // Trainers
  TRAINERS_VIEW: "TRAINERS_VIEW",
  TRAINERS_CREATE: "TRAINERS_CREATE",
  TRAINERS_EDIT: "TRAINERS_EDIT",
  TRAINERS_DELETE: "TRAINERS_DELETE",
  TRAINERS_SALARY: "TRAINERS_SALARY",

  // Groups
  GROUPS_VIEW: "GROUPS_VIEW",
  GROUPS_CREATE: "GROUPS_CREATE",
  GROUPS_EDIT: "GROUPS_EDIT",
  GROUPS_DELETE: "GROUPS_DELETE",

  // Attendance
  ATTENDANCE_VIEW: "ATTENDANCE_VIEW",
  ATTENDANCE_TAKE: "ATTENDANCE_TAKE",

  // Accounting
  ACCOUNTING_PAYMENTS_VIEW: "ACCOUNTING_PAYMENTS_VIEW",
  ACCOUNTING_PAYMENTS_CREATE: "ACCOUNTING_PAYMENTS_CREATE",
  ACCOUNTING_CASH_REGISTER_VIEW: "ACCOUNTING_CASH_REGISTER_VIEW",
  ACCOUNTING_CASH_REGISTER_CREATE: "ACCOUNTING_CASH_REGISTER_CREATE",
  ACCOUNTING_DAILY_STATUS_VIEW: "ACCOUNTING_DAILY_STATUS_VIEW",
  ACCOUNTING_ONLINE_PAYMENTS_VIEW: "ACCOUNTING_ONLINE_PAYMENTS_VIEW",

  // Reports
  REPORTS_GENERAL: "REPORTS_GENERAL",
  REPORTS_ATTENDANCE: "REPORTS_ATTENDANCE",
  REPORTS_STUDENTS: "REPORTS_STUDENTS",
  REPORTS_MATERIALS: "REPORTS_MATERIALS",
  REPORTS_SALARIES: "REPORTS_SALARIES",
  REPORTS_BIRTHDAYS: "REPORTS_BIRTHDAYS",

  // SMS
  SMS_VIEW: "SMS_VIEW",
  SMS_SEND: "SMS_SEND",

  // Users
  USERS_VIEW: "USERS_VIEW",
  USERS_CREATE: "USERS_CREATE",
  USERS_EDIT: "USERS_EDIT",
  USERS_DELETE: "USERS_DELETE",

  // Settings
  SETTINGS_VIEW: "SETTINGS_VIEW",
  SETTINGS_EDIT: "SETTINGS_EDIT",

  // Dealers (SuperAdmin only)
  DEALERS_VIEW: "DEALERS_VIEW",
  DEALERS_CREATE: "DEALERS_CREATE",
  DEALERS_EDIT: "DEALERS_EDIT",
  DEALERS_DELETE: "DEALERS_DELETE",
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

// Gender
export const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

// Pre-registration status
export const PreRegistrationStatus = {
  PENDING: "PENDING",
  CONTACTED: "CONTACTED",
  CONVERTED: "CONVERTED",
  CANCELLED: "CANCELLED",
} as const;

export type PreRegistrationStatus =
  (typeof PreRegistrationStatus)[keyof typeof PreRegistrationStatus];

// Attendance status
export const AttendanceStatus = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  LATE: "LATE",
  EXCUSED: "EXCUSED",
} as const;

export type AttendanceStatus =
  (typeof AttendanceStatus)[keyof typeof AttendanceStatus];

// Payment types
export const PaymentType = {
  REGISTRATION_FEE: "REGISTRATION_FEE",
  MONTHLY_FEE: "MONTHLY_FEE",
  MATERIAL: "MATERIAL",
  OTHER: "OTHER",
} as const;

export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];

// Payment methods
export const PaymentMethod = {
  CASH: "CASH",
  CREDIT_CARD: "CREDIT_CARD",
  BANK_TRANSFER: "BANK_TRANSFER",
  ONLINE_PAYTR: "ONLINE_PAYTR",
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

// Payment status
export const PaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

// Transaction type
export const TransactionType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

// SMS status
export const SmsStatus = {
  PENDING: "PENDING",
  SENT: "SENT",
  FAILED: "FAILED",
  DELIVERED: "DELIVERED",
} as const;

export type SmsStatus = (typeof SmsStatus)[keyof typeof SmsStatus];

// Audit actions
export const AuditAction = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  VIEW: "VIEW",
} as const;

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

// Audit status
export const AuditStatus = {
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
} as const;

export type AuditStatus = (typeof AuditStatus)[keyof typeof AuditStatus];
