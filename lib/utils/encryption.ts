import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("ENCRYPTION_KEY environment variable is not set");
  }
  return Buffer.from(key, "hex");
}

export function encrypt(text: string): string {
  if (!text) return text;

  const key = getKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:encrypted
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  if (!encryptedText || !encryptedText.includes(":")) return encryptedText;

  try {
    const key = getKey();
    const parts = encryptedText.split(":");

    if (parts.length !== 3) {
      return encryptedText; // Not encrypted or invalid format
    }

    const [ivHex, authTagHex, encrypted] = parts;

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch {
    // Return original if decryption fails (might not be encrypted)
    return encryptedText;
  }
}

// Helper to check if a value is encrypted
export function isEncrypted(value: string): boolean {
  if (!value) return false;
  const parts = value.split(":");
  return parts.length === 3 && parts[0].length === 32 && parts[1].length === 32;
}

// Mask sensitive data for display (show last 4 chars)
export function maskSensitive(value: string, showLast = 4): string {
  if (!value || value.length <= showLast) return "****";
  return "*".repeat(value.length - showLast) + value.slice(-showLast);
}

// Hash a value (one-way, for comparison)
export function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}
