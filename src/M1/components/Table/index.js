import React from 'react';
import { SafeHtml, Icon } from '@uniwebcms/core-components';
import { twJoin } from '@uniwebcms/module-sdk';

export default function Table(props) {
    const { block } = props;
    const { lists } = block.getBlockContent();

    const { content_align = 'left' } = block.getBlockProperties();

    const cols = [],
        data = [],
        icons = [[]],
        columnCellClassName = [];

    if (lists[0]?.length) {
        lists[0].forEach((item, i) => {
            const head = item.paragraphs?.[0];
            if (item.icons?.[0]) {
                icons[0][i] = item.icons[0];
            }

            const cells = [];

            item.lists?.[0]?.forEach((row, j) => {
                cells[j] = row.paragraphs?.[0];

                if (row.icons?.[0]) {
                    if (!icons[j + 1]) {
                        icons[j + 1] = [];
                    }
                    icons[j + 1][i] = row.icons[0];
                }
            });

            cols[i] = [head, ...cells];
        });
    }

    for (let i = 0; i < cols.length; i++) {
        for (let j = 0; j < cols[i].length; j++) {
            if (!data[j]) {
                data[j] = [];
            }

            let value = cols[i][j];

            const calloutPattern = /style=["']\s*color:\s*var\(--callout\)\s*["']/i;
            const highlightPattern = /style=["']\s*background-color:\s*var\(--highlight\)\s*["']/i;

            if (calloutPattern.test(value)) {
                if (j === 0) {
                    columnCellClassName[i] = 'bg-[var(--callout,transparent)]';
                }
                value = value.replace(/ style=["']\s*color:\s*var\(--callout\)\s*["']/i, '');
            }

            if (highlightPattern.test(value)) {
                value = value.replace(
                    / style=["']\s*background-color:\s*var\(--highlight\)\s*["']/i,
                    ' class="bg-[var(--highlight,transparent)] px-2 py-1 rounded"'
                );
            }

            data[j][i] = value;
        }
    }

    const [head, ...body] = data;

    return (
        <div className="border border-neutral-200 shadow-xl rounded-lg overflow-hidden">
            <table className="w-full table-auto">
                <thead className="bg-neutral-950">
                    <tr>
                        {head.map((cell, i) => (
                            <th key={i} className="px-6 py-4">
                                <span
                                    className={twJoin(
                                        'flex items-center gap-2',
                                        content_align === 'center' && 'justify-center',
                                        content_align === 'right' && 'justify-end',
                                        content_align === 'left' && 'justify-start'
                                    )}
                                >
                                    {icons[0][i] ? (
                                        <Icon
                                            icon={icons[0][i]}
                                            className="w-4 h-4 flex-shrink-0 text-neutral-50"
                                        ></Icon>
                                    ) : null}
                                    {cell && (
                                        <SafeHtml
                                            value={cell}
                                            className="font-medium text-neutral-50"
                                        />
                                    )}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {body.map((row, i) => (
                        <tr key={i} className="bg-neutral-50">
                            {row.map((cell, j) => (
                                <td key={j} className={twJoin('px-6 py-4', columnCellClassName[j])}>
                                    <span
                                        className={twJoin(
                                            'flex items-center gap-2',
                                            content_align === 'center' && 'justify-center',
                                            content_align === 'right' && 'justify-end',
                                            content_align === 'left' && 'justify-start'
                                        )}
                                    >
                                        {icons[i + 1] && icons[i + 1][j] ? (
                                            <Icon
                                                icon={icons[i + 1][j]}
                                                className="w-4 h-4 flex-shrink-0 text-neutral-700"
                                            ></Icon>
                                        ) : null}
                                        {cell && (
                                            <SafeHtml
                                                as="span"
                                                value={cell}
                                                className="font-medium"
                                            />
                                        )}
                                    </span>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
