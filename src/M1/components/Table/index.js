import React from 'react';

export default function Table(props) {
    const { block } = props;
    const { lists } = block.getBlockContent();

    const cols = [],
        data = [];

    if (lists[0]?.length) {
        lists[0].forEach((item, i) => {
            const head = item.paragraphs?.[0];

            const cells = item.lists?.[0]?.map((row) => {
                return row.paragraphs?.[0];
            });

            cols[i] = [head, ...cells];
        });
    }

    for (let i = 0; i < cols.length; i++) {
        for (let j = 0; j < cols[i].length; j++) {
            if (!data[j]) {
                data[j] = [];
            }

            data[j][i] = cols[i][j];
        }
    }

    const colCellClassName = ['font-medium', 'text-sm bg-orange-50 px-2 py-1 rounded'];

    return (
        <div className="overflow-hidden rounded-xl shadow-lg border border-text-color/10">
            <table className="w-full">
                <thead className="bg-text-color/80">
                    <tr>
                        {cols.map((col, i) => (
                            <th
                                key={i}
                                className="px-6 py-4 text-left text-sm font-medium text-bg-color"
                            >
                                {col[0]}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {data.map((row, i) =>
                        i > 0 ? (
                            <tr key={i} className="bg-bg-color hover:bg-text-color/10">
                                {row.map((cell, j) => (
                                    <td key={j} className="px-6 py-4">
                                        <span
                                            className={
                                                colCellClassName[j] ? colCellClassName[j] : ''
                                            }
                                        >
                                            {cell}
                                        </span>
                                    </td>
                                ))}
                            </tr>
                        ) : null
                    )}
                </tbody>
            </table>
        </div>
    );
}
