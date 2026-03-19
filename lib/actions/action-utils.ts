export type ActionResult<T = void> =
  | { success: true; data?: T; messageKey?: string }
  | { success: false; messageKey: string; message?: string; errors?: Record<string, string[]> };

export const ActionErrors = {
  AUTH_REQUIRED: "authRequired",
  UNAUTHORIZED: "unauthorized",
  VALIDATION_ERROR: "validationError",
  NOT_FOUND: "notFound",
  DUPLICATE: "duplicateEntry",
  INTERNAL_ERROR: "internalError",
} as const;
