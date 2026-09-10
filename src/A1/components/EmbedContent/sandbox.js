/**
 * Sandbox permissions that a site editor is allowed to grant to an embedded page.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#sandbox
 */
const ALLOWED_TOKENS = [
    'allow-downloads',
    'allow-forms',
    'allow-modals',
    'allow-orientation-lock',
    'allow-pointer-lock',
    'allow-popups',
    'allow-popups-to-escape-sandbox',
    'allow-presentation',
    'allow-same-origin',
    'allow-scripts',
    'allow-storage-access-by-user-activation',
    'allow-top-navigation',
    'allow-top-navigation-by-user-activation',
    'allow-top-navigation-to-custom-protocols',
];

/**
 * Turn the free-text sandbox setting into a valid iframe sandbox attribute.
 *
 * An empty sandbox attribute is the *most* restrictive value a browser accepts,
 * so an input with no recognizable permission returns undefined instead. That
 * omits the attribute and leaves the embed unrestricted, which keeps sections
 * created before this setting existed working exactly as they did.
 *
 * @param {string} value - Permissions separated by spaces, commas or newlines.
 * @returns {string|undefined} The sandbox attribute value, or undefined for none.
 */
export default function parseSandbox(value) {
    if (typeof value !== 'string') return undefined;

    const tokens = value
        .toLowerCase()
        .split(/[\s,]+/)
        .filter((token) => ALLOWED_TOKENS.includes(token));

    const granted = [...new Set(tokens)];

    return granted.length ? granted.join(' ') : undefined;
}
