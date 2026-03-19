import { describe, it, expect } from "vitest";
import {
  normalizePhoneNumber,
  formatTurkishPhone,
  isValidTurkishPhone,
  isValidTcKimlik,
} from "../validation";

describe("normalizePhoneNumber", () => {
  it("should remove spaces", () => {
    expect(normalizePhoneNumber("0532 123 45 67")).toBe("05321234567");
  });

  it("should remove dashes", () => {
    expect(normalizePhoneNumber("0532-123-45-67")).toBe("05321234567");
  });

  it("should remove parentheses", () => {
    expect(normalizePhoneNumber("(0532) 123 45 67")).toBe("05321234567");
  });

  it("should return unchanged string if no special chars", () => {
    expect(normalizePhoneNumber("05321234567")).toBe("05321234567");
  });
});

describe("isValidTurkishPhone", () => {
  it("should accept valid mobile number starting with 05", () => {
    expect(isValidTurkishPhone("05321234567")).toBe(true);
  });

  it("should accept valid mobile number starting with 5", () => {
    expect(isValidTurkishPhone("5321234567")).toBe(true);
  });

  it("should accept valid number with +90 prefix", () => {
    expect(isValidTurkishPhone("+905321234567")).toBe(true);
  });

  it("should accept valid number with 90 prefix", () => {
    expect(isValidTurkishPhone("905321234567")).toBe(true);
  });

  it("should accept number with spaces (normalized)", () => {
    expect(isValidTurkishPhone("0532 123 45 67")).toBe(true);
  });

  it("should reject number that is too short", () => {
    expect(isValidTurkishPhone("053212")).toBe(false);
  });

  it("should reject number with invalid prefix", () => {
    expect(isValidTurkishPhone("15321234567")).toBe(false);
  });

  it("should reject empty string", () => {
    expect(isValidTurkishPhone("")).toBe(false);
  });
});

describe("formatTurkishPhone", () => {
  it("should format 11-digit number starting with 0", () => {
    expect(formatTurkishPhone("05321234567")).toBe("0532 123 45 67");
  });

  it("should format number with +90 prefix", () => {
    expect(formatTurkishPhone("+905321234567")).toBe("0532 123 45 67");
  });

  it("should format number with 90 prefix", () => {
    expect(formatTurkishPhone("905321234567")).toBe("0532 123 45 67");
  });

  it("should add leading zero for 10-digit number", () => {
    expect(formatTurkishPhone("5321234567")).toBe("0532 123 45 67");
  });

  it("should return original string for unrecognized format", () => {
    expect(formatTurkishPhone("invalid")).toBe("invalid");
  });
});

describe("isValidTcKimlik", () => {
  it("should reject TC Kimlik that does not start with non-zero digit", () => {
    expect(isValidTcKimlik("01234567890")).toBe(false);
  });

  it("should reject TC Kimlik shorter than 11 digits", () => {
    expect(isValidTcKimlik("1234567890")).toBe(false);
  });

  it("should reject TC Kimlik with letters", () => {
    expect(isValidTcKimlik("1234567890A")).toBe(false);
  });

  it("should reject invalid checksum", () => {
    // All ones: 11111111111 — checksum is wrong
    expect(isValidTcKimlik("11111111111")).toBe(false);
  });

  it("should accept a known valid TC Kimlik (10000000146)", () => {
    // This is a well-known test TC number that passes the algorithm
    expect(isValidTcKimlik("10000000146")).toBe(true);
  });
});
