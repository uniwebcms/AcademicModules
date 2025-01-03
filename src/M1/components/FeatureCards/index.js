import React, { useRef, useState, useEffect } from 'react';
import { Image, getPageProfile, SafeHtml, Link, twJoin } from '@uniwebcms/module-sdk';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { GoArrowRight } from 'react-icons/go';
import { TbSlash } from 'react-icons/tb';
import Container from '../_utils/Container';

export default function FeatureCards(props) {
    const { block } = props;

    const { title, subtitle } = block.getBlockContent();
    const { layout = 'scroll', card_style: cardStyle = 'compact' } = block.getBlockProperties();
    const items = block.getBlockItems();

    const scrollContainerRef = useRef(null);
    const [currentItem, setCurrentItem] = useState(1);
    const [needScrollButtons, setNeedScrollButtons] = useState(false);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const getVisibleItemIndex = () => {
        if (!scrollContainerRef.current) return 1;

        const cardWidth = cardStyle === 'compact' ? 364 : 472; // card width+24px gap
        const scrollLeft = scrollContainerRef.current.scrollLeft;

        return scrollLeft === 0 ? 1 : Math.ceil(scrollLeft / cardWidth) + 1;
    };

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

            setCurrentItem(getVisibleItemIndex());
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
            const cardWidth = cardStyle === 'compact' ? 340 : 448; // w-[340px] or w-112
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
                classes +=
                    ' px-[var(--scroll-padding)] lg:px pt-1 pb-3 [--scroll-padding:calc((max(100vw,96rem)-96rem)/2+24px)] md:[--scroll-padding:calc((max(100vw,96rem)-96rem)/2+32px)] lg:[--scroll-padding:calc((max(100vw,96rem)-96rem)/2+64px)] xl:[--scroll-padding:calc((max(100vw,96rem)-96rem)/2+96px)]';
            }

            return classes;
        }

        // Grid layout with responsive columns based on card style
        return 'grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 xl:gap-12 2xl:gap-8';
    };

    // Card classes based on card style
    const cardClasses = {
        compact: `flex-none max-w-full w-[340px] bg-white rounded-xl shadow-lg overflow-hidden snap-start scroll-ml-[var(--scroll-padding)]`,
        expanded: `flex-none max-w-full w-112 snap-start`,
    };

    // Card banner classes based on card style
    const cardBannerClasses = {
        compact: 'h-56',
        expanded: 'h-60 rounded-3xl overflow-hidden',
    };

    const cardContentClasses = {
        compact: 'px-4 pt-6 pb-4 flex flex-col',
        expanded: 'py-4 flex flex-col bg-bg-color',
    };

    // Render card content based on style
    const renderCard = (card) => {
        const { banner, title, subtitle, paragraphs, links } = card;

        const [primaryLink, secondaryLink] = links;

        const primaryLinkClasses =
            'bg-btn-color text-btn-text-color flex items-center justify-center py-2 px-4 rounded-3xl max-w-[48%]';
        const secondaryLinkClasses =
            'text-btn-alt-text-color flex items-center justify-center max-w-[48%] hover:underline';

        if (cardStyle === 'overlay') {
            const titleElement =
                title && primaryLink ? (
                    <Link className="group inline-flex items-center gap-2 text-gray-200 hover:text-white transition-colors">
                        <h3 className="font-semibold text-xl text-inherit">{title}</h3>
                        <GoArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:animate-bounce-x text-inherit" />
                    </Link>
                ) : title ? (
                    <h3 className="font-semibold text-xl text-gray-200">{title}</h3>
                ) : null;

            return (
                <div className="relative w-full h-64 lg:h-[17rem] rounded-3xl overflow-hidden">
                    <Image
                        profile={getPageProfile()}
                        {...banner}
                        className="absolute w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/10 from-20% via-50%" />
                    <div className="absolute bottom-0 left-0 right-0 px-6 py-4">
                        {titleElement}
                        {subtitle && <h4 className="text-gray-200 mb-1">{subtitle}</h4>}
                        <SafeHtml value={paragraphs} className="text-sm text-gray-300 mb-3" />
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
                        <p className="text-sm">{subtitle}</p>
                    </div>
                    <SafeHtml value={paragraphs} className="mt-2 text-sm line-clamp-3" />
                    <div className="flex items-center justify-between gap-3 mt-4">
                        {primaryLink && (
                            <Link
                                to={primaryLink.href}
                                className={
                                    primaryLink && secondaryLink
                                        ? primaryLinkClasses
                                        : secondaryLinkClasses
                                }
                            >
                                <span className="truncate text-sm">{primaryLink.label}</span>
                            </Link>
                        )}
                        {secondaryLink && (
                            <Link to={secondaryLink.href} className={secondaryLinkClasses}>
                                <span className="truncate text-sm">{secondaryLink.label}</span>
                                &nbsp;&rarr;
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

        const baseButtonClasses =
            'rounded-full p-2 transition-all duration-200 shadow-md !text-gray-700';
        const activeButtonClasses =
            '!bg-white shadow-lg hover:bg-gray-100 hover:shadow-xl hover:!text-gray-800';
        const disabledButtonClasses = '!bg-gray-100 cursor-default opacity-50';

        const getButtonClasses = (canScroll) =>
            `${baseButtonClasses} ${canScroll ? activeButtonClasses : disabledButtonClasses}`;

        const prevButton = (
            <button
                onClick={() => canScrollPrev && scroll('left')}
                className={getButtonClasses(canScrollPrev)}
                disabled={!canScrollPrev}
                aria-label="Scroll previous"
            >
                <HiChevronLeft className="w-6 h-6 text-inherit" />
            </button>
        );

        const nextButton = (
            <button
                onClick={() => canScrollNext && scroll('right')}
                className={getButtonClasses(canScrollNext)}
                disabled={!canScrollNext}
                aria-label="Scroll next"
            >
                <HiChevronRight className="w-6 h-6 text-inherit" />
            </button>
        );

        // Navigation layout based on card style
        if (cardStyle === 'expanded') {
            return (
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-0.5 text-sm">
                        <span>{currentItem}</span>
                        <TbSlash />
                        <span>{items.length}</span>
                    </div>
                    <div className="flex gap-2">
                        {prevButton}
                        {nextButton}
                    </div>
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
            <div className="px-6 md:px-8 lg:px-16 xl:px-24 max-w-8xl mx-auto">
                {title && <h2 className="text-lg lg:text-2xl font-bold mb-2">{title}</h2>}
                {subtitle && <p className="mb-6 lg:mb-8 text-base lg:text-lg">{subtitle}</p>}
            </div>
            <div
                className={twJoin(
                    'relative',
                    layout === 'scroll' && cardStyle === 'compact'
                        ? ''
                        : 'px-6 md:px-8 lg:px-16 xl:px-24 max-w-8xl mx-auto'
                )}
            >
                {layout === 'scroll' && cardStyle === 'expanded' && renderNavigation()}
                <ul
                    role="list"
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className={getContainerClasses()}
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {items.map((item, index) => (
                        <li key={index}>{renderCard(item)}</li>
                    ))}
                </ul>
                {layout === 'scroll' && cardStyle !== 'expanded' && renderNavigation()}
            </div>
        </Container>
    );
}
