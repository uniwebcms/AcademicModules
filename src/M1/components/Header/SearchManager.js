import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { website } from '@uniwebcms/module-sdk';
import FlexSearch from 'flexsearch';

const getWebsiteData = async () => {
    const data = await website.getSearchData();

    const uniquePages = [];

    data.forEach((page) => {
        const { id, title, content, description, href } = page;

        const existingPage = uniquePages.find((p) => p.id === id);

        if (!existingPage) {
            uniquePages.push({
                id,
                title,
                content,
                description,
                href,
            });
        }
    });

    return uniquePages;
};

const SearchManager = forwardRef(({ onResultsChange }, ref) => {
    const searchIndex = useRef(null);

    useEffect(() => {
        searchIndex.current = new FlexSearch.Document({
            document: {
                id: 'id',
                index: ['title', 'content', 'description'],
                store: ['title', 'description', 'href'], // Store all needed fields
            },
            tokenize: 'forward',
            context: true,
        });

        const initializeSearch = async () => {
            try {
                const data = await getWebsiteData();

                data.forEach((page) => {
                    searchIndex.current.add(page);
                });
            } catch (error) {
                console.error('Failed to initialize search:', error);
            }
        };

        initializeSearch();
    }, []);

    useImperativeHandle(ref, () => ({
        search: async (query) => {
            if (!query.trim()) {
                onResultsChange?.([]);
                return;
            }

            try {
                const results = await searchIndex.current.search(query, {
                    enrich: true, // This ensures we get back the stored fields
                    limit: 10,
                });

                // Process and combine results from different fields
                const processedResults = new Map();

                results.forEach((fieldResult) => {
                    fieldResult.result.forEach((result) => {
                        const existingResult = processedResults.get(result.id);
                        if (!existingResult || existingResult.score < result.score) {
                            // Use the stored document data directly from the search result
                            processedResults.set(result.id, {
                                id: result.id,
                                title: result.doc.title,
                                content: result.doc.content,
                                description: result.doc.description,
                                href: result.doc.href,
                                score: result.score,
                            });
                        }
                    });
                });

                const sortedResults = Array.from(processedResults.values()).sort(
                    (a, b) => b.score - a.score
                );

                onResultsChange?.(sortedResults);
            } catch (error) {
                console.error('Search failed:', error);
                onResultsChange?.([]);
            }
        },
    }));

    return null;
});

export default SearchManager;
