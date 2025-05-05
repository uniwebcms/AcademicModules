import React from 'react';
import Container from '../_utils/Container';
import { twJoin, Image, Link, Profile } from '@uniwebcms/module-sdk';
import { normalizeDate } from '../_utils/date';

const ArticleAuthor = ({ info, in_side_panel }) => {
    if (!info.author) return null;

    let [authorId, authorInfo] = info.author;
    authorInfo = typeof authorInfo === 'string' ? JSON.parse(authorInfo) : authorInfo;

    const authorProfile = Profile.newProfile('members', authorId, { head: authorInfo });

    const { title } = authorProfile.getBasicInfo();

    return (
        <div className={twJoin(in_side_panel ? 'h-8 gap-2' : 'h-12 gap-4', 'flex items-center')}>
            <Image
                profile={authorProfile}
                type="avatar"
                className={twJoin(in_side_panel ? 'w-7 h-7' : 'w-10 h-10', 'rounded-full')}
            />
            <div>
                <p
                    className={twJoin(
                        in_side_panel ? 'text-sm' : 'text-sm lg:text-base',
                        'text-text-color-70'
                    )}
                >
                    {title}
                </p>
                {info.date && (
                    <p
                        className={twJoin(
                            in_side_panel ? 'text-xs' : 'text-xs lg:text-sm',
                            'text-text-color-40'
                        )}
                    >
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

const findRelatedArticles = (articles, page, blockId) => {
    const pageBlocks = page.blockGroups.body;
    const parentBlock = pageBlocks.find((block) =>
        block.childBlocks?.find((cb) => cb.id === blockId)
    );

    const siblingBlock = parentBlock?.childBlocks.find((block) => block.id !== blockId);
    if (siblingBlock) {
        const mainArticle =
            siblingBlock.input?.profile?.profileType === 'articles/profile'
                ? siblingBlock.input?.profile
                : null;

        if (mainArticle) {
            const mainArticleTag = mainArticle.getBasicInfo().head?.tag;
            console.log('mainArticleTag', mainArticleTag);
            if (mainArticleTag) {
                return articles.filter((article) => {
                    const articleTag = article.getBasicInfo().head?.tag;
                    return articleTag && articleTag === mainArticleTag;
                });
            }
        }
    }

    return [];
};

export default function ArticleList(props) {
    const { block, input, page } = props;
    const { title, subtitle } = block.getBlockContent();

    const {
        width = 'md',
        vertical_padding = 'lg',
        horizontal_padding = 'sm',
        in_side_panel = false,
        max_display,
        related_only = false,
    } = block.getBlockProperties();

    let articles = input?.profiles || [];

    if (!articles.length) return null;

    if (related_only) {
        articles = findRelatedArticles(articles, page, block.id);
    }

    if (max_display) {
        const maxDisplayNumber = parseInt(max_display, 10);
        if (!isNaN(maxDisplayNumber)) {
            articles = articles.slice(0, maxDisplayNumber);
        }
    }

    return (
        <Container
            px="none"
            py="none"
            as="aside"
            className={twJoin(
                width === 'sm' && 'max-w-3xl',
                width === 'md' && 'max-w-5xl',
                width === 'lg' && 'max-w-7xl',
                width === 'full' && 'max-w-full',
                vertical_padding === 'sm' && 'py-6 lg:py-12',
                vertical_padding === 'lg' && 'py-12 lg:py-20',
                horizontal_padding === 'sm' && 'px-6 lg:px-8',
                horizontal_padding === 'lg' && 'px-8 lg:px-12',
                'w-full mx-auto'
            )}
        >
            {title && (
                <h2
                    className={twJoin(
                        in_side_panel
                            ? 'text-lg md:text-xl lg:text-2xl font-medium'
                            : 'text-2xl md:text-3xl lg:text-4xl font-bold'
                    )}
                >
                    {title}
                </h2>
            )}
            {subtitle && (
                <p
                    className={twJoin(
                        in_side_panel
                            ? 'mt-2 lg:mt-3 text-sm md:text-base lg:text-lg'
                            : 'mt-4 lg:mt-6 text-base md:text-lg lg:text-xl'
                    )}
                >
                    {subtitle}
                </p>
            )}
            <div
                className={
                    title || subtitle ? (in_side_panel ? 'mt-4 lg:mt-6' : 'mt-8 lg:mt-12') : ''
                }
            >
                <ul className={twJoin('flex flex-col', in_side_panel ? 'gap-y-6' : 'gap-y-8')}>
                    {articles.map((article, index) => {
                        const { title, subtitle } = article.getBasicInfo();

                        const articleInformation = article.at('article_information');

                        return (
                            <Link
                                key={index}
                                to={input.makeHref(article)}
                                className={twJoin(
                                    in_side_panel ? 'space-x-4' : 'space-x-8',
                                    'flex items-start group'
                                )}
                            >
                                <div
                                    className={twJoin(
                                        in_side_panel ? 'w-40 h-32' : 'w-44 h-36',
                                        'rounded-lg overflow-hidden flex-shrink-0'
                                    )}
                                >
                                    <Image
                                        profile={article}
                                        type="banner"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    {title && (
                                        <h3
                                            className={twJoin(
                                                in_side_panel
                                                    ? 'text-base lg:text-lg font-medium !leading-snug'
                                                    : 'text-xl lg:text-2xl font-medium',
                                                'line-clamp-2 group-hover:underline'
                                            )}
                                            title={title}
                                        >
                                            {title}
                                        </h3>
                                    )}
                                    {subtitle && (
                                        <p
                                            className={twJoin(
                                                in_side_panel
                                                    ? 'text-xs lg:text-sm mt-1'
                                                    : 'text-base lg:text-lg mt-2',
                                                'line-clamp-2 text-text-color-50'
                                            )}
                                            title={subtitle}
                                        >
                                            {subtitle}
                                        </p>
                                    )}
                                    <div className={twJoin(in_side_panel ? 'mt-2' : 'mt-3')}>
                                        <ArticleAuthor
                                            info={articleInformation}
                                            in_side_panel={in_side_panel}
                                        />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </ul>
            </div>
        </Container>
    );
}
