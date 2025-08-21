import React, { useState, useRef, useEffect } from 'react';
import { twJoin } from '@uniwebcms/module-sdk';
import { LuPlay, LuPause } from 'react-icons/lu';

// Calculate actual pixel widths based on screen size
const calculateBoxWidths = () => {
    const width = window.innerWidth;
    let centerWidth, sideWidth, gap;

    if (width >= 1280) {
        // xl
        centerWidth = 42 * 16; // 672px
        sideWidth = 20 * 16; // 320px
        gap = 2 * 16; // 32px (gap-8)
    } else if (width >= 1024) {
        // lg
        centerWidth = 36 * 16; // 576px
        sideWidth = 20 * 16; // 320px
        gap = 2 * 16; // 32px (gap-8)
    } else if (width >= 768) {
        // md
        centerWidth = 28 * 16; // 448px
        sideWidth = 16 * 16; // 256px
        gap = 1.5 * 16; // 24px (gap-6)
    } else if (width >= 640) {
        // sm
        centerWidth = 24 * 16; // 384px
        sideWidth = 14 * 16; // 224px
        gap = 1 * 16; // 16px (gap-4)
    } else {
        // default
        centerWidth = 20 * 16; // 320px
        sideWidth = 12 * 16; // 192px
        gap = 1 * 16; // 16px (gap-4)
    }

    return { center: centerWidth, side: sideWidth, gap: gap };
};

// Calculate box dimensions based on screen size
const getBoxDimensions = () => {
    return {
        center: 'w-80 h-44 sm:w-96 sm:h-54 md:w-[28rem] md:h-[16rem] lg:w-[36rem] lg:h-[20rem] xl:w-[42rem] xl:h-[24rem]',
        side: 'w-48 h-28 sm:w-56 sm:h-32 md:w-64 md:h-36 lg:w-80 lg:h-44',
        scale: 'scale-100',
        sideScale: 'scale-75 md:scale-80 lg:scale-85',
    };
};

export default function VideoCarousel(props) {
    const { block } = props;

    const { title, videos } = block.getBlockContent();

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [boxWidths, setBoxWidths] = useState({ center: 0, side: 0, gap: 0 });
    const containerRef = useRef(null);
    const videoRefs = useRef([]);
    const activeVideoRef = useRef(null);

    const dimensions = getBoxDimensions();

    // Handle video play/pause
    const handleCenterClick = () => {
        if (activeVideoRef.current) {
            if (isPlaying) {
                activeVideoRef.current.pause();
            } else {
                activeVideoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Handle box click (move to center)
    const handleBoxClick = (index) => {
        if (index === activeIndex) {
            handleCenterClick();
        } else {
            // Pause current video
            if (activeVideoRef.current && isPlaying) {
                activeVideoRef.current.pause();
                setIsPlaying(false);
            }

            setActiveIndex(index);

            // Auto-play the new center video after animation
            setTimeout(() => {
                if (videoRefs.current[index]) {
                    videoRefs.current[index].play();
                    setIsPlaying(true);
                }
            }, 500);
        }
    };

    // Update box widths on mount and resize
    useEffect(() => {
        const updateWidths = () => {
            setBoxWidths(calculateBoxWidths());
        };

        updateWidths();
        window.addEventListener('resize', updateWidths);

        return () => window.removeEventListener('resize', updateWidths);
    }, []);

    // Scroll to center the active video
    useEffect(() => {
        if (containerRef.current && boxWidths.center > 0) {
            const container = containerRef.current;

            // Use the formula: activeIndex * (sideBoxWidth + gap) + (activeBoxWidth / 2)
            const scrollLeft =
                activeIndex * (boxWidths.side + boxWidths.gap) + boxWidths.center / 2;

            container.scrollTo({
                left: scrollLeft,
                behavior: 'smooth',
            });
        }
    }, [activeIndex, boxWidths]);

    // Initial centering of the first video
    useEffect(() => {
        if (containerRef.current && videos.length > 0 && boxWidths.center > 0) {
            const container = containerRef.current;

            // For the first video (index 0), the formula simplifies to just center box width / 2
            const scrollLeft = boxWidths.center / 2;

            container.scrollTo({
                left: scrollLeft,
                behavior: 'auto', // No animation for initial positioning
            });
        }
    }, [videos.length, boxWidths]); // Run when videos array changes or box widths update

    // Update active video ref
    useEffect(() => {
        activeVideoRef.current = videoRefs.current[activeIndex];
    }, [activeIndex]);

    // Reset playing state when active index changes
    useEffect(() => {
        setIsPlaying(false);
    }, [activeIndex]);

    return (
        <div className="relative w-full overflow-hidden px-6 py-12">
            <div className="text-center">
                <h2 className="text-[42px] md:text-[48px] xl:text-[72px] leading-[118%] md:leading-[112%]">
                    {title}
                </h2>
            </div>
            <div
                ref={containerRef}
                className="mt-8 sm:mt-14 flex items-center gap-4 md:gap-6 lg:gap-8 overflow-x-auto scroll-smooth py-8"
                style={{
                    scrollBehavior: 'smooth',
                    paddingLeft: '50%',
                    paddingRight: '50%',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {videos.map((video, index) => {
                    const isActive = index === activeIndex;
                    const distance = Math.abs(index - activeIndex);

                    return (
                        <div
                            key={index}
                            className={twJoin(
                                'relative flex-shrink-0 transition-all duration-500 ease-in-out cursor-pointer hover:opacity-100',
                                isActive ? dimensions.center : dimensions.side,
                                // !isActive && 'hover:scale-105',
                                distance > 2
                                    ? 'opacity-50'
                                    : distance > 1
                                    ? 'opacity-70'
                                    : 'opacity-100'
                            )}
                            onClick={() => handleBoxClick(index)}
                        >
                            {/* Video Element */}
                            <video
                                ref={(el) => (videoRefs.current[index] = el)}
                                src={video.src}
                                className="w-full h-full object-cover rounded-lg shadow-lg"
                                muted
                                loop
                                playsInline
                            />

                            {/* Play/Pause Overlay for Center Video */}
                            {isActive && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="bg-black bg-opacity-50 rounded-full p-4 transition-opacity duration-300 opacity-100 hover:opacity-100 pointer-events-auto">
                                        {isPlaying ? (
                                            <LuPause className="w-8 h-8 text-white" />
                                        ) : (
                                            <LuPlay className="w-8 h-8 text-white" />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
