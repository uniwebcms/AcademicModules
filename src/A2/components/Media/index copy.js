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

    console.log('mediaItems', mediaItems);

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

    // Refs for managing timers and video elements
    const timerRef = useRef(null);
    const videoRef = useRef(null);

    const activeItem = mediaItems[currentIndex];
    const itemCount = mediaItems.length;
    const hasMultiple = itemCount > 1;

    // --- HELPER CONFIGS ---
    const ratioClasses = {
        video: 'aspect-video', // 16/9
        standard: 'aspect-[4/3]',
        square: 'aspect-square', // 1/1
        portrait: 'aspect-[3/4]',
        auto: '', // Let content define height
    };

    const insetClasses = {
        standard: 'p-4 @md:p-6 @lg:p-8',
        edge_to_edge: 'p-0',
    };

    // --- LOGIC ---

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % itemCount);
        setIsPlayingVideo(false); // Reset video state on slide change
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
        setIsPlayingVideo(false);
    };

    // Automated Slideshow Logic
    useEffect(() => {
        // Stop if auto-switch is off, or only 1 item, or currently playing a video (waiting for end)
        if (!sliderAutoSwitch || itemCount <= 1 || isPlayingVideo) {
            return;
        }

        // Determine duration (Videos might be treated differently in future, for now using global duration for non-playing states)
        const time = sliderDuration * 1000;

        timerRef.current = setTimeout(() => {
            nextSlide();
        }, time);

        return () => clearTimeout(timerRef.current);
    }, [currentIndex, sliderAutoSwitch, sliderDuration, itemCount, isPlayingVideo]);

    // Video Event Handlers
    const handleVideoPlay = () => {
        if (sliderAutoSwitch) {
            // Pause the slider timer while video plays
            setIsPlayingVideo(true);
            clearTimeout(timerRef.current);
        }
    };

    const handleVideoEnd = () => {
        if (sliderAutoSwitch && !videoLoop) {
            // Video finished, move to next immediately
            nextSlide();
        } else {
            setIsPlayingVideo(false);
        }
    };

    // --- RENDERERS ---

    const renderImage = ({ type, ...item }) => (
        <Image
            profile={getPageProfile()}
            {...item}
            className={twJoin(
                'w-full h-full',
                aspectRatio === 'auto' ? 'object-contain' : 'object-cover'
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
            muted={videoMute || videoAutoplay} // Autoplay usually requires mute
            loop={videoLoop}
            playsInline
            className="w-full h-full object-cover"
            onPlay={handleVideoPlay}
            onEnded={handleVideoEnd}
        />
    );

    const renderYoutube = (item) => {
        // Extract ID (basic regex for standard links)
        const videoId =
            item.src.match(/(?:embed\/|v=|\/v\/|youtu\.be\/|\/embed\/)([^?&"'>]+)/)?.[1] || '';

        const params = new URLSearchParams({
            autoplay: videoAutoplay ? '1' : '0',
            controls: videoControls ? '1' : '0',
            mute: videoMute || videoAutoplay ? '1' : '0',
            loop: videoLoop ? '1' : '0',
            rel: '0', // No related videos
        });

        // conditionally add playlist if looping
        if (videoLoop) {
            params.append('playlist', videoId);
        }

        return (
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={item.alt || 'Video'}
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
        }
    };

    return (
        <Container
            className={twJoin('flex flex-col h-full overflow-hidden', insetClasses[mediaInset])}
            {...extra}
        >
            {/* MEDIA FRAME */}
            <div
                className={twJoin(
                    'relative w-full overflow-hidden bg-neutral-100',
                    mediaInset === 'standard' ? 'rounded-[var(--border-radius)]' : '',
                    ratioClasses[aspectRatio]
                )}
            >
                {activeItem && renderContent(activeItem)}

                {/* Fallback for empty state */}
                {!activeItem && (
                    <div className="flex items-center justify-center w-full h-full text-txt-color/60">
                        <p>No media selected</p>
                    </div>
                )}
            </div>

            {/* SLIDER INDICATORS (Only if multiple items) */}
            {hasMultiple && (
                <div
                    className={twJoin(
                        'flex flex-wrap items-center justify-center gap-2 mt-4',
                        // If Inset is edge-to-edge, we might want to add padding to the indicators
                        mediaInset === 'edge_to_edge' ? 'px-4' : ''
                    )}
                >
                    {mediaItems.map((_, index) => {
                        const isActive = index === currentIndex;
                        return (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                type="button"
                                aria-label={`Go to slide ${index + 1}`}
                                className={twJoin(
                                    'h-2 rounded-full transition-all duration-300 focus:outline-none',
                                    isActive
                                        ? 'w-8 bg-primary-700' // Active: Long bar
                                        : 'w-3 bg-text-color/40 hover:bg-text-color/70' // Inactive: Dot
                                )}
                            />
                        );
                    })}
                </div>
            )}
        </Container>
    );
}
