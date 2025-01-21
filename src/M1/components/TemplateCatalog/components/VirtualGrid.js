import React, { useMemo, useRef } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import ItemCard from './ItemCard';

// Main Virtual Grid Component
const VirtualGrid = ({ data, filters }) => {
    const virtuosoRef = useRef(null);

    // Memoized filtered and sorted data
    const filteredData = useMemo(() => {
        const { sort, searchText, ...actualFilters } = filters;

        // Step 1: Apply actual filters
        const filteredData = data.filter((item) => {
            // Check each actual filter key, Pass if filter value is 'all'
            return Object.entries(actualFilters).every(
                ([key, value]) => value === 'all' || item[key] === value
            );
        });

        // Step 2: Apply searchText filter
        const searchFilteredData = filteredData.filter((item) => {
            if (searchText) {
                return item.searchText.toLowerCase().includes(searchText.toLowerCase());
            }
            return true; // Pass if no searchText is specified
        });

        // Step 3: Apply sorting
        const sortedData = searchFilteredData.sort((a, b) => {
            switch (sort) {
                case 'newest':
                    if (!a.lastEdit || !b.lastEdit) return 0;
                    const dateA = new Date(a.lastEdit.replace(' ', 'T'));
                    const dateB = new Date(b.lastEdit.replace(' ', 'T'));
                    return dateB - dateA; // Newest first
                case 'popularity':
                    return b.popularity - a.popularity; // Highest popularity first
                case 'alphabetical':
                    return a.title.localeCompare(b.title); // Alphabetical order
                default:
                    return 0; // No sorting
            }
        });

        return sortedData;
    }, [data, filters]);

    if (data.length && !filteredData.length) {
        return (
            <div className="text-center mt-12 px-4 py-6 rounded-xl bg-neutral-100 border">
                <p className="text-neutral-500 italic">No result match your criteria</p>
            </div>
        );
    }

    return (
        <VirtuosoGrid
            ref={virtuosoRef}
            useWindowScroll
            data={filteredData}
            overscan={900}
            itemContent={(index, item) => <ItemCard item={item} index={index} />}
            listClassName="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-6 md:gap-8 lg:gap-12"
            itemClassName="h-full"
        />
    );
};

export default VirtualGrid;
