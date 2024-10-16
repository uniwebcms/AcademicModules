import { convertToProfileData } from '../document';
import { Profile } from '@uniwebcms/module-sdk';

const buildTextNode = (content) => {
    let data = '';

    let linkStart = '';

    if (!content || !Array.isArray(content)) return data;

    content.forEach((item, i) => {
        const { text, marks = [] } = item;

        let isBold = marks.find((mark) => mark.type === 'bold');
        let isItalic = marks.find((mark) => mark.type === 'italic');

        let linkHref = marks.filter((mark) => mark.type === 'link')?.[0]?.attrs?.href;

        if (text) {
            let start =
                isBold && isItalic ? '<strong><em>' : isBold ? '<strong>' : isItalic ? '<em>' : '';

            if (!linkStart && linkHref) {
                start = `<a href="${linkHref}">` + start;
                linkStart = linkHref;
            }

            let end =
                isBold && isItalic
                    ? '</em></strong>'
                    : isBold
                    ? '</strong>'
                    : isItalic
                    ? '</em>'
                    : '';

            if (
                linkStart &&
                (i === content.length - 1 ||
                    (content[i + 1]?.marks || []).filter((mark) => mark.type === 'link')?.[0]?.attrs
                        ?.href !== linkStart)
            ) {
                linkStart = '';
                end += '</a>';
            }

            data += start + text + end;
        }
    });

    return data;
};

function parseCodeBlock(input = '') {
    if (input.startsWith('```')) {
        input = input.slice(3);

        const splitIndex = input.indexOf('\n');

        if (splitIndex !== -1) {
            const language = input.substring(0, splitIndex);
            const content = input.substring(splitIndex + 1);
            return {
                type: 'codeBlock',
                language,
                content,
            };
        }
    }
    return {
        type: 'codeBlock',
        content: input,
    };
}

const parseDate = (value) => {
    const [datePart, timePart] = value.split(' ');
    const [year, month, date] = datePart.split('/');
    let hours = null;
    let minutes = null;

    if (timePart) {
        let [hourStr, minuteStr] = timePart.split(':');
        hours = parseInt(hourStr, 10);
        minutes = parseInt(minuteStr, 10);
    }

    const dateValue = new Date(year, month - 1, date, hours || 0, minutes || 0);

    let options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    if (timePart) {
        options = {
            ...options,
            hour: 'numeric',
            minute: 'numeric',
        };
    }

    return dateValue.toLocaleDateString(uniweb.language(), options);
};

const parseDocument = (document, title, index) => {
    const { name, identifier: url } = document;
    const filename = title || name;

    const asset = {
        info: {
            max_item_count: 1,
            fields: {
                name: { type: 'localstr' },
                description: { type: 'localstr' },
                category: { type: 'string' },
                url: { type: 'localstr' },
                metadata: { type: 'json' },
            },
            items: [
                {
                    name: filename,
                    metadata: { url, filename },
                },
            ],
        },
    };

    let data = convertToProfileData(asset);
    const id = `document_${index}`;

    const profile = Profile.newProfile('webasset/profile', id, { data });

    if (profile.at('info').metadata.url) {
        return profile;
    } else {
        return null;
    }
};

export const buildArticleBlocks = (articleContent) => {
    const { content: docContent } = articleContent;

    if (!docContent || !docContent.length) return [];

    return docContent
        .map((block) => {
            const { type, content, attrs } = block;

            switch (type) {
                case 'paragraph':
                    if (!content) return null;

                    return {
                        type: 'paragraph',
                        content: buildTextNode(content),
                        alignment: attrs?.textAlign,
                    };
                case 'DividerBlock':
                    return {
                        type: 'divider',
                        dividerType: attrs?.type,
                    };
                case 'ImageBlock':
                    return {
                        type: 'image',
                        ...attrs,
                    };
                case 'Video':
                    return {
                        type: 'video',
                        src: block.src,
                        ...attrs,
                    };
                case 'heading':
                    const { level, id, textAlign } = attrs;
                    return {
                        type: 'heading',
                        content: buildTextNode(content),
                        level,
                        id,
                        alignment: textAlign,
                    };
                case 'blockquote':
                    return {
                        type,
                        content: buildArticleBlocks(block),
                    };
                case 'orderedList':
                case 'bulletList':
                    return {
                        type,
                        content: content.map((item) => {
                            return buildArticleBlocks(item);
                        }),
                    };
                case 'codeBlock':
                    return parseCodeBlock(content[0].text);
                case 'WarningBlock':
                    return {
                        type: type === 'WarningBlock' ? 'warning' : 'codeBlock',
                        content: buildTextNode(content),
                        attrs,
                    };
                case 'card-group':
                    return {
                        type,
                        content: content.map((item, i) => {
                            if (item.attrs.type === 'document') {
                                item.attrs.document = parseDocument(
                                    item.attrs.document,
                                    item.attrs.title,
                                    i
                                );
                            } else {
                                if (item.attrs.address) {
                                    try {
                                        const addressObj = JSON.parse(item.attrs.address);
                                        item.attrs.address = addressObj;
                                    } catch {}
                                }

                                if (item.attrs.date) {
                                    item.attrs.date = parseDate(item.attrs.date);
                                }
                                if (item.attrs.datetime) {
                                    item.attrs.datetime = parseDate(item.attrs.datetime);
                                }
                            }

                            return item;
                        }),
                    };
            }
        })
        .filter((item) => item);
};
