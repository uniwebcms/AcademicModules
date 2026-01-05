/**
 * Parse a phone string into parts.
 * If parsing fails completely, return { raw: originalInput }
 */
export function parsePhoneParts(input) {
    const emptyResult = {
        raw: null,
        countryCode: null,
        areaCode: null,
        phoneNumber: null,
        extension: null,
    };

    if (typeof input !== 'string') {
        return { ...emptyResult, raw: String(input) };
    }

    const original = input.trim();
    if (!original) {
        return { ...emptyResult, raw: original };
    }

    let s = original;

    // 1) Extract extension
    let extension = null;
    const extMatch = s.match(/(?:\b(?:ext|extension|etx)\b\.?|x)\s*[:\-]?\s*(\d{1,10})\s*$/i);
    if (extMatch) {
        extension = extMatch[1];
        s = s.slice(0, extMatch.index).trim();
    }

    // 2) Detect "+"
    const hasPlus = /^\s*\+/.test(s);

    // 3) Extract digits
    const digits = s.replace(/\D/g, '');

    // 🚨 No digits at all → total failure
    if (!digits) {
        return { ...emptyResult, raw: original };
    }

    let countryCode = null;
    let national = digits;

    const knownCountryCodes = ['1', '33', '52'];

    if (hasPlus) {
        let cc = null;
        for (const candidate of knownCountryCodes.sort((a, b) => b.length - a.length)) {
            if (digits.startsWith(candidate)) {
                cc = candidate;
                break;
            }
        }
        if (!cc) cc = digits.slice(0, Math.min(3, digits.length));

        countryCode = cc;
        national = digits.slice(cc.length);

        if (!national) {
            return { ...emptyResult, raw: original };
        }
    } else {
        if (digits.length === 11 && digits.startsWith('1')) {
            countryCode = '1';
            national = digits.slice(1);
        } else if (digits.length === 10) {
            countryCode = '1';
            national = digits;
        } else {
            return { ...emptyResult, raw: original };
        }
    }

    let areaCode = null;
    let phoneNumber = null;

    if (countryCode === '1') {
        if (national.length !== 10) {
            return { ...emptyResult, raw: original };
        }
        areaCode = national.slice(0, 3);
        phoneNumber = national.slice(3);
    } else if (countryCode === '33') {
        if (national.length !== 9) {
            return { ...emptyResult, raw: original };
        }
        areaCode = national.slice(0, 1);
        phoneNumber = national.slice(1);
    } else if (countryCode === '52') {
        if (national.length !== 10) {
            return { ...emptyResult, raw: original };
        }
        areaCode = national.slice(0, 2);
        phoneNumber = national.slice(2);
    } else {
        return { ...emptyResult, raw: original };
    }

    return {
        raw: null,
        countryCode,
        areaCode,
        phoneNumber,
        extension,
    };
}

/**
 * Format parsed phone parts into a human-readable string.
 * Accepts either:
 * - parsed object from parsePhoneParts()
 * - or a raw string (it will parse it)
 */
export function formatPhone(input) {
    const parsed = typeof input === 'string' ? parsePhoneParts(input) : input;

    if (!parsed) return null;

    if (parsed.raw) return parsed.raw;

    const { countryCode, areaCode, phoneNumber, extension } = parsed;

    // NANP: (AAA) BBB-CCCC
    const isNANP = countryCode === '1' && areaCode?.length === 3 && phoneNumber?.length === 7;
    if (isNANP) {
        const main = `(${areaCode}) ${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        return extension ? `${main} x${extension}` : main;
    }

    // Fallback formatting for non-NANP (simple, readable)
    // If we have areaCode + phoneNumber, show "+CC area phone"
    if (countryCode && areaCode && phoneNumber) {
        const main = `+${countryCode} ${areaCode} ${groupDigits(phoneNumber)}`;
        return extension ? `${main} x${extension}` : main;
    }

    // If partial, best-effort
    const digits = [countryCode ? `+${countryCode}` : null, areaCode, phoneNumber]
        .filter(Boolean)
        .join(' ');
    return extension ? `${digits} x${extension}` : digits || null;
}

function groupDigits(s) {
    // very small helper: groups like 4-4 or 3-3-... (best-effort)
    if (!s) return '';
    if (s.length <= 4) return s;
    if (s.length === 8) return `${s.slice(0, 4)} ${s.slice(4)}`;
    if (s.length === 9) return `${s.slice(0, 3)} ${s.slice(3, 6)} ${s.slice(6)}`;
    if (s.length === 10) return `${s.slice(0, 2)} ${s.slice(2, 6)} ${s.slice(6)}`;
    return s.replace(/(\d{3})(?=\d)/g, '$1 ');
}

/**
 * Build a tel: href from parsed phone parts.
 * Returns null if not enough info to dial.
 */
export function toTelHref(parsed) {
    if (!parsed || parsed.raw) return null;

    const { countryCode, areaCode, phoneNumber, extension } = parsed;
    if (!countryCode || !areaCode || !phoneNumber) return null;

    // E.164-ish dial string: +<cc><national>
    const e164 = `+${countryCode}${areaCode}${phoneNumber}`;

    // Extension handling:
    // - Many dialers won't truly "dial extension" automatically.
    // - Using "," adds a pause on many systems. If you don't want this, omit it.
    const withExt = extension ? `${e164},${extension}` : e164;

    return `tel:${withExt}`;
}
