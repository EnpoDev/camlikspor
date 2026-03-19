import { encrypt, decrypt } from "./encryption";

export function encryptPII(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return encrypt(value);
  } catch (error) {
    console.error("[PII] Encryption failed, storing plain text:", error);
    return value;
  }
}

export function decryptPII(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return decrypt(value);
  } catch {
    return value; // already plain text
  }
}
