import React from 'react';
import Container from '../../_utils/Container';
import { twJoin, Icon } from '@uniwebcms/module-sdk';
import { formatToCAD } from '../../_utils/pricing';

const containerBgDefault = 'bg-bg-color';
const containerBgOcean = 'bg-slate-900';

const containerBgGradientColorDefault = 'from-bg-color via-primary-50 to-bg-color';
const containerBgGradientColorOcean = 'from-blue-950 via-slate-900 to-slate-900';

const containerBgHalationTopLeftColorDefault = 'bg-primary-50';
const containerBgHalationTopLeftColorOcean = 'bg-blue-400/10';

const containerBgHalationBottomRightColorDefault = 'bg-primary-100';
const containerBgHalationBottomRightColorOcean = 'bg-orange-500/5';

const titleColorDefault = '';
const titleColorOcean = 'text-white';

const subtitleColorDefault = 'text-text-color-80';
const subtitleColorOcean = 'text-slate-400';

const promotionStyleDefault = 'bg-primary-100 border-primary-200';
const promotionStyleOcean = 'bg-blue-500/10 border-blue-500/20';

const promotionTitleColorDefault = 'text-primary-600';
const promotionTitleColorOcean = 'text-blue-400';

const promotionDescriptionColorDefault = 'text-primary-600';
const promotionDescriptionColorOcean = 'text-blue-400';

const addonBoxStyleDefault = 'bg-text-color/10 border-text-color-20';
const addonBoxStyleOcean = 'bg-slate-800/50 border-slate-700/50';

const addonItemTitleColorDefault = 'text-text-color';
const addonItemTitleColorOcean = 'text-white';

const addonBoxDividerStyleDefault = 'from-transparent via-primary-200 to-transparent';
const addonBoxDividerStyleOcean = 'from-transparent via-slate-600/70 to-transparent';

const addonIconColorDefault = 'text-primary-500';
const addonIconColorOcean = ['text-blue-500', 'text-orange-500', 'text-green-500', 'text-blue-500'];

const addonFeatureColorDefault = 'text-text-color';
const addonFeatureColorOcean = 'text-white';

const addonFeaturePeriodColorDefault = 'text-text-color-60';
const addonFeaturePeriodColorOcean = 'text-slate-400';

export default function Fancy(props) {
    const { title, subtitle, promotions, items, uiPreset } = props;

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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-12">
                    <div className="max-w-3xl col-span-2">
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
                                'text-base',
                                uiPreset === 'ocean' ? subtitleColorOcean : subtitleColorDefault
                            )}
                        >
                            {subtitle}
                        </p>
                    </div>
                    <div
                        className={twJoin(
                            'border rounded-lg p-4 mx-8 gap-y-2',
                            uiPreset === 'ocean' ? promotionStyleOcean : promotionStyleDefault
                        )}
                    >
                        {promotions.map((promotion, index) => (
                            <div key={index}>
                                <p
                                    className={twJoin(
                                        'font-semibold text-sm mb-2',
                                        uiPreset === 'ocean'
                                            ? promotionTitleColorOcean
                                            : promotionTitleColorDefault
                                    )}
                                >
                                    {promotion.title}
                                </p>
                                <p
                                    className={twJoin(
                                        'font-base text-sm',
                                        uiPreset === 'ocean'
                                            ? promotionDescriptionColorOcean
                                            : promotionDescriptionColorDefault
                                    )}
                                >
                                    {promotion.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    {items.map((item, index) => {
                        const { title, icons, lists } = item;

                        const features = lists[0]?.map((item) => {
                            const content = item?.paragraphs?.[0];
                            const [text = '', price = ''] = content.split('|');
                            const [amount, period] = price.split('/');
                            return {
                                text,
                                price: formatToCAD(amount),
                                period,
                            };
                        });

                        return (
                            <div
                                key={index}
                                className={twJoin(
                                    'rounded-xl backdrop-blur-sm border overflow-hidden',
                                    uiPreset === 'ocean' ? addonBoxStyleOcean : addonBoxStyleDefault
                                )}
                            >
                                <div className="p-6 flex justify-between items-center">
                                    <h3
                                        className={twJoin(
                                            'text-xl font-bold',
                                            uiPreset === 'ocean'
                                                ? addonItemTitleColorOcean
                                                : addonItemTitleColorDefault
                                        )}
                                    >
                                        {title}
                                    </h3>
                                </div>
                                <div
                                    className={twJoin(
                                        'h-px w-full bg-gradient-to-r',
                                        uiPreset === 'ocean'
                                            ? addonBoxDividerStyleOcean
                                            : addonBoxDividerStyleDefault
                                    )}
                                ></div>
                                <div className="p-6 space-y-6">
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex items-center">
                                            <div
                                                className={twJoin(
                                                    'w-10 h-10 rounded-lg flex items-center justify-center mr-4'
                                                )}
                                            >
                                                <Icon
                                                    icon={icons[index]}
                                                    className={twJoin(
                                                        'w-5 h-5',
                                                        uiPreset === 'ocean'
                                                            ? addonIconColorOcean[index]
                                                            : addonIconColorDefault
                                                    )}
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center justify-between">
                                                    <h4
                                                        className={twJoin(
                                                            'text-lg font-medium',
                                                            uiPreset === 'ocean'
                                                                ? addonFeatureColorOcean
                                                                : addonFeatureColorDefault
                                                        )}
                                                    >
                                                        {feature.text}
                                                    </h4>
                                                    <div className="text-right">
                                                        <span
                                                            className={twJoin(
                                                                'text-xl font-bold ',
                                                                uiPreset === 'ocean'
                                                                    ? addonFeatureColorOcean
                                                                    : addonFeatureColorDefault
                                                            )}
                                                        >
                                                            {feature.price}
                                                        </span>
                                                        <span
                                                            className={twJoin(
                                                                uiPreset === 'ocean'
                                                                    ? addonFeaturePeriodColorOcean
                                                                    : addonFeaturePeriodColorDefault
                                                            )}
                                                        >
                                                            /{feature.period}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Container>
    );
}
