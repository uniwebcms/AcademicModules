import React, { useRef, useState } from 'react';
import { website, stripTags, Link, Image } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';
import { parseReference, getDateFromIssued, parseProfileData } from '../_utils/reference';
import CVRefRender from '../_utils/reference/CVRefRender';
import Sidebar from './Sidebar';
import AdvancedSmartCards from './AdvancedSmartCards';
import DOILogo from './doi.svg';
import UrlLogo from './external.png';

const ItemMarkup = (props) => {
    const { profile, href, ...rest } = props;

    const { title, issued, author, DOI = '', isStandard, pages, page_range, page } = rest;

    let year = issued?.['date-parts']?.[0]?.[0] || '';
    const journal = rest['container-title'] || '';

    const banner = profile.getBanner();

    let finalDoi =
        DOI && DOI.startsWith('https://doi.org/') ? DOI.replace('https://doi.org/', '') : DOI;

    let completeDoi = finalDoi ? `https://doi.org/${DOI}` : '';

    let externalUrl = rest?.url || '';

    let refMarkup = null;

    let pageNum = page || pages || page_range || '';

    if (isStandard) {
        refMarkup = (
            <div className={`flex flex-col space-y-2 ${banner ? 'mr-4' : ''}`}>
                <Link href={href} className={`text-text-color font-semibold hover:underline`}>
                    {title}
                </Link>
                <p className="text-sm text-text-color-80">
                    {author && author.length
                        ? author
                              .map((author) => {
                                  const { given, family } = author;
                                  return `${family} ${given}${given.length === 1 ? '.' : ''}`;
                              })
                              .join(', ')
                        : null}
                </p>
                <span className={`text-text-color-60 text-sm`}>
                    {`${journal}${year ? `${journal ? ', ' : ''}${year}` : ''}${
                        pageNum ? `, ${pageNum}` : ''
                    }`}
                </span>
                <div className={`flex items-center space-x-1`}>
                    {completeDoi ? (
                        <div className={`w-7 h-7 flex`}>
                            <a
                                target="_blank"
                                className={`w-7 h-7 rounded-full cursor-pointer`}
                                href={completeDoi}
                            >
                                <DOILogo className={`w-7 h-7`}></DOILogo>
                            </a>
                        </div>
                    ) : null}
                    {externalUrl ? (
                        <div className={`w-8 h-8 flex items-center`}>
                            <a
                                target="_blank"
                                className={`w-8 h-8 rounded-full cursor-pointer text-text-color-60 hover:text-text-color-80`}
                                href={externalUrl}
                            >
                                <img src={UrlLogo} className={`block w-full h-full rounded-full`} />
                                {/* <UrlLogo className={`w-8 h-8`}></UrlLogo> */}
                            </a>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    } else {
        const { parsedMeta, parsedData } = rest;
        let sectionPath = (parsedMeta?.['_section'] || []).join('/');
        let parsed = parseProfileData({ sections: [parsedData] });
        refMarkup = (
            <Link href={href} className={'text-text-color font-semibold hover:underline'}>
                <CVRefRender value={parsed?.[0]?.value || []} sectionPath={sectionPath} />
            </Link>
        );
    }
    return (
        <div className={`flex`} key={href}>
            {refMarkup}
            {banner ? (
                <Link
                    href={href}
                    className={
                        'cursor-pointer w-[111px] h-[142px] flex-shrink-0 overflow-hidden ml-auto !shadow-[0_1px_2px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.15)] bg-white'
                    }
                >
                    <Image profile={profile} type="banner"></Image>
                </Link>
            ) : null}
        </div>
    );
};

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

    const { groupReferences = false, noLink = false } = block.getBlockProperties();

    let groups = {};

    let defaultCategory = website.localize({
        en: 'Others',
        fr: 'Autres',
    });

    const { data: info, error } = uniweb.useCompleteQuery('getPubInfo', () => {
        return postRequest('reference.php', {
            action: 'getPubInfo',
            contentType: 'reference',
        }).then((res) => res.data || {});
    });

    const pubTypeOptions = [];

    if (!info || error) return null;

    let typeOptions = info?.typeOptionsDisplay || [];

    typeOptions.forEach((option) => {
        pubTypeOptions.push({
            label: option[1],
            value: option[0],
        });
    });

    let parsedReferences = input.profiles.map((profile) => {
        let parsedData = parseReference(profile);

        const topics = profile.at('topics');

        const metaData = profile.rawHead?.meta_data || {};
        // const category = metaData['_category'] || defaultCategory; //'journal article';
        let category = pubTypeOptions.find(
            (option) => option.value == metaData?.['belongs-to'] || ''
        );

        category = category ? category.value : defaultCategory;
        let categoryLabel = category.replace('_', ' ');

        let href = input.makeHref(profile);

        let item = {
            ...parsedData,
            href,
            profile,
            category,
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

        return item;
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

            const { _type, _topics = [], category } = reference;

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
        })
        .map((item) => {
            const { category } = item;
            if (!groups[category]) {
                groups[category] = [];
            }

            groups[category].push(item);

            return item;
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

    let args = {
        ItemMarkup,
        columnCount: 1,
    };

    if (groupReferences) {
        args.groups = groups;
    } else {
        args.cards = filteredReferences;
    }

    const containerRef = useRef(null);

    return (
        <Container
            className="px-6 mx-auto max-w-7xl lg:px-8 flex md:space-x-6 lg:space-x-10"
            ref={containerRef}
        >
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
            <div className={`block flex-1`}>
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
                <div className="block w-full lg:pb-12 lg:border-l lg:pl-12 pt-3.5">
                    <AdvancedSmartCards {...args} containerRef={containerRef} />
                </div>
                {/* <ul
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
                </ul> */}
            </div>
        </Container>
    );
}
