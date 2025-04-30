import React from 'react';
import getFieldValue from '../utils/fieldValueParser';
import ReactDOMServer from 'react-dom/server';
import { isValidElement } from 'react';
import TextTruncator from '../../TextTruncator';
import styles from './html.module.scss';

export default function HTMLResolver(props) {
    const { '@': content, glue = ' ', taskSuffix = '', tag, style = {}, ...settings } = props;

    let markup = [];

    let markupFieldsIndexes = [];

    let fields = Array.isArray(content) ? content : [content];

    fields.forEach((field, index) => {
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

    let Tag = tag;

    if (markup.length) {
        if (tag) {
            if (taskSuffix) {
                return (
                    <>
                        <Tag dangerouslySetInnerHTML={{ __html: markup.join('') }} style={style} />
                        {tag === 'span' ? <span className="text-gray-600">{taskSuffix}</span> : ''}
                    </>
                );
            } else {
                return (
                    <TextTruncator
                        text={markup.join('')}
                        maxLine={3}
                        style={style}
                        tag={tag}
                        className={styles.HtmlRenderer}
                        controlColor="blue"
                        controlClassName="!mt-0 !mb-1"
                    />
                );
            }
        }
    }

    return null;
}

// export function EMResolver(props) {
//     const { '@': content, ...settings } = props;

//     let markup = [];

//     let fields = Array.isArray(content) ? content : [content];

//     fields.forEach((field, index) => {
//         const fieldValue = getFieldValue(field, settings);
//         if (fieldValue) {
//             markup.push(<Fragment key={index}>{fieldValue}</Fragment>);
//         }
//     });

//     if (markup.length)
//         return (
//             <em>
//                 {markup.map((m, index) => (
//                     <React.Fragment key={index}>{m}</React.Fragment>
//                 ))}
//             </em>
//         );

//     return null;
// }

// export function DivResolver(props) {
//     const { '@': content, ...settings } = props;

//     let markup = [];

//     let fields = Array.isArray(content) ? content : [content];

//     fields.forEach((field, index) => {
//         const fieldValue = getFieldValue(field, settings);
//         if (fieldValue) {
//             markup.push(<Fragment key={index}>{fieldValue}</Fragment>);
//         }
//     });

//     if (markup.length)
//         return (
//             <div>
//                 {markup.map((m, index) => (
//                     <React.Fragment key={index}>{m}</React.Fragment>
//                 ))}
//             </div>
//         );

//     return null;
// }
