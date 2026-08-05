import { parsePhoneNumber } from 'libphonenumber-js';

const YE_MOBILE_REGEX = /^7[01378]\d{7}$/;
const ARABIC_INDIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

function toAsciiDigits(input: string): string {
  return input
    .replace(/[٠-٩]/g, (d) => String(ARABIC_INDIC_DIGITS.indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)));
}

function cleanInput(phone: string): string {
  return toAsciiDigits(phone).replace(/[\s\-()]/g, '');
}

function toNationalNumber(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('967') && digits.length > 9) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits;
}

export function isYemeniPhoneNumber(input: string): boolean {
  return YE_MOBILE_REGEX.test(toNationalNumber(cleanInput(input)));
}

export function normalizePhone(phone: string): string {
  const cleaned = cleanInput(phone);

  try {
    const parsed = parsePhoneNumber(cleaned, 'YE');
    if (parsed && parsed.isValid() && YE_MOBILE_REGEX.test(parsed.nationalNumber)) {
      return parsed.format('E.164');
    }
  } catch {}

  if (cleaned.startsWith('+')) {
    try {
      const parsed = parsePhoneNumber(cleaned);
      if (parsed && parsed.isValid() && parsed.country === 'YE' && YE_MOBILE_REGEX.test(parsed.nationalNumber)) {
        return parsed.format('E.164');
      }
    } catch {}
  }

  const national = toNationalNumber(cleaned);
  if (YE_MOBILE_REGEX.test(national)) {
    return `+967${national}`;
  }

  throw new Error('Invalid phone number format');
}

export function isValidPhone(phone: string): boolean {
  try {
    normalizePhone(phone);
    return true;
  } catch {
    return false;
  }
}

export function formatPhoneLocal(phone: string): string {
  try {
    return normalizePhone(phone).replace(/^\+967/, '0');
  } catch {
    return phone;
  }
}
