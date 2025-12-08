import React, { useState, useEffect, useRef } from 'react';
import Container from '../_utils/Container';
import { twJoin, getPageProfile } from '@uniwebcms/module-sdk';
import { Image } from '@uniwebcms/core-components';

const parseMediaType = (item) => {
    if (item.url || item.value) {
        item.type = 'image';
    }

    if (item.src) {
        if (item.src.startsWith('https://assets.uniweb.app/')) {
            item.type = 'video';
        } else if (item.src.startsWith('https://www.youtube')) {
            item.type = 'youtube';
        }
    }
    return item;
};

export default function MediaBox(props) {
    const { block, extra } = props;

    // Get Content
    const { banner, images, videos } = block.getBlockContent();

    const mediaItems = [banner, ...images, ...videos]
        .map((item) => parseMediaType(item))
        .filter((item) => item?.type);

    // Get Configuration
    const {
        mediaInset = 'standard', // 'standard' | 'edge_to_edge'
        aspectRatio = 'video', // 'video' (16:9), 'standard' (4:3), 'square' (1:1), 'portrait' (3:4), 'auto'

        videoAutoplay = false,
        videoControls = true,
        videoMute = false,
        videoLoop = false,

        sliderAutoSwitch = true,
        sliderDuration = 5, // in seconds
    } = block.getBlockProperties();

    // --- STATE ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlayingVideo, setIsPlayingVideo] = useState(false);

    // Refs for managing timers
    const timerRef = useRef(null);
    const videoRef = useRef(null);

    const activeItem = mediaItems[currentIndex];
    const itemCount = mediaItems.length;
    const hasMultiple = itemCount > 1;

    // --- LOGIC HELPERS ---

    // Check if the current item is a video that is set to Autoplay
    // If so, we should PAUSE the slider timer and the progress animation
    const isAutoPlayVideo =
        videoAutoplay &&
        activeItem &&
        (activeItem.type === 'video' || activeItem.type === 'youtube');

    // --- EFFECT: SLIDESHOW TIMER ---
    useEffect(() => {
        // Stop if:
        // 1. Auto-switch disabled
        // 2. Only 1 item
        // 3. User manually playing video (isPlayingVideo)
        // 4. Component is auto-playing a video (isAutoPlayVideo)
        if (!sliderAutoSwitch || itemCount <= 1 || isPlayingVideo || isAutoPlayVideo) {
            return;
        }

        const time = sliderDuration * 1000;

        timerRef.current = setTimeout(() => {
            nextSlide();
        }, time);

        return () => clearTimeout(timerRef.current);
    }, [
        currentIndex,
        sliderAutoSwitch,
        sliderDuration,
        itemCount,
        isPlayingVideo,
        isAutoPlayVideo,
    ]);

    // --- HANDLERS ---

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % itemCount);
        setIsPlayingVideo(false);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
        setIsPlayingVideo(false);
    };

    const handleVideoPlay = () => {
        if (sliderAutoSwitch) {
            setIsPlayingVideo(true);
            clearTimeout(timerRef.current);
        }
    };

    const handleVideoEnd = () => {
        if (sliderAutoSwitch && !videoLoop) {
            nextSlide();
        } else {
            setIsPlayingVideo(false);
        }
    };

    // --- STYLES ---

    const ratioClasses = {
        video: 'aspect-video',
        standard: 'aspect-[4/3]',
        square: 'aspect-square',
        portrait: 'aspect-[3/4]',
        auto: '',
    };

    const insetClasses = {
        standard: 'p-4 @md:p-6 @lg:p-8',
        edge_to_edge: 'p-0',
    };

    // Helper for applying radius to inner elements
    const radiusClass = mediaInset === 'standard' ? 'rounded-[var(--border-radius)]' : '';

    // --- RENDERERS ---

    const renderImage = ({ type, ...item }) => (
        <Image
            profile={getPageProfile()}
            {...item}
            className={twJoin(
                'w-full h-full',
                aspectRatio === 'auto' ? 'object-contain' : 'object-cover',
                radiusClass
            )}
        />
    );

    const renderNativeVideo = (item) => (
        <video
            ref={videoRef}
            src={item.src}
            poster={item.poster}
            controls={videoControls}
            autoPlay={videoAutoplay}
            muted={videoMute || videoAutoplay}
            loop={videoLoop}
            playsInline
            className={twJoin('w-full h-full object-cover', radiusClass)}
            onPlay={handleVideoPlay}
            onEnded={handleVideoEnd}
        />
    );

    const renderYoutube = (item) => {
        const videoId =
            item.src.match(/(?:embed\/|v=|\/v\/|youtu\.be\/|\/embed\/)([^?&"'>]+)/)?.[1] || '';

        const params = new URLSearchParams({
            autoplay: videoAutoplay ? '1' : '0',
            controls: videoControls ? '1' : '0',
            mute: videoMute || videoAutoplay ? '1' : '0',
            loop: videoLoop ? '1' : '0',
            rel: '0',
        });

        if (videoLoop) params.append('playlist', videoId);

        return (
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
                className={twJoin('w-full h-full', radiusClass)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={item.alt || 'Video'}
                loading="lazy"
            />
        );
    };

    const renderContent = (item) => {
        if (!item) return null;
        switch (item.type) {
            case 'video':
                return renderNativeVideo(item);
            case 'youtube':
                return renderYoutube(item);
            case 'image':
                return renderImage(item);
            default:
                return null;
        }
    };

    return (
        <Container
            className={twJoin('flex flex-col h-full overflow-hidden', insetClasses[mediaInset])}
            {...extra}
        >
            <style>
                {`
                    @keyframes progress-fill {
                        from { width: 0%; }
                        to { width: 100%; }
                    }
                `}
            </style>

            {/* MEDIA FRAME */}
            <div
                className={twJoin(
                    'relative w-full bg-neutral-100',
                    // The wrapper also gets radius to help with masking if needed
                    mediaInset === 'standard' ? 'rounded-[var(--border-radius)]' : '',
                    ratioClasses[aspectRatio]
                )}
            >
                {activeItem && renderContent(activeItem)}

                {!activeItem && (
                    <div className="flex items-center justify-center w-full h-full text-txt-color/60">
                        <p>No media selected</p>
                    </div>
                )}
            </div>

            {/* SLIDER INDICATORS */}
            {hasMultiple && (
                <div
                    className={twJoin(
                        'flex flex-wrap items-center justify-center gap-2 mt-4',
                        mediaInset === 'edge_to_edge' ? 'px-4' : ''
                    )}
                >
                    {mediaItems.map((_, index) => {
                        const isActive = index === currentIndex;
                        // Determine if we should show the progress animation:
                        // 1. Must be the active slide
                        // 2. Auto switch must be enabled
                        // 3. Must NOT be an autoplaying video (timer is paused)
                        // 4. Must NOT be a manually playing video (timer is paused)
                        const showProgress =
                            isActive && sliderAutoSwitch && !isAutoPlayVideo && !isPlayingVideo;

                        return (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                type="button"
                                aria-label={`Go to slide ${index + 1}`}
                                className={twJoin(
                                    'relative h-1.5 rounded-full overflow-hidden transition-all duration-300 focus:outline-none',
                                    isActive
                                        ? 'w-8 bg-primary-700'
                                        : 'w-2 bg-text-color/20 hover:bg-text-color/40'
                                )}
                            >
                                {/* PROGRESS OVERLAY (Gray filling from left) */}
                                {showProgress && (
                                    <div
                                        className="absolute top-0 left-0 h-full bg-neutral-300/80"
                                        style={{
                                            animationName: 'progress-fill',
                                            animationDuration: `${sliderDuration}s`,
                                            animationTimingFunction: 'linear',
                                            animationFillMode: 'forwards',
                                        }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </Container>
    );
}
