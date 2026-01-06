import pino from "pino";

// PII fields that should be masked in logs
const PII_FIELDS = [
  "tcKimlikNo",
  "parentTcKimlik",
  "bankAccount",
  "password",
  "passwordHash",
  "email",
  "phone",
  "parentPhone",
  "emergencyPhone",
  "address",
];

// Mask PII in objects recursively
function maskPII(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(maskPII);
  }

  const masked: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (PII_FIELDS.includes(key)) {
      masked[key] = "***MASKED***";
    } else if (typeof value === "object" && value !== null) {
      masked[key] = maskPII(value);
    } else {
      masked[key] = value;
    }
  }

  return masked;
}

// Create logger with PII masking
const isPiiMaskingEnabled = process.env.PII_MASKING_ENABLED === "true";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  formatters: {
    level: (label) => ({ level: label }),
  },
  hooks: {
    logMethod(inputArgs, method) {
      if (isPiiMaskingEnabled && inputArgs.length > 0) {
        if (typeof inputArgs[0] === "object") {
          inputArgs[0] = maskPII(inputArgs[0]) as object;
        }
      }
      return method.apply(this, inputArgs as [object | string]);
    },
  },
});

// Structured log helper for audit
export interface AuditLogData {
  actor: string;
  action: string;
  entity: string;
  entityId?: string;
  dealerId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  status: "SUCCESS" | "FAILURE";
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
}

export function logAudit(data: AuditLogData): void {
  const maskedData = isPiiMaskingEnabled ? (maskPII(data) as AuditLogData) : data;
  logger.info({ type: "AUDIT", ...maskedData }, `Audit: ${data.action} ${data.entity}`);
}

// Request log helper
export interface RequestLogData {
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  userId?: string;
  dealerId?: string;
}

export function logRequest(data: RequestLogData): void {
  logger.info(
    { type: "REQUEST", ...data },
    `${data.method} ${data.path} ${data.statusCode} ${data.duration}ms`
  );
}
