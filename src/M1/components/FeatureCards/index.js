import React, { useRef, useState, useEffect } from 'react';
import { Image, getPageProfile, SafeHtml, Link } from '@uniwebcms/module-sdk';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import Container from '../_utils/Container';

export default function FeatureCards(props) {
    const { block } = props;

    const { title, subtitle } = block.getBlockContent();
    const { layout = 'scroll', cardStyle = 'compact' } = block.getBlockProperties();
    const items = block.getBlockItems();

    const scrollContainerRef = useRef(null);

    const [needScrollButtons, setNeedScrollButtons] = useState(false);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const checkScroll = () => {
        if (scrollContainerRef.current && layout === 'scroll') {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

            // Check if content is wider than container
            const needsScroll = scrollWidth > clientWidth;
            setNeedScrollButtons(needsScroll);

            if (needsScroll) {
                setCanScrollPrev(scrollLeft > 1);
                setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 1);
            }
        }
    };

    // Check scroll on mount and window resize
    useEffect(() => {
        checkScroll();

        const handleResize = () => {
            checkScroll();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [layout, scrollContainerRef.current]); // Re-run when layout changes

    const handleScroll = () => {
        checkScroll();
    };
    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const cardWidth = cardStyle === 'compact' ? 320 : 384; // w-80 or w-96
            const gap = 24;

            let scrollAmount;

            if (direction === 'left') {
                if (canScrollNext) {
                    scrollAmount = -(cardWidth + gap);
                } else {
                    const scrollLeft = scrollContainerRef.current.scrollLeft;

                    const amount = scrollLeft % (cardWidth + gap);
                    scrollAmount = amount === 0 ? -(cardWidth + gap) : -amount;
                }
            } else {
                scrollAmount = cardWidth + gap;
            }

            // const scrollAmount = direction === 'left' ? -(cardWidth + gap) : cardWidth + gap;

            const currentScroll = scrollContainerRef.current.scrollLeft;
            const targetScroll = currentScroll + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: targetScroll,
                behavior: 'smooth',
            });
        }
    };

    // Container classes based on layout and card style
    const getContainerClasses = () => {
        if (layout === 'scroll') {
            let classes =
                'flex overflow-x-auto gap-6 scrollbar-hide scroll-smooth snap-x snap-mandatory';

            if (cardStyle === 'compact') {
                classes += ' -mx-0.5 px-0.5 scroll-px-0.5 py-2';
            }

            return classes;
        }

        // Grid layout with responsive columns based on card style
        if (cardStyle === 'compact') {
            return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
        } else {
            return 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6';
        }
    };

    // Card classes based on card style
    const cardClasses = {
        compact: `${
            layout === 'grid' ? '' : 'flex-none'
        } w-80 bg-white rounded-lg shadow-md overflow-hidden snap-start`,
        expanded: `${
            layout === 'grid' ? '' : 'flex-none'
        } w-96 bg-white overflow-hidden snap-start`,
        overlay: `${
            layout === 'grid' ? '' : 'flex-none'
        } w-96 relative overflow-hidden snap-start h-96`,
    };

    // Card banner classes based on card style
    const cardBannerClasses = {
        compact: 'h-56',
        expanded: 'h-64',
        overlay: 'h-64',
    };

    const cardContentClasses = {
        compact: 'px-4 pt-6 pb-4 flex flex-col',
        expanded: 'py-4 flex flex-col',
        // overlay: 'h-64',
    };

    // Render card content based on style
    const renderCard = (card) => {
        const { banner, title, subtitle, paragraphs, links } = card;

        const [primaryLink, secondaryLink] = links;

        if (cardStyle === 'overlay') {
            return (
                <div className={cardClasses[cardStyle]}>
                    <Image
                        profile={getPageProfile()}
                        {...banner}
                        className="absolute w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="font-bold text-xl mb-2">{title}</h3>
                        <p className="text-sm text-gray-200 mb-3">{subtitle}</p>
                        <SafeHtml value={paragraphs} className="text-sm text-gray-300 mb-4" />
                        <div className="flex gap-3">
                            {primaryLink && (
                                <button className="flex-1 bg-white text-black py-2 px-4 rounded-md hover:bg-gray-100 transition-colors">
                                    {/* {card.primaryAction} */}1
                                </button>
                            )}
                            {secondaryLink && (
                                <button className="flex-1 border border-white text-white py-2 px-4 rounded-md hover:bg-white/10 transition-colors">
                                    {/* {card.secondaryAction} */}2
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className={cardClasses[cardStyle]}>
                <div className={cardBannerClasses[cardStyle]}>
                    <Image
                        profile={getPageProfile()}
                        {...banner}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className={cardContentClasses[cardStyle]}>
                    <div>
                        <h3 className="font-bold text-lg">{title}</h3>
                        <p className="text-sm text-gray-600">{subtitle}</p>
                    </div>
                    <SafeHtml
                        value={paragraphs}
                        className="mt-2 text-gray-700 text-sm line-clamp-3"
                    />
                    <div className="flex gap-3 mt-4">
                        {primaryLink && (
                            <Link
                                to={primaryLink.href}
                                className="flex-1 truncate bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                {primaryLink.label}
                            </Link>
                        )}
                        {secondaryLink && (
                            <Link
                                to={secondaryLink.href}
                                className="flex-1 truncate border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                {secondaryLink.label}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Navigation controls
    const renderNavigation = () => {
        if (layout !== 'scroll' || !needScrollButtons) return null;

        const baseButtonClasses = 'rounded-full p-2 transition-all duration-200';
        const activeButtonClasses = 'bg-white shadow-lg hover:bg-gray-100';
        const disabledButtonClasses = 'bg-gray-100 cursor-default opacity-50';

        const getButtonClasses = (canScroll) =>
            `${baseButtonClasses} ${canScroll ? activeButtonClasses : disabledButtonClasses}`;

        const prevButton = (
            <button
                onClick={() => canScrollPrev && scroll('left')}
                className={getButtonClasses(canScrollPrev)}
                disabled={!canScrollPrev}
                aria-label="Scroll previous"
            >
                <HiChevronLeft className="w-6 h-6" />
            </button>
        );

        const nextButton = (
            <button
                onClick={() => canScrollNext && scroll('right')}
                className={getButtonClasses(canScrollNext)}
                disabled={!canScrollNext}
                aria-label="Scroll next"
            >
                <HiChevronRight className="w-6 h-6" />
            </button>
        );

        // Navigation layout based on card style
        if (cardStyle === 'expanded') {
            return (
                <div className="flex gap-2 mb-4">
                    {prevButton}
                    {nextButton}
                </div>
            );
        }

        return (
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
                <div className="pointer-events-auto ml-4">{prevButton}</div>
                <div className="pointer-events-auto mr-4">{nextButton}</div>
            </div>
        );
    };

    return (
        <Container px="none">
            <div className="px-16 lg:px-24">
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <p className="text-gray-600 mb-6 lg:mb-8">{subtitle}</p>
            </div>
            <div className="relative px-16 lg:px-24">
                {layout === 'scroll' && cardStyle === 'expanded' && renderNavigation()}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className={getContainerClasses()}
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {items.map((item, index) => (
                        <div key={index}>{renderCard(item)}</div>
                    ))}
                </div>
                {layout === 'scroll' && cardStyle !== 'expanded' && renderNavigation()}
            </div>
        </Container>
    );
}