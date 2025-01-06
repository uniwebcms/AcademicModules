import React, { useState, useEffect } from 'react';
import Container from '../../_utils/Container';
import { twJoin, Icon, Image, getPageProfile } from '@uniwebcms/module-sdk';

const containerBgGradientToColors = ['to-primary-50', 'to-accent-50', 'to-secondary-50'];
const showcaseSwitcherColors = ['bg-primary-50', 'bg-accent-50', 'bg-secondary-50'];
const contentItemBgColors = [
    'radial-gradient(circle at 50% 90%, var(--callout), transparent 50%)',
    'radial-gradient(circle at 50% 90%, var(--muted), transparent 50%)',
    'radial-gradient(circle at 50% 90%, var(--highlight), transparent 50%)',
];
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

export default function Fancy(props) {
    const { title, subtitle, items } = props;

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

    const activeItemFeatures = activeItem.lists?.[0]?.map((item) => {
        const { icons, paragraphs } = item;

        const icon = icons[0];
        const text = paragraphs.filter(Boolean)[0];

        return { icon, text };
    });

    return (
        <Container
            px="none"
            py="none"
            className={twJoin(
                'relative bg-gradient-to-b from-neutral-50',
                containerBgGradientToColors[activeIndex % 3]
            )}
        >
            <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
                <div className="text-center mb-16">
                    <h2 className={twJoin('text-4xl font-bold mb-4')}>{title}</h2>
                    <p className={twJoin('text-xl max-w-3xl mx-auto')}>{subtitle}</p>
                </div>
            </div>
            <div
                id="use-cases-nav"
                className={twJoin(
                    'relative',
                    isSticky
                        ? 'sticky top-0 z-50 py-4 backdrop-blur-sm transition-all duration-300'
                        : 'py-4'
                )}
            >
                <div className="flex justify-center max-w-7xl mx-auto px-4">
                    <div
                        className={twJoin(
                            'p-2 rounded-full shadow-lg relative',
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

                                            // Scroll to position that places content right below the sticky nav
                                            window.scrollTo({
                                                top: window.scrollY + contentTop - navHeight - 20,
                                                behavior: 'smooth',
                                            });
                                        }}
                                        className={twJoin(
                                            'relative px-6 py-3 rounded-full transition-colors duration-300 z-10',
                                            activeCase === key
                                                ? 'text-bg-color'
                                                : 'text-neutral-600 hover:text-neutral-900'
                                        )}
                                    >
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                            <div className="w-5 h-5">
                                                <Icon
                                                    icon={icon}
                                                    className="w-5 h-5 text-inherit"
                                                />
                                            </div>
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
                    <div className="grid lg:grid-cols-2 gap-16 items-center h-full">
                        <div className="space-y-8">
                            <div
                                className={twJoin(
                                    'inline-flex p-4 rounded-2xl',
                                    contentItemIconStyles[activeIndex % 3]
                                )}
                            >
                                <Icon
                                    icon={activeItem.icons[0]}
                                    className={twJoin('w-8 h-8 text-inherit')}
                                />
                            </div>
                            <div>
                                <h3
                                    className={twJoin(
                                        'text-3xl font-bold mb-4',
                                        'text-neutral-900'
                                    )}
                                >
                                    {activeItem.title}
                                </h3>
                                <p className={twJoin('text-xl', 'text-neutral-600')}>
                                    {activeItem.subtitle}
                                </p>
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
                                                    contentItemFeatureItemIconColors[
                                                        activeIndex % 3
                                                    ]
                                                )}
                                            />
                                            <span
                                                className={twJoin(
                                                    'font-medium',
                                                    'text-neutral-700'
                                                )}
                                            >
                                                {text}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="relative aspect-square">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 opacity-5"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Image profile={getPageProfile()} {...activeItem.images[0]}></Image>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
