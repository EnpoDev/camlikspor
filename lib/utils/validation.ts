import { z } from "zod";

/**
 * Turkish phone number validation
 * Accepts formats:
 * Mobile:
 * - 05XXXXXXXXX (11 digits, starting with 05)
 * - 5XXXXXXXXX (10 digits, starting with 5)
 * - +905XXXXXXXXX (13 chars with +90)
 * - 905XXXXXXXXX (12 digits with 90)
 * Landline:
 * - 02XXXXXXXXX (11 digits, starting with 02, 03, 04)
 * - +902XXXXXXXXX (13 chars with +90)
 * - Can include spaces, dashes, or parentheses
 */
const TURKISH_PHONE_REGEX = /^(\+90|90|0)?[2-5][0-9]{9}$/;

/**
 * Normalizes a phone number by removing spaces, dashes, and parentheses
 */
export function normalizePhoneNumber(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, "");
}

/**
 * Formats a Turkish phone number to standard format: 0XXX XXX XX XX
 * Returns the original string if it can't be formatted
 */
export function formatTurkishPhone(phone: string): string {
  const normalized = normalizePhoneNumber(phone);

  // Remove country code if present
  let digits = normalized;
  if (digits.startsWith("+90")) {
    digits = digits.slice(3);
  } else if (digits.startsWith("90") && digits.length === 12) {
    digits = digits.slice(2);
  }

  // Add leading 0 if missing
  if (digits.length === 10 && !digits.startsWith("0")) {
    digits = "0" + digits;
  }

  // Format as 0XXX XXX XX XX
  if (digits.length === 11 && digits.startsWith("0")) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
  }

  return phone;
}

/**
 * Validates a Turkish phone number
 */
export function isValidTurkishPhone(phone: string): boolean {
  const normalized = normalizePhoneNumber(phone);
  return TURKISH_PHONE_REGEX.test(normalized);
}

/**
 * Zod schema for required Turkish phone number
 */
export const turkishPhoneSchema = z
  .string()
  .min(1, "Telefon numarasi gerekli")
  .refine(
    (val) => {
      const normalized = normalizePhoneNumber(val);
      return normalized.length >= 10;
    },
    { message: "Telefon numarasi en az 10 hane olmali" }
  )
  .refine(
    (val) => {
      const normalized = normalizePhoneNumber(val);
      return TURKISH_PHONE_REGEX.test(normalized);
    },
    { message: "Gecerli bir telefon numarasi girin (ornek: 05XX XXX XX XX)" }
  );

/**
 * Zod schema for optional Turkish phone number
 */
export const turkishPhoneOptionalSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === "") return true;
      const normalized = normalizePhoneNumber(val);
      return TURKISH_PHONE_REGEX.test(normalized);
    },
    { message: "Gecerli bir telefon numarasi girin (ornek: 05XX XXX XX XX)" }
  );

/**
 * Turkish TC Kimlik No validation (11 digits, specific algorithm)
 */
export function isValidTcKimlik(tcKimlik: string): boolean {
  if (!/^[1-9][0-9]{10}$/.test(tcKimlik)) return false;

  const digits = tcKimlik.split("").map(Number);

  // First 10 digits checksum for 11th digit
  const sum10 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
  if (sum10 % 10 !== digits[10]) return false;

  // Odd positions (1,3,5,7,9) sum * 7 - even positions (2,4,6,8) sum should equal 10th digit (mod 10)
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
  if ((oddSum * 7 - evenSum) % 10 !== digits[9]) return false;

  return true;
}

/**
 * Zod schema for optional TC Kimlik No
 */
export const tcKimlikOptionalSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === "") return true;
      return isValidTcKimlik(val);
    },
    { message: "Gecerli bir TC Kimlik numarasi girin (11 haneli)" }
  );

/**
 * Zod schema for required TC Kimlik No
 */
export const tcKimlikSchema = z
  .string()
  .length(11, "TC Kimlik numarasi 11 haneli olmalidir")
  .refine(
    (val) => isValidTcKimlik(val),
    { message: "Gecerli bir TC Kimlik numarasi girin" }
  );
