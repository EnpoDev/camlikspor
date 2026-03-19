import { describe, it, expect } from "vitest";
import { ActionErrors } from "../action-utils";
import type { ActionResult } from "../action-utils";

describe("ActionErrors", () => {
  it("should contain AUTH_REQUIRED key", () => {
    expect(ActionErrors.AUTH_REQUIRED).toBe("authRequired");
  });

  it("should contain UNAUTHORIZED key", () => {
    expect(ActionErrors.UNAUTHORIZED).toBe("unauthorized");
  });

  it("should contain VALIDATION_ERROR key", () => {
    expect(ActionErrors.VALIDATION_ERROR).toBe("validationError");
  });

  it("should contain NOT_FOUND key", () => {
    expect(ActionErrors.NOT_FOUND).toBe("notFound");
  });

  it("should contain DUPLICATE key", () => {
    expect(ActionErrors.DUPLICATE).toBe("duplicateEntry");
  });

  it("should contain INTERNAL_ERROR key", () => {
    expect(ActionErrors.INTERNAL_ERROR).toBe("internalError");
  });

  it("should have exactly 6 keys", () => {
    expect(Object.keys(ActionErrors).length).toBe(6);
  });
});

describe("ActionResult type", () => {
  it("should allow success result without data", () => {
    const result: ActionResult = { success: true };
    expect(result.success).toBe(true);
  });

  it("should allow success result with data", () => {
    const result: ActionResult<string> = { success: true, data: "hello" };
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("hello");
    }
  });

  it("should allow success result with messageKey", () => {
    const result: ActionResult = { success: true, messageKey: "created" };
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.messageKey).toBe("created");
    }
  });

  it("should allow failure result with messageKey", () => {
    const result: ActionResult = { success: false, messageKey: ActionErrors.NOT_FOUND };
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.messageKey).toBe("notFound");
    }
  });

  it("should allow failure result with errors map", () => {
    const result: ActionResult = {
      success: false,
      messageKey: ActionErrors.VALIDATION_ERROR,
      errors: { email: ["Invalid email"] },
    };
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors?.email).toEqual(["Invalid email"]);
    }
  });
});
