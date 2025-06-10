import React from 'react';
import { Profile, website } from '@uniwebcms/module-sdk';
import { Image, Link } from '@uniwebcms/core-components';

const GridCard = ({ article, input }) => {
    const { title, subtitle, head } = article.getBasicInfo();

    const author = article.at('article_information')?.author || null;

    const tag = head?.tag || '';

    let authorName = '';

    if (author) {
        let [authorId, authorInfo] = author;
        authorInfo = typeof authorInfo === 'string' ? JSON.parse(authorInfo) : authorInfo;
        const authorProfile = Profile.newProfile('members', authorId, { head: authorInfo });
        authorName = authorProfile.getBasicInfo()?.title;
    }

    const linkHref = input.makeHref(article);

    return (
        <div className="w-full">
            <Link
                to={linkHref}
                className="block w-full aspect-[16/9] overflow-hidden rounded-xl shadow"
            >
                <Image
                    profile={article}
                    type="banner"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
            </Link>
            <h3>
                <Link
                    to={linkHref}
                    className="block relative group text-lg md:text-xl lg:text-2xl my-4 text-pretty font-semibold"
                >
                    <span className="bg-gradient-to-r from-neutral-950 to-neutral-950 bg-no-repeat [background-size:0%_1.5px] group-hover:[background-size:100%_1.5px] [background-position:0_100%] transition-[background-size] duration-700 ease-out">
                        {title}
                    </span>
                </Link>
            </h3>
            <p
                className="text-sm md:text-base lg:text-lg line-clamp-3 mb-4 text-text-color-50"
                title={subtitle}
            >
                {subtitle}
            </p>
            {authorName && (
                <p className="text-sm md:text-base font-medium mb-5 text-text-color-70 cursor-default">
                    <span>
                        {website.localize({
                            en: `By ${authorName}`,
                            zh: `作者：${authorName}`,
                            fr: `Par ${authorName}`,
                            es: `Por ${authorName}`,
                        })}
                    </span>
                </p>
            )}
            {tag && (
                <div>
                    <span className="px-2.5 py-1 text-xs bg-accent-50 text-accent-500 rounded-full font-medium cursor-default">
                        {tag}
                    </span>
                </div>
            )}
        </div>
    );
};

const ListCard = ({ article, input }) => {
    const { title, subtitle, head } = article.getBasicInfo();

    const author = article.at('article_information')?.author || null;

    const tag = head?.tag || '';

    let authorName = '';

    if (author) {
        let [authorId, authorInfo] = author;
        authorInfo = typeof authorInfo === 'string' ? JSON.parse(authorInfo) : authorInfo;
        const authorProfile = Profile.newProfile('members', authorId, { head: authorInfo });
        authorName = authorProfile.getBasicInfo()?.title;
    }

    const linkHref = input.makeHref(article);

    return (
        <div className="flex lg:flex-row flex-col items-start gap-6 lg:gap-8 xl:gap-12">
            <div className="w-full lg:w-1/3 aspect-[16/9] overflow-hidden rounded-xl shadow">
                <Link to={linkHref} className="block w-full h-full">
                    <Image
                        profile={article}
                        type="banner"
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                </Link>
            </div>
            <div className="w-full lg:w-2/3">
                <h3>
                    <Link
                        to={linkHref}
                        className="block relative group text-lg md:text-xl lg:text-2xl my-4 text-pretty font-bold"
                    >
                        <span className="bg-gradient-to-r from-neutral-950 to-neutral-950 bg-no-repeat [background-size:0%_1.5px] group-hover:[background-size:100%_1.5px] [background-position:0_100%] transition-[background-size] duration-700 ease-out">
                            {title}
                        </span>
                    </Link>
                </h3>
                <p
                    className="text-sm md:text-base lg:text-lg line-clamp-3 mb-4 text-text-color-50"
                    title={subtitle}
                >
                    {subtitle}
                </p>
                {authorName && (
                    <p className="text-sm md:text-base font-medium mb-5 text-text-color-70 cursor-default">
                        <span>
                            {website.localize({
                                en: `By ${authorName}`,
                                zh: `作者：${authorName}`,
                                fr: `Par ${authorName}`,
                                es: `Por ${authorName}`,
                            })}
                        </span>
                    </p>
                )}
                {tag && (
                    <div>
                        <span className="px-2.5 py-1 text-xs bg-accent-50 text-accent-500 rounded-full font-medium cursor-default">
                            {tag}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Articles(props) {
    const { block, input } = props;

    const { title } = block.getBlockContent();
    const { layout = 'grid' } = block.getBlockProperties();

    const articles = input.profiles || [];

    const wrapperClassName =
        layout === 'list'
            ? 'space-y-12 xl:space-y-16'
            : layout === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12'
            : '';

    return (
        <div className="max-w-7xl mx-auto py-28 px-6">
            <h2 className="text-[42px] md:text-[48px] xl:text-[56px] leading-[118%] md:leading-[112%] mb-10">
                {title}
            </h2>
            <div className={wrapperClassName}>
                {articles.map((article, index) => {
                    if (layout === 'list') {
                        return <ListCard key={index} article={article} input={input} />;
                    }

                    return <GridCard key={index} article={article} input={input} />;
                })}
            </div>
        </div>
    );
}
