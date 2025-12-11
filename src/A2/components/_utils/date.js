import { website } from '@uniwebcms/module-sdk';

/**
 * Format a flexible date string into a localized string.
 *
 * Supports inputs:
 *  - "yyyy/mm/dd"
 *  - "yyyy-mm-dd"
 *  - "yyyy/mm"
 *  - "yyyy-mm"
 *  - "yyyy"
 *
 * Output:
 *  - If day is present:   localized "short month, 2-digit day, 4-digit year"
 *  - If only month/year:  localized "short month, 4-digit year"
 *  - If only year:        "4-digit year"
 *  - Any other non-empty value: returned as-is.
 *
 * @param {string | number} value   The input date value.
 * @returns {string} Localized formatted date or original value.
 */
export function formatFlexibleDate(value) {
    const locale = `${website.getLanguage()}-CA`;
    if (value === null || value === undefined) return value;

    const str = String(value).trim();
    if (str === '') return str;

    const fullDateMatch = str.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/);
    const yearMonthMatch = str.match(/^(\d{4})[\/-](\d{1,2})$/);
    const yearOnlyMatch = str.match(/^(\d{4})$/);

    function makeDate(y, m = 1, d = 1) {
        const yr = Number(y),
            mo = Number(m),
            da = Number(d);
        if (mo < 1 || mo > 12 || da < 1 || da > 31) return null;

        // Create using UTC to avoid invalid local conversions, but output locally.
        const date = new Date(Date.UTC(yr, mo - 1, da));

        // Validate
        if (
            date.getUTCFullYear() !== yr ||
            date.getUTCMonth() + 1 !== mo ||
            date.getUTCDate() !== da
        )
            return null;

        return date;
    }

    // yyyy/mm/dd or yyyy-mm-dd
    if (fullDateMatch) {
        const [, y, m, d] = fullDateMatch;
        const date = makeDate(y, m, d);
        if (!date) return str;

        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            timeZone: 'UTC',
        }).format(date);
    }

    // yyyy/mm or yyyy-mm
    if (yearMonthMatch) {
        const [, y, m] = yearMonthMatch;
        const date = makeDate(y, m, 1);
        if (!date) return str;

        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'short',
            timeZone: 'UTC',
        }).format(date);
    }

    // yyyy
    if (yearOnlyMatch) {
        const [, y] = yearOnlyMatch;
        const date = makeDate(y, 1, 1);
        if (!date) return str;

        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            timeZone: 'UTC',
        }).format(date);
    }

    return str;
}

// Helper: parse many date formats into a UTC timestamp (ms since epoch at 00:00 UTC)
function parseToUtcTimestamp(raw) {
    if (raw == null) return { valid: false, ts: null };

    const str = String(raw).trim();
    if (!str) return { valid: false, ts: null };

    const monthNames = {
        jan: 0,
        january: 0,
        feb: 1,
        february: 1,
        mar: 2,
        march: 2,
        apr: 3,
        april: 3,
        may: 4,
        jun: 5,
        june: 5,
        jul: 6,
        july: 6,
        aug: 7,
        august: 7,
        sep: 8,
        sept: 8,
        september: 8,
        oct: 9,
        october: 9,
        nov: 10,
        november: 10,
        dec: 11,
        december: 11,
    };

    function makeUtc(y, m, d) {
        const year = Number(y);
        const month = Number(m); // 1–12
        const day = Number(d); // 1–31
        if (
            !Number.isInteger(year) ||
            !Number.isInteger(month) ||
            !Number.isInteger(day) ||
            month < 1 ||
            month > 12 ||
            day < 1 ||
            day > 31
        ) {
            return { valid: false, ts: null };
        }
        // Use UTC year/month/day, ignore time
        const ts = Date.UTC(year, month - 1, day);
        const date = new Date(ts);

        // Validate that Y/M/D match (catch invalid dates like 2024-02-31)
        if (
            date.getUTCFullYear() !== year ||
            date.getUTCMonth() !== month - 1 ||
            date.getUTCDate() !== day
        ) {
            return { valid: false, ts: null };
        }

        return { valid: true, ts };
    }

    let m;

    // 1) yyyy/mm/dd or yyyy-mm-dd
    m = str.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/);
    if (m) {
        const [, y, mo, d] = m;
        return makeUtc(y, mo, d);
    }

    // 2) yyyy/mm or yyyy-mm  (day assumed 1)
    m = str.match(/^(\d{4})[\/-](\d{1,2})$/);
    if (m) {
        const [, y, mo] = m;
        return makeUtc(y, mo, 1);
    }

    // 3) yyyy (month/day assumed Jan 1)
    m = str.match(/^(\d{4})$/);
    if (m) {
        const [, y] = m;
        return makeUtc(y, 1, 1);
    }

    // 4) 2024/Dec/15 or 2024-December-15 (optional day)
    m = str.match(/^(\d{4})[\/-]([A-Za-z]+)(?:[\/-](\d{1,2}))?$/);
    if (m) {
        const [, y, monthName, dOpt] = m;
        const key = monthName.toLowerCase();
        if (key in monthNames) {
            const monthIndex = monthNames[key]; // 0–11
            const day = dOpt ? Number(dOpt) : 1; // default day 1 if missing
            return makeUtc(y, monthIndex + 1, day);
        }
    }

    // 5) December 15, 2024
    m = str.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
    if (m) {
        const [, monthName, d, y] = m;
        const key = monthName.toLowerCase();
        if (key in monthNames) {
            const monthIndex = monthNames[key];
            return makeUtc(y, monthIndex + 1, d);
        }
    }

    // 6) 15 December 2024  (nice extra)
    m = str.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (m) {
        const [, d, monthName, y] = m;
        const key = monthName.toLowerCase();
        if (key in monthNames) {
            const monthIndex = monthNames[key];
            return makeUtc(y, monthIndex + 1, d);
        }
    }

    // 7) Fallback: let JS try to parse, then normalize to UTC Y/M/D
    const fallbackDate = new Date(str);
    if (!isNaN(fallbackDate.getTime())) {
        const year = fallbackDate.getFullYear();
        const month = fallbackDate.getMonth(); // 0–11
        const day = fallbackDate.getDate();
        const ts = Date.UTC(year, month, day);
        return { valid: true, ts };
    }

    // Unrecognized
    return { valid: false, ts: null };
}

/**
 * Sort an array of objects by a date-like property, using UTC.
 *
 * @param {Array<object>} items       The array to sort.
 * @param {"asc"|"desc"} direction    Sort direction.
 * @param {string} key                Object property that holds the date value.
 * @returns {Array<object>}           New sorted array.
 */
export function sortByDateField(items, direction = 'asc', key = 'date') {
    const dir = direction === 'desc' ? -1 : 1;

    return [...items].sort((a, b) => {
        const aVal = a && Object.prototype.hasOwnProperty.call(a, key) ? a[key] : null;
        const bVal = b && Object.prototype.hasOwnProperty.call(b, key) ? b[key] : null;

        const aParsed = parseToUtcTimestamp(aVal);
        const bParsed = parseToUtcTimestamp(bVal);

        // Both invalid → keep relative order
        if (!aParsed.valid && !bParsed.valid) return 0;

        // Only a invalid → a goes to the end
        if (!aParsed.valid) return 1;

        // Only b invalid → b goes to the end
        if (!bParsed.valid) return -1;

        // Both valid → compare timestamps
        if (aParsed.ts === bParsed.ts) return 0;
        return aParsed.ts < bParsed.ts ? -1 * dir : 1 * dir;
    });
}
