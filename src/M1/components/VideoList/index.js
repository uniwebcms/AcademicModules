import React from 'react';
import Container from '../_utils/Container';
import { twJoin, Image, Link, Profile } from '@uniwebcms/module-sdk';

// const ArticleAuthor = ({ info, in_side_panel }) => {
//     if (!info.author) return null;

//     let [authorId, authorInfo] = info.author;
//     authorInfo = typeof authorInfo === 'string' ? JSON.parse(authorInfo) : authorInfo;

//     const authorProfile = Profile.newProfile('members', authorId, { head: authorInfo });

//     const { title } = authorProfile.getBasicInfo();

//     return (
//         <div className={twJoin(in_side_panel ? 'h-8 gap-2' : 'h-12 gap-4', 'flex items-center')}>
//             <Image
//                 profile={authorProfile}
//                 type="avatar"
//                 className={twJoin(in_side_panel ? 'w-7 h-7' : 'w-10 h-10', 'rounded-full')}
//             />
//             <div>
//                 <p
//                     className={twJoin(
//                         in_side_panel ? 'text-sm' : 'text-sm lg:text-base',
//                         'text-text-color-70'
//                     )}
//                 >
//                     {title}
//                 </p>
//                 {info.date && (
//                     <p
//                         className={twJoin(
//                             in_side_panel ? 'text-xs' : 'text-xs lg:text-sm',
//                             'text-text-color-40'
//                         )}
//                     >
//                         {new Date(info.date).toLocaleDateString('en-US', {
//                             year: 'numeric',
//                             month: 'long',
//                             day: 'numeric',
//                         })}
//                     </p>
//                 )}
//             </div>
//         </div>
//     );
// };

export default function VideoList(props) {
    const { block, input } = props;
    const { title, subtitle } = block.getBlockContent();

    const {
        width = 'md',
        vertical_padding = 'lg',
        horizontal_padding = 'sm',
        in_side_panel = 'false',
    } = block.getBlockProperties();

    const videos = input?.profiles || [];

    if (!videos.length) return null;

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
                    {videos.map((video, index) => {
                        const { title, subtitle, lastLocalEditTime } = video.getBasicInfo();

                        return (
                            <Link
                                key={index}
                                to={input.makeHref(video)}
                                className={twJoin(
                                    in_side_panel ? 'space-x-4' : 'space-x-8',
                                    'flex items-start group'
                                )}
                            >
                                <div
                                    className={twJoin(
                                        in_side_panel ? 'w-40 aspect-video' : 'w-52 aspect-video',
                                        'rounded-lg overflow-hidden flex-shrink-0'
                                    )}
                                >
                                    <Image
                                        profile={video}
                                        type="banner"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    {title && (
                                        <h3
                                            className={twJoin(
                                                in_side_panel
                                                    ? 'text-sm lg:text-base font-medium !leading-snug'
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
                                                'line-clamp-1 text-text-color-50 break-all'
                                            )}
                                            title={subtitle}
                                        >
                                            {subtitle}
                                        </p>
                                    )}
                                    {lastLocalEditTime && (
                                        <p className="text-xs text-text-color-60 mt-1.5">
                                            {lastLocalEditTime}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </ul>
            </div>
        </Container>
    );
}
