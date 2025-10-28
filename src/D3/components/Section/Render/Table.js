import React from 'react';
import Render from './index';
import { twJoin } from '@uniwebcms/module-sdk';

export default function Table(props) {
    const { content } = props;

    return (
        <div className="my-[2em] border-[length:var(--depth-style-outline)] rounded-[var(--border-radius)] [box-shadow:var(--depth-style-shadow)] border-text-color/30 overflow-hidden">
            <table className="!my-0 table-collapse">
                <tbody>
                    {content.map((row, i) => {
                        const { content: rowContent } = row;

                        const tabRow = (
                            <tr
                                key={i}
                                className="divide-x divide-text-color/30 border-b border-text-color/30"
                            >
                                {rowContent.map((cell, j) => {
                                    const { type, content: cellContent, attrs } = cell;

                                    return (
                                        <td
                                            key={j}
                                            colSpan={attrs.colspan}
                                            rowSpan={attrs.rowspan}
                                            className={twJoin(
                                                type === 'tableHeader'
                                                    ? 'bg-text-color-5 [&>p]:text-heading-color font-semibold'
                                                    : 'bg-text-color-0 [&>p]:text-text-color',
                                                'text-left px-3 py-0 [&>p]:my-3 [&_*_p]:my-3'
                                            )}
                                        >
                                            <Render content={cellContent} />
                                        </td>
                                    );
                                })}
                            </tr>
                        );

                        return tabRow;
                    })}
                </tbody>
            </table>
        </div>
    );
}
