import React, { useState, useEffect } from 'react';
import Container from '../_utils/Container';
import { twJoin, getPageProfile } from '@uniwebcms/module-sdk';
import { Icon, Image, Media, Link } from '@uniwebcms/core-components';
import { LuArrowRight } from 'react-icons/lu';

const containerBgGradientToColors = ['to-primary-50', 'to-accent-50', 'to-secondary-50'];
const showcaseSwitcherColors = ['bg-primary-50', 'bg-accent-50', 'bg-secondary-50'];
const contentItemBgColors = [
    'radial-gradient(circle at 50% 90%, var(--callout), transparent 50%)',
    'radial-gradient(circle at 50% 90%, var(--muted), transparent 50%)',
    'radial-gradient(circle at 50% 90%, var(--highlight), transparent 50%)',
];
const navItemIconStyle = ['text-primary-500', 'text-accent-500', 'text-secondary-500'];
const contentItemIconStyles = [
    'bg-primary-50 text-primary-500',
    'bg-accent-50 text-accent-500',
    'bg-secondary-50 text-secondary-500',
];
const contentItemFeatureItemStyles = [
    'bg-white border-primary-200 hover:border-primary-300 shadow-primary-100',
    'bg-white border-accent-200 hover:border-accent-300 shadow-accent-100',
    'bg-white border-secondary-200 hover:border-secondary-300 shadow-secondary-100',
];
const contentItemFeatureItemIconColors = [
    'text-primary-500',
    'text-accent-500',
    'text-secondary-500',
];
const contentItemFeatureVideoThumbnailSvgColors = [
    '[&_svg]:!text-primary-500',
    '[&_svg]:!text-accent-500',
    '[&_svg]:!text-secondary-500',
];

const VideoItem = ({ activeItem, activeIndex, thumbnail }) => {
    const activeItemFeatures = activeItem.lists?.[0]?.map((item) => {
        const { icons, paragraphs } = item;

        const icon = icons[0];
        const text = paragraphs.filter(Boolean)[0];

        return { icon, text };
    });

    const video = activeItem.videos[0];
    const link = activeItem.links[0];

    return (
        <div className="flex flex-col lg:items-center items-start space-y-8">
            <div
                className={twJoin(
                    'inline-flex p-4 rounded-2xl',
                    contentItemIconStyles[activeIndex % 3]
                )}
            >
                <Icon icon={activeItem.icons[0]} className={twJoin('w-8 h-8 text-inherit')} />
            </div>
            <div className="text-left lg:text-center">
                <h3 className={twJoin('text-3xl font-bold mb-4', 'text-neutral-900')}>
                    {activeItem.title}
                </h3>
                <p className={twJoin('text-xl', 'text-neutral-600')}>{activeItem.subtitle}</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 lg:items-center w-full">
                <div className="space-y-4">
                    {activeItemFeatures.map(({ icon, text }, index) => {
                        return (
                            <div
                                key={index}
                                className={twJoin(
                                    'flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02]',
                                    contentItemFeatureItemStyles[activeIndex % 3]
                                )}
                            >
                                <Icon
                                    icon={icon}
                                    className={twJoin(
                                        'w-5 h-5',
                                        contentItemFeatureItemIconColors[activeIndex % 3]
                                    )}
                                />
                                <span className={twJoin('font-medium', 'text-neutral-700')}>
                                    {text}
                                </span>
                            </div>
                        );
                    })}
                    {link && (
                        <Link
                            to={link.href}
                            className="flex items-center gap-1 group !mt-6 text-neutral-600 hover:text-neutral-700 pl-4"
                        >
                            <span className="text-base font-medium">{link.label}</span>
                            <LuArrowRight className="w-5 h-5 text-inherit group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                    )}
                </div>
                <div className="relative aspect-video">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 opacity-5"></div>
                    <div
                        className={twJoin(
                            'absolute inset-0 flex items-center justify-center',
                            contentItemFeatureVideoThumbnailSvgColors[activeIndex % 3]
                        )}
                    >
                        <Media
                            profile={getPageProfile()}
                            media={video}
                            style={{
                                paddingBottom: '56.25%',
                                width: '100%',
                            }}
                            thumbnail={thumbnail}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ImageItem = ({ activeItem, activeIndex }) => {
    const activeItemFeatures = activeItem.lists?.[0]?.map((item) => {
        const { icons, paragraphs } = item;

        const icon = icons[0];
        const text = paragraphs.filter(Boolean)[0];

        return { icon, text };
    });

    const image = activeItem.images[0];
    const link = activeItem.links[0];

    return (
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 lg:items-center">
            <div className="space-y-8">
                <div
                    className={twJoin(
                        'inline-flex p-4 rounded-2xl',
                        contentItemIconStyles[activeIndex % 3]
                    )}
                >
                    <Icon icon={activeItem.icons[0]} className={twJoin('w-8 h-8 text-inherit')} />
                </div>
                <div>
                    <h3 className={twJoin('text-3xl font-bold mb-4', 'text-neutral-900')}>
                        {activeItem.title}
                    </h3>
                    <p className={twJoin('text-xl', 'text-neutral-600')}>{activeItem.subtitle}</p>
                </div>
                <div className="space-y-4">
                    {activeItemFeatures.map(({ icon, text }, index) => {
                        return (
                            <div
                                key={index}
                                className={twJoin(
                                    'flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02]',
                                    contentItemFeatureItemStyles[activeIndex % 3]
                                )}
                            >
                                <Icon
                                    icon={icon}
                                    className={twJoin(
                                        'w-5 h-5',
                                        contentItemFeatureItemIconColors[activeIndex % 3]
                                    )}
                                />
                                <span className={twJoin('font-medium', 'text-neutral-700')}>
                                    {text}
                                </span>
                            </div>
                        );
                    })}
                    {link && (
                        <Link
                            to={link.href}
                            className="flex items-center gap-1 group !mt-6 text-neutral-600 hover:text-neutral-700 pl-4"
                        >
                            <span className="text-base font-medium">{link.label}</span>
                            <LuArrowRight className="w-5 h-5 text-inherit group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                    )}
                </div>
            </div>
            <div className="relative aspect-square">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 opacity-5"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Image profile={getPageProfile()} {...image}></Image>
                </div>
            </div>
        </div>
    );
};

export default function ContentShowcase(props) {
    const { block } = props;
    const { title, subtitle } = block.getBlockContent();
    const items = block.getBlockItems();

    const [activeCase, setActiveCase] = useState('case0');
    const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
    const [isSticky, setIsSticky] = useState(false);

    const updateSliderStyle = (event) => {
        const button = event.currentTarget;
        const buttonRect = button.getBoundingClientRect();
        const containerRect = button.parentElement.getBoundingClientRect();

        setSliderStyle({
            left: buttonRect.left - containerRect.left + 8,
            width: buttonRect.width,
        });
    };

    useEffect(() => {
        const initialButton = document.querySelector(`[data-case="${activeCase}"]`);

        if (initialButton) {
            updateSliderStyle({ currentTarget: initialButton });
        }

        const handleResize = () => {
            const button = document.querySelector(`[data-case="${activeCase}"]`);
            if (button) {
                updateSliderStyle({ currentTarget: button });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeCase]);

    useEffect(() => {
        const handleScroll = () => {
            const navSection = document.getElementById('use-cases-nav');
            if (navSection) {
                const rect = navSection.getBoundingClientRect();
                const shouldBeSticky = rect.top <= 0;
                setIsSticky(shouldBeSticky);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const activeIndex = parseInt(activeCase.slice(-1));
    const activeItem = items[activeIndex];

    let activeItemVideo, activeItemImage, activeItemVideoThumbnail;

    if (activeItem.videos[0] && activeItem.images[0]) {
        activeItemVideo = activeItem.videos[0];
        activeItemVideoThumbnail = activeItem.images[0];
    } else if (activeItem.videos[0]) {
        activeItemVideo = activeItem.videos[0];
    } else if (activeItem.images[0]) {
        activeItemImage = activeItem.images[0];
    }

    // const activeItemImage = activeItem.images[0];
    // const activeItemVideo = activeItem.videos[0];

    return (
        <Container
            px="none"
            py="none"
            className={twJoin(
                'relative bg-gradient-to-b from-neutral-50',
                containerBgGradientToColors[activeIndex % 3]
            )}
        >
            <div className="max-w-7xl mx-auto px-4 pt-24 pb-4" id="use-cases-nav">
                <div className="text-center">
                    <h2 className={twJoin('text-4xl font-bold mb-3')}>{title}</h2>
                    <p className={twJoin('text-xl max-w-3xl mx-auto')}>{subtitle}</p>
                </div>
            </div>
            <div
                className={twJoin(
                    'relative py-4',
                    isSticky ? 'sticky top-0 z-50 backdrop-blur-sm transition-all duration-300' : ''
                )}
            >
                <div className="flex justify-center max-w-7xl mx-auto px-4">
                    <div
                        className={twJoin(
                            'p-2 rounded-full shadow-lg relative overflow-auto no-scrollbar',
                            showcaseSwitcherColors[activeIndex % 3]
                        )}
                    >
                        <div
                            className="absolute top-2 bottom-2 transition-all duration-300 ease-in-out rounded-full bg-neutral-900"
                            style={{
                                left: `${sliderStyle.left}px`,
                                width: `${sliderStyle.width}px`,
                            }}
                        ></div>
                        <div className="flex gap-2">
                            {items.map((item, index) => {
                                const { title, icons } = item;
                                const icon = icons[0];

                                const key = `case${index}`;

                                return (
                                    <div
                                        key={key}
                                        data-case={key}
                                        onClick={(e) => {
                                            setActiveCase(key);
                                            updateSliderStyle(e);
                                            // Get the nav height for offset
                                            const navHeight =
                                                document.getElementById('use-cases-nav')
                                                    ?.offsetHeight || 0;

                                            // Calculate the ideal scroll position
                                            const contentTop = document
                                                .getElementById('use-cases-content')
                                                ?.getBoundingClientRect().top;

                                            const scrollToTop =
                                                window.scrollY + contentTop - navHeight;

                                            const isScrollingUp = scrollToTop < window.scrollY;

                                            // we set a flag to indicate that we are programmatically scrolling, prevent the navbar from showing up
                                            if (isScrollingUp) {
                                                window.dispatchEvent(
                                                    new CustomEvent(
                                                        'programmatically-scrolling-start'
                                                    )
                                                );
                                            }

                                            // Scroll to position that places content right below the sticky nav(title)
                                            window.scrollTo({
                                                // top: window.scrollY + contentTop - navHeight - 20,
                                                top: scrollToTop - 80,
                                                behavior: 'smooth',
                                            });

                                            // we set a timeout to remove the flag after a while
                                            setTimeout(() => {
                                                if (isScrollingUp) {
                                                    window.dispatchEvent(
                                                        new CustomEvent(
                                                            'programmatically-scrolling-end'
                                                        )
                                                    );
                                                }
                                            }, 800);
                                        }}
                                        className={twJoin(
                                            'relative px-4 py-2 md:px-6 md:py-3 rounded-full transition-colors duration-300 z-10 cursor-pointer',
                                            activeCase === key
                                                ? 'text-bg-color'
                                                : 'text-neutral-600 hover:text-neutral-900'
                                        )}
                                    >
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                            <Icon
                                                icon={icon}
                                                className={twJoin(
                                                    'w-5 h-5',
                                                    navItemIconStyle[index % 3]
                                                )}
                                            />
                                            <span className="font-medium">{title}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div id="use-cases-content" className="max-w-7xl mx-auto px-4 pb-20">
                <div
                    className={twJoin(
                        'relative min-h-[400px] rounded-3xl border p-8 transition-all duration-500 shadow-xl mt-8',
                        'border-neutral-100 bg-bg-color'
                    )}
                    style={{
                        backgroundImage: contentItemBgColors[activeIndex % 3],
                    }}
                >
                    {activeItemImage && (
                        <ImageItem activeItem={activeItem} activeIndex={activeIndex} />
                    )}
                    {activeItemVideo && (
                        <VideoItem
                            activeItem={activeItem}
                            activeIndex={activeIndex}
                            thumbnail={activeItemVideoThumbnail}
                        />
                    )}
                </div>
            </div>
        </Container>
    );
}
