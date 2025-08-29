import React from 'react';
import { twJoin, website } from '@uniwebcms/module-sdk';
import { Icon, Link } from '@uniwebcms/core-components';
import { BsArrowRightShort } from 'react-icons/bs';

const parseTableData = (firstCol, items) => {
    const restCols = items.map((item) => item.lists[0]);
    const cols = [firstCol, ...restCols];

    const data = [];
    let count = 0;

    cols.forEach((col, cI) => {
        col.forEach((cell, j) => {
            const { paragraphs, lists } = cell;
            const sectionTitle = paragraphs[0] || '';

            if (cI === 0) {
                data.push([
                    {
                        text: sectionTitle,
                        type: 'section',
                    },
                ]);

                lists[0].forEach((listItem) => {
                    data.push([
                        {
                            text: listItem.paragraphs[0] || '',
                            type: 'section-item',
                        },
                    ]);
                });
            } else {
                data[count][cI] = {
                    text: sectionTitle,
                    type: 'section',
                };

                count++;

                lists[0].forEach((listItem) => {
                    data[count][cI] = {
                        text: listItem.paragraphs[0] || '',
                        icon: listItem.icons[0] || null,
                        type: 'section-item',
                    };

                    count++;
                });
            }
        });

        count = 0;
    });

    return data;
};

const HeaderCell = ({ text, link }) => {
    if (!text && !link) return null;

    return (
        <div className="flex flex-col items-center m-px rounded-t-md px-4 pt-3 pb-2 bg-gradient-to-b from-neutral-100 from-[90%] to-transparent">
            <p className="text-xl">{text}</p>
            {link && (
                <Link
                    to={website.makeHref(link.href)}
                    className="flex w-full items-center justify-center p-3 mt-3 bg-neutral-950 text-neutral-50 rounded-md text-base group"
                >
                    <span className="truncate">{link.label}</span>
                    <BsArrowRightShort className="w-5 h-5 ml-1 group-hover:translate-x-1 transform transition-transform duration-100 flex-shrink-0" />
                </Link>
            )}
        </div>
    );
};

const SectionCell = ({ text, rowIndex }) => {
    if (!text) return null;
    return (
        <div className={twJoin(rowIndex > 1 ? 'pt-8' : '', 'pb-2')}>
            <p className="text-lg">{text}</p>
        </div>
    );
};

const ItemCell = ({ text, icon, isFirstCol }) => {
    return (
        <div className={twJoin('py-3 min-h-10', isFirstCol ? '' : 'text-center')}>
            <p className="text-sm font-light">{text}</p>
            {icon && <Icon icon={icon} className="w-5 h-5 mx-auto" />}
        </div>
    );
};

export default function PricingComparison(props) {
    const { block, website } = props;

    const { title, lists } = block.getBlockContent();
    const items = block.getBlockItems();

    const tableData = parseTableData(lists[0], items);

    tableData.unshift([
        { text: '', type: 'header' },
        ...items.map((item) => ({
            text: item.title || '',
            type: 'header',
            link: item.links[0],
        })),
    ]);

    // add a empty tail row for ui uniformity
    tableData.push(
        Array.from({ length: items.length + 1 }, () => ({ text: '', type: 'section-item' }))
    );

    const columnCount = items.length + 1; // +1 for the first column

    return (
        <div className="pt-[60px] pb-10 px-6">
            <div className="max-w-[1400px] mx-auto">
                <div className="text-center">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl">{title}</h2>
                </div>
                <div
                    id="pricing-comparison-table"
                    className="relative mt-12 overflow-x-auto"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                >
                    <div className="relative" style={{ minWidth: `${columnCount * 200}px` }}>
                        {/* Background Column Layout */}
                        <div
                            className="absolute inset-0 z-0 grid gap-4"
                            style={{
                                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                            }}
                        >
                            {Array.from({ length: columnCount }).map((_, colIndex) => (
                                <div
                                    key={colIndex}
                                    className={
                                        colIndex === 0
                                            ? ''
                                            : 'bg-neutral-100 shadow border rounded-md'
                                    }
                                />
                            ))}
                        </div>
                        <div className="relative z-10">
                            {/* Table Rows */}
                            <div className="">
                                {tableData.map((row, rowIndex) => {
                                    const isHeaderRow = rowIndex === 0 || row[0].type === 'section';
                                    const isTailRow = rowIndex === tableData.length - 1;

                                    return (
                                        <div
                                            key={rowIndex}
                                            className={twJoin(
                                                'grid gap-4',
                                                !isHeaderRow &&
                                                    !isTailRow &&
                                                    'border-b border-dashed',
                                                rowIndex === 0 && 'sticky top-0 z-10'
                                            )}
                                            style={{
                                                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                                            }}
                                        >
                                            {row.map((cell, colIndex) => {
                                                const isFirstCol = colIndex === 0;
                                                const stickyClass = isFirstCol
                                                    ? twJoin(
                                                          'sticky left-0 bg-bg-color',
                                                          isHeaderRow ? 'z-30' : 'z-20'
                                                      )
                                                    : '';

                                                return (
                                                    <div key={colIndex} className={stickyClass}>
                                                        {cell.type === 'header' && (
                                                            <HeaderCell
                                                                text={cell.text}
                                                                link={cell.link}
                                                            />
                                                        )}
                                                        {cell.type === 'section' && (
                                                            <SectionCell
                                                                text={cell.text}
                                                                rowIndex={rowIndex}
                                                            />
                                                        )}
                                                        {cell.type === 'section-item' && (
                                                            <ItemCell
                                                                text={cell.text}
                                                                icon={cell.icon}
                                                                isFirstCol={isFirstCol}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
