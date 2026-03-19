import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { encryptPII, decryptPII } from "../pii";

describe("encryptPII", () => {
  it("should return null for null input", () => {
    expect(encryptPII(null)).toBeNull();
  });

  it("should return null for undefined input", () => {
    expect(encryptPII(undefined)).toBeNull();
  });

  it("should return null for empty string", () => {
    expect(encryptPII("")).toBeNull();
  });

  describe("with ENCRYPTION_KEY set", () => {
    beforeEach(() => {
      // 32-byte hex key (64 hex chars)
      process.env.ENCRYPTION_KEY = "0".repeat(64);
    });

    afterEach(() => {
      delete process.env.ENCRYPTION_KEY;
    });

    it("should return an encrypted string (not plain text)", () => {
      const result = encryptPII("test");
      expect(result).not.toBeNull();
      expect(result).not.toBe("test");
    });

    it("should produce iv:authTag:encrypted format", () => {
      const result = encryptPII("test");
      expect(result).not.toBeNull();
      const parts = result!.split(":");
      expect(parts.length).toBe(3);
    });

    it("should round-trip encrypt and decrypt correctly", () => {
      const original = "12345678901";
      const encrypted = encryptPII(original);
      expect(encrypted).not.toBeNull();
      const decrypted = decryptPII(encrypted);
      expect(decrypted).toBe(original);
    });
  });

  describe("without ENCRYPTION_KEY (fallback)", () => {
    beforeEach(() => {
      delete process.env.ENCRYPTION_KEY;
    });

    it("should return plain text as fallback when ENCRYPTION_KEY is missing", () => {
      const result = encryptPII("test");
      expect(result).toBe("test");
    });
  });
});

describe("decryptPII", () => {
  it("should return null for null input", () => {
    expect(decryptPII(null)).toBeNull();
  });

  it("should return null for undefined input", () => {
    expect(decryptPII(undefined)).toBeNull();
  });

  it("should return null for empty string", () => {
    expect(decryptPII("")).toBeNull();
  });

  it("should return plain text as fallback when decrypt fails", () => {
    // plain-text that is not in iv:authTag:encrypted format
    expect(decryptPII("plain-text")).toBe("plain-text");
  });

  it("should return plain text for value without colons", () => {
    expect(decryptPII("notencrypted")).toBe("notencrypted");
  });
});
