/**
 * Normalize a phone number string.
 * - Allows digits, spaces, +, (, )
 * - Strips formatting characters and returns only digits
 * - Accepts only 10- or 11-digit numbers
 * - Returns normalized number as string, or null if invalid
 */
export function normalizePhone(phone) {
    if (typeof phone !== 'string') return null;

    // Quick reject: if it has any characters we don't allow
    // Allowed: digits, space, +, (, )
    if (/[^0-9+\s()]/.test(phone)) {
        return null;
    }

    // Remove everything except digits
    const digits = phone.replace(/\D/g, '');

    // Must be 10 or 11 digits
    if (digits.length !== 10 && digits.length !== 11) {
        return null;
    }

    return digits;
}

/**
 * Returns the normalized phone from primary or secondary
 * - Tries primary first
 * - If primary is invalid, tries secondary
 * - Returns null if both invalid
 */
export function getPreferredPhone(primary, secondary) {
    const primaryNorm = normalizePhone(primary);
    if (primaryNorm !== null) return primaryNorm;

    const secondaryNorm = normalizePhone(secondary);
    if (secondaryNorm !== null) return secondaryNorm;

    return null;
}

/** * Formats a phone number string into a human-readable format.
 * - Accepts 10-digit or 11-digit numbers
 * - Returns formatted string: (AAA) BBB-CCCC or +A (AAA) BBB-CCCC
 * - Returns null if invalid
 */
export function formatPhone(num) {
    if (typeof num !== 'string') return null;

    const digits = num.replace(/\D/g, '');

    if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    if (digits.length === 11) {
        return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }

    return null;
}
