export function required(value: string | number | null | undefined): boolean {
  return value !== null && value !== undefined && String(value).trim().length > 0;
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

export function passwordMessage(password: string): string | null {
  if (password.length < 6) return "Password must be at least 6 characters.";
  return null;
}
