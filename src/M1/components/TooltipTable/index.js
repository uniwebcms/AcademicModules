import React from 'react';
import { ArticleRender, SafeHtml } from '@uniwebcms/core-components';
import { twJoin } from '@uniwebcms/module-sdk';
import { Tooltip } from 'react-tooltip';
import Container from '../_utils/Container';

const getFormContent = (content) => {
    const docContent = content.content;

    return docContent.find((item) => item.type === 'table')?.content;
};

const parseTableData = (content) => {
    const head = [],
        body = [];

    content.forEach((row, i) => {
        const { type, content: cells } = row;

        cells.forEach((cell, j) => {
            const { type, content, attrs } = cell;

            const [data, tooltip] = content;

            let cellContent, tooltipContent, isBold, isItalic;

            if (data) {
                const item = data.content.find((item) => item.type === 'text');
                cellContent = item?.text || '';
                isBold = item?.marks?.find((mark) => mark.type === 'bold');
                isItalic = item?.marks?.find((mark) => mark.type === 'italic');
                cellContent = data.content.find((item) => item.type === 'text')?.text || '';
            }

            if (tooltip) {
                tooltipContent = tooltip.content.find((item) => item.type === 'text')?.text || '';
            }

            if (i === 0) {
                head.push({
                    content: cellContent,
                    tooltip: tooltipContent,
                    style: {
                        fontWeight: isBold ? '700' : '500',
                        fontStyle: isItalic ? 'italic' : 'normal',
                    },
                });
            } else {
                if (!body[i - 1]) {
                    body[i - 1] = [];
                }
                body[i - 1].push({
                    content: cellContent,
                    tooltip: tooltipContent,
                    style: {
                        fontWeight: isBold ? '700' : '400',
                        fontStyle: isItalic ? 'italic' : 'normal',
                    },
                });
            }
        });
    });

    return { head, body };
};

export default function TooltipTable(props) {
    const { block } = props;

    const { featured_column = '' } = block.getBlockProperties();
    const { title, subtitle } = block.getBlockContent();

    const formContent = getFormContent(block.content);
    const { head, body } = parseTableData(formContent);

    return (
        <Container className="max-w-6xl mx-auto">
            {title || subtitle ? (
                <div className="text-center mb-10 lg:mb-16">
                    <h2 className="text-4xl font-bold mb-6">{title}</h2>
                    <p className="max-w-3xl mx-auto text-xl">{subtitle}</p>
                </div>
            ) : null}
            <table className="w-full ring-1 ring-neutral-300 rounded-xl overflow-hidden divide-y table-auto">
                <thead className="bg-heading-color/10">
                    <tr>
                        {head.map((cell, i) => (
                            <th
                                key={i}
                                className={twJoin(
                                    'px-6 py-4',
                                    Number(featured_column) === i + 1 ? 'bg-primary-100' : ''
                                )}
                            >
                                <span
                                    className={twJoin(
                                        'flex items-center gap-2',
                                        i === 0 ? 'justify-start' : 'justify-center'
                                    )}
                                >
                                    {cell && (
                                        <span className="text-heading-color" style={cell.style}>
                                            {cell.content}
                                        </span>
                                    )}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {body.map((row, i) => (
                        <tr key={i} className={'bg-neutral-50'}>
                            {row.map((cell, j) => (
                                <td
                                    key={j}
                                    className={twJoin(
                                        'px-6 py-4',
                                        Number(featured_column) === j + 1 ? 'bg-primary-100' : ''
                                    )}
                                >
                                    <span
                                        data-tooltip-id="table-tooltip"
                                        data-tooltip-content={cell.tooltip}
                                        className={twJoin(
                                            'flex items-center gap-2',
                                            j === 0 ? 'justify-start' : 'justify-center'
                                        )}
                                    >
                                        {cell && (
                                            <span className="font-medium" style={cell.style}>
                                                {cell.content}
                                            </span>
                                        )}
                                    </span>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <Tooltip
                id="table-tooltip"
                style={{
                    maxWidth: '240px',
                }}
                render={({ content, activeAnchor }) =>
                    content ? <SafeHtml as="span" value={content} /> : null
                }
            />
        </Container>
    );
}
