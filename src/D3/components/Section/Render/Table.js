import React from 'react';
import Render from './index';
import { twJoin } from '@uniwebcms/module-sdk';

export default function Table(props) {
    const { content } = props;

    return (
        <table className="border-collapse border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
            <tbody className="divide-y">
                {content.map((row, i) => {
                    const { content: rowContent } = row;

                    const tabRow = (
                        <tr key={i}>
                            {rowContent.map((cell, j) => {
                                const { type, content: cellContent, attrs } = cell;

                                return (
                                    <td
                                        key={j}
                                        colSpan={attrs.colspan}
                                        rowSpan={attrs.rowspan}
                                        className={twJoin(
                                            type === 'tableHeader'
                                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 font-semibold'
                                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300',
                                            'text-left px-3 py-0 [&>p]:my-3 [&_*_p]:my-3',
                                            'border border-slate-200 dark:border-slate-700'
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
    );
}
