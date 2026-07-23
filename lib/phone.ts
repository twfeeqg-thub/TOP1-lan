import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  try {
    const parsed = parsePhoneNumber(cleaned, 'YE');
    if (parsed && parsed.isValid()) {
      return parsed.format('E.164');
    }
  } catch {}
  if (cleaned.startsWith('+')) {
    try {
      const parsed = parsePhoneNumber(cleaned);
      if (parsed && parsed.isValid()) return parsed.format('E.164');
    } catch {}
  }
  try {
    const parsed = parsePhoneNumber(cleaned, 'YE');
    if (parsed) return parsed.format('E.164');
  } catch {}
  throw new Error('Invalid phone number format');
}

export function isValidPhone(phone: string): boolean {
  try {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return isValidPhoneNumber(cleaned, 'YE') || isValidPhoneNumber(cleaned);
  } catch {
    return false;
  }
}

export function formatPhoneLocal(phone: string): string {
  try {
    const parsed = parsePhoneNumber(phone);
    return parsed.formatNational();
  } catch {
    return phone;
  }
}
