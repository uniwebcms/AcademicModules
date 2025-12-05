import React, { useState, useRef, useEffect } from 'react'; // Added useRef, useEffect
import { twJoin } from '@uniwebcms/module-sdk';
import { Tooltip } from 'react-tooltip';
import Container from '../_utils/Container';

// ... (keep getFormContent and parseTableData helper functions exactly as they were) ...
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

    const [hoveredCell, setHoveredCell] = useState(null);

    // NEW: State for showing shadow
    const [showShadow, setShowShadow] = useState(false);
    // NEW: Ref for the scrollable container
    const tableContainerRef = useRef(null);

    // NEW: Effect to measure scroll capability
    useEffect(() => {
        const checkScrollable = () => {
            const el = tableContainerRef.current;
            if (el) {
                // If scrollWidth is larger than clientWidth, content is overflowing
                const isOverflowing = el.scrollWidth > el.clientWidth;
                setShowShadow(isOverflowing);
            }
        };

        // Check initially
        checkScrollable();

        // Watch for size changes (window resize or content change)
        const observer = new ResizeObserver(checkScrollable);
        if (tableContainerRef.current) {
            observer.observe(tableContainerRef.current);
        }

        return () => observer.disconnect();
    }, [head, body]); // Re-run if data changes

    // Reusable Shadow Class string
    const shadowClasses =
        "after:absolute after:top-0 after:right-0 after:bottom-0 after:w-4 after:translate-x-full after:bg-gradient-to-r after:from-neutral-400/10 after:to-transparent after:content-['']";

    return (
        <Container className="max-w-7xl mx-auto">
            {title || subtitle ? (
                <div className="text-center mb-10 lg:mb-16">
                    <h2 className="text-4xl font-bold mb-6">{title}</h2>
                    <p className="max-w-3xl mx-auto text-xl">{subtitle}</p>
                </div>
            ) : null}

            {/* Added ref={tableContainerRef} here */}
            <div
                ref={tableContainerRef}
                className="w-full overflow-x-auto ring-1 ring-neutral-300 rounded-xl relative"
            >
                <table className="w-full text-sm md:text-base divide-y table-auto min-w-max">
                    <thead>
                        <tr>
                            {head.map((cell, i) => {
                                const isStickyCol = i === 0;
                                const isFeatured = Number(featured_column) === i + 1;

                                return (
                                    <th
                                        key={i}
                                        className={twJoin(
                                            'px-6 py-5',
                                            isFeatured ? 'bg-primary-100/80' : 'bg-neutral-100',
                                            // STICKY LOGIC
                                            isStickyCol
                                                ? twJoin(
                                                      'sticky left-0 z-20',
                                                      // Only add shadow classes if showShadow is true
                                                      showShadow ? shadowClasses : ''
                                                  )
                                                : ''
                                        )}
                                    >
                                        <span
                                            className={twJoin(
                                                'flex items-center gap-2',
                                                i === 0 ? 'justify-start' : 'justify-center'
                                            )}
                                        >
                                            {cell && (
                                                <span
                                                    className="text-heading-color"
                                                    style={cell.style}
                                                >
                                                    {cell.content}
                                                </span>
                                            )}
                                        </span>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {body.map((row, i) => {
                            const isRowHovered = hoveredCell?.split('-')[0] === String(i);

                            return (
                                <tr key={i}>
                                    {row.map((cell, j) => {
                                        const isStickyCol = j === 0;
                                        const isFeatured = Number(featured_column) === j + 1;

                                        return (
                                            <td
                                                key={j}
                                                data-tooltip-id="table-tooltip"
                                                data-tooltip-content={cell.tooltip}
                                                className={twJoin(
                                                    'px-6 py-5',
                                                    // isFeatured && 'bg-primary-100/60',
                                                    isRowHovered
                                                        ? isFeatured
                                                            ? 'bg-primary-100/90'
                                                            : 'bg-neutral-50'
                                                        : isFeatured
                                                        ? 'bg-primary-100/60'
                                                        : 'bg-text-color-0',
                                                    cell.tooltip && 'cursor-help',
                                                    // STICKY LOGIC
                                                    isStickyCol
                                                        ? twJoin(
                                                              `sticky left-0 z-10`,
                                                              // Only add shadow classes if showShadow is true
                                                              showShadow ? shadowClasses : ''
                                                          )
                                                        : ''
                                                )}
                                                onMouseEnter={() => setHoveredCell(`${i}-${j}`)}
                                                onMouseLeave={() => setHoveredCell(null)}
                                            >
                                                <span
                                                    className={twJoin(
                                                        'flex items-center gap-2',
                                                        j === 0 ? 'justify-start' : 'justify-center'
                                                    )}
                                                >
                                                    {cell && (
                                                        <span
                                                            className="font-medium"
                                                            style={cell.style}
                                                        >
                                                            {cell.content}
                                                        </span>
                                                    )}
                                                </span>
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <Tooltip
                id="table-tooltip"
                style={{
                    maxWidth: '240px',
                    zIndex: 1000,
                }}
            />
        </Container>
    );
}
