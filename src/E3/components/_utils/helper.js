export const filterExperts = (experts, searchFaculty, searchLanguage, sort) => {
    const filtered = experts.filter((expert) => {
        const { caption, language, other_languages } = expert;

        let pass = true;

        if (searchFaculty && searchFaculty !== 'all') {
            pass = pass && caption.toLowerCase().includes(searchFaculty.toLowerCase());
        }

        if (searchLanguage && searchLanguage !== 'all') {
            if (searchLanguage === 'other_languages') {
                pass = pass && other_languages !== null && other_languages !== '';
            } else {
                pass = pass && language === searchLanguage;
            }
        }

        return pass;
    });

    if (!sort || sort === 'relevance') {
        return filtered;
    }

    if (sort === 'asce') {
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sort === 'desc') {
        return filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    return [];
};

/**
 * Parse a joined academic hierarchy string into
 * { unit, faculty, institution }
 *
 * Order assumption: low → high
 * Empty levels are omitted.
 */
export function parseAcademicUnit(input) {
    const parts = String(input ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    const result = {
        unit: null,
        faculty: null,
        institution: null,
    };

    if (parts.length === 1) {
        // Institution only
        result.institution = parts[0];
    } else if (parts.length === 2) {
        // Faculty, Institution
        result.faculty = parts[0];
        result.institution = parts[1];
    } else if (parts.length >= 3) {
        // Unit, Faculty, Institution (unit may contain commas)
        result.institution = parts[parts.length - 1];
        result.faculty = parts[parts.length - 2];
        result.unit = parts.slice(0, parts.length - 2).join(', ');
    }

    return result;
}

export const joinWithComma = (a, b) => [a, b].filter(Boolean).join(', ');

/**
 * Join two date values into a readable range.
 *
 * @param {string | null | undefined} start
 * @param {string | null | undefined} end
 * @param {boolean} withParentheses - default false
 * @returns {string | null}
 */
export function formatDateRange(start, end, endPlaceholder = 'Present', withParentheses = false) {
    const startDate = parseDate(start);
    const endDate = parseDate(end);

    // Both invalid or missing
    if (!startDate && !endDate) return null;

    let result;

    if (!startDate && endDate) {
        result = formatDate(endDate);
    } else if (startDate && !endDate) {
        result = `${formatDate(startDate)} – ${endPlaceholder}`;
    } else {
        result = `${formatDate(startDate)} – ${formatDate(endDate)}`;
    }

    return withParentheses ? `(${result})` : result;
}

function parseDate(value) {
    if (typeof value !== 'string') return null;

    const m = value.trim().match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (!m) return null;

    const year = Number(m[1]);
    const month = Number(m[2]);
    const day = Number(m[3]);

    // Basic validation
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;

    const d = new Date(year, month - 1, day);

    // Catch invalid calendar dates like 2023-02-31
    if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;

    return d;
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}
