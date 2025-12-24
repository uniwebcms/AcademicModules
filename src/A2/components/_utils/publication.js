// --- Helpers ---

// Escape a few special characters for BibTeX
function escapeBibtex(str) {
    if (!str) return '';
    return String(str)
        .replace(/\\/g, '\\\\')
        .replace(/{/g, '\\{')
        .replace(/}/g, '\\}')
        .replace(/"/g, '\\"');
}

// Normalize authors to a BibTeX "A and B and C" string
function normalizeAuthors(authors) {
    if (!authors) return '';

    if (Array.isArray(authors)) {
        return authors.join(' and ');
    }

    return String(authors);
}

// Extract a 4-digit year from a date (Date or string)
function extractYear(dateVal) {
    if (!dateVal) return null;

    if (dateVal instanceof Date) {
        return dateVal.getUTCFullYear();
    }

    const str = String(dateVal).trim();
    if (!str) return null;

    // Try native Date first
    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
        return parsed.getUTCFullYear();
    }

    // Fallback: first 4-digit number
    const m = str.match(/(\d{4})/);
    return m ? Number(m[1]) : null;
}

// Build a slug/citation key if user didn't provide one
function makeSlug(pub, year) {
    if (pub.slug) {
        return String(pub.slug).replace(/\s+/g, '_');
    }

    // Try to build from first author + year + short title
    let lastName = 'unknown';
    if (pub.authors) {
        if (Array.isArray(pub.authors) && pub.authors.length > 0) {
            const first = String(pub.authors[0]);
            const parts = first.trim().split(/\s+/);
            lastName = parts[parts.length - 1];
        } else if (typeof pub.authors === 'string') {
            const first = pub.authors.split(/(?:,|and)/)[0];
            const parts = first.trim().split(/\s+/);
            lastName = parts[parts.length - 1];
        }
    }

    const shortTitle = (pub.title || 'untitled')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .split(/\s+/)
        .slice(0, 3)
        .join('');

    const yearPart = year || 'noyear';

    return `${lastName}${yearPart}${shortTitle}`.replace(/[^A-Za-z0-9]+/g, '');
}

// --- Core: build one BibTeX entry ---

/**
 * Builds a BibTeX entry string from a publication object.
 *
 * Default fields: slug (key), title, author, year.
 * Extra fields are added if present: publisher, bookTitle, journal, volume, number,
 * pages, doi, url, venue, note, etc.
 *
 * @param {object} pub
 * @returns {string} BibTeX entry
 */
function buildBibtexEntry(pub) {
    const type = (pub.type || 'misc').toLowerCase(); // generic type by default

    const year = extractYear(pub.date);
    const slug = makeSlug(pub, year);
    const authors = normalizeAuthors(pub.authors);

    const fields = [];

    // ---- Default fields ----
    if (authors) {
        fields.push(`  author = {${escapeBibtex(authors)}}`);
    }

    if (pub.title) {
        fields.push(`  title = {${escapeBibtex(pub.title)}}`);
    }

    if (year) {
        fields.push(`  year = {${year}}`);
    }

    // ---- Extra fields (conditionally added) ----

    // Publisher
    if (pub.publisher) {
        fields.push(`  publisher = {${escapeBibtex(pub.publisher)}}`);
    }

    // Book title (for chapters or inproceedings)
    if (pub.bookTitle || pub.booktitle) {
        const bt = pub.bookTitle || pub.booktitle;
        fields.push(`  booktitle = {${escapeBibtex(bt)}}`);
    }

    // Journal (for articles)
    if (pub.journal) {
        fields.push(`  journal = {${escapeBibtex(pub.journal)}}`);
    }

    // Venue: if you don't have a specific type, store as "howpublished" or "note"
    if (pub.venue) {
        fields.push(`  howpublished = {${escapeBibtex(pub.venue)}}`);
    }

    // Volume / number / pages / doi / url / note etc.
    if (pub.volume) {
        fields.push(`  volume = {${escapeBibtex(pub.volume)}}`);
    }
    if (pub.number) {
        fields.push(`  number = {${escapeBibtex(pub.number)}}`);
    }
    if (pub.pages) {
        fields.push(`  pages = {${escapeBibtex(pub.pages)}}`);
    }
    if (pub.doi) {
        fields.push(`  doi = {${escapeBibtex(pub.doi)}}`);
    }
    if (pub.url) {
        fields.push(`  url = {${escapeBibtex(pub.url)}}`);
    }
    if (pub.note) {
        fields.push(`  note = {${escapeBibtex(pub.note)}}`);
    }

    // If you want to always keep the original date around as a note:
    if (pub.date && !pub.note) {
        fields.push(`  note = {${escapeBibtex(String(pub.date))}}`);
    }

    return `@${type}{${slug},\n${fields.join(',\n')}\n}`;
}

// --- Generate BibTeX for an array of publications ---

export function generateBibtex(publication) {
    return buildBibtexEntry(publication);
}

export function prettyPrintNames(input) {
    const seen = new Set();

    return (
        input
            // split ONLY on semicolons or on " Last, First" boundaries
            .split(/;\s*|\s+(?=[A-Z][a-z]+,)/)
            .map((p) => p.trim())
            .filter((p) => p.includes(','))
            .map((p) => {
                const [last, first] = p.split(',').map((s) => s.trim());
                return `${first} ${last}`;
            })
            .filter((name) => {
                if (seen.has(name)) return false;
                seen.add(name);
                return true;
            })
            .join(', ')
    );
}
