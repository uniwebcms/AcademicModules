export const fieldValueParser = (field) => {
    const { type, value, other_values } = field;
    if (!value || (Array.isArray(value) && value.length === 0)) return null;

    switch (type) {
        case 'bilingual': {
            const primaryLanguage = uniweb.language();
            const parsedValue = [];

            if (value[primaryLanguage]) {
                parsedValue.push({ lang: '', langVal: value[primaryLanguage] });
            }
            Object.keys(value).forEach((lang) => {
                if (lang !== primaryLanguage) {
                    parsedValue.push({ lang, langVal: value[lang] });
                }
            });
            return parsedValue;
        }
        case 'localstr': {
            const { '@': metadata, ...fieldValue } = value;
            let primaryLanguage = uniweb.language();

            if (metadata) {
                Object.entries(metadata).forEach(([key, value]) => {
                    if (value.isSource) primaryLanguage = key;
                });
            }

            const parsedValue = [];

            if (fieldValue[primaryLanguage]) {
                parsedValue.push({ lang: '', langVal: fieldValue[primaryLanguage] });
            }
            Object.keys(fieldValue).forEach((lang) => {
                if (lang !== primaryLanguage) {
                    parsedValue.push({ lang, langVal: fieldValue[lang] });
                }
            });
            return parsedValue.length ? parsedValue : null;
        }
        case 'profile':
        case 'lov':
        case 'reftable':
        case 'systable': {
            const noOtherValue = (other_values) => other_values.every((val) => val === '');

            if (noOtherValue) {
                return [value];
            } else {
                return [value, ...other_values];
            }
        }
        case 'elapsed-time': {
            const time = value.split(':').filter((time) => /\d/.test(time));
            return { min: time[0], sec: time[1] };
        }
        case 'address': {
            const { formatted_address, geometry } = value;
            return { formatted_address, location: geometry.location };
        }
        case 'year':
        case 'yearmonth':
        case 'monthday': {
            const date = value.split('/').filter((time) => /\d/.test(time));
            if (date.length === 3) {
                return { month: date[1], day: date[2], year: date[0] };
            } else if (date.length === 2) {
                if (type !== 'monthday') {
                    return { month: date[1], year: date[0] };
                }
                return { month: date[1], day: date[0] };
            } else {
                return { year: date[0] };
            }
        }
        case 'date':
            const date = value.split('-').filter((time) => /\d/.test(time));
            return { month: date[1], day: date[2], year: date[0] };
        case 'hourminute': {
            const time = value.split(':').filter((time) => /\d/.test(time));

            const pageLanguage = uniweb.language();
            let hour;
            let min;
            let meridiem;

            if (time.length === 2) {
                if (pageLanguage === 'en') {
                    min = ('0' + time[1].toString()).slice(-2);
                    meridiem = time[0] < 12 ? 'AM' : 'PM';
                    hour = time[0] % 12 || 12;
                    return { hour, min, meridiem };
                } else {
                    hour = ('0' + time[0].toString()).slice(-2);
                    min = ('0' + time[1].toString()).slice(-2);
                    return { hour, min, meridiem: '' };
                }
            }
        }
        default:
            return value;
    }
};
