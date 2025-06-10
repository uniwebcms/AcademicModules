import React, { useRef } from 'react';
import { ArticleRender as Render, buildArticleBlocks } from '@uniwebcms/core-components';
import SideNavigator from './components/SideNavigator';

export default function Article(props) {
    const articleRef = useRef(null);

    const { website, input } = props;

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

    return (
        <div className="w-full max-w-7xl mx-auto min-h-screen px-6 pt-16 pb-24">
            <div className="w-full flex items-start">
                <div ref={articleRef} className="max-w-3xl flex-shrink-0">
                    <article className="prose prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl">
                        <Render {...props} content={parsedContent}></Render>
                    </article>
                </div>
                <div className="hidden lg:block sticky top-28 lg:pl-24 xl:pl-28 2xl:pl-32 flex-grow">
                    <SideNavigator articleRef={articleRef} />
                </div>
            </div>
        </div>
    );
}
