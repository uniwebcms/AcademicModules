import React from 'react';
import Container from '../_utils/Container';
import { Link, Image, Profile, useBlockInputFilterState } from '@uniwebcms/module-sdk';
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
                        {new Date(info.date).toLocaleDateString('en-US', {
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

export default function ArticleHub(props) {
    const { block, input, website } = props;

    const { title, subtitle } = block.getBlockContent();

    const [filter, setFilter] = useBlockInputFilterState(block);

    const { filtered: articles } = filter;

    const searchText = filter.selection._search || '';

    return (
        <Container className="max-w-8xl mx-auto">
            {title && <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">{title}</h2>}
            {subtitle && <p className="mt-4 lg:mt-6 text-lg md:text-xl lg:text-2xl">{subtitle}</p>}
            <div className="mt-8 lg:mt-10 space-y-8 lg:space-y-10">
                {/* search, filer and sort */}
                <div className="relative max-w-xl mx-auto">
                    <input
                        type="text"
                        value={searchText}
                        placeholder={website.localize({
                            en: 'Search articles',
                            fr: 'Rechercher des articles',
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring focus:ring-primary-500"
                        onChange={(e) => setFilter({ _search: e.target.value })}
                    />
                    {searchText && (
                        <button
                            className="absolute right-0 top-0 mt-2.5 mr-2 !bg-transparent"
                            onClick={() => setFilter({ _search: '' })}
                        >
                            <HiX className="w-6 h-6 text-text-color-50 hover:text-text-color" />
                        </button>
                    )}
                </div>
                {/* grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
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
