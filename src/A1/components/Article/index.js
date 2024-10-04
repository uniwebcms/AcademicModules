import React from 'react';
import { Link, twJoin } from '@uniwebcms/module-sdk';
import { IoReturnUpBackOutline } from 'react-icons/io5';
import Container from '../_utils/Container';
import Render from '../_utils/articles/Render';
import { buildArticleBlocks } from '../_utils/articles';

export default function Article(props) {
    const { website, input, block } = props;

    const { width = 'lg' } = block.getBlockProperties();

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
            as="article"
            className={twJoin(
                width === 'md' && 'max-w-2xl',
                width === 'lg' && 'max-w-3xl',
                width === 'xl' && 'max-w-5xl',
                width === '2xl' && 'max-w-7xl',
                'w-full mx-auto min-h-screen py-12 lg:py-20 space-y-12 px-6 lg:px-8'
            )}
        >
            {isDynamicPage && (
                <Link
                    to={input.makeHrefToIndex()}
                    className="block w-10 h-10 border rounded-full p-1.5 bg-link-color/10 hover:bg-link-color/20"
                >
                    <IoReturnUpBackOutline className="w-full h-full text-link-color" />
                </Link>
            )}
            <div className={'prose prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl'}>
                <Render {...props} content={parsedContent}></Render>
            </div>
        </Container>
    );
}
