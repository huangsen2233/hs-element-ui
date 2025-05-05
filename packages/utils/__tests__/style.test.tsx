import { describe, it, expect, vi } from 'vitest';
import { addUnit, isStringNumber } from '../style';
import { debugWarn } from '../error';

vi.mock('../error', () => ({
  debugWarn: vi.fn(),
}));

describe("style utils", () => {
  describe("isStringNumber", () => {
    it("should validate numeric strings", () => {
      expect(isStringNumber("123")).toBe(true);
      expect(isStringNumber("12.3")).toBe(true);
      expect(isStringNumber("-50")).toBe(true);
      expect(isStringNumber("abc")).toBe(false);
      expect(isStringNumber("100px")).toBe(false);
      expect(isStringNumber("")).toBe(true);
    });

    it("should return false for non-string values", () => {
      expect(isStringNumber(123 as any)).toBe(false);
      expect(isStringNumber(true as any)).toBe(false);
      expect(isStringNumber({} as any)).toBe(false);
    });
  });

  describe("addUnit", () => {
    it("should return empty string for falsy values", () => {
      expect(addUnit(undefined)).toBe("");
      expect(addUnit("")).toBe("");
      expect(addUnit(null as any)).toBe("");
    });

    it("should warn for invalid types", () => {
      expect(addUnit(true as any)).toBeUndefined();
      expect(addUnit({} as any)).toBeUndefined();
      expect(debugWarn).toHaveBeenCalledTimes(2);
      expect(debugWarn).toHaveBeenCalledWith(
        "utils/style",
        "binding value must be a string or number"
      );
    });

    it("should handle values", () => {
      expect(addUnit(100)).toBe("100px");
      expect(addUnit("200")).toBe("200px");
      expect(addUnit("50%")).toBe("50%");
    });
  });

})