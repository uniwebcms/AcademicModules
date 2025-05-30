import React, { useState, useEffect } from 'react';
import Container from '../_utils/Container';
import { useHorizontalOverflowIndicator } from './useHorizontalOverflowIndicator';
import { Profile, twJoin, website, twMerge } from '@uniwebcms/module-sdk';
import { Link, Image } from '@uniwebcms/core-components';
import { normalizeDate } from '../_utils/date';
import { Listbox } from '@headlessui/react';
import { BiFilter } from 'react-icons/bi';
import { HiX } from 'react-icons/hi';

const TagFilter = ({ tags, tag }) => {
    const { useNavigate, useLocation } = website.getRoutingComponents();
    const navigate = useNavigate();
    const location = useLocation();

    const updateSearchParams = (tag) => {
        const params = new URLSearchParams(location.search);
        if (!tag) {
            params.delete('tag');
        } else {
            params.set('tag', tag);
        }
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    };

    return (
        <Listbox as="div" value={tag} onChange={updateSearchParams} className="relative z-20">
            <Listbox.Label className="sr-only">Article Tag</Listbox.Label>
            <Listbox.Button className="flex bg-bg-color" aria-label="Article Tag">
                <div className="flex items-center">
                    <BiFilter
                        className={twJoin(
                            'w-8 h-8 md:w-7 md:h-7',
                            tag ? 'text-primary-500' : 'text-text-color-60'
                        )}
                    />
                    <span
                        className="max-w-24 truncate hidden md:block ml-1 text-base text-text-color-60 hover:text-text-color-90"
                        title={tag || website.localize({ en: 'All Tags', fr: 'Tous les tags' })}
                    >
                        {tag ||
                            website.localize({
                                en: 'All Tags',
                                fr: 'Tous les tags',
                            })}
                    </span>
                </div>
            </Listbox.Button>
            <Listbox.Options className="absolute z-50 top-full right-0 max-h-[30vh] bg-bg-color rounded-lg ring-1 ring-text-color-20 shadow-lg overflow-x-hidden overflow-y-auto w-36 py-1 mt-4 lg:mt-3 translate-x-2">
                {tags.map((tag, index) => (
                    <Listbox.Option
                        key={index}
                        value={tag}
                        className={({ active, selected }) =>
                            twMerge(
                                'text-base cursor-pointer px-2.5 py-1.5 text-text-color-70 h-8',
                                selected && 'bg-text-color-10 text-primary-500',
                                active && !selected && 'bg-text-color-20 text-text-color'
                            )
                        }
                    >
                        {({ selected }) => (
                            <div className="truncate" title={tag}>
                                {tag}
                            </div>
                        )}
                    </Listbox.Option>
                ))}
            </Listbox.Options>
        </Listbox>
    );
};

const ArticleAuthor = ({ info }) => {
    const date = info.date
        ? new Date(normalizeDate(info.date)).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : null;

    if (!info.author) {
        return <p className="text-sm text-gray-100">{date}</p>;
    }

    let [authorId, authorInfo] = info.author;
    authorInfo = typeof authorInfo === 'string' ? JSON.parse(authorInfo) : authorInfo;

    const authorProfile = Profile.newProfile('members', authorId, { head: authorInfo });

    const { title } = authorProfile.getBasicInfo();

    return (
        <div className="flex h-12 items-center gap-4">
            <Image profile={authorProfile} type="avatar" className="w-10 h-10 rounded-full" />
            <div>
                <p className="text-sm text-gray-100">{title}</p>
                <p className="mt-0.5 text-sm text-gray-300">{date}</p>
            </div>
        </div>
    );
};

const ArticleCard = ({ article, input, size = 'md' }) => {
    const { title, subtitle } = article.getBasicInfo();

    const info = article.at('article_information');

    return (
        <Link to={input.makeHref(article)} className="flex flex-col overflow-hidden group">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image profile={article} type="banner" className="object-cover w-full h-full" />
                {info.author || info.date ? (
                    <div className="absolute inset-0 z-10 opacity-0 hover:opacity-100 text-sm text-white transition-all duration-300 px-4 py-3 flex items-end bg-gradient-to-t from-gray-950/90 to-transparent">
                        <ArticleAuthor info={info} />
                    </div>
                ) : null}
            </div>
            <div className="mt-3">
                <h3
                    className={twJoin(
                        'font-medium line-clamp-2 group-hover:underline',
                        size === 'lg' && 'text-xl lg:text-2xl',
                        size === 'md' && 'text-lg lg:text-xl',
                        size === 'sm' && 'text-base lg:text-lg !leading-6'
                    )}
                    style={{
                        textWrapStyle: 'auto',
                    }}
                >
                    {title}
                </h3>
                {subtitle && (
                    <p
                        className={twJoin(
                            'text-sm text-text-color-50 line-clamp-2',
                            size === 'lg' && 'text-lg mt-2',
                            size === 'md' && 'text-base mt-2',
                            size === 'sm' && 'text-sm mt-1'
                        )}
                        title={subtitle}
                    >
                        {subtitle}
                    </p>
                )}
            </div>
        </Link>
    );
};

const ArticleList = ({ title, articles, input }) => {
    const [containerRef, hasOverflow, showIndicator] = useHorizontalOverflowIndicator();

    const params = new URLSearchParams({ tag: title });

    return (
        <div className="relative">
            <div className={hasOverflow ? 'flex items-center justify-between' : ''}>
                <h3 className="text-xl font-semibold">{title}</h3>
                {hasOverflow && (
                    <Link
                        to={`?${params.toString()}`}
                        className="text-base text-text-color-60 hover:underline hover:text-blue-600 group"
                        onClick={() => {
                            // scroll to the page top
                            window.scrollTo({
                                top: 0,
                            });
                        }}
                    >
                        {website.localize({ en: 'See all', fr: 'Voir tout' })}{' '}
                        <span className="text-text-color-50 group-hover:text-inherit">
                            ({articles.length})
                        </span>
                    </Link>
                )}
            </div>

            <div
                ref={containerRef}
                className="mt-3 flex items-start overflow-x-auto gap-6 xl:gap-8 no-scrollbar"
            >
                {articles.map((article) => (
                    <div key={article.key} className="w-72 flex-shrink-0">
                        <ArticleCard article={article} input={input} size="sm" />
                    </div>
                ))}
            </div>

            {hasOverflow && (
                <div
                    className={twJoin(
                        'absolute top-10 right-0 z-10 w-12 bg-gradient-to-l from-bg-color to-transparent pointer-events-none transition-opacity duration-300',
                        showIndicator ? 'opacity-100' : 'opacity-0'
                    )}
                    style={{
                        height: containerRef.current?.clientHeight,
                    }}
                ></div>
            )}
        </div>
    );
};

const getArticleTags = (article, noTagText) => {
    const allTags =
        article?.map((article) => {
            const { head } = article.getBasicInfo();
            return head?.tag || noTagText;
        }) || [];

    const sorted = [...new Set(allTags)].sort((a, b) => {
        return a.localeCompare(b);
    });

    if (sorted.length > 0) {
        sorted.unshift('');
    }

    return sorted;
};

export default function ArticleHub(props) {
    const { block, input, website } = props;
    const noTagText = website.localize({ en: 'No Tag', fr: 'Pas de tag' });
    const tags = getArticleTags(input.profiles, noTagText);

    const { useLocation } = website.getRoutingComponents();

    const { title, subtitle } = block.getBlockContent();
    let { layout = 'grid' } = block.getBlockProperties();

    const [searchText, setSearchText] = useState('');
    const [tag, setTag] = useState('');

    const location = useLocation();

    const articles = input.profiles?.filter((article) => {
        const { title, subtitle, head } = article.getBasicInfo();

        const articleTag = head?.tag || noTagText;

        return (
            (title.toLowerCase().includes(searchText.toLowerCase()) ||
                subtitle.toLowerCase().includes(searchText.toLowerCase())) &&
            (tag === '' || articleTag === tag)
        );
    });

    const groupedArticles = articles.reduce((acc, article) => {
        const { head } = article.getBasicInfo();
        const articleTag = head?.tag || noTagText;

        if (!acc[articleTag]) {
            acc[articleTag] = [];
        }
        acc[articleTag].push(article);
        return acc;
    }, {});

    // get the tag from the URL and update the state
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tag = searchParams.get('tag');

        setTag(tag || '');
    }, [location.search]);

    if (layout === 'grouped' && tag) {
        layout = 'grid';
    }

    return (
        <Container className="max-w-8xl mx-auto">
            {title && <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">{title}</h2>}
            {subtitle && <p className="mt-4 lg:mt-6 text-lg md:text-xl lg:text-2xl">{subtitle}</p>}
            <div className="relative mt-8 lg:mt-10">
                {/* search */}
                <div className="relative max-w-[calc(100%-60px)] md:max-w-xl ml-0 lg:mx-auto">
                    <input
                        type="text"
                        value={searchText}
                        placeholder={website.localize({
                            en: 'Search articles',
                            fr: 'Rechercher des articles',
                        })}
                        className=" w-full px-4 py-2 border border-text-color-20 rounded-2xl focus:outline-none focus:ring focus:ring-primary-500 hover:border-text-color-30"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    {searchText && (
                        <button
                            className="absolute right-0 top-0 mt-2.5 mr-2 !bg-transparent"
                            onClick={() => setSearchText('')}
                        >
                            <HiX className="w-6 h-6 text-text-color-50 hover:text-text-color" />
                        </button>
                    )}
                </div>

                {/* filter */}
                {layout === 'grid' && tags.length > 0 ? (
                    <div className="absolute right-0 top-[5px] md:top-[7px]">
                        <TagFilter tags={tags} tag={tag} />
                    </div>
                ) : null}

                {/* grid */}
                {layout === 'grid' && (
                    <div className="mt-8 lg:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
                        {articles.map((article, index) => (
                            <ArticleCard key={index} article={article} input={input} />
                        ))}
                    </div>
                )}

                {/* grouped */}
                {layout === 'grouped' && (
                    <div className="mt-8 lg:mt-10 space-y-8">
                        {tags.map((tag, index) => {
                            const articles = groupedArticles[tag] || [];
                            if (articles.length === 0) return null;

                            return (
                                <ArticleList
                                    key={index}
                                    title={tag}
                                    articles={articles}
                                    input={input}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </Container>
    );
}
