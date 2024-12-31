import React, { useState, useEffect } from 'react';
import Container from '../../_utils/Container';
import { twJoin, Icon, Image, getPageProfile } from '@uniwebcms/module-sdk';

const containerBgDefault = 'bg-bg-color';
const containerBgRainbow = [
    'bg-gradient-to-b from-white via-slate-50 to-orange-50',
    'bg-gradient-to-b from-white via-slate-50 to-green-50',
    'bg-gradient-to-b from-white via-slate-50 to-blue-50',
];

const titleColorDefault = 'text-text-color';
const titleColorRainbow = 'text-gray-900';

const subtitleColorDefault = 'text-text-color-60';
const subtitleColorRainbow = 'text-gray-600';

const showcaseSwitcherColorDefault = 'bg-bg-color';
const showcaseSwitcherColorRainbow = ['bg-orange-50', 'bg-green-50', 'bg-blue-50'];

const showcaseSwitcherItemStyleDefault = 'text-text-color-70 hover:text-text-color-90';
const showcaseSwitcherItemStyleRainbow = 'text-gray-600 hover:text-gray-900';

const showcaseSwitcherItemActiveStyleDefault = 'text-bg-color';
const showcaseSwitcherItemActiveStyleRainbow = 'text-white';

const contentItemBgStyleDefault = '';
const contentItemBgStyleRainbow = 'border-gray-100 bg-white';

const contentItemBgColorDefault = '';
const contentItemBgColorRainbow = [
    'radial-gradient(circle at 50% 90%, rgba(255,137,0,0.1), transparent 50%)',
    'radial-gradient(circle at 50% 90%, rgba(34,197,94,0.1), transparent 50%)',
    'radial-gradient(circle at 50% 90%, rgba(59,130,246,0.1), transparent 50%)',
];

const contentItemIconStyleDefault = 'bg-primary-50 text-primary-500';
const contentItemIconStyleRainbow = [
    'bg-orange-50 text-orange-500',
    'bg-green-50 text-green-500',
    'bg-blue-50 text-blue-500',
];

const contentItemTitleColorDefault = 'text-text-color';
const contentItemTitleColorRainbow = 'text-gray-900';

const contentItemSubtitleColorDefault = 'text-text-color-60';
const contentItemSubtitleColorRainbow = 'text-gray-600';

const contentItemFeatureItemStyleDefault =
    'bg-bg-color border-text-color-10 hover:border-text-color-20 shadow-text-color-10';
const contentItemFeatureItemStyleRainbow = [
    'bg-white border-orange-200 hover:border-orange-300 shadow-orange-100',
    'bg-white border-green-200 hover:border-green-300 shadow-green-100',
    'bg-white border-blue-200 hover:border-blue-300 shadow-blue-100',
];

const contentItemFeatureItemIconColorDefault = 'text-primary-600';
const contentItemFeatureItemIconColorRainbow = [
    'text-orange-500',
    'text-green-500',
    'text-blue-500',
];

const contentItemFeatureItemTextColorDefault = 'text-text-color-80';
const contentItemFeatureItemTextColorRainbow = 'text-gray-700';

export default function Fancy(props) {
    const { title, subtitle, items, uiPreset } = props;

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
                'relative',
                uiPreset === 'rainbow' ? containerBgRainbow[activeIndex] : containerBgDefault
            )}
        >
            <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
                <div className="text-center mb-16">
                    <h2
                        className={twJoin(
                            'text-4xl font-bold mb-4',
                            uiPreset === 'rainbow' ? titleColorRainbow : titleColorDefault
                        )}
                    >
                        {title}
                    </h2>
                    <p
                        className={twJoin(
                            'text-xl max-w-3xl mx-auto',
                            uiPreset === 'rainbow' ? subtitleColorRainbow : subtitleColorDefault
                        )}
                    >
                        {subtitle}
                    </p>
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
                            uiPreset === 'rainbow'
                                ? showcaseSwitcherColorRainbow[activeIndex]
                                : showcaseSwitcherColorDefault
                        )}
                    >
                        <div
                            className="absolute top-2 bottom-2 transition-all duration-300 ease-in-out rounded-full bg-gray-900"
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
                                    <button
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
                                                ? uiPreset === 'rainbow'
                                                    ? showcaseSwitcherItemActiveStyleRainbow
                                                    : showcaseSwitcherItemActiveStyleDefault
                                                : uiPreset === 'rainbow'
                                                ? showcaseSwitcherItemStyleRainbow
                                                : showcaseSwitcherItemStyleDefault
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
                                    </button>
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
                        uiPreset === 'rainbow'
                            ? contentItemBgStyleRainbow
                            : contentItemBgStyleDefault
                    )}
                    style={{
                        backgroundImage:
                            uiPreset === 'rainbow'
                                ? contentItemBgColorRainbow[0]
                                : contentItemBgColorDefault,
                    }}
                >
                    <div className="grid lg:grid-cols-2 gap-16 items-center h-full">
                        <div className="space-y-8">
                            <div
                                className={twJoin(
                                    'inline-flex p-4 rounded-2xl',
                                    uiPreset === 'rainbow'
                                        ? contentItemIconStyleRainbow[activeIndex]
                                        : contentItemIconStyleDefault
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
                                        uiPreset === 'rainbow'
                                            ? contentItemTitleColorRainbow
                                            : contentItemTitleColorDefault
                                    )}
                                >
                                    {activeItem.title}
                                </h3>
                                <p
                                    className={twJoin(
                                        'text-xl',
                                        uiPreset === 'rainbow'
                                            ? contentItemSubtitleColorRainbow
                                            : contentItemSubtitleColorDefault
                                    )}
                                >
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
                                                uiPreset === 'rainbow'
                                                    ? contentItemFeatureItemStyleRainbow[
                                                          activeIndex
                                                      ]
                                                    : contentItemFeatureItemStyleDefault
                                            )}
                                        >
                                            <Icon
                                                icon={icon}
                                                className={twJoin(
                                                    'w-5 h-5',
                                                    uiPreset === 'rainbow'
                                                        ? contentItemFeatureItemIconColorRainbow[
                                                              activeIndex
                                                          ]
                                                        : contentItemFeatureItemIconColorDefault
                                                )}
                                            />
                                            <span
                                                className={twJoin(
                                                    'font-medium',
                                                    uiPreset === 'rainbow'
                                                        ? contentItemFeatureItemTextColorRainbow
                                                        : contentItemFeatureItemTextColorDefault
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
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 opacity-5"></div>
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
