import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    Grid,
    AutoSizer,
    WindowScroller,
    CellMeasurer,
    CellMeasurerCache,
} from 'react-virtualized';
import 'react-virtualized/styles.css';

const CardItem = (props) => {
    const { ItemMarkup, itemProps = {}, cardArgs, measure } = props;

    useEffect(() => {
        if (measure) measure();
    }, []);

    const { isGroupHeader, groupName, isGroupFakeItem } = itemProps;
    if (isGroupHeader) {
        let title = groupName.replace('_', ' ');
        return (
            <div className={`w-full mb-6`}>
                <div className={`w-full text-lg font-bold capitalize`}>{title}</div>
            </div>
        );
    } else if (isGroupFakeItem) {
        return <div className={`w-full mb-6`}></div>;
    }

    return (
        <div className={`w-full mb-6`}>
            <ItemMarkup {...itemProps} {...cardArgs} measure={measure}></ItemMarkup>
        </div>
    );
};

export default function SmartCards(props) {
    const {
        cards,
        ItemMarkup,
        filters = null,
        histograms = {},
        cardArgs = {},
        columnCount = 2,
        GUTTER_SIZE = 20,
        columnWidth = null,
        sorting = '',
        sort = null,
        groups,
    } = props;

    const [data, setData] = useState([]);

    const sortField = sort?.field;
    const sortOrder = sort?.order;

    useEffect(() => {
        let result = [];
        let topGroups = ['journal_articles', 'Professor', 'Professeur'];

        if (groups) {
            Object.keys(groups)
                .sort((a, b) => {
                    // Place 'journal' key first
                    if (topGroups.includes(a)) return -1;
                    if (topGroups.includes(b)) return 1;

                    // Sort the remaining keys alphabetically
                    if (a < b) return -1;
                    if (a > b) return 1;
                    return 0;
                })
                .forEach((group) => {
                    let items = groups[group];

                    if (filters) {
                        items = items.filter((item) => {
                            for (let i in filters) {
                                if (histograms[i]) {
                                    let selected = filters[i] || '';

                                    if (selected) {
                                        let selectedCards = histograms[i][selected];

                                        if (!selectedCards.includes(item.contentId)) return false;
                                    }
                                } else {
                                    let val = item?.[i] || '';

                                    if (!val.toLowerCase().includes(filters[i].toLowerCase()))
                                        return false;
                                }
                            }

                            return true;
                        });
                    }

                    if (sorting) {
                        items.sort((a, b) => {
                            switch (sorting) {
                                case 'a-z':
                                    return a.title.localeCompare(b.title);
                                case 'z-a':
                                    return b.title.localeCompare(a.title);
                            }
                        });
                    }

                    if (sortField && sortOrder) {
                        items.sort((a, b) => {
                            let aField = a?.[sortField] || '';
                            let bField = b?.[sortField] || '';

                            aField =
                                typeof aField.toString === 'function' ? aField.toString() : aField;
                            bField =
                                typeof bField.toString === 'function' ? bField.toString() : bField;

                            if (sortOrder === 'asc') {
                                return aField > bField ? 1 : -1;
                            } else {
                                return aField < bField ? 1 : -1;
                            }
                        });
                    }

                    if (items.length) {
                        let groupHeaders = [
                            {
                                groupName: group,
                                isGroupHeader: true,
                            },
                        ];

                        for (let i = 1; i < columnCount; i++)
                            groupHeaders.push({ groupName: '', isGroupHeader: true });

                        result = [...result, ...groupHeaders, ...items];

                        if (columnCount > 1) {
                            let currentItemsCount = result.length;
                            if (currentItemsCount % columnCount !== 0) {
                                const fakeItemsToInsert =
                                    columnCount - (currentItemsCount % columnCount);
                                for (let j = 0; j < fakeItemsToInsert; j++) {
                                    result.push({ isGroupFakeItem: true });
                                }
                            }
                        }
                    }
                });
        } else {
            result = cards;
        }

        setData(result);
    }, [filters, sorting, sortField, sortOrder, groups, columnCount, cards]);

    const cache = useRef(
        new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 56,
        })
    ).current;

    const gridRef = useRef();
    const containerRef = useRef();

    const handleRef = useCallback((ref) => {
        if (ref !== null) {
            ref.scrollToPosition = (scrollTop) => {
                window.scrollTo({ top: scrollTop });
            };

            ref.scrollToRow = (rowIndex) => {
                const scrollTop = ref.getOffsetForCell({ rowIndex, columnIndex: 0 });
                const top = containerRef.current.getBoundingClientRect().top;

                window.scrollTo({ top: scrollTop.scrollTop + top });
            };
        }
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (gridRef.current) {
                const scrollTop = uniweb.getPageState('scrollTop', 0);

                setTimeout(() => {
                    gridRef.current.scrollToPosition(scrollTop);
                }, 20);
            }
        }, 20);

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [data.length]);

    if (!data.length) return null;

    if (data.length < 10 && columnCount === 1) {
        return (
            <div className={`flex flex-col w-full`}>
                {data.map((item, index) => (
                    <CardItem
                        key={index}
                        itemProps={item}
                        ItemMarkup={ItemMarkup}
                        cardArgs={cardArgs}
                    ></CardItem>
                ))}
            </div>
        );
    }

    const measuredHeight = {};

    let Cell = ({ columnIndex, key, parent, rowIndex, style, registerChild, index: keyIndex }) => {
        const index = keyIndex || rowIndex * parent.props.columnCount + columnIndex;

        let item = data[index] || null;

        columnIndex = columnIndex || 0;

        if (!item) return null;

        return (
            <CellMeasurer
                cache={cache}
                columnIndex={columnIndex}
                key={key}
                parent={parent}
                rowIndex={index}
            >
                {({ measure }) => (
                    <div
                        key={key}
                        ref={() => {
                            // if (!measuredHeight[key]) {
                            //     setTimeout(() => {
                            //         measuredHeight[key] = true;
                            //         console.log('measuring');
                            //         measure();
                            //     }, 0);
                            // }
                        }}
                        style={style}
                    >
                        <CardItem
                            itemProps={item}
                            ItemMarkup={ItemMarkup}
                            cardArgs={cardArgs}
                            measure={measure}
                        ></CardItem>
                    </div>
                )}
            </CellMeasurer>
        );
    };

    const rowCount = Math.ceil(data.length / columnCount);

    // const gridClass = css`
    //     & > .ReactVirtualized__Grid__innerScrollContainer {
    //         width: inherit !important;
    //         max-width: 100% !important;
    //     }
    // `;

    // const getItemSize = (itemProps) => {
    //     let { index } = itemProps;

    //     if (columnCount > 1) {
    //         index = index * columnCount;
    //     }
    //     const item = data[index] || {};

    //     const { isGroupHeader } = item;

    //     let result = '';
    //     if (isGroupHeader && height) {
    //         result = 30;
    //     } else result = height ? height + GUTTER_SIZE : 80; // Default height

    //     return result;
    // };

    return (
        <WindowScroller>
            {({ height: scrollerHeight, isScrolling, registerChild, onChildScroll, scrollTop }) => (
                <div className={`w-full flex-1`} ref={containerRef}>
                    <AutoSizer disableHeight>
                        {({ width: boxW }) => {
                            const colW =
                                columnWidth &&
                                columnWidth * columnCount + (columnCount - 1) * GUTTER_SIZE < boxW
                                    ? columnWidth
                                    : Math.ceil(
                                          (boxW - (columnCount - 1) * GUTTER_SIZE) / columnCount
                                      );

                            return (
                                <div ref={registerChild}>
                                    <Grid
                                        ref={(el) => {
                                            handleRef(el);
                                            gridRef.current = el;
                                        }}
                                        // className={tw`${gridClass}`}
                                        autoHeight
                                        height={scrollerHeight}
                                        width={boxW + columnCount - 1}
                                        rowCount={rowCount}
                                        columnCount={columnCount}
                                        rowHeight={cache.rowHeight}
                                        columnWidth={colW}
                                        cellRenderer={Cell}
                                        isScrolling={isScrolling}
                                        onScroll={onChildScroll}
                                        scrollTop={scrollTop}
                                        overscanRowCount={0}
                                    />
                                </div>
                            );
                        }}
                    </AutoSizer>
                </div>
            )}
        </WindowScroller>
    );
}
