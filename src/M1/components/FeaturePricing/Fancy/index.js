import React from 'react';
import Container from '../../_utils/Container';
import { twJoin, Icon, stripTags } from '@uniwebcms/module-sdk';

const containerBgDefault = 'bg-bg-color';
const containerBgOcean = 'bg-slate-900';

const containerBgGradientColorDefault = 'from-primary-50 via-primary-100 to-primary-50';
const containerBgGradientColorOcean = 'from-blue-950 via-slate-900 to-slate-900';

const containerBgHalationTopLeftColorDefault = 'bg-primary-50';
const containerBgHalationTopLeftColorOcean = 'bg-blue-500/10';

const containerBgHalationBottomRightColorDefault = 'bg-primary-50';
const containerBgHalationBottomRightColorOcean = 'bg-blue-400/5';

const containerBgHalationCenterColorDefault = 'bg-primary-100';
const containerBgHalationCenterColorOcean = 'bg-orange-500/5';

const titleColorDefault = '';
const titleColorOcean = 'text-white';

const subtitleColorDefault = 'text-text-color-80';
const subtitleColorOcean = 'text-slate-400';

const featureBoxStyleDefault = 'bg-text-color/10 border-text-color-20 hover:bg-text-color/20';
const featureBoxStyleOcean = 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70';

const featureItemAccentColorDefault = 'text-primary-600';
const featureItemAccentColorOcean = ['text-blue-500', 'text-orange-500', 'text-green-500'];

const featureItemTitleColorDefault = 'text-text-color';
const featureItemTitleColorOcean = 'text-white';

const featureItemFeatureBulletFromDefault = 'from-primary-500';
const featureItemFeatureBulletFromOcean = [
    'from-blue-500/50',
    'from-orange-500/50',
    'from-green-500/50',
];

const featureItemFeatureBulletHoverDefault = 'from-primary-600';
const featureItemFeatureBulletHoverOcean = [
    'from-blue-400/70',
    'from-orange-400/70',
    'from-green-400/70',
];

const featureItemFeatureTextColorDefault = 'from-primary-600';
const featureItemFeatureTextColorOcean = 'text-slate-300';

const Ocean = ({ title, subtitle, items, uiPreset }) => {
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
                        'absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl',
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
                <div
                    className={twJoin(
                        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl',
                        uiPreset === 'ocean'
                            ? containerBgHalationCenterColorOcean
                            : containerBgHalationCenterColorDefault
                    )}
                ></div>
            </div>
            <div className="max-w-7xl mx-auto px-8 relative">
                <div className="max-w-xl mx-auto text-center mb-16">
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
                            'text-lg',
                            uiPreset === 'ocean' ? subtitleColorOcean : subtitleColorDefault
                        )}
                    >
                        {subtitle}
                    </p>
                </div>
                <div className="grid gap-8 md:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                    {items.map((item, index) => {
                        const { icons, title, lists } = item;

                        const icon = icons[0];

                        const features =
                            lists[0]?.map((item) => item.paragraphs[0])?.filter(Boolean) || [];

                        return (
                            <div
                                className={twJoin(
                                    'group backdrop-blur-sm border rounded-xl transition-all duration-300',
                                    uiPreset === 'ocean'
                                        ? featureBoxStyleOcean
                                        : featureBoxStyleDefault
                                )}
                                key={index}
                            >
                                <div className="p-6">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Icon
                                            icon={icon}
                                            className={twJoin(
                                                'w-6 h-6',
                                                uiPreset === 'ocean'
                                                    ? featureItemAccentColorOcean[index % 3]
                                                    : featureItemAccentColorDefault
                                            )}
                                        />
                                    </div>
                                    <h3
                                        className={twJoin(
                                            'text-lg font-bold mb-4',
                                            uiPreset === 'ocean'
                                                ? featureItemTitleColorOcean
                                                : featureItemTitleColorDefault
                                        )}
                                    >
                                        {title}
                                    </h3>
                                    <ul className="space-y-3">
                                        {features.map((feature, f_index) => {
                                            return (
                                                <li
                                                    key={f_index}
                                                    className="flex items-center group/item"
                                                >
                                                    <div
                                                        className={twJoin(
                                                            'mr-3 w-6 h-px bg-gradient-to-r group-hover/item:w-8 transition-all duration-300 to-transparent',
                                                            uiPreset === 'ocean'
                                                                ? featureItemFeatureBulletFromOcean[
                                                                      index % 3
                                                                  ]
                                                                : featureItemFeatureBulletFromDefault,
                                                            uiPreset === 'ocean'
                                                                ? featureItemFeatureBulletHoverOcean[
                                                                      index % 3
                                                                  ]
                                                                : featureItemFeatureBulletHoverDefault
                                                        )}
                                                    ></div>
                                                    <span
                                                        className={
                                                            uiPreset === 'ocean'
                                                                ? featureItemFeatureTextColorOcean
                                                                : featureItemFeatureTextColorDefault
                                                        }
                                                    >
                                                        {stripTags(feature)}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Container>
    );
};

const featureItemIconBgColorOceanBox = ['bg-blue-500/20', 'bg-orange-500/20', 'bg-green-500/20'];
const featureItemIconColorOceanBox = ['text-blue-500', 'text-orange-500', 'text-green-500'];
const featureItemDecorationColorOceanBox = [
    'bg-blue-500/20',
    'bg-orange-500/20',
    'bg-green-500/20',
];

const OceanBox = ({ title, subtitle, items }) => {
    return (
        <Container px="none" py="lg" className="relative bg-slate-900">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-bl from-blue-950 via-slate-900 to-slate-900"></div>
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                    }}
                ></div>
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
            </div>
            <div className="max-w-6xl mx-auto px-8 relative">
                <div className="bg-slate-900/60 rounded-2xl backdrop-blur-xl border border-slate-700/50 p-8 shadow-2xl">
                    <div className="max-w-3xl mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
                        <p className="text-slate-400 text-base">{subtitle}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {items.map((item, index) => {
                            const { title, icons, lists } = item;

                            const icon = icons[0];
                            const features =
                                lists[0]?.map((item) => item.paragraphs[0])?.filter(Boolean) || [];

                            return (
                                <div
                                    key={index}
                                    className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50 transform transition-all duration-300 hover:translate-y--1 hover:bg-slate-800/70"
                                >
                                    <div
                                        className={twJoin(
                                            'w-12 h-12 rounded-lg flex items-center justify-center mb-6',
                                            featureItemIconBgColorOceanBox[index % 3]
                                        )}
                                    >
                                        <Icon
                                            icon={icon}
                                            className={twJoin(
                                                'w-6 h-6',
                                                featureItemIconColorOceanBox[index % 3]
                                            )}
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
                                    <ul className="space-y-3">
                                        {features.map((feature, f_index) => {
                                            return (
                                                <li
                                                    key={f_index}
                                                    className="flex items-center text-slate-300"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className={twJoin(
                                                            'lucide lucide-chevron-right h-4 w-4 mr-2 flex-shrink-0',
                                                            featureItemIconColorOceanBox[index % 3]
                                                        )}
                                                    >
                                                        <path d="m9 18 6-6-6-6"></path>
                                                    </svg>
                                                    {feature}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    <div
                                        className={twJoin(
                                            'h-1 w-16 rounded-full mt-6 opacity-50',
                                            featureItemDecorationColorOceanBox[index % 3]
                                        )}
                                    ></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default function Fancy(props) {
    const { title, subtitle, items, uiPreset } = props;

    if (uiPreset === 'ocean-box') {
        return <OceanBox {...{ title, subtitle, items }} />;
    } else {
        return <Ocean {...{ title, subtitle, items, uiPreset }} />;
    }
}
