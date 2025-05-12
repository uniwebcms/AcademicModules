import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, Image, getPageProfile } from '@uniwebcms/module-sdk';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';

const ShowcaseCarousel = (props) => {
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
            <div className="flex flex-col lg:flex-row justify-between items-center mb-12 space-x-12 xl:px-8">
                <div>
                    <h2 className="text-5xl md:text-6xl xl:text-7xl leading-[118%] md:leading-[112%] mb-6">
                        {title}
                    </h2>
                    <p className="text-base md:text-lg xl:text-xl text-heading-color font-light">
                        {subtitle}
                    </p>
                </div>
                {link && (
                    <Link
                        to={link.href}
                        className="flex sm:inline-flex px-8 py-3 sm:py-4 rounded-xl gap-2 items-center justify-center text-bg-color bg-text-color hover:bg-text-color-90 border shadow-md whitespace-nowrap"
                    >
                        {link.label}
                    </Link>
                )}
            </div>

            {/* Wrapper with known padding */}
            <div className="relative" ref={wrapperRef}>
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
                        const { banner, title, subtitle } = item;

                        return (
                            <div
                                key={idx}
                                className="relative rounded-xl overflow-hidden aspect-[9/16] shadow-md group cursor-pointer flex-shrink-0"
                                style={{ width: cardWidth }}
                            >
                                <div className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:translate-y-1/2">
                                    {/* dark overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent z-10"></div>
                                    <Image profile={getPageProfile()} {...banner} />
                                </div>
                                <div className="relative z-20 p-5">
                                    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
                                    <p className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {subtitle}
                                    </p>
                                </div>
                            </div>
                        );
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

    // const [visibleCards, setVisibleCards] = useState(1);
    // const [currentOffset, setCurrentOffset] = useState(0);
    // const [wrapperWidth, setWrapperWidth] = useState(0);
    // const wrapperRef = useRef(null);

    // const items = sampleItems; // Replace with your data source

    // // Update number of visible cards on resize
    // useEffect(() => {
    //     const updateVisible = () => {
    //         if (window.innerWidth >= 1200) setVisibleCards(4);
    //         else if (window.innerWidth >= 768) setVisibleCards(3);
    //         else setVisibleCards(1);
    //     };
    //     updateVisible();
    //     window.addEventListener('resize', updateVisible);
    //     return () => window.removeEventListener('resize', updateVisible);
    // }, []);

    // // Measure wrapper width before paint
    // useLayoutEffect(() => {
    //     const updateWidth = () => {
    //         if (wrapperRef.current) {
    //             setWrapperWidth(wrapperRef.current.offsetWidth);
    //         }
    //     };
    //     updateWidth();
    //     window.addEventListener('resize', updateWidth);
    //     return () => window.removeEventListener('resize', updateWidth);
    // }, []);

    // // Ensure offset is within bounds when items or visibleCards change
    // useEffect(() => {
    //     const maxOffset = Math.max(0, items.length - visibleCards);
    //     setCurrentOffset((prev) => Math.min(prev, maxOffset));
    // }, [items.length, visibleCards]);

    // const maxOffset = Math.max(0, items.length - visibleCards);

    // const handlePrev = () => {
    //     setCurrentOffset((prev) => Math.max(prev - 1, 0));
    // };

    // const handleNext = () => {
    //     setCurrentOffset((prev) => Math.min(prev + 1, maxOffset));
    // };

    // // Calculate dimensions
    // const cardWidth = wrapperWidth / visibleCards;
    // const containerWidth = cardWidth * items.length;
    // const translateX = cardWidth * currentOffset;

    // return (
    //     <section className="w-full py-10 px-4">
    //         <div className="flex justify-between items-center mb-6">
    //             <div>
    //                 <h2 className="text-3xl font-bold mb-1">{title}</h2>
    //                 <p className="text-gray-600 text-lg">{description}</p>
    //             </div>
    //             {linkText && linkUrl && (
    //                 <a href={linkUrl} className="text-blue-600 font-medium hover:underline">
    //                     {linkText}
    //                 </a>
    //             )}
    //         </div>

    //         <div className="relative overflow-hidden" ref={wrapperRef}>
    //             <motion.div
    //                 className="flex gap-6"
    //                 style={{ width: containerWidth }}
    //                 animate={{ x: -translateX }}
    //                 transition={{ type: 'tween', ease: 'easeInOut', duration: 0.5 }}
    //             >
    //                 {items.map((item, idx) => (
    //                     <div
    //                         key={item.id || idx}
    //                         className="relative rounded-xl overflow-hidden h-64 shadow-md group cursor-pointer flex-shrink-0"
    //                         style={{ width: cardWidth }}
    //                     >
    //                         <div
    //                             className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:translate-y-8"
    //                             style={{ backgroundImage: `url(${item.image})` }}
    //                         ></div>
    //                         <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent z-10"></div>
    //                         <div className="relative z-20 p-4 text-white">
    //                             <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
    //                             <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
    //                                 {item.description}
    //                             </p>
    //                         </div>
    //                     </div>
    //                 ))}
    //             </motion.div>

    //             {maxOffset > 0 && (
    //                 <div className="flex justify-center gap-4 mt-6">
    //                     <button
    //                         onClick={handlePrev}
    //                         disabled={currentOffset === 0}
    //                         className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
    //                         aria-label="Previous"
    //                     >
    //                         <LuChevronLeft size={20} />
    //                     </button>
    //                     <button
    //                         onClick={handleNext}
    //                         disabled={currentOffset === maxOffset}
    //                         className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
    //                         aria-label="Next"
    //                     >
    //                         <LuChevronRight size={20} />
    //                     </button>
    //                 </div>
    //             )}
    //         </div>
    //     </section>
    // );
};
export default ShowcaseCarousel;
