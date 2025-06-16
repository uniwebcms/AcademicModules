import React, { useMemo, useRef, useState } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import ItemCard from './ItemCard';
import { website } from '@uniwebcms/module-sdk';

// Main Virtual Grid Component
const VirtualGrid = ({ data, filters }) => {
    const [schemaMap, setSchemaMap] = useState({});
    const virtuosoRef = useRef(null);
    const schemaCache = useRef(new Map());

    const getSchema = async (url) => {
        if (!url || schemaCache.current.has(url)) return schemaCache.current.get(url);

        const fetchPromise = (async () => {
            try {
                const versionText = await fetch(`${url}/latest_version.txt`).then((res) =>
                    res.text()
                );
                const version = versionText.split('\n')[0].trim();
                const schema = await fetch(`${url}/${version}/schema.json`).then((res) =>
                    res.json()
                );

                Object.keys(schema).forEach((key) => {
                    if (key === '_self') return;

                    let imageSrc = null;
                    if (schema[key].images?.length > 0) {
                        schema[key].images.forEach((image) => {
                            image.src = `${url}/${version}/${image.path}`;
                        });

                        imageSrc = schema[key].images[0].src;
                    }

                    if (schema[key].presets?.length > 0) {
                        schema[key].presets.forEach((preset) => {
                            preset.image.src = `${url}/${version}/${preset.image.path}`;
                        });

                        if (!imageSrc) {
                            imageSrc = schema[key].presets[0].image.src;
                        }
                    }

                    // let imageSrc;
                    // if (schema[key].images?.length > 0) {
                    //     imageSrc = `${url}/${version}/${schema[key].images[0].path}`;
                    // } else if (schema[key].presets?.length > 0) {
                    //     imageSrc = `${url}/${version}/${schema[key].presets[0].image.path}`;
                    // }
                    schema[key].image = imageSrc ? { src: imageSrc } : null;
                });

                setSchemaMap((prev) => ({ ...prev, [url]: schema }));
                return schema;
            } catch (error) {
                // console.error(`Failed to fetch schema for ${url}:`, error);
                return null;
            }
        })();

        schemaCache.current.set(url, fetchPromise);
        return fetchPromise;
    };

    // Memoized filtered and sorted data
    const filteredData = useMemo(() => {
        const { sort, ...actualFilters } = filters;

        // Step 1: Apply actual filters
        const filteredData = data.filter((item) => {
            // Check each actual filter key, Pass if filter value is 'all'
            return Object.entries(actualFilters).every(
                ([key, value]) =>
                    value === 'all' ||
                    (Array.isArray(item[key]) ? item[key].includes(value) : item[key] === value)
            );
        });

        // Step 2: Apply sorting
        const sortedData = filteredData.sort((a, b) => {
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
                <p className="text-neutral-500 italic">
                    {website.localize({
                        en: 'No result match your criteria',
                        fr: 'Aucun résultat ne correspond à vos critères',
                        es: 'Ningún resultado coincide con tus criterios',
                        zh: '没有结果符合您的条件',
                    })}
                </p>
            </div>
        );
    }

    return (
        <VirtuosoGrid
            ref={virtuosoRef}
            useWindowScroll
            data={filteredData}
            itemContent={(index, item) => (
                <ItemCard
                    item={item}
                    index={index}
                    schema={schemaMap[item.url]}
                    getSchema={getSchema}
                />
            )}
            listClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-12"
        />
    );
};

export default VirtualGrid;
