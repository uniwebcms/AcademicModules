import React, { useState } from 'react';
import { website, stripTags, Link, Image } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';
import { parseReference, getDateFromIssued } from '../_utils/reference';
import Sidebar from './Sidebar';

export default function ProfileReferences({ block, input }) {
    const title = block.mainTitle || '';

    const { useLocation } = website.getRoutingComponents();
    const query = new URLSearchParams(useLocation().search);

    const initYear = query.get('year') || '';
    const initType = query.get('type') || '';
    const initTopic = query.get('topic') || '';

    let initSelection = {
        _search: '',
        year: initYear ? [initYear] : [],
        type: initType ? [initType] : [],
        topic: initTopic ? [initTopic] : [],
    };

    const [filter, setFilter] = block.useBlockState(useState, {
        selection: initSelection,
    });

    let parsedReferences = input.profiles.map((profile) => {
        let parsedData = parseReference(profile);

        const topics = profile.at('topics');

        const metaData = profile.rawHead?.meta_data || {};
        const category = metaData['_category'] || 'journal article';
        let categoryLabel = category.replace('_', ' ');

        let url = input.makeHref(profile);

        return {
            ...parsedData,
            url,
            profile,
            _type: categoryLabel,
            _topics: topics
                .map(({ topic }) => {
                    if (!topic) return null;

                    const [topicId, info] = topic;
                    let parsedInfo = JSON.parse(info);

                    return {
                        value: topicId,
                        label: parsedInfo.name,
                    };
                })
                .filter(Boolean),
        };
    });

    const years = new Set();
    const topics = new Set();
    const types = new Set();

    let {
        selection: { _search: search, year, type, topic },
    } = filter;

    let filteredReferences = parsedReferences
        .filter((reference) => {
            const date = reference?.issued?.['date-parts']?.[0]?.[0] || '';

            const yearLabel = date || 'N/A';

            const title = reference?.title || '';
            const journal = reference?.['container-title'] || '';

            const { _type, _topics = [] } = reference;

            years.add(isNaN(yearLabel) ? yearLabel : yearLabel.toString());

            if (_type) types.add(_type);

            if (_topics && _topics.length) {
                _topics.forEach((topic) => {
                    topics.add(topic);
                });
            }

            let searchText = search.toLocaleLowerCase();

            if (
                searchText &&
                !title.toLocaleLowerCase().includes(searchText) &&
                !journal.toLocaleLowerCase().includes(searchText)
            )
                return false;

            if (
                (year.length &&
                    !year.includes(isNaN(yearLabel) ? yearLabel : yearLabel.toString())) ||
                (type.length && !type.includes(_type)) ||
                (topic.length && !_topics.filter(({ value }) => topic.includes(value)).length)
            )
                return false;

            return true;
        })
        .sort((a, b) => {
            return getDateFromIssued(b.issued || {}) - getDateFromIssued(a.issued || {});
        });

    const seen = new Set();

    let mergedTopics = Array.from(topics).filter((obj) => {
        if (seen.has(obj.value)) {
            return false;
        } else {
            seen.add(obj.value);
            return true;
        }
    });

    return (
        <Container className="px-6 mx-auto max-w-7xl lg:px-8 flex md:space-x-6 lg:space-x-10">
            <Sidebar
                filter={filter}
                setFilter={setFilter}
                category={filter.selection}
                setCategory={(property, val) => {
                    setFilter({
                        selection: {
                            ...(filter?.selection || {}),
                            [property]: val,
                        },
                    });
                }}
                website={website}
                categories={[
                    {
                        label: {
                            en: 'Issued Year',
                            fr: "Année d'émission",
                        },
                        name: 'year',
                        values: Array.from(years).sort((a, b) => {
                            if (a === 'N/A') return 1;
                            if (b === 'N/A') return -1;

                            return b - a;
                        }),
                    },
                    {
                        name: 'type',
                        label: {
                            en: 'Publication Type',
                            fr: 'Type de publication',
                        },
                        values: Array.from(types).sort(),
                    },
                    {
                        name: 'topic',
                        label: {
                            en: 'Topic',
                            fr: 'Sujet',
                        },
                        values: mergedTopics.sort((a, b) => {
                            return a.label.localeCompare(b.label);
                        }),
                    },
                ]}
                // categories={Array.from(categories).sort()}
            />
            <div className={`block`}>
                {title ? (
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-8 lg:pl-12">
                        {stripTags(title)}
                    </h2>
                ) : null}
                {filteredReferences.length === 0 && (
                    <h3 className="font-medium lg:pl-12">
                        {website.localize({
                            en: 'No publications found.',
                            fr: 'Aucune publication trouvée.',
                        })}
                    </h3>
                )}
                <ul
                    className={`flex flex-col space-y-6 lg:space-y-10 lg:pb-12 lg:border-l lg:pl-12 pt-3.5`}
                >
                    {filteredReferences.map((reference) => {
                        const { profile, url, ...rest } = reference;

                        const { title, issued, author } = rest;

                        let year = issued?.['date-parts']?.[0]?.[0] || '';
                        const journal = rest['container-title'] || '';

                        const banner = profile.getBanner();
                        return (
                            <div className={`flex`} key={url}>
                                <div className={`flex flex-col space-y-2 ${banner ? 'mr-4' : ''}`}>
                                    <Link
                                        href={url}
                                        className={`text-text-color font-medium text-lg hover:underline`}
                                    >
                                        {title}
                                    </Link>
                                    <p className="text-sm text-text-color-90">
                                        {author && author.length
                                            ? author
                                                  .map((author) => {
                                                      const { given, family } = author;
                                                      return `${family} ${given}${
                                                          given.length === 1 ? '.' : ''
                                                      }`;
                                                  })
                                                  .join(', ')
                                            : null}
                                    </p>
                                    <span className={`text-text-color-80 text-sm`}>
                                        {`${journal}${year ? `${journal ? ', ' : ''}${year}` : ''}`}
                                    </span>
                                </div>
                                {banner ? (
                                    <Link
                                        href={url}
                                        className={
                                            'cursor-pointer w-[111px] h-[142px] flex-shrink-0 overflow-hidden ml-auto !shadow-[0_1px_2px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.15)] bg-white'
                                        }
                                    >
                                        <Image profile={profile} type="banner"></Image>
                                    </Link>
                                ) : null}
                            </div>
                        );
                    })}
                </ul>
            </div>
            {/* {title ? (
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-8">{stripTags(title)}</h2>
            ) : null}
            <div className="flex space-x-2 items-center justify-end mb-6">
                <Searcher filter={filter} setFilter={setFilter} />
                <Sorter filter={filter} setFilter={setFilter} />
            </div>
            {filtered.length ? (
                <div className="w-full bg-bg-color-80 border border-text-color-60 rounded-xl divide-y divide-text-color-60">
                    {filtered.map((publication) => (
                        <Publication key={publication.contentId} publication={publication} />
                    ))}
                </div>
            ) : null} */}
        </Container>
    );
}
