import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Profile, twJoin } from '@uniwebcms/module-sdk';
import { Icon } from '@uniwebcms/core-components';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const buildTextNode = (content, headingLevel = 0) => {
    let data = '';

    let linkStart = '';

    if (!content || !Array.isArray(content)) return data;

    content.forEach((item, i) => {
        const { type, text, marks = [] } = item;

        let isBold = marks.find((mark) => mark.type === 'bold');
        let isItalic = marks.find((mark) => mark.type === 'italic');
        let isHighlight = marks.find((mark) => mark.type === 'highlight');

        const textColor = marks.find((mark) => mark.type === 'textStyle')?.attrs?.color;

        let linkProps = marks.filter((mark) => mark.type === 'link')?.[0]?.attrs;

        let linkHref = linkProps?.href;

        let textStyle = '';

        if (isHighlight) {
            textStyle += 'background-color: var(--highlight);';
        }

        if (textColor) {
            textStyle += `color: var(--${textColor});`;
        }

        textStyle = textStyle ? `style="${textStyle}"` : '';

        if (text) {
            let start =
                isBold && isItalic
                    ? `<strong><em ${textStyle}>`
                    : isBold
                    ? `<strong ${textStyle}>`
                    : isItalic
                    ? `<em ${textStyle}>`
                    : textStyle
                    ? `<span ${textStyle}>`
                    : '';

            if (!linkStart && linkHref) {
                const external =
                    linkHref.includes('https:') ||
                    linkHref.startsWith('mailto:') ||
                    linkHref.includes('http:');

                const fileExtensions = [
                    'pdf',
                    'doc',
                    'docx',
                    'xls',
                    'xlsx',
                    'ppt',
                    'pptx',
                    'jpg',
                    'svg',
                    'jpeg',
                    'png',
                    'webp',
                    'gif',
                    'mp4',
                    'mp3',
                    'wav',
                    'mov',
                ];

                // Extract the extension from the href
                const extension = linkHref.split('.').pop().toLowerCase();

                // Check if the extracted extension matches any known file extensions
                const isFileLink = fileExtensions.includes(extension);

                start =
                    `<a href="${linkHref}"${external ? ' target="_blank"' : ''}${
                        isFileLink
                            ? ` download onclick="event.preventDefault(); uniweb.downloadFile('${linkHref}');return false;"`
                            : ''
                    }>` + start;

                linkStart = linkHref;
            }

            let end =
                isBold && isItalic
                    ? '</em></strong>'
                    : isBold
                    ? '</strong>'
                    : isItalic
                    ? '</em>'
                    : textStyle
                    ? '</span>'
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

        if (type === 'math_inline' && item.content?.[0]?.text) {
            const math = <InlineMath math={item.content[0].text} />;

            const mathHtml = ReactDOMServer.renderToStaticMarkup(math);

            data += mathHtml;
        } else if (type === 'emoji') {
            if (item.attrs?.emoji) {
                data += item.attrs.emoji;
            }
        } else if (type === 'UniwebIcon') {
            const className = [
                headingLevel === 1 && 'w-7 h-7',
                headingLevel === 2 && 'w-[26px] h-[26px] pt-1',
                headingLevel === 3 && 'w-5 h-5 pt-1',
                headingLevel === 0 && 'w-5 h-5 pt-1',
            ].filter(Boolean);

            const icon = <Icon icon={item.attrs} className={twJoin('inline-block', className)} />;
            const iconHtml = ReactDOMServer.renderToStaticMarkup(icon);
            data += iconHtml;
        }
    });

    return data;
};

function parseCodeBlock(input = '', attrs) {
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
        language: attrs?.language,
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

function parseTableContent(content) {
    return content.map((row) => {
        const { type, content: rowContent } = row;

        return {
            type,
            content: rowContent.map((cell) => {
                const { type, attrs } = cell;

                return {
                    type,
                    content: buildArticleBlocks(cell),
                    attrs,
                };
            }),
        };
    });
}

export const buildArticleBlocks = (articleContent) => {
    const { content: docContent } = articleContent;

    if (!docContent || !docContent.length) return [];

    return docContent
        .map((block) => {
            const { type, content, attrs } = block;

            switch (type) {
                case 'paragraph':
                    // make empty paragraph available, users may expect to use that to control spacing
                    // if (!content) return null;

                    return {
                        type: 'paragraph',
                        content: content ? buildTextNode(content) : '<span>&nbsp;</span>',
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
                        content: buildTextNode(content, level),
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
                    return parseCodeBlock(content[0].text, attrs);
                case 'WarningBlock':
                    return {
                        type: type === 'WarningBlock' ? 'warning' : 'codeBlock',
                        content: buildTextNode(content),
                        attrs,
                    };
                case 'card-group':
                    return {
                        type,
                        content:
                            content?.map((item, i) => {
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
                            }) || [],
                    };
                case 'math_display':
                    return {
                        type: 'math_display',
                        content: content[0].text,
                    };
                case 'button':
                    return {
                        type: 'button',
                        content: buildTextNode(content),
                        attrs,
                    };
                case 'table':
                    return {
                        type: 'table',
                        content: parseTableContent(content),
                        attrs,
                    };
                case 'details': {
                    return {
                        type: 'details',
                        content: content.map((item) => {
                            const { type, content } = item;

                            console.log('details item', item);

                            return {
                                type,
                                content:
                                    type === 'detailsSummary'
                                        ? content[0].text
                                        : buildArticleBlocks(item),
                            };
                        }),
                        attrs,
                    };
                }
            }
        })
        .filter((item) => item);
};

const convertToProfileData = (sections) => {
    let counter = 0;

    Object.entries(sections).forEach(([sectionName, section]) => {
        // Ensure defaults for missing properties using the nullish assignment operator
        section.section_id = ++counter;
        section.has_fields = 1;
        section.name ??= sectionName;
        section.label ??= sectionName;
        section.subsections ??= {};
        section.fields ??= {};
        section.items ??= [];

        // Enhance fields with name and label
        Object.entries(section.fields).forEach(([key, field]) => {
            field.name ??= key;
            field.label ??= key;
            field.field_id = key; // We could use numbers, but this seems easier
        });

        const items = section.items.map((item, index) => {
            const id = `${sectionName}_${index}`;
            const attributes = item._attributes_ || {};
            delete item._attributes_; // Remove _attributes_ from the original item
            return { id, values: item, attributes };
        });

        section.items = items;
    });

    return Object.values(sections);
};
