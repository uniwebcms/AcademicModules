import React, { useState } from 'react';
import Container from '../_utils/Container';
import { Link, Image, Profile, twJoin, website, twMerge } from '@uniwebcms/module-sdk';
import { normalizeDate } from '../_utils/date';
import { Listbox } from '@headlessui/react';
import { BiFilter } from 'react-icons/bi';
import { HiX } from 'react-icons/hi';

const ArticleAuthor = ({ info }) => {
    if (!info.author) return null;

    let [authorId, authorInfo] = info.author;
    authorInfo = typeof authorInfo === 'string' ? JSON.parse(authorInfo) : authorInfo;

    const authorProfile = Profile.newProfile('members', authorId, { head: authorInfo });

    const { title } = authorProfile.getBasicInfo();

    return (
        <div className="flex h-12 items-center gap-4">
            <Image profile={authorProfile} type="avatar" className="w-10 h-10 rounded-full" />
            <div>
                <p className="text-sm lg:text-base text-text-color-70">{title}</p>
                {info.date && (
                    <p className="text-xs lg:text-sm text-text-color-40">
                        {new Date(normalizeDate(info.date)).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                )}
            </div>
        </div>
    );
};

const TagFilter = ({ tags, tag, setTag }) => {
    return (
        <Listbox
            as="div"
            value={tag}
            onChange={(newTag) => {
                setTag((prev) => (prev === newTag ? '' : newTag));
            }}
            className="relative z-10"
        >
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
                                'text-base cursor-pointer px-2.5 py-1.5 text-text-color-70',
                                selected && 'bg-text-color-10 text-primary-500',
                                active && 'bg-text-color-20 text-text-color'
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

const getArticleTags = (article) => {
    const allTags =
        article
            ?.map((article) => {
                const { head } = article.getBasicInfo();
                return head?.tag || '';
            })
            ?.filter((tag) => tag !== '') || [];

    return [...new Set(allTags)];
};

export default function ArticleHub(props) {
    const { block, input, website } = props;

    const { title, subtitle } = block.getBlockContent();

    const [searchText, setSearchText] = useState('');
    const [tag, setTag] = useState('');

    const tags = getArticleTags(input.profiles);

    const articles = input.profiles?.filter((article) => {
        const { title, subtitle, head } = article.getBasicInfo();

        const articleTag = head?.tag || '';

        return (
            (title.toLowerCase().includes(searchText.toLowerCase()) ||
                subtitle.toLowerCase().includes(searchText.toLowerCase())) &&
            (tag === '' || articleTag === tag)
        );
    });

    return (
        <Container className="max-w-8xl mx-auto">
            {title && <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">{title}</h2>}
            {subtitle && <p className="mt-4 lg:mt-6 text-lg md:text-xl lg:text-2xl">{subtitle}</p>}
            <div className="relative mt-8 lg:mt-10">
                {/* search and filter */}
                <div className="relative flex justify-start lg:justify-center">
                    <input
                        type="text"
                        value={searchText}
                        placeholder={website.localize({
                            en: 'Search articles',
                            fr: 'Rechercher des articles',
                        })}
                        className="max-w-[calc(100%-60px)] md:max-w-xl w-full px-4 py-2 border border-text-color-20 rounded-2xl focus:outline-none focus:ring focus:ring-primary-500 hover:border-text-color-30"
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
                    {tags.length > 0 && (
                        <div className="absolute right-0 top-[5px] md:top-[7px]">
                            <TagFilter tags={tags} tag={tag} setTag={setTag} />
                        </div>
                    )}
                </div>
                {/* grid */}
                <div className="mt-8 lg:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
                    {articles.map((article, index) => {
                        const { title, subtitle } = article.getBasicInfo();

                        const articleInformation = article.at('article_information');

                        return (
                            <Link
                                key={index}
                                to={input.makeHref(article)}
                                className="flex flex-col overflow-hidden group"
                            >
                                <div className="w-full aspect-video rounded-lg overflow-hidden">
                                    <Image
                                        profile={article}
                                        type="banner"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="flex-grow mt-3 mb-5">
                                    <h3 className="text-xl lg:text-2xl font-medium line-clamp-2 !leading-snug group-hover:underline">
                                        {title}
                                    </h3>
                                    {subtitle && (
                                        <p className="mt-2 text-sm lg:text-base text-text-color-50 line-clamp-3">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>
                                <ArticleAuthor info={articleInformation} />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </Container>
    );
}
