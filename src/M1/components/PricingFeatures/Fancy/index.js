import React from 'react';
import Container from '../../_utils/Container';
import { twJoin, Icon, stripTags } from '@uniwebcms/module-sdk';

const featureItemAccentColors = ['text-secondary-500', 'text-primary-500', 'text-accent-500'];
const featureItemFeatureBulletStyles = [
    'from-blue-500/50',
    'from-orange-500/50',
    'from-green-500/50',
];
const featureItemFeatureBulletHoverStyles = [
    'hover:from-blue-400/70',
    'hover:from-orange-400/70',
    'hover:from-green-400/70',
];

const Fancy = ({ title, subtitle, items }) => {
    return (
        <Container px="none" py="lg" className={twJoin('relative')}>
            <div className="absolute inset-0">
                <div
                    className={twJoin(
                        'absolute inset-0 bg-gradient-to-br',
                        'from-secondary-950 via-neutral-900 to-neutral-900'
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
                        'bg-secondary-500/10'
                    )}
                ></div>
                <div
                    className={twJoin(
                        'absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl',
                        'bg-secondary-400/5'
                    )}
                ></div>
                <div
                    className={twJoin(
                        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl',
                        'bg-primary-500/5'
                    )}
                ></div>
            </div>
            <div className="max-w-7xl mx-auto px-8 relative">
                <div className="max-w-xl mx-auto text-center mb-16">
                    <h2 className={twJoin('text-3xl font-bold mb-4')}>{title}</h2>
                    <p className={twJoin('text-lg')}>{subtitle}</p>
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
                                    'bg-neutral-800/50 border-neutral-700/50 hover:bg-neutral-800/70'
                                )}
                                key={index}
                            >
                                <div className="p-6">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Icon
                                            icon={icon}
                                            className={twJoin(
                                                'w-6 h-6',
                                                featureItemAccentColors[index % 3]
                                            )}
                                        />
                                    </div>
                                    <h3 className={twJoin('text-lg font-bold mb-4')}>{title}</h3>
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
                                                            featureItemFeatureBulletStyles[
                                                                index % 3
                                                            ],
                                                            featureItemFeatureBulletHoverStyles[
                                                                index % 3
                                                            ]
                                                        )}
                                                    ></div>
                                                    <span>{stripTags(feature)}</span>
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

const featureItemIconBgColors = ['bg-secondary-500/20', 'bg-primary-500/20', 'bg-accent-500/20'];
const featureItemIconColors = ['text-secondary-500', 'text-primary-500', 'text-accent-500'];
const featureItemDecorationColors = [
    'bg-secondary-500/20',
    'bg-primary-500/20',
    'bg-accent-500/20',
];

const Box = ({ title, subtitle, items }) => {
    return (
        <Container px="none" py="lg" className="relative">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-bl from-secondary-950 via-neutral-900 to-neutral-900"></div>
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                    }}
                ></div>
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-secondary-400/5 rounded-full blur-3xl"></div>
            </div>
            <div className="max-w-6xl mx-auto px-8 relative">
                <div className="bg-neutral-900/60 rounded-2xl backdrop-blur-xl border border-neutral-700/50 p-8 shadow-2xl">
                    <div className="max-w-3xl mb-16">
                        <h2 className="text-3xl font-bold mb-4">{title}</h2>
                        <p className="text-base">{subtitle}</p>
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
                                    className="bg-neutral-800/50 rounded-xl p-6 backdrop-blur-sm border border-neutral-700/50 transform transition-all duration-300 hover:translate-y--1 hover:bg-neutral-800/70"
                                >
                                    <div
                                        className={twJoin(
                                            'w-12 h-12 rounded-lg flex items-center justify-center mb-6',
                                            featureItemIconBgColors[index % 3]
                                        )}
                                    >
                                        <Icon
                                            icon={icon}
                                            className={twJoin(
                                                'w-6 h-6',
                                                featureItemIconColors[index % 3]
                                            )}
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">{title}</h3>
                                    <ul className="space-y-3">
                                        {features.map((feature, f_index) => {
                                            return (
                                                <li
                                                    key={f_index}
                                                    className="flex items-center text-neutral-300"
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
                                                            'h-4 w-4 mr-2 flex-shrink-0',
                                                            featureItemIconColors[index % 3]
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
                                            featureItemDecorationColors[index % 3]
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

export default function (props) {
    const { title, subtitle, items, layout } = props;

    if (layout === 'box') {
        return <Box {...{ title, subtitle, items }} />;
    } else {
        return <Fancy {...{ title, subtitle, items }} />;
    }
}
