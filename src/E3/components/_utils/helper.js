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
