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
            }
        })
        .filter((item) => item);
};
