import React from 'react';
import { Profile } from '@uniwebcms/module-sdk';
import { Image } from '@uniwebcms/core-components';

const locales = {
    en: 'en-US',
    fr: 'fr-FR',
    es: 'es-ES',
    zh: 'zh-CN',
};

export default function ArticleHead(props) {
    const { input, website } = props;

    const article = input?.profile;

    if (!article) return null;

    console.log('article', article);

    const { title, subtitle, head } = article.getBasicInfo();

    console.log('head', head);

    const author = article.at('article_information')?.author || null;

    const tag = head?.tag || '';
    const date = head?.date
        ? new Date(head.date).toLocaleDateString(locales[website.getLanguage()], {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : '';

    let authorName = '';
    let authorAvatar = null;

    if (author) {
        let [authorId, authorInfo] = author;
        authorInfo = typeof authorInfo === 'string' ? JSON.parse(authorInfo) : authorInfo;
        const authorProfile = Profile.newProfile('members', authorId, { head: authorInfo });
        authorName = authorProfile.getBasicInfo()?.title;
        authorAvatar = (
            <Image
                profile={authorProfile}
                type="avatar"
                className="w-8 h-8 rounded-full object-cover"
            />
        );
    }

    return (
        <div className="max-w-7xl mx-auto pt-36 pb-12 px-6">
            <div className="flex lg:flex-row flex-col items-center gap-8 xl:gap-16">
                <div className="flex flex-col flex-grow gap-y-8">
                    {date && (
                        <div className="hidden lg:block text-base text-text-color-50 pb-2">
                            {date}
                        </div>
                    )}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-pretty">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-lg md:text-xl text-text-color-70">{subtitle}</p>
                    )}
                    {authorName || authorAvatar ? (
                        <div className="flex items-center gap-3">
                            {authorAvatar}
                            <span className="text-sm md:text-base lg:text-xl text-text-color-70 font-medium">
                                {authorName}
                            </span>
                        </div>
                    ) : null}
                    {tag && (
                        <div className="hidden lg:block">
                            <span className="px-3 py-1.5 text-xs md:text-sm lg:text-base bg-accent-50 text-accent-500 rounded-full font-medium">
                                {tag}
                            </span>
                        </div>
                    )}
                </div>
                <div className="w-full lg:w-[43%] flex-shrink-0 aspect-[16/9] rounded-xl overflow-hidden shadow">
                    <Image profile={article} type="banner" className="w-full h-full object-cover" />
                </div>
            </div>
            {date && <div className="block lg:hidden text-sm text-text-color-50 pt-5">{date}</div>}
        </div>
    );
}
