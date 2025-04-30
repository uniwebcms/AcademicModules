import * as React from 'react';
import { Fragment, isValidElement } from 'react';
import { Months } from '../../GenericFieldRender';

export default function getFieldValue(field, settings) {
    // check if field is React Element, Object or a string Object
    if (isValidElement(field)) {
        return field;
    } else if (field && typeof field === 'object') {
        return resolveFieldValue(field, settings);
    } else if (typeof field === 'string') {
        field = JSON.parse(field);
        return resolveFieldValue(field, settings);
    }

    return null;
}

export const getTag = (searchText, info = {}) => {
    const { strong = [], em = [] } = info;
    return strong.indexOf(searchText) !== -1
        ? 'strong'
        : em.indexOf(searchText) !== -1
        ? 'em'
        : Fragment;
};

export const getLabel = (fieldName, fieldLabel, label = [], Tag) => {
    const showLabel = label.indexOf(fieldName) !== -1;

    if (showLabel) {
        if (typeof Tag === 'symbol' && Tag === Symbol.for('react.fragment')) {
            return <span className="font-semibold">{fieldLabel}: </span>;
        } else {
            return <Tag>{fieldLabel}: </Tag>;
        }
    }
    return '';
};

const resolveFieldValue = (field, settings = {}) => {
    const { type, subtype, label: field_label, value, other_values, name, constraints } = field;
    const {
        label = [],
        em = [],
        strong = [],
        editMode,
        numberFormat = {},
        suffix = {},
        atonic = '', // make systable field value as one
    } = settings;

    const Tag = getTag(name, { em, strong });
    const fieldLabel = getLabel(name, field_label, label, Tag);

    const getSuffix = () => {
        if ([name] in suffix) {
            return suffix[name];
        }
        return '';
    };

    if (value) {
        if (value === '_invalid_' && editMode) {
            return (
                <Tag>
                    {fieldLabel}
                    <span className={`text-red-500`}>
                        {uniweb.activeWebsite.localize({
                            en: 'Invalid data',
                            fr: 'Données invalides',
                        })}
                    </span>
                    {getSuffix()}
                </Tag>
            );
        }

        // omit 'None of the above' and 'Prefer not to answer' from the display for 'title' field (Identification)
        if (type === 'lov' && name === 'title') {
            if (
                value === 'None of the above' ||
                value === 'Prefer not to answer' ||
                value === 'Aucune de ces réponses' ||
                value === 'Préfère ne pas répondre'
            )
                return null;
        }

        switch (type) {
            case 'string':
                return (
                    <Tag>
                        {fieldLabel}
                        {value}
                        {getSuffix()}
                    </Tag>
                );
            case 'lov':
                return (
                    <Tag>
                        {fieldLabel}
                        <LovRenderer {...field} />
                        {getSuffix()}
                    </Tag>
                );
            case 'integer':
                if (!Number(value)) return null;
                let formattedNumber;
                const pageLanguage = uniweb.language();
                if (numberFormat !== null) {
                    formattedNumber = new Intl.NumberFormat(
                        `${pageLanguage}-CA`,
                        numberFormat
                    ).format(value);
                } else {
                    formattedNumber = value;
                }
                return (
                    <Tag>
                        {fieldLabel}
                        {formattedNumber}
                        {getSuffix()}
                    </Tag>
                );
            case 'profile':
            case 'reftable':
            case 'systable':
                const notRequiredText = uniweb.activeWebsite.localize({
                    en: 'Not Required',
                    fr: 'Non requis',
                });

                if (editMode) {
                    return (
                        <Tag>
                            <span className={`font-semibold text-gray-600 mr-1`}>{value}</span>
                            {other_values?.length ? (
                                <span className={`text-gray-500`}>
                                    (
                                    {other_values
                                        .filter((text) => text !== notRequiredText)
                                        .join(' - ')}
                                    )
                                </span>
                            ) : (
                                ''
                            )}
                        </Tag>
                    );
                } else {
                    let parsedValue = value.split('|');

                    return (
                        <Tag>
                            {atonic ? (
                                <span>{[value, ...other_values].join(atonic)}</span>
                            ) : (
                                <>
                                    <span className={`font-semibold text-gray-600 mr-1`}>
                                        {parsedValue[0]}
                                    </span>
                                    {other_values?.length ? (
                                        <span className={`text-gray-500`}>
                                            (
                                            {other_values
                                                .filter((text) => text !== notRequiredText)
                                                .join(' - ')}
                                            )
                                        </span>
                                    ) : (
                                        ''
                                    )}
                                </>
                            )}
                        </Tag>
                    );
                }
            case 'bilingual':
                const primaryLanguage = uniweb.language();
                const otherLanguages = Object.keys(value).filter(
                    (lang) => lang !== primaryLanguage
                );

                return (
                    <Tag>
                        {constraints?.richText === true ? (
                            <>
                                <div dangerouslySetInnerHTML={{ __html: value[primaryLanguage] }} />
                                {otherLanguages.map((lang, index) =>
                                    value[lang] ? (
                                        <div
                                            key={index}
                                            dangerouslySetInnerHTML={{ __html: value[lang] }}
                                        />
                                    ) : (
                                        ''
                                    )
                                )}
                            </>
                        ) : (
                            <>
                                <span
                                    className={`text-gray-700 ${
                                        otherLanguages.length ? 'mr-1' : ''
                                    }`}
                                >
                                    {value[primaryLanguage]}
                                </span>
                                {otherLanguages.map((lang, index) =>
                                    value[lang] ? (
                                        <span className={`text-gray-500`} key={index}>
                                            ({value[lang]})
                                        </span>
                                    ) : (
                                        ''
                                    )
                                )}
                            </>
                        )}
                    </Tag>
                );
            case 'localstr': {
                if (editMode) {
                    const { value } = field;

                    const lang = uniweb.language();
                    const secLang = lang === 'fr' ? 'en' : 'fr';
                    const secLangLabel = secLang === 'fr' ? 'French' : 'Anglaise';

                    if (constraints?.richText === true) {
                        // Add a <br> tag in between open and close <p> tags. In SchemaForm, tiptap show a gap between two paragraphs, but when display data, <p></p> has no height, add <br> tag to make it visible.
                        value[lang] = value[lang]
                            ? value[lang].replace(/<p><\/p>/g, '<p><br></p>')
                            : '';
                        value[secLang] = value[secLang]
                            ? value[secLang].replace(/<p><\/p>/g, '<p><br></p>')
                            : '';

                        return (
                            <Tag>
                                {fieldLabel}
                                {value[lang] ? (
                                    <div dangerouslySetInnerHTML={{ __html: value[lang] }} />
                                ) : (
                                    ''
                                )}
                                {value[secLang] ? (
                                    <>
                                        <span className={`font-medium text-gray-400`}>
                                            ({secLangLabel})
                                        </span>
                                        <div dangerouslySetInnerHTML={{ __html: value[secLang] }} />
                                    </>
                                ) : (
                                    ''
                                )}
                            </Tag>
                        );
                    } else {
                        return (
                            <Tag>
                                {fieldLabel}
                                {value[lang] ? <span>{value[lang]}</span> : ''}
                                {value[secLang] ? (
                                    <span className={`text-gray-400`}> ({value[secLang]})</span>
                                ) : (
                                    ''
                                )}
                            </Tag>
                        );
                    }
                } else {
                    const { activeValue = '' } = field;

                    return (
                        <Tag>
                            {fieldLabel}
                            {constraints?.richText === true ? (
                                <div dangerouslySetInnerHTML={{ __html: activeValue }} />
                            ) : (
                                <span>{activeValue}</span>
                            )}
                        </Tag>
                    );
                }
            }
            case 'year':
            case 'yearmonth':
            case 'monthday': {
                if (value === 'present') {
                    return (
                        <Tag>
                            {fieldLabel}
                            {uniweb.activeWebsite.localize({ en: 'Present', fr: 'Présent' })}
                        </Tag>
                    );
                }

                const date = value.split('/').filter((time) => /\d/.test(time));
                let year, month, day;

                if (date.length) {
                    if (date.length === 3) {
                        month = date[1];
                        day = date[2];
                        year = date[0];
                    } else if (date.length === 2) {
                        if (type !== 'monthday') {
                            month = date[1];
                            year = date[0];
                        } else {
                            month = date[0];
                            day = date[1];
                        }
                    } else {
                        year = date[0];
                    }

                    return (
                        <Tag>
                            {fieldLabel}
                            <DateRenderer date={{ year, month, day }} />
                        </Tag>
                    );
                }
            }
            case 'date':
                if (value === 'present') {
                    return (
                        <Tag>
                            {fieldLabel}
                            {uniweb.activeWebsite.localize({ en: 'Present', fr: 'Présent' })}
                        </Tag>
                    );
                }
                const date = value.split('-').filter((time) => /\d/.test(time));
                return (
                    <Tag>
                        {fieldLabel}
                        <DateRenderer date={{ month: date[1], day: date[2], year: date[0] }} />
                    </Tag>
                );
            case 'elapsed-time':
                const [min, sec] = value.split(':');

                let minLabel = {};
                if (min == 1) {
                    minLabel = uniweb.activeWebsite.localize({
                        en: '1 minute',
                        fr: '1 minute',
                    });
                } else {
                    minLabel = uniweb.activeWebsite.localize({
                        en: `${min} minutes`,
                        fr: `${min} minutes`,
                    });
                }
                let secLabel = {};
                if (sec == 1) {
                    secLabel = uniweb.activeWebsite.localize({
                        en: '1 second',
                        fr: '1 seconde',
                    });
                } else {
                    secLabel = uniweb.activeWebsite.localize({
                        en: `${sec} seconds`,
                        fr: `${sec} secondes`,
                    });
                }

                return (
                    <Tag>
                        {fieldLabel}
                        {minLabel} {secLabel}{' '}
                    </Tag>
                );
            default:
                console.error('unhandled field type', field);
        }
    }

    return null;
};

const DateRenderer = ({ date }) => {
    const { year, month, day } = date;

    if (year && month && day)
        return `${uniweb.activeWebsite.localize([Months[month - 1]])} ${day}, ${year}`;
    else if (year && month) return `${uniweb.activeWebsite.localize([Months[month - 1]])} ${year}`;
    else if (month && day) return `${uniweb.activeWebsite.localize([Months[month - 1]])} ${day}`;
    else if (year) return `${year}`;

    return null;
};

const LovRenderer = ({ value, subtype, label }) => {
    switch (subtype) {
        case 'Yes-No':
            if (value === 'Yes') return label.replace('?', '');
            return '';
        default:
            return value;
    }
};
