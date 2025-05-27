import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, Image, getPageProfile, twJoin, Media } from '@uniwebcms/module-sdk';
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';

const ImageCard = ({ width, background, title, subtitle }) => {
    return (
        <div
            className="relative rounded-xl overflow-hidden aspect-[9/16] shadow-md group flex-shrink-0"
            style={{ width }}
        >
            <div className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:translate-y-1/2">
                {/* dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent z-10"></div>
                <Image profile={getPageProfile()} {...background} />
            </div>
            <div className="relative z-20 p-5">
                <h3 className="text-2xl font-semibold mb-2">{title}</h3>
                <p className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {subtitle}
                </p>
            </div>
        </div>
    );
};

const VideoCard = ({ width, video, title, subtitle }) => {
    const ref = useRef(null);

    return (
        <div
            className="p-6 space-y-6 relative rounded-xl overflow-hidden aspect-[9/16] shadow-md group flex-shrink-0 bg-text-color-30"
            style={{ width }}
            onMouseEnter={() => {
                if (ref.current) {
                    ref.current.play();
                }
            }}
            onMouseLeave={() => {
                if (ref.current) {
                    ref.current.pause();
                }
            }}
        >
            <div
                className="relative w-full aspect-[6/5] rounded-xl overflow-hidden"
                style={{ paddingBottom: '120%' }}
            >
                <video
                    ref={ref}
                    src={video.src}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    playsInline
                />
            </div>
            <div className="relative">
                <h3 className="text-xl mb-1">{title}</h3>
                <p className="text-lg font-light line-clamp-4" title={subtitle}>
                    {subtitle}
                </p>
            </div>
        </div>
    );
};

export default function ShowcaseCarousel(props) {
    const { block } = props;

    const { title, subtitle, links } = block.getBlockContent();
    const items = block.getBlockItems();
    const link = links[0];

    const [visibleCards, setVisibleCards] = useState(1);
    const [currentOffset, setCurrentOffset] = useState(0);
    const [wrapperWidth, setWrapperWidth] = useState(0);
    const wrapperRef = useRef(null);

    const gap = 24;

    // Update number of visible cards on resize
    useEffect(() => {
        const updateVisible = () => {
            if (window.innerWidth >= 1024) setVisibleCards(4);
            else if (window.innerWidth >= 768) setVisibleCards(3);
            else if (window.innerWidth >= 640) setVisibleCards(2);
            else setVisibleCards(1);
        };
        updateVisible();
        window.addEventListener('resize', updateVisible);
        return () => window.removeEventListener('resize', updateVisible);
    }, []);

    // Measure inner width (excluding px-5 padding)
    useLayoutEffect(() => {
        const updateWidth = () => {
            if (wrapperRef.current) {
                const { clientWidth } = wrapperRef.current;
                const style = window.getComputedStyle(wrapperRef.current);
                const paddingLeft = parseFloat(style.paddingLeft) || 0;
                const paddingRight = parseFloat(style.paddingRight) || 0;
                setWrapperWidth(clientWidth - paddingLeft - paddingRight);
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // Keep offset in bounds
    useEffect(() => {
        const maxOffset = Math.max(0, items.length - visibleCards);
        if (currentOffset > maxOffset) {
            setCurrentOffset(maxOffset);
        }
    }, [items.length, visibleCards, currentOffset]);

    const maxOffset = Math.max(0, items.length - visibleCards);
    const cardWidth = (wrapperWidth - (visibleCards - 1) * gap) / visibleCards;
    const containerWidth = items.length * cardWidth + (items.length - 1) * gap;
    const translateX = currentOffset * (cardWidth + gap);

    const handlePrev = () => {
        setCurrentOffset((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setCurrentOffset((prev) => Math.min(prev + 1, maxOffset));
    };

    return (
        <section className="pt-[60px] pb-10 px-5">
            <div
                className={twJoin(
                    'flex flex-col lg:flex-row lg:items-center mb-12 gap-y-6 gap-x-12 max-w-[1400px] mx-auto',
                    link ? 'justify-between' : 'justify-center text-center'
                )}
            >
                <div className="space-y-6">
                    <h2 className="text-5xl md:text-6xl xl:text-7xl leading-[118%] md:leading-[112%]">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-base md:text-lg xl:text-xl text-heading-color font-light">
                            {subtitle}
                        </p>
                    )}
                </div>
                {link && (
                    <Link
                        to={link.href}
                        className="flex px-8 py-3 sm:py-4 rounded-xl gap-2 items-center justify-center text-bg-color bg-text-color hover:bg-text-color-90 border shadow-md whitespace-nowrap"
                    >
                        {link.label}
                    </Link>
                )}
            </div>

            {/* Wrapper with known padding */}
            <div className="relative overflow-hidden max-w-[1400px] mx-auto" ref={wrapperRef}>
                {/* Sliding container */}
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        width: containerWidth,
                        transform: `translateX(-${translateX}px)`,
                        gap: `${gap}px`,
                    }}
                >
                    {items.map((item, idx) => {
                        const { banner, title, subtitle, videos } = item;

                        if (banner) {
                            return (
                                <ImageCard
                                    key={idx}
                                    width={cardWidth}
                                    background={banner}
                                    title={title}
                                    subtitle={subtitle}
                                />
                            );
                        }

                        if (videos[0]) {
                            return (
                                <VideoCard
                                    key={idx}
                                    width={cardWidth}
                                    video={videos[0]}
                                    title={title}
                                    subtitle={subtitle}
                                />
                            );
                        }

                        return null;

                        // return (
                        //     <div
                        //         key={idx}
                        //         className="relative rounded-xl overflow-hidden aspect-[9/16] shadow-md group cursor-pointer flex-shrink-0"
                        //         style={{ width: cardWidth }}
                        //     >
                        //         <div className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:translate-y-1/2">
                        //             {/* dark overlay */}
                        //             <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent z-10"></div>
                        //             <Image profile={getPageProfile()} {...banner} />
                        //         </div>
                        //         <div className="relative z-20 p-5">
                        //             <h3 className="text-2xl font-semibold mb-2">{title}</h3>
                        //             <p className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        //                 {subtitle}
                        //             </p>
                        //         </div>
                        //     </div>
                        // );
                    })}
                </div>

                {/* Navigation */}
                {maxOffset > 0 && (
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            onClick={handlePrev}
                            disabled={currentOffset === 0}
                            className="p-1 rounded-full text-bg-color bg-text-color enabled:hover:bg-text-color-90 disabled:opacity-50"
                            aria-label="Previous"
                        >
                            <RiArrowLeftLine className="w-7 h-7 text-inherit" />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentOffset === maxOffset}
                            className="p-1 rounded-full text-bg-color bg-text-color enabled:hover:bg-text-color-90 disabled:opacity-50"
                            aria-label="Next"
                        >
                            <RiArrowRightLine className="w-7 h-7 text-inherit" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
