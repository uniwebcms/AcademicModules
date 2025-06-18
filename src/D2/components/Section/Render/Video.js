import React, { useState, useEffect } from 'react';
import { FaCompress, FaExpand } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import { twJoin, website, stripTags } from '@uniwebcms/module-sdk';
import { Media, Image } from '@uniwebcms/core-components';

const youtubeRegex =
    /\b(?:https?:\/\/)?(?:(?:www|m)\.)?youtu(?:\.be\/|be\.com\/(?:watch(?:\?(?:(?:feature=player_embedded|app=desktop)&)?v=|\/)|v\/|oembed\?url=http%3A\/\/www\.youtube\.com\/watch\?v%3D|attribution_link\?a=[0-9A-Za-z\-_]{10,20}&u=(?:%2F|\/)watch%3Fv%3D|e(?:mbed)?\/|shorts\/)|be-nocookie\.com\/embed\/)([0-9A-Za-z\-_]{10,20})/;

const vimeoRegex =
    /(?:http|https)?:?\/?\/?(?:www\.)?(?:player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;

function getVideos(sections) {
    const videos = sections
        .map((section) => section.content.content?.filter((object) => object.type === 'Video'))
        .flat()
        .map((video) => video.attrs);
    return videos;
}

async function getVideoThumbnail(url) {
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
        const videoId = vimeoMatch[1];
        try {
            const response = await fetch(
                `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`
            );
            const data = await response.json();
            return data.thumbnail_url;
        } catch (error) {
            console.error('Failed to fetch Vimeo thumbnail:', error);
            return null;
        }
    }

    return null;
}

export default function Video({ block, page, videoControl, ...video }) {
    const profile = page.getPageProfile();
    const sections = page.blockGroups.body;
    const videos = getVideos(sections);

    let caption = video?.caption || '';
    caption = stripTags(caption);

    // const [src, setSrc] = useState(video.src);
    const [currentVideo, setCurrentVideo] = useState(video);
    const [miniPlayer, setMiniPlayer] = useState(false);
    const [overlay, setOverlay] = useState(false);

    const resetVideo = () => {
        if (video.src !== currentVideo.src) {
            setCurrentVideo(video);
        }
    };

    const changeVideo = (newVideo) => {
        return () => {
            setCurrentVideo(newVideo);
        };
    };

    const toggleMiniPlayer = () => {
        setOverlay(false);
        if (miniPlayer) {
            resetVideo();
        }
        setMiniPlayer(!miniPlayer);
    };

    const toggleOverlay = () => {
        setMiniPlayer(false);
        if (overlay) {
            resetVideo();
        }
        setOverlay(!overlay);
    };

    const [ogThumbnail, setOgThumbnail] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnails, setThumbnails] = useState(Array(videos.length).fill(null));

    const playerClasses = twJoin(
        miniPlayer && 'fixed bottom-4 right-4 w-64 h-36 z-50',
        overlay && 'flex w-full max-w-6xl mx-auto shadow-lg px-4'
    );

    const outerClasses = twJoin(
        !overlay && 'absolute inset-0 z-10',
        overlay && 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80'
    );

    useEffect(() => {
        async function fetchThumbnail() {
            const thumb = await getVideoThumbnail(video.src);
            setOgThumbnail(thumb);
        }
        fetchThumbnail();
    }, []);

    useEffect(() => {
        async function fetchThumbnail() {
            const thumb = await getVideoThumbnail(currentVideo.src);
            setThumbnail(thumb);
        }
        // setSrc(currentVideo.src);
        fetchThumbnail();
    }, [currentVideo]);

    useEffect(() => {
        async function fetchThumbnails() {
            const array = await Promise.all(
                videos.map(async ({ src }) => {
                    const thumb = await getVideoThumbnail(src);
                    return thumb;
                })
            );
            setThumbnails(array);
        }
        fetchThumbnails();
    }, []);

    // hit esc to close overlay
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                if (overlay) {
                    setOverlay(false);
                } else if (miniPlayer) {
                    setMiniPlayer(false);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [overlay, miniPlayer]);

    const Buttons = () =>
        videoControl ? (
            <div className={twJoin('flex space-x-4', caption ? 'mt-10' : 'mt-6')}>
                <button
                    onClick={toggleMiniPlayer}
                    className="flex items-center px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500"
                >
                    <FaCompress className="mr-2 text-slate-700 dark:text-slate-100" />
                    <span className="text-sm md:text-base text-slate-700 dark:text-slate-100">
                        {website.localize({
                            en: 'Mini Player',
                            es: 'Reproductor Mini',
                        })}
                    </span>
                </button>
                <button
                    onClick={toggleOverlay}
                    className="flex items-center px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 dark:border-slate-500 dark:hover:bg-slate-700"
                >
                    <FaExpand className="mr-2 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm md:text-base text-slate-700 dark:text-slate-300">
                        {website.localize({
                            en: 'Overlay',
                            es: 'Superposición',
                        })}
                    </span>
                </button>
            </div>
        ) : null;

    const FakeBlock = () => (
        <Image
            className="relative z-0 flex-1 block m-0 aspect-video"
            {...{ profile, url: ogThumbnail }}
        />
    );

    return (
        <div className="not-prose mb-6 lg:my-8">
            <div className="relative">
                {/* Mini close button */}
                {miniPlayer && (
                    <button
                        className="fixed bottom-[166px] right-4 bg-slate-100 text-slate-400 hover:text-slate-600"
                        onClick={toggleMiniPlayer}
                    >
                        <HiX className="h-5 w-5" />
                    </button>
                )}
                <div className={outerClasses}>
                    <div className={playerClasses}>
                        {/* Overlay close button */}
                        {overlay && (
                            <button
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
                                onClick={toggleOverlay}
                            >
                                <HiX className="h-6 w-6" />
                            </button>
                        )}
                        {/* Main Video Area */}
                        <div className={`flex-1 block`}>
                            <Media
                                className="mt-0"
                                media={currentVideo}
                                block={block}
                                {...(thumbnail && { thumbnail: { url: thumbnail } })}
                            />
                        </div>
                        {/* Thumbnail Grid */}
                        {overlay && (
                            <div className="hidden lg:block w-1/4 px-6 py-4 overflow-y-auto bg-gray-900/75 overscroll-contain aspect-video">
                                <p className="text-slate-300 text-lg font-medium mb-4">
                                    {website.localize({
                                        en: 'Related Videos',
                                        es: 'Videos Relacionados',
                                    })}
                                </p>
                                {videos.map((video, index) => {
                                    const currentThumbnail = thumbnails[index];

                                    return (
                                        <div
                                            key={index}
                                            className={`cursor-pointer rounded-lg transition-transform transform hover:scale-105 mb-4 ${
                                                video === currentVideo
                                                    ? 'border-2 border-indigo-500'
                                                    : ''
                                            }`}
                                            onClick={changeVideo(video)}
                                        >
                                            <Image
                                                className="w-full aspect-video object-contain rounded-md"
                                                {...{ profile, url: currentThumbnail }}
                                            />
                                            {video.caption && (
                                                <div className="text-slate-300 text-xs text-center mt-1">
                                                    {video.caption}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {/* Show caption under full screen */}
                        {overlay && currentVideo?.caption ? (
                            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-slate-200 text-sm bg-slate-950">
                                {currentVideo.caption}
                            </div>
                        ) : null}
                    </div>
                    {caption && !overlay ? (
                        <div
                            className={`block outline-none text-slate-500 dark:text-slate-400 border-none text-sm text-center mt-1`}
                        >
                            {caption}
                        </div>
                    ) : null}
                </div>
                {/* Conditional Rendering of FakeBlock and Buttons */}
                {<FakeBlock />}
            </div>
            {!overlay && <Buttons />}
        </div>
    );
}
