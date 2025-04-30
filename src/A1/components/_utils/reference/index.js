export const parseReference = (profile) => {
    const head = profile.rawHead;

    const { data, title, doi, date, meta_data } = head;

    let isStandard = true;

    let parsedData = data;

    if (parsedData?.section_id) {
        if (parsedData?.['standardData']) {
            parsedData = {
                ...parsedData?.['standardData'],
                title,
                date,
            };
        } else {
            isStandard = false;
        }
    }

    //For some reason, maybe beacuse the raw editor is not working properly, the data is being saved as a string
    if (typeof parsedData === 'string') {
        parsedData = JSON.parse(parsedData);
    }

    let parsedMeta = meta_data;
    if (typeof parsedMeta === 'string') {
        parsedMeta = JSON.parse(parsedMeta);
    }

    parsedData = {
        ...parsedData,
        title,
        date,
    };

    let finalDoi = doi || parsedData?.doi || '';

    finalDoi =
        finalDoi && finalDoi.startsWith('https://doi.org/')
            ? finalDoi.replace('https://doi.org/', '')
            : finalDoi;

    let {
        authors,
        date: d,
        pages,
        publisher,
        published,
        volume,
        issue,
        page_range,
        journal,
        url,
    } = parsedData;

    let finalData = {
        title,
        DOI: finalDoi,
        type: 'article-journal',
        volume,
        issue,
        journal,
        isStandard,
    };

    if (!isStandard) {
        finalData = {
            ...finalData,
            parsedData,
            parsedMeta,
        };
    }

    if (authors) {
        const { parsedAuthorArray, hasOtherAuthors } = init(authors);

        finalData.originalAuthors = authors;

        authors = parsedAuthorArray.map((author) => {
            const [name, asterisk] = author;

            let [family, given] = name.split(',');

            if (!given) {
                let p = family.split(' ');

                family = p?.[0];
                given = p?.[1] || '';
            }

            return { given: given.trim(), family: `${asterisk ? '*' : ''}${family.trim()}` };
        });

        if (hasOtherAuthors) authors.push({ given: '', family: 'et al.' });

        finalData.author = authors;
    }

    if (published) {
        finalData['publisher-place'] = published;
    }

    if (pages || page_range) {
        finalData.page = pages || page_range;
    }

    if (publisher) {
        finalData.publisher = publisher;
    }

    if (d) {
        const [year, month] = d.split('/');
        finalData.issued = {
            'date-parts': [[parseInt(year), parseInt(month)]],
        };
    }

    if (parsedData['periodical-title'] || journal) {
        finalData['container-title'] = parsedData['periodical-title'] || journal;
    }

    return finalData;
};

const isInitial = (name) => {
    return name.length <= 4 && name === name.toUpperCase() && name != name.toLowerCase();
};

const cleanupAuthorsStr = (authors) => {
    //Covert " and ", ",and ", ", and" to comma
    //Covert the same format for "&" as well
    //Examples:
    //1. (*) Gao, X, (*) Porter, J, Brooks, S, and Arnold, D V
    //2. Welsh, T.N., Pacione, S.*, & Neyedli, H.F
    //3. 'M. A. MacLean,* C. A. Wheaton,* and Mark Stradiotto*'
    let regex = /\,?\s*\*?((\sand\s)|\&)\s*/g;
    let str = authors.replaceAll(regex, ',');

    //Remove et al.
    const hasOtherAuthors = str.includes('et al');

    regex = /\,?\s*et\sal\.?\s*/g;
    str = str.replaceAll(regex, '');

    //Remove empty comma
    //Example: 'F. Riahi(*),, Z. Zolaktaf(*), M. Shafiei, E. Milios'
    regex = /\,\s*\,/g;
    str = str.replaceAll(regex, ',');

    //replace *, (*) to single *
    regex = /(\s*\*)|(\(\s*\*\s*\))/g;
    str = str.replaceAll(regex, '*');

    //Remove parentheses
    regex = /\(.*\)/g;
    str = str.replaceAll(regex, '');

    //Remove brackets
    regex = /\[.*\]/g;
    str = str.replaceAll(regex, '');

    //Replace \n to ' '
    str = str.replaceAll(/\n/g, ' ');

    str = str.trim();

    // Replace all multiples spaces by a single space
    str = str.replaceAll(/ +/g, ' ');

    // Remove all space after ;
    str = str.replaceAll(/; /g, ';');

    // Replace all multiples spaces by a single space
    str = str.replaceAll(/;+/g, ';');

    // Clean str if it is a single ';'
    if (str === ';') str = '';

    // remove last ';'
    // if (str.charAt(str.length - 1) === ';') str = str.slice(0, -1);

    // console.log(`str${str}`);

    //Remove the last comma if it is the last letter
    if (str.charAt(str.length - 1) === ',') {
        str = str.substr(0, str.length - 1);
    }

    return { cleanStr: str, hasOtherAuthors: hasOtherAuthors };
};

const initSMMode = (authors) => {
    const p = authors.split(';');
    const weights = {
        perfects: 0,
        nonPerfects: 0,
    };

    p.forEach((item) => {
        let itemArray = item.split(',');

        if (itemArray.length === 2) {
            weights.perfects++;
        } else {
            weights.nonPerfects++;
        }
    });

    const accuracy = weights.nonPerfects === 0 ? 'perfect' : 'PARTIAL';

    // this.setFormatType('SM', accuracy, authors);
    return {
        parsedAuthors: authors,
        parsedType: 'SM',
        parsedAccuracy: accuracy,
    };
};

const initOtherMode = (authors) => {
    //Separate authors by comma
    const splitsByComma = authors.split(',');

    //Used for tell between single comma mode and double comma mode
    const weights = { single: 0, double: 0 };

    // Used for tell between first name first and last name first in single comma mode
    const flWeights = { ff: 0, lf: 0 };

    let preCount = 0;

    for (let i = 0; i < splitsByComma.length; i++) {
        let item = splitsByComma[i];
        if (item === '') continue;
        let words = item.trim().split(' ');
        //Count the number of words
        let count = words.length;
        preCount = i ? splitsByComma[i - 1].trim().split(' ').length : 0;
        //Double comma mode, every single name is separated by a comma
        if (count === 1) {
            weights.double++;
        } else {
            if (isInitial(item)) {
                weights.double++;
            } else {
                //The name in even postion contains multiple words, and the previous part only contain one word
                //We treat it as DC mode. The second part of the name might contains middle name.
                if (preCount == 1) {
                    weights.double++;
                } else {
                    weights.single++;

                    //Check if the first word is first name
                    if (isInitial(words[0])) {
                        flWeights.ff++;
                    } else if (isInitial(words[words.length - 1])) {
                        flWeights.lf++;
                    } else {
                        //Both first word and last word are not initials
                        //We treat the name as First name first mode.
                        flWeights.ff++;
                    }
                }
            }
        }
    }

    //Mixed mode
    if (weights.double && weights.single) {
        //if single mode has higher weight, we cannot display the name correctly
        if (weights.single >= weights.double) {
            // console.log('Mixed mode, cannot tell single or double comma mode.');
            // return this.setFormatType('', 'unknown');
            return {
                parsedType: '',
                parsedAccuracy: 'unknown',
                parsedAuthors: '',
            };
        } else {
            //Number of splits must be even. Each name must contain exact two parts
            if (splitsByComma.length % 2 == 1) {
                // console.log('DC mode with odd number of words.');
                // return this.setFormatType('', 'unknown');
                return {
                    parsedType: '',
                    parsedAccuracy: 'unknown',
                    parsedAuthors: '',
                };
            }

            //It may still fine if the DC mode has higher weight
            // return this.setFormatType('DC', 'PARTIAL', authors);
            return {
                parsedType: 'DC',
                parsedAccuracy: 'PARTIAL',
                parsedAuthors: authors,
            };
        }
    }

    if (weights.double) {
        //Number of splits must be even. Each name must contain exact two parts
        if (splitsByComma.length % 2 == 1) {
            // console.log('DC mode with odd number of words.');
            // return this.setFormatType('', 'unknown');
            return {
                parsedType: '',
                parsedAccuracy: 'unknown',
                parsedAuthors: '',
            };
        }

        // return this.setFormatType('DC', 'perfect', authors);
        return {
            parsedType: 'DC',
            parsedAccuracy: 'perfect',
            parsedAuthors: authors,
        };
    }

    if (weights.single) {
        if (flWeights.ff >= flWeights.lf) {
            let accuracy = flWeights.lf == 0 ? 'perfect' : 'PARTIAL';
            // return this.setFormatType('SCFF', accuracy, authors);
            return {
                parsedType: 'SCFF',
                parsedAccuracy: accuracy,
                parsedAuthors: authors,
            };
        } else {
            let accuracy = flWeights.ff == 0 ? 'perfect' : 'PARTIAL';
            // return this.setFormatType('SCLF', accuracy, authors);
            return {
                parsedType: 'SCLF',
                parsedAccuracy: accuracy,
                parsedAuthors: authors,
            };
        }
    }
};

const parseAuthors = (authors) => {
    if (!authors) {
        return {
            parsedAuthors: '',
            parsedType: 'SM',
            parsedAccuracy: '',
            hasOtherAuthors: false,
        };
    } else {
        const splitsBySemicolon = authors.split(';');
        const { cleanStr: authorsStrClean, hasOtherAuthors } = cleanupAuthorsStr(authors);

        if (splitsBySemicolon.length > 1) {
            return {
                ...initSMMode(authorsStrClean),
                hasOtherAuthors: hasOtherAuthors,
            };
        } else {
            return {
                ...initOtherMode(authorsStrClean),
                hasOtherAuthors: hasOtherAuthors,
            };
        }
    }
};

const init = (initialValue) => {
    let { parsedAuthors, parsedType, parsedAccuracy, hasOtherAuthors } = parseAuthors(initialValue);

    //trim ',' and ';'
    parsedAuthors = parsedAuthors.replace(/^[;,]+|[;,]+$/g, '');

    let parsedAuthorArray = [];
    let rawMode = false;
    switch (parsedType) {
        case 'SCLF':
        case 'SCFF': {
            let p = parsedAuthors.split(',');
            parsedAuthorArray = p.map((item) => {
                let isStudent = item.includes('*');
                let name = item.replaceAll(/\**/g, '');
                let p2 = name.trim().split(' ');
                let lastName = parsedType === 'SCLF' ? p2.shift().trim() : p2.pop().trim();
                let firstName = p2.join(' ').trim();
                name = lastName + ', ' + firstName;
                return [name, isStudent];
            });
            break;
        }
        case 'DC': {
            if (parsedAccuracy === 'perfect' || parsedAccuracy === 'PARTIAL') {
                let p = parsedAuthors.split(',');
                const parsedArray = p.reduce(
                    (rows, item, index) =>
                        (index % 2 == 0
                            ? rows.push([item.trim()])
                            : rows[rows.length - 1].push(item.trim())) && rows,
                    []
                );
                parsedAuthorArray = parsedArray.map((item) => {
                    let name = item.join(', ');
                    let isStudent = name.includes('*');
                    name = name.trim().replaceAll(/\**/g, '');
                    return [name, isStudent];
                });
            }
            break;
        }
        case 'SM': {
            let p = parsedAuthors.split(';');
            parsedAuthorArray = p.map((item) => {
                let isStudent = item.includes('*');
                let name = item.replaceAll(/\**/g, '');
                return [name, isStudent];
            });
            break;
        }
        default: {
            rawMode = true;
            break;
        }
    }

    return {
        initialAuthors: initialValue,
        parsedAuthors: parsedAuthors,
        parsedType: parsedType,
        parsedAccuracy: parsedAccuracy,
        hasOtherAuthors: hasOtherAuthors,
        parsedAuthorArray: rawMode
            ? []
            : parsedAuthorArray.length > 0
            ? parsedAuthorArray
            : [['', false]],
        rawMode: rawMode,
    };
};

export function getDateFromIssued(issued) {
    const parts = issued['date-parts'];

    if (parts && parts.length > 0) {
        const year = parts[0][0] || 0; // Get the year, or use 0 if not present
        let month = parts[0][1] || 0; // Get the month, or default to 0 if not present
        month = isNaN(month) ? 0 : month; // Ensure month is a number

        // return `${year}/${month}`; // Create a Date object (month is 0-indexed)
        return `${year}.${month}`; // Create a Date object (month is 0-indexed)
    }
    return '0'; // Return a very old date if no valid data is available
}

export const isEmptySectionValue = (value) => {
    if (!value.length) return true;

    const copy = structuredClone(value);

    const filtered = copy.filter((item) => {
        const { itemId, _primaryItem, ...fields } = item;

        if (!Object.keys(fields).length) return false;

        let hasValue = false;

        Object.values(fields).forEach((field) => {
            if (!field.value) return;

            if (field.type === 'localstr') {
                if (Object.values(field.value).filter(Boolean).length) {
                    hasValue = true;
                }
            } else {
                hasValue = true;
            }
        });

        return hasValue;
    });

    return !filtered.length;
};

const parseItemAttributes = (attributes, format) => {
    const { _attributes_ } = format;
    const parsedAttributes = {};
    for (const [attributeId, attributeValue] of Object.entries(attributes)) {
        for (const [_attributeName_, _attribute_] of Object.entries(_attributes_)) {
            if (_attribute_.type_id === attributeId) {
                parsedAttributes[_attributeName_] = attributeValue;
            }
        }
    }
    return parsedAttributes;
};

const getCardFileNames = (fields, subsections) => {
    let cardFileNames = [];

    Object.values(fields).forEach((field) => {
        if (field.constraints?.autocomplete) {
            cardFileNames.push(field.constraints.autocomplete);
        }
    });
    Object.values(subsections).forEach((subsection) => {
        const { fields, subsections } = subsection;
        cardFileNames.push(...getCardFileNames(fields, subsections));
    });
    return cardFileNames;
};

const getSubtypeIds = (fields, subsections) => {
    let subtypeIds = [];
    Object.values(fields).forEach((field) => {
        if (field.type === 'lov' || field.type === 'systable') {
            subtypeIds.push(field.subtype_id);
        } else if (field.type === 'reftable') {
            subtypeIds.push([field.subtype_id, field.dependencies]);
        } else if (field.type === 'profile') {
            // this is to handle the case where the field is profile type without subtype
            // we set the subtype_id to the field name to help the rest code to parse selector options
            // warning: the field name might not be unique, consider use field_id with a special symbol or use field name with section id.
            if (!field.subtype_id) {
                field.subtype_id = field.name;
            }
            subtypeIds.push(field.subtype_id);
        }
    });
    Object.values(subsections).forEach((subsection) => {
        const { fields, subsections } = subsection;
        subtypeIds.push(...getSubtypeIds(fields, subsections));
    });

    return subtypeIds;
};

export const parseFieldValue = (
    fieldType,
    fieldSubtype,
    fieldValue = null,
    attributes = {},
    lang
) => {
    if (fieldValue === null)
        return {
            value: null,
        };

    let parsedValue = {};

    switch (fieldType) {
        case 'systable':
        case 'lov':
        case 'reftable': {
            if (!Array.isArray(fieldValue))
                return {
                    value: '_invalid_',
                }; // "invalid" waring will be display in view page and in edit page the field will be empty

            const [id, value = null, ...other_values] = fieldValue;

            const result = {
                value_id: id,
            };

            if (value) result.value = value;

            if (other_values) result.other_values = other_values.filter(Boolean);

            return result;
        }
        case 'bilingual':
            if (fieldValue.english) parsedValue.en = fieldValue.english;

            if (fieldValue.french) parsedValue.fr = fieldValue.french;

            return {
                value: parsedValue,
            };
        case 'localstr':
            try {
                parsedValue = JSON.parse(fieldValue);
            } catch (error) {
                parsedValue = { [uniweb.language()]: fieldValue, '@': {} };
            }

            const { '@': metadata = {}, ...langValue } = parsedValue;

            return {
                value: langValue,
                activeValue:
                    langValue[uniweb.language()] ||
                    Object.values(langValue).filter(Boolean)[0] ||
                    '',
                activeLang: uniweb.language(),
                metadata,
            };
        case 'address':
            return { value: JSON.parse(fieldValue) };
        default:
            return {
                value: fieldValue,
            };
    }
};

const parseFields = (
    fields,
    itemValues,
    subsections,
    subsectionItemOrder = null,
    attributes = {},
    lang
) => {
    const parsedFields = {};

    for (const [fieldId, field] of Object.entries(fields)) {
        const { type, subtype, label, constraints, subsection_id, name, field_id } = field;

        const fieldValue = itemValues ? itemValues[fieldId] : '';
        const parsedField = {
            name,
            type,
            subtype,
            label,
            constraints,
            fieldId: field_id,
        };

        if (type !== 'section') {
            Object.assign(
                parsedField,
                fieldValue ? parseFieldValue(type, subtype, fieldValue, attributes, lang) : ''
            );
            if (name === 'order') {
                parsedField['value'] = parsedField['value'] ?? subsectionItemOrder;
            }
        } else {
            const subsectionValue = [];
            const subsection = subsections[subsection_id];
            if (!fieldValue) parsedField['value'] = null;
            else {
                fieldValue.forEach((subItem) => {
                    const parsedSubsection = parseFields(
                        subsection.fields,
                        subItem.values,
                        subsection.subsections,
                        subItem.order,
                        attributes,
                        lang
                    );
                    parsedSubsection['itemId'] = subItem.id;
                    subsectionValue.push(parsedSubsection);
                });

                parsedField['value'] = subsectionValue;
            }
        }
        parsedFields[name] = parsedField;
    }
    return parsedFields;
};

// TODO check field permission
const filterFields = (fields) => {
    for (const [fieldId, field] of Object.entries(fields)) {
        if (field.disabled === '1') {
            delete fields[fieldId];
        }
    }
};

const filterSubsections = (subsections) => {
    for (const [subsectionId, subsection] of Object.entries(subsections)) {
        if (subsection.disabled === '1') {
            delete subsections[subsectionId];
        }
    }
};

export const parseSection = (
    section,
    format,
    contentInfo,
    filterOption = { skip: [], keep: [], ignoreEmpty: false },
    editMode,
    lang
) => {
    const {
        name,
        sectionPath,
        label,
        max_item_count,
        section_id,
        fields,
        has_fields,
        disabled,
        items,
        description,
        constraints = {},
        subsections = [],
        source_id,
    } = section;

    const { skip, keep, ignoreEmpty } = filterOption;

    const value = [];
    let subtypeIds = [];
    let cardFileNames = [];
    let forceKeep = false;

    if (keep.indexOf(name) !== -1) forceKeep = true;
    // if (disabled === '1' && !forceKeep) return null;
    if (disabled === '1') return null;
    if ((skip === 'all' || skip.indexOf(name) !== -1) && !forceKeep) return null;

    // const permission = constraints ? constraints.permission : null;
    // if (permission && contentInfo) {
    //     if (!uniweb.checkUserPermission(permission, contentInfo)) {
    //         return null;
    //     }
    // }

    filterFields(fields);
    filterSubsections(subsections);

    if (has_fields === '1') {
        if (items) {
            items.forEach((item) => {
                const { id, values, attributes } = item;

                const attrVal = {};

                if (attributes) {
                    if (attributes.primary === true) {
                        attrVal['_primaryItem'] = true;
                    } else {
                        if (format)
                            attrVal['_attributes'] = parseItemAttributes(attributes, format);
                    }
                }

                const parsedItem = {
                    itemId: id,
                    ...parseFields(fields, values, subsections, null, attrVal?._attributes, lang),
                    ...attrVal,
                };

                value.push(parsedItem);
            });
        }
        subtypeIds = getSubtypeIds(fields, subsections);
        cardFileNames = getCardFileNames(fields, subsections);
    } else {
        if (items?.[0]) {
            const { values, id } = items[0];
            for (const [fieldId, field] of Object.entries(fields)) {
                const { subsection_id } = field;
                const subsection = subsections[subsection_id];
                const subsectionItems = values[fieldId];
                subsection['items'] = subsectionItems ?? [];
                const parsedSubsection = parseSection(
                    subsection,
                    format,
                    contentInfo,
                    filterOption,
                    editMode,
                    lang
                );

                if (parsedSubsection) {
                    subsections[subsection_id] = {
                        parentFieldId: fieldId,
                        parentItemId: id,
                        ...parsedSubsection,
                    };
                } else {
                    delete subsections[subsection_id];
                }
            }
        } else {
            if (ignoreEmpty && !forceKeep) {
                return null;
            } else {
                for (const [fieldId, field] of Object.entries(fields)) {
                    const { subsection_id } = field;
                    const subsection = subsections[subsection_id];

                    subsection['items'] = [];
                    const parsedSubsection = parseSection(
                        subsection,
                        format,
                        contentInfo,
                        filterOption,
                        editMode,
                        lang
                    );

                    if (parsedSubsection) {
                        subsections[subsection_id] = {
                            parentItemId: '0',
                            parentFieldId: fieldId,
                            ...parsedSubsection,
                        };
                    } else {
                        delete subsections[subsection_id];
                    }
                }
            }
        }
    }

    let parsedSection;

    if (
        ignoreEmpty &&
        !forceKeep &&
        ((has_fields === '1' && isEmptySectionValue(value)) ||
            (has_fields !== '1' && Object.keys(subsections).length === 0))
    )
        return null;

    if (!editMode) {
        parsedSection = {
            name,
            label,
            max_item_count,
            section_id,
            value,
            has_fields,
            fields,
            subsections,
            constraints,
            source_id,
        };
    } else {
        parsedSection = {
            name,
            sectionPath,
            label,
            max_item_count,
            section_id,
            value,
            has_fields,
            fields,
            subsections,
            subtypeIds,
            cardFileNames,
            description,
            constraints,
            source_id,
        };
    }

    return parsedSection;
};

/**
 * @todo Add comments about how the data is parsed. Define the options.
 *
 * @param {*} profileData
 * @param {*} filterSetting
 * @param {*} editMode
 * @returns
 */
export const parseProfileData = (profileData, filterSetting, editMode = false, lang = '') => {
    let parsedProfileData = [];

    let filterOption = {};

    const { sections, format, contentInfo } = profileData;

    if (!filterSetting) {
        filterOption = { skip: [], keep: [], ignoreEmpty: false };
    } else {
        if (filterSetting === true) {
            filterOption = { skip: [], keep: [], ignoreEmpty: true };
        } else {
            filterOption = Object.assign({ skip: [], keep: [], ignoreEmpty: false }, filterSetting);
        }
    }

    sections.forEach((section) => {
        const parsedSection = parseSection(
            section,
            format,
            contentInfo,
            filterOption,
            editMode,
            lang
        );

        if (parsedSection) {
            parsedProfileData.push(parsedSection);
        }
    });

    return parsedProfileData;
};
