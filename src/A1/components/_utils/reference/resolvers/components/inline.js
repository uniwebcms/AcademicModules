import React from 'react';
import getFieldValue from '../utils/fieldValueParser';
import ReactDOMServer from 'react-dom/server';
import { isValidElement } from 'react';

export default function InlineResolver(props) {
    const { '@': content, glue = ' ', groupSuffix = '', ...settings } = props;

    let markup = [];

    let markupFieldsIndexes = [];

    let fields = Array.isArray(content) ? content : [content];

    fields.forEach((field) => {
        if (isValidElement(field)) markupFieldsIndexes.push(index);
        const fieldValueMarkup = ReactDOMServer.renderToStaticMarkup(
            getFieldValue(field, settings)
        );
        if (fieldValueMarkup) {
            markup.push(fieldValueMarkup);
        }
    });

    markup.forEach((m, index) => {
        if (!markupFieldsIndexes.includes(index) && index < markup.length - 1) {
            markup[index] = m + glue;
        }
    });

    if (markup.length) {
        return (
            <>
                (<span dangerouslySetInnerHTML={{ __html: markup.join('') }} />){groupSuffix}
            </>
        );
    }

    return null;
}
