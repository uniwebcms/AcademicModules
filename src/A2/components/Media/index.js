import React, { useState, useEffect, useRef } from 'react';
import Container from '../_utils/Container';
import { twJoin, getPageProfile } from '@uniwebcms/module-sdk';
import { Image } from '@uniwebcms/core-components';

// --- HELPERS ---

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

const loadYouTubeAPI = (() => {
    let promise = null;
    return () => {
        if (!promise) {
            promise = new Promise((resolve, reject) => {
                if (window.YT && window.YT.Player) {
                    return resolve(window.YT);
                }
                const script = document.createElement('script');
                script.src = 'https://www.youtube.com/iframe_api';
                window.onYouTubeIframeAPIReady = () => resolve(window.YT);
                script.onerror = () =>
                    reject(new Error('Failed to load YouTube API. Check for ad blockers.'));
                document.body.appendChild(script);
            });
        }
        return promise;
    };
})();

// --- SUB-COMPONENT: YOUTUBE EMBED ---

const YouTubeEmbed = ({
    src,
    poster,
    autoplay,
    controls,
    mute,
    loop,
    onPlay,
    onEnd,
    className,
    radiusClass,
    profile,
    alt,
}) => {
    const containerRef = useRef(null);
    const playerRef = useRef(null);
    const [isApiReady, setIsApiReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Extract ID
    const videoId = src.match(/(?:embed\/|v=|\/v\/|youtu\.be\/|\/embed\/)([^?&"'>]+)/)?.[1];

    useEffect(() => {
        if (!videoId) return;

        let playerInstance = null;

        loadYouTubeAPI()
            .then((YT) => {
                // If component unmounted during load, abort
                if (!containerRef.current) return;

                playerInstance = new YT.Player(containerRef.current, {
                    videoId: videoId,
                    height: '100%',
                    width: '100%',
                    playerVars: {
                        autoplay: autoplay ? 1 : 0,
                        controls: controls ? 1 : 0,
                        mute: mute || autoplay ? 1 : 0, // Autoplay usually requires mute
                        loop: loop ? 1 : 0,
                        playlist: loop ? videoId : undefined, // Required for loop
                        rel: 0,
                        playsinline: 1,
                    },
                    events: {
                        onReady: () => setIsApiReady(true),
                        onStateChange: (event) => {
                            // PlayerState: 1 = PLAYING, 0 = ENDED
                            if (event.data === YT.PlayerState.PLAYING) {
                                setIsPlaying(true);
                                onPlay && onPlay();
                            }
                            if (event.data === YT.PlayerState.ENDED) {
                                setIsPlaying(false);
                                onEnd && onEnd();
                            }
                            if (event.data === YT.PlayerState.PAUSED) {
                                setIsPlaying(false);
                            }
                        },
                    },
                });
                playerRef.current = playerInstance;
            })
            .catch((err) => console.error('YouTube API Error:', err));

        // Cleanup
        return () => {
            if (playerInstance && typeof playerInstance.destroy === 'function') {
                playerInstance.destroy();
            }
        };
    }, [videoId, autoplay, controls, mute, loop]); // Re-init on major prop changes

    // Handle Cover Interaction
    const handleCoverClick = () => {
        if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
            playerRef.current.playVideo();
        }
    };

    return (
        <div className={twJoin('relative w-full h-full group', className)}>
            {/* The ref div will be REPLACED by the iframe, so we wrap it to maintain layout if needed */}
            <div className="w-full h-full">
                <div ref={containerRef} className={twJoin('w-full h-full', radiusClass)} />
            </div>

            {/* CUSTOM COVER / INTERACTION LAYER 
                Show if: Not Autoplay AND Not Playing AND API is Ready
            */}
            {!autoplay && !isPlaying && isApiReady && (
                <div
                    onClick={handleCoverClick}
                    className={twJoin(
                        'absolute inset-0 z-10 cursor-pointer flex items-center justify-center bg-transparent',
                        radiusClass
                    )}
                >
                    {poster ? (
                        <Image
                            profile={profile}
                            src={poster}
                            alt={alt}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        // Default "Play" overlay if no poster
                        <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center text-white opacity-80 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                            <svg className="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// --- MAIN COMPONENT ---

export default function MediaBox(props) {
    const { block, extra } = props;

    // Get Content
    const { banner, images, videos } = block.getBlockContent();

    const mediaItems = [banner, ...images, ...videos]
        .map((item) => parseMediaType(item))
        .filter((item) => item?.type);

    // Get Configuration
    const {
        mediaInset = 'standard',
        aspectRatio = 'video',
        videoAutoplay = false,
        videoControls = true,
        videoMute = false,
        videoLoop = false,
        sliderAutoSwitch = true,
        sliderDuration = 5,
    } = block.getBlockProperties();

    // --- STATE ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlayingVideo, setIsPlayingVideo] = useState(false);

    // Refs
    const timerRef = useRef(null);
    const videoRef = useRef(null);

    const activeItem = mediaItems[currentIndex];
    const itemCount = mediaItems.length;
    const hasMultiple = itemCount > 1;

    // --- LOGIC HELPERS ---
    const isAutoPlayVideo =
        videoAutoplay &&
        activeItem &&
        (activeItem.type === 'video' || activeItem.type === 'youtube');

    // --- EFFECT: RESET STATE ---
    useEffect(() => {
        setIsPlayingVideo(false);
    }, [currentIndex]);

    // --- EFFECT: SLIDESHOW TIMER ---
    useEffect(() => {
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
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
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

    const renderContent = (item) => {
        if (!item) return null;
        switch (item.type) {
            case 'video':
                return renderNativeVideo(item);
            case 'youtube':
                return (
                    <YouTubeEmbed
                        src={item.src}
                        poster={item.poster}
                        alt={item.alt}
                        autoplay={videoAutoplay}
                        controls={videoControls}
                        mute={videoMute}
                        loop={videoLoop}
                        onPlay={handleVideoPlay}
                        onEnd={handleVideoEnd}
                        radiusClass={radiusClass}
                        profile={getPageProfile()}
                    />
                );
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
                        const showProgress =
                            isActive && sliderAutoSwitch && !isAutoPlayVideo && !isPlayingVideo;

                        return (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                type="button"
                                aria-label={`Go to slide ${index + 1}`}
                                className={twJoin(
                                    'relative h-2 rounded-full overflow-hidden transition-all duration-300 focus:outline-none',
                                    isActive
                                        ? 'w-10 bg-primary-700'
                                        : 'w-2 bg-text-color/20 hover:bg-text-color/40'
                                )}
                            >
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
