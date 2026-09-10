/** Sections must never collapse to an unusable sliver, whatever the setting says. */
const MIN_HEIGHT = 200;

/** A 16:9 ratio, used whenever the setting cannot be understood. */
const DEFAULT_HEIGHT = '56.25%';

/** An amount with an optional unit, e.g. "800px", "56.25 %", "100vh" or just "800". */
const HEIGHT_PATTERN = /^(\d+(?:\.\d+)?)\s*(px|%|vh)?$/;

/**
 * Read the editor's height setting, tolerating the ways people write it:
 * a missing unit ("800"), uppercase units ("800PX") and stray spaces.
 *
 * @param {string|number} value - The raw iframe_height setting.
 * @returns {string} A valid CSS length or percentage.
 */
function normalize(value) {
    const raw = typeof value === 'number' ? String(value) : value;

    if (typeof raw !== 'string') return DEFAULT_HEIGHT;

    const match = raw.trim().toLowerCase().match(HEIGHT_PATTERN);

    if (!match) return DEFAULT_HEIGHT;

    const [, amount, unit = 'px'] = match;

    return `${amount}${unit}`;
}

/**
 * A px height below the minimum is raised to it. A vh height cannot be resolved
 * here, so the minHeight style below is what guards it.
 *
 * @param {string} height - A normalized height that is not a percentage.
 * @returns {string} The height to apply.
 */
function clampPixels(height) {
    if (!height.endsWith('px')) return height;

    return `${Math.max(Number.parseFloat(height), MIN_HEIGHT)}px`;
}

/**
 * Turn the height setting into inline styles for the iframe wrapper.
 *
 * A percentage is an aspect ratio relative to the wrapper's width (the padding
 * -bottom trick, which the absolutely positioned iframe then fills), while px
 * and vh are real heights.
 *
 * @param {string|number} value - The raw iframe_height setting.
 * @returns {object} Style properties for the wrapper element.
 */
export default function parseHeight(value) {
    const height = normalize(value);

    const sizing = height.endsWith('%')
        ? { paddingBottom: height }
        : { height: clampPixels(height) };

    return { ...sizing, minHeight: `${MIN_HEIGHT}px` };
}
