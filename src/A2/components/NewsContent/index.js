import React from 'react';
import {
    Link,
    Image,
    ArticleRender as Render,
    buildArticleBlocks,
} from '@uniwebcms/core-components';
import { LuArrowLeft } from 'react-icons/lu';
import Container from '../_utils/Container';
import { formatFlexibleDate } from '../_utils/date';
import { twJoin } from '@uniwebcms/module-sdk';
import { BeatLoader } from 'react-spinners';

export default function NewsContent(props) {
    const { input, website, page, block } = props;
    const { contentAlignment = 'auto' } = block.getBlockProperties();
    const article = input.profile;

    if (!article) return null;

    const { title, lastEditTime, head } = article.getBasicInfo() || {};

    const { tag = '' } = head || {};

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

    const isDynamicPage = page.activeRoute.includes('[id]');

    return (
        <Container className="animate-in fade-in slide-in-from-bottom-4 min-h-screen">
            <div className="w-full px-4 xs:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
                <div className="pt-8 pb-12 px-6 max-w-3xl mx-auto text-center">
                    {isDynamicPage && (
                        <Link
                            to={input.makeHrefToIndex()}
                            className="inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-95 text-sm md:text-md px-5 py-2.5 mb-6 text-text-color/70 hover:text-text-color"
                        >
                            <LuArrowLeft className="w-4 h-4" />{' '}
                            {website.localize({ en: 'Back to News', fr: 'Retour aux actualités' })}
                        </Link>
                    )}
                    <div className="flex justify-center gap-3 items-center mb-6">
                        {tag && (
                            <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wide text-primary-600">
                                {tag.split(',').join(', ')}
                            </span>
                        )}
                        <span className="font-mono text-sm md:text-md text-text-color/70 uppercase tracking-widest">
                            {formatFlexibleDate(lastEditTime)}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">{title}</h1>
                </div>
                <div className="max-w-4xl mx-auto px-6 pb-12">
                    <div className="rounded-[var(--border-radius)] overflow-hidden mb-12 shadow-xl aspect-video">
                        <Image
                            profile={article}
                            type="banner"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                    <div
                        className={twJoin(
                            'prose prose-base lg:prose-lg max-w-none',
                            contentAlignment === 'auto' && 'text-center md:text-left',
                            contentAlignment === 'left' && 'text-left',
                            contentAlignment === 'center' && 'text-center',
                            contentAlignment === 'right' && 'text-right'
                        )}
                    >
                        <Render {...props} content={parsedContent}></Render>
                    </div>
                </div>
            </div>
        </Container>
    );
}

NewsContent.Loader = ({ block }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] text-center p-4">
            <BeatLoader
                color="rgba(var(--primary-700) / 1.00)"
                aria-label="Loading"
                size={12}
                margin={4}
            />
            <p className="mt-4 text-text-color text-lg lg:text-2xl">
                {block.website.localize({
                    en: 'Loading news content...',
                    fr: 'Chargement du contenu de l’actualité...',
                })}
            </p>
            <p className="mt-1 text-text-color/70 text-sm lg:text-lg">
                {block.website.localize({
                    en: 'This should only take a few seconds.',
                    fr: 'Cela ne devrait prendre que quelques secondes.',
                })}
            </p>
        </div>
    );
};

NewsContent.inputSchema = {
    type: 'articles',
};
