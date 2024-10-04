import React from 'react';
import { useBlockInputFilterState, stripTags } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';
import Searcher from '../_utils/Searcher';
import Publication from './Publication';

export default function ProfileReferences({ block }) {
    const title = block.mainTitle || '';

    const [filter, setFilter] = useBlockInputFilterState(block);

    const { filtered } = filter;

    return (
        <Container className="px-6 mx-auto max-w-7xl lg:px-8">
            {title ? (
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-8">
                    {stripTags(title)}
                </h2>
            ) : null}
            <div className="flex space-x-2 items-center justify-end mb-6">
                <Searcher filter={filter} setFilter={setFilter} />
            </div>
            {filtered.length ? (
                <div className="w-full bg-bg-color-80 border border-text-color-60 rounded-xl divide-y divide-text-color-60">
                    {filtered.map((publication) => (
                        <Publication key={publication.contentId} publication={publication} />
                    ))}
                </div>
            ) : null}
        </Container>
    );
}
