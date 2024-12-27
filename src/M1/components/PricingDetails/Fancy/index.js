import React from 'react';
import Container from '../../_utils/Container';
import { twJoin, Icon, stripTags } from '@uniwebcms/module-sdk';

const containerBgDefault = 'bg-bg-color';
const containerBgOcean = 'bg-slate-900';

const containerBgGradientColorDefault = 'from-bg-color via-primary-50 to-bg-color';
const containerBgGradientColorOcean = 'from-blue-950 via-slate-900 to-slate-900';

const containerBgHalationTopLeftColorDefault = 'bg-primary-50';
const containerBgHalationTopLeftColorOcean = 'bg-blue-500/10';

const containerBgHalationBottomRightColorDefault = 'bg-primary-100';
const containerBgHalationBottomRightColorOcean = 'bg-blue-400/5';

const detailBoxStyleDefault = 'bg-text-color/10 border-text-color-20';
const detailBoxStyleOcean = 'bg-slate-900/60 border-slate-700/50';

const titleColorDefault = '';
const titleColorOcean = 'text-white';

const subtitleColorDefault = 'text-text-color-80';
const subtitleColorOcean = 'text-slate-400';

const detailBoxItemStyleDefault = 'bg-text-color/10 border-text-color-30';
const detailBoxItemStyleOcean = 'bg-slate-800/50 border-slate-700/50';

const detailBoxItemTitleColorDefault = 'text-text-color';
const detailBoxItemTitleColorOcean = 'text-white';

const detailBoxItemTitleIconColorDefault = 'text-primary-600';
const detailBoxItemTitleIconColorOcean = 'text-orange-500';

const detailBoxFirstItemTextColorDefault = 'text-text-color-80';
const detailBoxFirstItemTextColorOcean = 'text-slate-300';

const detailBoxFirstItemIconColorDefault = 'text-green-500';
const detailBoxFirstItemIconColorOcean = 'text-blue-500';

const detailBoxSecondItemIconBgColorDefault = 'bg-primary-50';
const detailBoxSecondItemIconBgColorOcean = 'bg-blue-500/20';

const detailBoxSecondItemIconColorDefault = 'text-green-500';
const detailBoxSecondItemIconColorOcean = 'text-blue-500';

const detailBoxSecondItemTitleColorDefault = 'text-text-color';
const detailBoxSecondItemTitleColorOcean = 'text-white';

const detailBoxSecondItemTextColorDefault = 'text-text-color-80';
const detailBoxSecondItemTextColorOcean = 'text-slate-400';

export default function Fancy(props) {
    const { title, subtitle, items, uiPreset } = props;

    const [firstItem, secondItem] = items;

    const [firstItemTitleIcon, ...firstItemIcons] = firstItem?.icons || [];
    const firstItemTitle = firstItem?.title;
    const firstItemFeatures =
        firstItem?.lists[0]?.map((item) => item.paragraphs[0])?.filter(Boolean) || [];

    const [secondItemTitleIcon, ...secondItemIcons] = secondItem?.icons || [];
    const secondItemTitle = secondItem?.title;
    const secondItemFeatures =
        secondItem?.lists[0]?.map((item) => {
            return { title: item.paragraphs[0], description: item.lists[0]?.[0]?.paragraphs[0] };
        }) || [];

    return (
        <Container
            px="none"
            py="lg"
            className={twJoin(
                'relative',
                uiPreset === 'ocean' ? containerBgOcean : containerBgDefault
            )}
        >
            <div className="absolute inset-0">
                <div
                    className={twJoin(
                        'absolute inset-0 bg-gradient-to-br',
                        uiPreset === 'ocean'
                            ? containerBgGradientColorOcean
                            : containerBgGradientColorDefault
                    )}
                ></div>
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}
                ></div>
                <div
                    className={twJoin(
                        'absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl',
                        uiPreset === 'ocean'
                            ? containerBgHalationTopLeftColorOcean
                            : containerBgHalationTopLeftColorDefault
                    )}
                ></div>
                <div
                    className={twJoin(
                        'absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl',
                        uiPreset === 'ocean'
                            ? containerBgHalationBottomRightColorOcean
                            : containerBgHalationBottomRightColorDefault
                    )}
                ></div>
            </div>
            <div className="max-w-6xl mx-auto px-8 relative">
                <div
                    className={twJoin(
                        'rounded-2xl backdrop-blur-xl border p-8 shadow-2xl',
                        uiPreset === 'ocean' ? detailBoxStyleOcean : detailBoxStyleDefault
                    )}
                >
                    <div className="grid md:grid-cols-2 gap-8 md:gap-16">
                        <div className="flex flex-col md:h-full">
                            <div className="mt-4">
                                <h2
                                    className={twJoin(
                                        'text-3xl font-bold mb-4',
                                        uiPreset === 'ocean' ? titleColorOcean : titleColorDefault
                                    )}
                                >
                                    {title}
                                </h2>
                                <p
                                    className={twJoin(
                                        'text-base mb-8',
                                        uiPreset === 'ocean'
                                            ? subtitleColorOcean
                                            : subtitleColorDefault
                                    )}
                                >
                                    {subtitle}
                                </p>
                            </div>
                            <div
                                className={twJoin(
                                    'rounded-xl p-6 backdrop-blur-sm border mt-auto',
                                    uiPreset === 'ocean'
                                        ? detailBoxItemStyleOcean
                                        : detailBoxItemStyleDefault
                                )}
                            >
                                <h3
                                    className={twJoin(
                                        'text-xl font-bold mb-4 flex items-center',
                                        uiPreset === 'ocean'
                                            ? detailBoxItemTitleColorOcean
                                            : detailBoxItemTitleColorDefault
                                    )}
                                >
                                    <Icon
                                        icon={firstItemTitleIcon}
                                        className={twJoin(
                                            'w-5 h-5 mr-2',
                                            uiPreset === 'ocean'
                                                ? detailBoxItemTitleIconColorOcean
                                                : detailBoxItemTitleIconColorDefault
                                        )}
                                    />
                                    {firstItemTitle}
                                </h3>
                                <ul className="space-y-3">
                                    {firstItemFeatures.map((feature, index) => (
                                        <li
                                            key={index}
                                            className={twJoin(
                                                'flex items-center',
                                                uiPreset === 'ocean'
                                                    ? detailBoxFirstItemTextColorOcean
                                                    : detailBoxFirstItemTextColorDefault
                                            )}
                                        >
                                            <Icon
                                                icon={firstItemIcons[index]}
                                                className={twJoin(
                                                    'h-4 w-4 mr-2 flex-shrink-0',
                                                    uiPreset === 'ocean'
                                                        ? detailBoxFirstItemIconColorOcean
                                                        : detailBoxFirstItemIconColorDefault
                                                )}
                                            />
                                            {stripTags(feature)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div
                            className={twJoin(
                                'rounded-xl p-6 backdrop-blur-sm border h-full',
                                uiPreset === 'ocean'
                                    ? detailBoxItemStyleOcean
                                    : detailBoxItemStyleDefault
                            )}
                        >
                            <h3
                                className={twJoin(
                                    'text-xl font-bold mb-6 flex items-center',
                                    uiPreset === 'ocean'
                                        ? detailBoxItemTitleColorOcean
                                        : detailBoxItemTitleColorDefault
                                )}
                            >
                                <Icon
                                    icon={secondItemTitleIcon}
                                    className={twJoin(
                                        'w-5 h-5 mr-2',
                                        uiPreset === 'ocean'
                                            ? detailBoxItemTitleIconColorOcean
                                            : detailBoxItemTitleIconColorDefault
                                    )}
                                />
                                {secondItemTitle}
                            </h3>
                            <div className="space-y-6">
                                {secondItemFeatures.map((feature, index) => (
                                    <div key={index} className="flex items-start">
                                        <div
                                            className={twJoin(
                                                'flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center mr-4',
                                                uiPreset === 'ocean'
                                                    ? detailBoxSecondItemIconBgColorOcean
                                                    : detailBoxSecondItemIconBgColorDefault
                                            )}
                                        >
                                            <Icon
                                                icon={secondItemIcons[index]}
                                                className={twJoin(
                                                    'h-4 w-4 flex-shrink-0',
                                                    uiPreset === 'ocean'
                                                        ? detailBoxSecondItemIconColorOcean
                                                        : detailBoxSecondItemIconColorDefault
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <h4
                                                className={twJoin(
                                                    'font-medium mb-1',
                                                    uiPreset === 'ocean'
                                                        ? detailBoxSecondItemTitleColorOcean
                                                        : detailBoxSecondItemTitleColorDefault
                                                )}
                                            >
                                                {feature.title}
                                            </h4>
                                            <p
                                                className={twJoin(
                                                    uiPreset === 'ocean'
                                                        ? detailBoxSecondItemTextColorOcean
                                                        : detailBoxSecondItemTextColorDefault
                                                )}
                                            >
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
