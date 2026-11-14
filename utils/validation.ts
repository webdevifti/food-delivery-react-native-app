const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isEmail = (value: string) => EMAIL_RE.test(value.trim());

export const emailError = (value: string) => {
  if (!value.trim()) return "Email is required";
  if (!isEmail(value)) return "Enter a valid email address";
  return undefined;
};

export const passwordError = (value: string) => {
  if (!value) return "Password is required";
  if (value.length < 6) return "Use at least 6 characters";
  return undefined;
};

export const hasErrors = (errors: Record<string, string | undefined>) =>
  Object.values(errors).some(Boolean);

/* ------------------------------ Cards ------------------------------ */

export const digitsOnly = (value: string) => value.replace(/\D/g, "");

/** "2134567812345678" -> "2134 5678 1234 5678" */
export const formatCardNumber = (value: string) =>
  digitsOnly(value)
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

/** "1229" -> "12/29" */
export const formatExpiry = (value: string) => {
  const d = digitsOnly(value).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

export const cardNumberError = (value: string) => {
  const d = digitsOnly(value);
  if (!d) return "Card number is required";
  if (d.length < 15) return "Enter a valid card number";
  return undefined;
};

export const expiryError = (value: string) => {
  if (!value) return "Required";
  const m = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!m) return "Use MM/YY";
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return "Invalid month";
  const now = new Date();
  const expiresAfter = new Date(year, month, 1); // first day after expiry month
  if (expiresAfter <= now) return "Card expired";
  return undefined;
};

export const cvcError = (value: string) => {
  if (!value) return "Required";
  if (!/^\d{3,4}$/.test(value)) return "3-4 digits";
  return undefined;
};

export const cardBrandOf = (number: string): "visa" | "mastercard" =>
  digitsOnly(number).startsWith("4") ? "visa" : "mastercard";
