import React from 'react';
import { fieldValueParser } from './helper';
import './richtext.css';
import TextTruncator from './TextTruncator';

export const Months = [
    {
        en: 'January',
        fr: 'Janvier',
    },
    {
        en: 'February',
        fr: 'Février',
    },
    {
        en: 'March',
        fr: 'Mars',
    },
    {
        en: 'April',
        fr: 'Avril',
    },
    {
        en: 'May',
        fr: 'Mai',
    },
    {
        en: 'June',
        fr: 'Juin',
    },
    {
        en: 'July',
        fr: 'Juillet',
    },
    {
        en: 'August',
        fr: 'Août',
    },
    {
        en: 'September',
        fr: 'Septembre',
    },
    {
        en: 'October',
        fr: 'Octobre',
    },
    {
        en: 'November',
        fr: 'Novembre',
    },
    {
        en: 'December',
        fr: 'Décembre',
    },
];

/**
 * Renders a field value based on its type and constraints.
 *
 * @param {object} field - The field object containing type, value, label, constraints, etc.
 * @param {boolean} [showLabel=true] - Whether to display the field's label.
 * @param {string} [wrapper='p'] - The HTML tag type to use as a wrapper ('p', 'span', 'div', etc.).
 * @param {boolean} [editMode=false] - Flag to indicate if rendering in an edit context (shows all languages for localstr/bilingual).
 * @param {boolean} [plainText=false] - If true, returns a plain string or a specific object structure instead of JSX (useful for non-React contexts or data extraction).
 * @returns {React.ReactNode|string|object|null} Rendered field or null if value is empty.
 */
export const genericFieldRenderer = (
    field,
    showLabel = true,
    wrapper = 'p',
    editMode = false,
    plainText = false,
    website
) => {
    const localize = website.localize;
    // Ensure field is an object, otherwise return null
    if (!field || typeof field !== 'object') {
        return null;
    }

    const Wrapper = wrapper; // Use the dynamic wrapper tag
    const { type, constraints, label, name } = field;
    const fieldValue = fieldValueParser(field); // Parse the value using the helper

    // Helper function for label rendering
    const getLabel = (showColon = true) => {
        if (label && showLabel)
            return (
                <span>
                    {label}
                    {showColon ? ': ' : ' '}
                </span>
            );
        return null;
    };

    // Return null if the parsed field value is null or undefined
    if (fieldValue === null || typeof fieldValue === 'undefined') {
        return null;
    }

    switch (type) {
        case 'bilingual':
        case 'localstr': {
            // Default initialTruncate to true unless it's 'research_description'
            const initialTruncate = name !== 'research_description';

            if (editMode && !plainText) {
                // Edit mode, render all languages
                if (constraints?.richText === true) {
                    // Ensure fieldValue is an array before mapping
                    if (!Array.isArray(fieldValue)) return null;

                    return fieldValue.map((langValue, index) => {
                        let { lang, langVal = '' } = langValue; // Default langVal to empty string

                        // Handle empty paragraphs for display consistency
                        if (type === 'localstr')
                            langVal = langVal.replace(/<p><\/p>/g, '<p><br></p>');
                        if (type === 'bilingual') {
                            langVal = langVal.replace(/<br>/g, '<p><br></p>');
                        }

                        return (
                            <div key={index}>
                                <p className="font-medium text-gray-600 mb-0.5">
                                    <span>{getLabel(false)}</span>
                                    {lang && (
                                        <span className="text-gray-400">
                                            (
                                            {lang === 'en'
                                                ? localize({
                                                      en: 'English',
                                                      fr: 'Anglais',
                                                  })
                                                : lang === 'fr'
                                                ? localize({
                                                      en: 'French',
                                                      fr: 'Français',
                                                  })
                                                : lang}{' '}
                                            )
                                        </span>
                                    )}
                                </p>
                                {/* Apply rich-text-style for proper rendering via CSS */}
                                <TextTruncator
                                    text={langVal}
                                    className="rich-text-style"
                                    maxLine={'line-clamp-3'}
                                    initialTruncate={initialTruncate}
                                />
                            </div>
                        );
                    });
                } else {
                    // Edit mode, plain text - render all languages inline
                    // Ensure fieldValue is an array before mapping
                    if (!Array.isArray(fieldValue)) return null;

                    return (
                        <Wrapper>
                            {getLabel()}
                            {fieldValue.map((langValue, index) => {
                                const { lang, langVal = '' } = langValue; // Default to empty string
                                // Basic escaping for non-rich text display
                                const escapedVal = langVal
                                    .replace(/&/g, '&amp;')
                                    .replace(/</g, '&lt;')
                                    .replace(/>/g, '&gt;');

                                if (lang) {
                                    return (
                                        <span
                                            key={index}
                                            className="text-gray-400"
                                            title={escapedVal}
                                        >
                                            ({escapedVal}){index < fieldValue.length - 1 ? ' ' : ''}
                                        </span>
                                    );
                                } else {
                                    return (
                                        <span key={index} title={escapedVal}>
                                            {escapedVal}
                                            {index < fieldValue.length - 1 ? ' ' : ''}
                                        </span>
                                    );
                                }
                            })}
                        </Wrapper>
                    );
                }
            } else if (plainText) {
                // Plain text output logic
                const { activeValue = '', value = {} } = field;
                const finalValue = activeValue || Object.values(value)[0] || ''; // Get active or first value

                if (!editMode) {
                    // Plain text, non-edit mode
                    if (constraints?.richText === true) {
                        return { html: true, value: finalValue }; // Indicate HTML content
                    } else {
                        return finalValue; // Return plain string
                    }
                } else {
                    // Plain text, edit mode - structure with current and other languages
                    const parsed = {};
                    if (constraints?.richText === true) {
                        parsed.html = true;
                    }
                    // Ensure uniweb is defined or handle error/default
                    const currentLang = typeof uniweb !== 'undefined' ? uniweb.language() : 'en'; // Example fallback
                    Object.keys(value).forEach((lang) => {
                        const langText = value[lang] || ''; // Default to empty string
                        if (lang === currentLang) {
                            parsed.value = langText;
                        } else {
                            parsed.otherLang = parsed.otherLang || []; // Initialize if needed
                            parsed.otherLang.push({
                                lang:
                                    lang === 'en'
                                        ? localize({
                                              en: 'English',
                                              fr: 'Anglais',
                                          })
                                        : lang === 'fr'
                                        ? localize({
                                              en: 'French',
                                              fr: 'Français',
                                          })
                                        : lang, // Use translation or lang code
                                value: langText,
                            });
                        }
                    });
                    // Ensure value is set, even if empty, if it was the currentLang
                    if (!parsed.value && value.hasOwnProperty(currentLang)) {
                        parsed.value = '';
                    }
                    return parsed;
                }
            } else {
                // Display mode (non-edit, non-plainText) - render active language
                const { activeValue = '', value = {} } = field;
                // Get active value or the first available value, default to empty string
                const finalValue = activeValue || Object.values(value)[0] || '';

                if (constraints?.richText === true) {
                    // Handle empty paragraphs for display consistency
                    let cleanedFinalValue = finalValue;
                    if (type === 'localstr')
                        cleanedFinalValue = cleanedFinalValue.replace(/<p><\/p>/g, '<p><br></p>');
                    if (type === 'bilingual') {
                        cleanedFinalValue = cleanedFinalValue.replace(/<br>/g, '<p><br></p>');
                    }

                    return (
                        // Apply rich-text-style for proper rendering via CSS
                        <div className="rich-text-style">
                            <p className="font-semibold text-gray-700">
                                <span>{getLabel(false)}</span>
                            </p>
                            {/* Assuming TextTruncator can handle basic HTML */}
                            <TextTruncator
                                text={cleanedFinalValue}
                                maxLine={'line-clamp-3'}
                                initialTruncate={initialTruncate}
                                // className="rich-text-style" // Applied on parent div
                            />
                        </div>
                    );
                } else {
                    // Display mode, plain text
                    return (
                        <Wrapper>
                            {getLabel()}
                            {/* Basic escaping for safety */}
                            <span>
                                {finalValue
                                    .replace(/&/g, '&amp;')
                                    .replace(/</g, '&lt;')
                                    .replace(/>/g, '&gt;')}
                            </span>
                        </Wrapper>
                    );
                }
            }
        }
        case 'profile':
        case 'lov':
        case 'reftable':
        case 'systable': {
            // Ensure fieldValue is an array
            if (!Array.isArray(fieldValue)) return null;

            const displayValue = fieldValue.filter(Boolean); // Remove empty/null values

            if (plainText) {
                // Join non-empty parts for plain text
                return displayValue.join(' - ');
            }

            return (
                <Wrapper>
                    {getLabel()}
                    {displayValue.length > 1 ? (
                        <span>
                            <span className="font-semibold text-gray-600">
                                {displayValue[0]} {/* First part bold */}
                            </span>
                            <span className="text-gray-500">
                                {displayValue.slice(1).join(' - ')} {/* Rest normal */}
                            </span>
                        </span>
                    ) : (
                        <span>{displayValue[0]}</span> // Only one part
                    )}
                </Wrapper>
            );
        }
        case 'elapsed-time': {
            // Ensure fieldValue is an object with min/sec
            if (typeof fieldValue !== 'object' || fieldValue === null) return null;
            const { min = 0, sec = 0 } = fieldValue; // Default to 0

            let minLabel = {};
            if (min == 1) {
                minLabel = localize({
                    en: '1 minute',
                    fr: '1 minute',
                });
            } else {
                minLabel = localize({
                    en: `${min} minutes`,
                    fr: `${min} minutes`,
                });
            }
            let secLabel = {};
            if (sec == 1) {
                secLabel = localize({
                    en: '1 second',
                    fr: '1 seconde',
                });
            } else {
                secLabel = localize({
                    en: `${sec} seconds`,
                    fr: `${sec} secondes`,
                });
            }

            if (plainText) {
                return `${minLabel} ${secLabel}`;
            }
            return (
                <Wrapper>
                    {getLabel()}
                    {minLabel} {secLabel}{' '}
                </Wrapper>
            );
        }
        case 'address': {
            // Ensure fieldValue is an object with formatted_address
            if (
                typeof fieldValue !== 'object' ||
                fieldValue === null ||
                !fieldValue.formatted_address
            )
                return null;
            const { formatted_address } = fieldValue;

            if (plainText) {
                return formatted_address;
            }
            return (
                // Add appropriate class if truncation is desired
                <Wrapper className="truncate">
                    {getLabel()}
                    {formatted_address}
                </Wrapper>
            );
        }
        case 'date':
        case 'year':
        case 'yearmonth':
        case 'monthday': {
            // Ensure fieldValue is an object
            if (typeof fieldValue !== 'object' || fieldValue === null) return null;
            const { year, month, day } = fieldValue;

            // Validate month index
            const monthIndex = month ? parseInt(month, 10) - 1 : -1;
            let monthName = monthIndex >= 0 && monthIndex < 12 ? Months[monthIndex] || '' : '';

            monthName = monthName ? localize(monthName) : ''; // Localize month name

            const dayStr = day ? String(day) : '';
            const yearStr = year ? String(year) : '';

            // Combine parts, filtering out empty ones
            const dateParts = [monthName, dayStr, yearStr].filter(Boolean);
            if (dateParts.length === 0) return null; // Return null if no parts are valid

            // Format for display (e.g., "Month Day, Year" or "Month Year" etc.)
            let formattedDate;
            if (monthName && dayStr && yearStr) {
                formattedDate = `${monthName} ${dayStr}, ${yearStr}`;
            } else {
                formattedDate = dateParts.join(' ');
            }

            if (plainText) {
                return formattedDate;
            }
            return (
                <Wrapper>
                    {getLabel()}
                    {formattedDate}
                </Wrapper>
            );
        }
        case 'boolean': {
            // Handle actual boolean true/false as well as '1'/'0' strings
            const boolValue = fieldValue === '1' || fieldValue === true;
            const displayValue = boolValue
                ? localize({
                      en: 'Yes',
                      fr: 'Oui',
                  })
                : localize({
                      en: 'No',
                      fr: 'Non',
                  });

            if (plainText) {
                return displayValue;
            }
            return (
                <Wrapper>
                    {getLabel()}
                    {displayValue}
                </Wrapper>
            );
        }
        case 'hourminute': {
            // Ensure fieldValue is an object
            if (typeof fieldValue !== 'object' || fieldValue === null) return null;
            const { hour, min, meridiem } = fieldValue;

            // Basic validation/formatting
            const displayHour = hour ? String(hour) : '';
            const displayMin = min ? String(min).padStart(2, '0') : ''; // Pad minutes
            const displayMeridiem = meridiem || ''; // Handle potentially missing meridiem

            if (!displayHour || !displayMin) return null; // Return null if essential parts are missing

            const timeString = `${displayHour}:${displayMin} ${displayMeridiem}`.trim();

            if (plainText) {
                return timeString;
            }
            return (
                <Wrapper>
                    {getLabel()}
                    {timeString}
                </Wrapper>
            );
        }
        case 'file': {
            // Extract filename from path/URL
            const filename =
                typeof fieldValue === 'string'
                    ? fieldValue.substring(fieldValue.lastIndexOf('/') + 1)
                    : '';
            if (!filename) return null; // Return null if no filename could be extracted

            return (
                <Wrapper>
                    {getLabel()}
                    {/* break-all for long filenames, title shows full path */}
                    <span className="break-all" title={fieldValue}>
                        {filename}
                    </span>
                </Wrapper>
            );
        }
        case 'string': {
            // Ensure fieldValue is treated as a string
            const stringValue = String(fieldValue ?? '');

            if (plainText) {
                if (name === 'url') {
                    return { link: true, value: stringValue }; // Special structure for URLs
                }
                // Basic escaping for safety
                return stringValue
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
            }

            if (constraints?.select) {
                // Handle dropdown/select constraints
                const options = constraints.select?.[0]?.options || [];
                const option = options.find((o) => o.value === stringValue);
                // Localize label if found, otherwise use the value itself
                const valueLabel = option ? localize(option.label) : stringValue;

                return (
                    <Wrapper>
                        {getLabel()}
                        {valueLabel}
                    </Wrapper>
                );
            } else if (constraints?.color) {
                // Handle color constraint with a swatch
                return (
                    <Wrapper>
                        {getLabel()}
                        <span className="flex space-x-2.5 items-center">
                            {' '}
                            {/* Use CSS for flex layout */}
                            <span title={stringValue}>{stringValue}</span>
                            <span
                                style={{
                                    backgroundColor: stringValue, // Apply color inline
                                    width: '18px',
                                    height: '18px',
                                    border: '1px solid #ccc', // Example border
                                    borderRadius: '4px', // Example border radius
                                }}
                            ></span>
                        </span>
                    </Wrapper>
                );
            }

            // Default string rendering
            return (
                // Add truncate class if needed for long strings
                <Wrapper className="truncate">
                    {getLabel()}
                    {/* Show value in title, display potentially escaped value */}
                    <span title={stringValue}>
                        {stringValue
                            .replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')}
                    </span>
                </Wrapper>
            );
        }
        case 'json': {
            // Stringify object, handle non-objects gracefully
            const stringValue =
                typeof fieldValue === 'object' && fieldValue !== null
                    ? JSON.stringify(fieldValue, null, 2) // Pretty print
                    : String(fieldValue ?? ''); // Convert others to string

            if (plainText) {
                return stringValue;
            }

            return (
                <div>
                    {getLabel()}
                    {/* Use TextTruncator for potentially long JSON strings */}
                    <TextTruncator text={stringValue} maxLine={'line-clamp-5'} />
                    {/* Alternative: Display in <pre> tag for formatting */}
                    {/* <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{stringValue}</pre> */}
                </div>
            );
        }
        case 'section': {
            // Ensure fieldValue is an array
            if (!Array.isArray(fieldValue)) return null;

            return (
                <div>
                    <strong>{getLabel()}</strong>
                    <div>
                        {[...fieldValue]
                            // Sort by order field, default to 0 if missing
                            .sort((a, b) => (a?.order?.value ?? 0) - (b?.order?.value ?? 0))
                            .map((item, index) => {
                                // Basic validation for item structure
                                if (!item || typeof item !== 'object') return null;

                                const subFieldNames = Object.keys(item).filter(
                                    (subFieldName) =>
                                        subFieldName !== 'order' && subFieldName !== 'itemId'
                                );
                                // Determine if it's effectively a single field entry (excluding order/itemId)
                                const isSingleFieldSection = subFieldNames.length === 1;

                                return (
                                    // Use unique itemId if available, otherwise index
                                    <React.Fragment key={item.itemId || index}>
                                        {subFieldNames.map((subFieldName) => {
                                            const subField = item[subFieldName];
                                            // Ensure subField is a valid field object before recursive call
                                            if (!subField || typeof subField !== 'object')
                                                return null;

                                            // Recursive call to render sub-fields
                                            return genericFieldRenderer(
                                                subField,
                                                !isSingleFieldSection, // Hide label if only one field in section item
                                                'div', // Render section items in divs
                                                editMode,
                                                plainText
                                            );
                                        })}
                                    </React.Fragment>
                                );
                            })}
                    </div>
                </div>
            );
        }
        default:
            // Default case: convert value to string and render
            const defaultValue = String(fieldValue ?? ''); // Ensure conversion
            if (plainText) {
                return defaultValue;
            }
            return (
                <Wrapper>
                    {getLabel()}
                    {defaultValue}
                </Wrapper>
            );
    }
};
