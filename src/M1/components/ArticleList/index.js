import React from 'react';
import Container from '../_utils/Container';
import { twJoin, Profile } from '@uniwebcms/module-sdk';
import { Link, Image } from '@uniwebcms/core-components';
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
        max_width = 'full',
        is_side_panel = false,
        max_display,
        related_only = false,
    } = block.getBlockProperties();

    let articles = input?.profiles || [];

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
            px={is_side_panel ? 'none' : undefined}
            py={is_side_panel ? 'py-12 lg:py-[70px]' : undefined}
            as={is_side_panel ? 'aside' : undefined}
            className={twJoin(
                max_width === 'sm' && 'max-w-3xl',
                max_width === 'md' && 'max-w-5xl',
                max_width === 'lg' && 'max-w-7xl',
                max_width === 'full' && 'max-w-full',
                'w-full mx-auto'
            )}
        >
            {title && (
                <h2
                    className={twJoin(
                        is_side_panel
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
                        is_side_panel
                            ? 'mt-2 lg:mt-3 text-sm md:text-base lg:text-lg'
                            : 'mt-4 lg:mt-6 text-base md:text-lg lg:text-xl'
                    )}
                >
                    {subtitle}
                </p>
            )}
            <div
                className={
                    title || subtitle ? (is_side_panel ? 'mt-4 lg:mt-6' : 'mt-8 lg:mt-12') : ''
                }
            >
                <ul
                    className={twJoin(
                        'flex flex-col',
                        is_side_panel ? 'gap-y-6' : 'gap-y-8 lg:gap-y-10'
                    )}
                >
                    {articles.map((article, index) => {
                        const { title, subtitle } = article.getBasicInfo();

                        const articleInformation = article.at('article_information');
                        const headInfo = articleInformation?.head || {};
                        return (
                            <Link
                                key={index}
                                to={input.makeHref(article)}
                                className={twJoin(
                                    is_side_panel ? 'space-x-4' : 'space-x-8',
                                    'flex items-start group'
                                )}
                            >
                                <div
                                    className={twJoin(
                                        is_side_panel && 'w-40',
                                        !is_side_panel && max_width === 'sm' && 'w-48 md:w-56',
                                        !is_side_panel &&
                                            max_width === 'md' &&
                                            'w-48 md:w-56 lg:w-64',
                                        !is_side_panel &&
                                            max_width === 'lg' &&
                                            'w-48 md:w-56 lg:w-64 xl:w-72',
                                        !is_side_panel &&
                                            max_width === 'full' &&
                                            'w-48 md:w-56 lg:w-64 xl:w-72 2xl:w-80',
                                        'aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0'
                                    )}
                                >
                                    <Image
                                        profile={article}
                                        type="banner"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className={twJoin('flex flex-col')}>
                                    {title && (
                                        <h3
                                            className={twJoin(
                                                is_side_panel
                                                    ? 'text-base lg:text-lg font-medium !leading-snug'
                                                    : 'text-xl lg:text-2xl font-medium',
                                                'line-clamp-2 group-hover:underline text-pretty'
                                            )}
                                            title={title}
                                        >
                                            {title}
                                        </h3>
                                    )}
                                    {subtitle && (
                                        <p
                                            className={twJoin(
                                                is_side_panel
                                                    ? 'text-xs lg:text-sm mt-1 line-clamp-1'
                                                    : 'text-base lg:text-lg mt-2 line-clamp-2',
                                                'text-text-color-50'
                                            )}
                                            title={subtitle}
                                        >
                                            {subtitle}
                                        </p>
                                    )}
                                    <div className={twJoin(is_side_panel ? 'mt-2' : 'mt-3')}>
                                        <ArticleAuthor
                                            info={headInfo}
                                            in_side_panel={is_side_panel}
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

ArticleList.inputSchema = {
    queryMode: 'simple',
    type: 'articles',
};
