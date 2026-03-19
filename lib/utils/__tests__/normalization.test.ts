import { describe, it, expect } from "vitest";
import { normalizeEmail, normalizePhone } from "../normalization";

describe("normalizeEmail", () => {
  it("should lowercase email", () => {
    expect(normalizeEmail("USER@EXAMPLE.COM")).toBe("user@example.com");
  });

  it("should trim whitespace", () => {
    expect(normalizeEmail("  user@example.com  ")).toBe("user@example.com");
  });

  it("should handle mixed case", () => {
    expect(normalizeEmail("User.Name@Example.COM")).toBe("user.name@example.com");
  });

  it("should handle already lowercase email", () => {
    expect(normalizeEmail("user@example.com")).toBe("user@example.com");
  });

  it("should handle both trim and lowercase together", () => {
    expect(normalizeEmail("  ADMIN@TEST.ORG  ")).toBe("admin@test.org");
  });
});

describe("normalizePhone", () => {
  it("should remove spaces", () => {
    expect(normalizePhone("0532 123 45 67")).toBe("05321234567");
  });

  it("should remove dashes", () => {
    expect(normalizePhone("0532-123-45-67")).toBe("05321234567");
  });

  it("should remove parentheses", () => {
    expect(normalizePhone("(0532) 123 45 67")).toBe("05321234567");
  });

  it("should remove mixed special chars", () => {
    expect(normalizePhone("(0532) 123-45 67")).toBe("05321234567");
  });

  it("should return unchanged string if no special chars", () => {
    expect(normalizePhone("05321234567")).toBe("05321234567");
  });
});
