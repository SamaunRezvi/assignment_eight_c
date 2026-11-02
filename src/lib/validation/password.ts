export const PASSWORD_RULES = [
  { id: "length", label: "At least 6 characters", test: (value: string) => value.length >= 6 },
  { id: "upper", label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { id: "lower", label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
] as const;

/** Returns the first unmet rule as a user-facing message, or null when the password is valid. */
export function validatePassword(value: string): string | null {
  if (value.length < 6) return "Password must be at least 6 characters long";
  if (!/[A-Z]/.test(value)) return "Password must include an uppercase letter";
  if (!/[a-z]/.test(value)) return "Password must include a lowercase letter";
  return null;
}
