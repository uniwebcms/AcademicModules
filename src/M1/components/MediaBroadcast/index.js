import React, { useState, useEffect } from 'react';
import Container from '../_utils/Container';
import { getMediaLinkType, getMediaIcon } from '../_utils/media';
import { SiYoutube, SiVimeo } from 'react-icons/si';
import { HiX } from 'react-icons/hi';
import { Link, Image } from '@uniwebcms/module-sdk';

const VideoThumbnail = (props) => {
    const { src, caption: defaultTitle } = props;

    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                setIsFullscreen(false);
            }
        };

        if (isFullscreen) {
            // Prevent scrolling on the body when fullscreen is active
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEscKey);
        } else {
            // Restore scrolling when exiting fullscreen
            document.body.style.overflow = 'unset';
        }

        return () => {
            // Cleanup: remove event listener and restore scrolling
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'unset';
        };
    }, [isFullscreen]);

    // Function to identify the video platform and extract the ID
    const getVideoDetails = (url) => {
        const youtubeRegex =
            /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const vimeoRegex = /vimeo\.com\/(?:channels\/\w+\/|groups\/\w+\/videos\/|video\/|)(\d+)/;

        const youtubeMatch = url.match(youtubeRegex);
        const vimeoMatch = url.match(vimeoRegex);

        if (youtubeMatch) {
            return { platform: 'youtube', id: youtubeMatch[1] };
        } else if (vimeoMatch) {
            return { platform: 'vimeo', id: vimeoMatch[1] };
        } else {
            return { platform: null, id: null };
        }
    };

    const { platform, id } = getVideoDetails(src);

    if (!platform || !id) {
        return null;
    }

    let thumbnail, title, error;

    if (platform === 'youtube') {
        thumbnail = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
        title = defaultTitle;
    } else if (platform === 'vimeo') {
        let { data, error: queryError } = uniweb.useCompleteQuery(
            `https://vimeo.com/api/v2/video/${id}.json`,
            async () => {
                const response = await fetch(`https://vimeo.com/api/v2/video/${id}.json`);
                const data = await response.json();
                const thumbnail = data[0]?.thumbnail_large || '';
                const title = data[0]?.title || '';

                return { thumbnail, title };
            }
        );

        if (data) {
            thumbnail = data.thumbnail;
            title = data.title;
        }
        error = queryError;
    }

    if (error) return null;

    const allow =
        platform === 'youtube'
            ? 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            : 'autoplay; fullscreen; picture-in-picture';

    return (
        <div className="relative">
            {/* Video thumbnail */}
            <div
                className="relative hover:scale-105 cursor-pointer"
                onClick={() => setIsFullscreen(true)}
            >
                <img src={thumbnail} alt={title} className="w-full aspect-video object-cover" />
                {title && (
                    <div className="absolute inset-x-0 bottom-0 z-10 px-2 py-2 w-full flex items-center space-x-2 bg-black bg-opacity-50">
                        {platform === 'youtube' && (
                            <SiYoutube className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        {platform === 'vimeo' && (
                            <div className="w-5 h-5 bg-blue-500 flex-shrink-0 p-1">
                                <SiVimeo className="w-full h-full text-white" />
                            </div>
                        )}
                        <span className="text-sm font-medium text-white truncate" title={title}>
                            {title}
                        </span>
                    </div>
                )}
            </div>
            {/* Video modal */}
            {isFullscreen && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
                    <div
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                    >
                        <HiX className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-full max-w-full lg:max-w-4xl px-4">
                        <iframe
                            className="w-full aspect-video object-cover"
                            src={`${src}?autoplay=1`}
                            allow={allow}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default function MediaBroadcast(props) {
    const { block, website } = props;

    const { title, links, images, videos } = block.getBlockContent();

    let mediaLinks = [],
        otherLinks = [];

    links.forEach((link) => {
        const type = getMediaLinkType(link);

        if (type) {
            link.mt = type;
            mediaLinks.push(link);
        } else {
            otherLinks.push(link);
        }
    });

    const [primaryLink, secondaryLink] = otherLinks;

    return (
        <Container
            py="lg"
            className="max-w-8xl mx-auto flex flex-col lg:flex-row items-center gap-y-8 lg:gap-x-12"
        >
            {/* content */}
            <div className="w-full lg:w-1/2 max-w-full lg:max-w-[38rem] mr-auto">
                {title && (
                    <h2
                        className="text-3xl md:text-4xl lg:text-5xl tracking-wide text-pretty"
                        style={{
                            lineHeight: '1.25',
                        }}
                    >
                        {title}
                    </h2>
                )}
                {mediaLinks.length && (
                    <div className="mt-6 lg:mt-12 flex items-center gap-x-5 px-4">
                        {mediaLinks.map((link, index) => {
                            const { label, href, mt: type } = link;

                            const linkTitle = {
                                en: `${label || type} link`,
                                fr: `Lien ${label || type}`,
                            };

                            const Icon = getMediaIcon(type);

                            return (
                                <a
                                    key={index}
                                    className="w-8 h-8"
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={website.localize(linkTitle)}
                                >
                                    <span className="sr-only">{type}</span>
                                    <Icon className="w-7 h-7 hover:scale-105 !text-link-color hover:!text-link-hover-color" />
                                </a>
                            );
                        })}
                    </div>
                )}
                {primaryLink || secondaryLink ? (
                    <div className="mt-8 lg:mt-16 flex items-center justify-between">
                        {primaryLink && (
                            <Link
                                to={primaryLink.href}
                                className="max-w-[44%] truncate text-lg lg:text-xl font-semibold text-text-color flex items-center justify-center py-3 px-10 border-2 border-primary-600 rounded-3xl hover:shadow-lg"
                            >
                                {primaryLink.label}
                            </Link>
                        )}
                        {secondaryLink && (
                            <Link
                                to={secondaryLink.href}
                                className="max-w-[44%] truncate text-lg lg:text-xl font-semibold text-text-color flex items-center justify-center py-3 px-10 border-2 border-secondary-600 rounded-3xl hover:shadow-lg"
                            >
                                {secondaryLink.label}
                            </Link>
                        )}
                    </div>
                ) : null}
            </div>
            {/* media */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 w-full lg:w-1/2 pl-0 lg:pl-12 gap-6 lg:gap-8 xl:gap-10">
                {videos.map((video, index) => {
                    return (
                        <div key={index}>
                            <VideoThumbnail {...video} />
                        </div>
                    );
                })}
                {images.map((image, index) => {
                    const { caption } = image;

                    const imageElement = (
                        <Image
                            key={index}
                            {...image}
                            className="w-full aspect-video object-cover"
                        />
                    );

                    const urlRegex =
                        /^(https?:\/\/)?((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})|localhost)(:\d+)?(\/[^\s]*)?$/;

                    if (urlRegex.test(caption)) {
                        return (
                            <a
                                key={index}
                                href={caption}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block hover:scale-105 cursor-pointer"
                            >
                                {imageElement}
                            </a>
                        );
                    }

                    return imageElement;
                })}
            </div>
        </Container>
    );
}
