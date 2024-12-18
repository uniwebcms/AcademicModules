import React from 'react';
import { Link, twJoin } from '@uniwebcms/module-sdk';
import { HiArrowLeft, HiArrowNarrowLeft } from 'react-icons/hi';
import { CgArrowLeft } from 'react-icons/cg';
import Container from '../_utils/Container';
import { buildArticleBlocks } from './Render/helper';
import Render from './Render';

export default function Article(props) {
    const { website, input, block } = props;

    const {
        width = 'md',
        vertical_padding = 'lg',
        horizontal_padding = 'sm',
    } = block.getBlockProperties();

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
                    <CgArrowLeft className="w-6 h-6 text-text-color-50 group-hover:text-link-hover-color" />
                    <span className="text-base lg:text-lg text-text-color-50 group-hover:text-link-hover-color group-hover:underline">
                        {website.localize({
                            en: 'Back to list',
                            es: 'Volver a la lista',
                        })}
                    </span>
                </Link>
            )}
            <div className={'prose prose-sm md:prose-lg lg:prose-xl'}>
                <Render {...props} content={parsedContent}></Render>
            </div>
        </Container>
    );
}
