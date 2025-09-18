import React from 'react';
import { Profile, getPageProfile } from '@uniwebcms/module-sdk';
import { Image } from '@uniwebcms/core-components';

const locales = {
    en: 'en-US',
    fr: 'fr-FR',
    es: 'es-ES',
    zh: 'zh-CN',
};

const HeadComponent = ({ date, title, subtitle, banner, author, tags }) => {
    const { name: authorName, avatar: authorAvatar } = author || {};
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
                    {tags.length > 0 && (
                        <div className="lg:block flex items-center space-x-2 flex-wrap">
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 text-xs md:text-sm lg:text-base bg-accent-50 text-accent-500 rounded-full font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <div className="w-full lg:w-[43%] flex-shrink-0 aspect-[16/9] rounded-xl overflow-hidden shadow">
                    {/* <Image profile={article} type="banner" className="w-full h-full object-cover" /> */}
                    {banner}
                </div>
            </div>
            {date && <div className="block lg:hidden text-sm text-text-color-50 pt-5">{date}</div>}
        </div>
    );
};

export default function ArticleHead(props) {
    const { input, website, block } = props;

    let date, title, subtitle, banner, author, tags;

    // If input is a profile, use its data
    if (input?.profile) {
        const article = input.profile;
        ({ title, subtitle } = article.getBasicInfo());
        const head = article.basicInfo.head;
        date = head?.date
            ? new Date(head.date).toLocaleDateString(locales[website.getLanguage()], {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
              })
            : '';
        banner = <Image profile={article} type="banner" className="w-full h-full object-cover" />;
        const authorInfo = article.at('article_information')?.author || null;
        tags = head?.tag ? head.tag.split(',').map((t) => t.trim()) : [];

        if (authorInfo) {
            let [authorId, authorData] = authorInfo;
            authorData = typeof authorData === 'string' ? JSON.parse(authorData) : authorData;
            const authorProfile = Profile.newProfile('members', authorId, { head: authorData });
            author = {
                name: authorProfile.getBasicInfo()?.title,
                avatar: (
                    <Image
                        profile={authorProfile}
                        type="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                ),
            };
        }
    } else {
        let bannerImage;
        ({ banner: bannerImage, pretitle: date, title, subtitle } = block.getBlockContent());

        if (bannerImage) {
            banner = (
                <Image
                    profile={getPageProfile()}
                    {...bannerImage}
                    className="w-full h-full object-cover"
                />
            );
        }

        const firstItem = block.getBlockItems()[0];

        if (firstItem) {
            author = {};
            if (firstItem.banner) {
                author.avatar = (
                    <Image
                        profile={getPageProfile()}
                        {...firstItem.banner}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                );
            }
            if (firstItem.title) {
                author.name = firstItem.title;
            }
            if (firstItem.lists[0]) {
                tags = firstItem.lists[0].map((item) => item.paragraphs[0]);
            }
        }
    }

    // const article = input?.profile;

    // if (!article) return null;

    // const { title, subtitle, head } = article.getBasicInfo();

    // const author = article.at('article_information')?.author || null;

    // const tags = head?.tag ? head.tag.split(',').map((t) => t.trim()) : [];
    // const date = head?.date
    //     ? new Date(head.date).toLocaleDateString(locales[website.getLanguage()], {
    //           year: 'numeric',
    //           month: 'long',
    //           day: 'numeric',
    //       })
    //     : '';

    // const banner = <Image profile={article} type="banner" className="w-full h-full object-cover" />;

    // let authorName = '';
    // let authorAvatar = null;

    // if (author) {
    //     let [authorId, authorInfo] = author;
    //     authorInfo = typeof authorInfo === 'string' ? JSON.parse(authorInfo) : authorInfo;
    //     const authorProfile = Profile.newProfile('members', authorId, { head: authorInfo });
    //     authorName = authorProfile.getBasicInfo()?.title;
    //     authorAvatar = (
    //         <Image
    //             profile={authorProfile}
    //             type="avatar"
    //             className="w-8 h-8 rounded-full object-cover"
    //         />
    //     );
    // }

    return (
        <HeadComponent
            date={date}
            title={title}
            subtitle={subtitle}
            banner={banner}
            author={author}
            tags={tags}
        />
    );

    // return (
    //     <div className="max-w-7xl mx-auto pt-36 pb-12 px-6">
    //         <div className="flex lg:flex-row flex-col items-center gap-8 xl:gap-16">
    //             <div className="flex flex-col flex-grow gap-y-8">
    //                 {date && (
    //                     <div className="hidden lg:block text-base text-text-color-50 pb-2">
    //                         {date}
    //                     </div>
    //                 )}
    //                 <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-pretty">
    //                     {title}
    //                 </h1>
    //                 {subtitle && (
    //                     <p className="text-lg md:text-xl text-text-color-70">{subtitle}</p>
    //                 )}
    //                 {authorName || authorAvatar ? (
    //                     <div className="flex items-center gap-3">
    //                         {authorAvatar}
    //                         <span className="text-sm md:text-base lg:text-xl text-text-color-70 font-medium">
    //                             {authorName}
    //                         </span>
    //                     </div>
    //                 ) : null}
    //                 {tags.length > 0 && (
    //                     <div className="lg:block flex items-center space-x-2 flex-wrap">
    //                         {tags.map((tag, index) => (
    //                             <span
    //                                 key={index}
    //                                 className="px-3 py-1.5 text-xs md:text-sm lg:text-base bg-accent-50 text-accent-500 rounded-full font-medium"
    //                             >
    //                                 {tag}
    //                             </span>
    //                         ))}
    //                     </div>
    //                 )}
    //             </div>
    //             <div className="w-full lg:w-[43%] flex-shrink-0 aspect-[16/9] rounded-xl overflow-hidden shadow">
    //                 <Image profile={article} type="banner" className="w-full h-full object-cover" />
    //             </div>
    //         </div>
    //         {date && <div className="block lg:hidden text-sm text-text-color-50 pt-5">{date}</div>}
    //     </div>
    // );
}
