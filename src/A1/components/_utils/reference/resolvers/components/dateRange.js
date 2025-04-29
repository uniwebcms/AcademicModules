import React from 'react';
import getFieldValue from '../utils/fieldValueParser';

export default function DateRangeResolver(props) {
    const { '@': fields, start, mid, end, groupSuffix = '', ...settings } = props;

    let end_field = end || {
        type: start?.type || mid?.type,
    };

    if (start?.value || mid?.value) {
        if (!end_field.value) end_field.value = 'present';
    }

    const startField = getFieldValue(start, settings);
    const endField = getFieldValue(end_field, settings);
    const midField = getFieldValue(mid, settings);

    const markup = [];

    if (startField) {
        markup.push(startField);
    }
    if (midField) {
        markup.push(midField);
    }
    if (endField) {
        markup.push(endField);
    }

    if (markup.length)
        return (
            <span>
                (
                {markup.map((m, index) => (
                    <React.Fragment key={index}>
                        {m}
                        {index < markup.length - 1 ? ' - ' : ''}
                    </React.Fragment>
                ))}
                ){groupSuffix}
            </span>
        );

    return null;
}
