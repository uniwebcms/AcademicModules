import React from 'react';
import { twJoin } from '@uniwebcms/module-sdk';
import { Link } from '@uniwebcms/core-components';
import { CgArrowLeft } from 'react-icons/cg';
import Container from '../_utils/Container';
import { ArticleRender as Render, buildArticleBlocks } from '@uniwebcms/core-components';

export default function Article(props) {
    const { website, input, block, extra } = props;

    const {
        width = 'md',
        vertical_padding = 'lg',
        horizontal_padding = 'sm',
    } = block.getBlockProperties();

    const size = extra?.size || 'full';

    const article = input?.profile || null;

    if (!article) return null;

    const activeLang = website.getLanguage();
    const articleData = article.getFullData();

    const { value } = articleData.find((item) => item.name === 'article_body');

    let content = {};

    if (value.length) {
        const item = value[0];

        content =
            typeof item?.content?.value === 'string'
                ? JSON.parse(item?.content?.value)
                : item?.content?.value;
    }

    const langContent = content[activeLang];

    const parsedContent = buildArticleBlocks(website.parseLinksInArticle(langContent));

    const isDynamicPage = block.page.activeRoute.includes('[id]');

    return (
        <Container
            px="none"
            py="none"
            as="article"
            className={twJoin(
                width === 'sm' && 'max-w-3xl',
                width === 'md' && 'max-w-5xl',
                width === 'lg' && 'max-w-7xl',
                width === 'full' && 'max-w-full',
                vertical_padding === 'sm' && 'py-6 lg:py-12',
                vertical_padding === 'lg' && 'py-12 lg:py-20',
                horizontal_padding === 'sm' && 'px-6 lg:px-8',
                horizontal_padding === 'lg' && 'px-8 lg:px-12',
                'w-full mx-auto min-h-screen space-y-6 lg:space-y-10'
            )}
        >
            {isDynamicPage && (
                <Link to={input.makeHrefToIndex()} className="inline-flex items-center gap-2 group">
                    <CgArrowLeft className="w-6 h-6 lg:w-7 lg:h-7 text-text-color-50 group-hover:text-link-hover-color group-hover:-translate-x-1 transition-transform duration-150" />
                    <span className="text-base lg:text-lg text-text-color-50 group-hover:text-link-hover-color group-hover:underline">
                        {website.localize({
                            en: 'Back to list',
                            es: 'Volver a la lista',
                        })}
                    </span>
                </Link>
            )}
            <div
                className={twJoin(
                    'prose',
                    size === 'full' && 'prose-sm md:prose-base lg:prose-lg xl:prose-xl',
                    size === 'half' && 'prose-sm md:prose-base lg:prose-lg'
                )}
            >
                <Render {...props} content={parsedContent}></Render>
            </div>
        </Container>
    );
}
