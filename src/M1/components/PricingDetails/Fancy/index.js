import React from 'react';
import Container from '../../_utils/Container';
import { twJoin, Icon, stripTags } from '@uniwebcms/module-sdk';

export default function Fancy(props) {
    const { title, subtitle, items } = props;

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
                        'absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl',
                        'bg-secondary-500/10'
                    )}
                ></div>
                <div
                    className={twJoin(
                        'absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl',
                        'bg-secondary-400/5'
                    )}
                ></div>
            </div>
            <div className="max-w-6xl mx-auto px-8 relative">
                <div
                    className={twJoin(
                        'rounded-2xl backdrop-blur-xl border p-8 shadow-2xl',
                        'bg-neutral-900/60 border-neutral-700/50'
                    )}
                >
                    <div className="grid md:grid-cols-2 gap-8 md:gap-16">
                        <div className="flex flex-col md:h-full">
                            <div className="mt-4">
                                <h2 className={twJoin('text-3xl font-bold mb-4')}>{title}</h2>
                                <p className={twJoin('text-base mb-8')}>{subtitle}</p>
                            </div>
                            <div
                                className={twJoin(
                                    'rounded-xl p-6 backdrop-blur-sm border mt-auto',
                                    'bg-neutral-800/50 border-neutral-700/50'
                                )}
                            >
                                <h3 className={twJoin('text-xl font-bold mb-4 flex items-center')}>
                                    <Icon
                                        icon={firstItemTitleIcon}
                                        className={twJoin('w-5 h-5 mr-2', 'text-primary-500')}
                                    />
                                    {firstItemTitle}
                                </h3>
                                <ul className="space-y-3">
                                    {firstItemFeatures.map((feature, index) => (
                                        <li
                                            key={index}
                                            className={twJoin(
                                                'flex items-center',
                                                'text-text-color'
                                            )}
                                        >
                                            <Icon
                                                icon={firstItemIcons[index]}
                                                className={twJoin(
                                                    'h-4 w-4 mr-2 flex-shrink-0',
                                                    'text-secondary-500'
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
                                'bg-neutral-800/50 border-neutral-700/50'
                            )}
                        >
                            <h3 className={twJoin('text-xl font-bold mb-6 flex items-center')}>
                                <Icon
                                    icon={secondItemTitleIcon}
                                    className={twJoin('w-5 h-5 mr-2', 'text-primary-500')}
                                />
                                {secondItemTitle}
                            </h3>
                            <div className="space-y-6">
                                {secondItemFeatures.map((feature, index) => (
                                    <div key={index} className="flex items-start">
                                        <div
                                            className={twJoin(
                                                'flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center mr-4',
                                                'bg-secondary-500/20'
                                            )}
                                        >
                                            <Icon
                                                icon={secondItemIcons[index]}
                                                className={twJoin(
                                                    'h-4 w-4 flex-shrink-0',
                                                    'text-secondary-500'
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <h4 className={twJoin('font-medium mb-1')}>
                                                {feature.title}
                                            </h4>
                                            <p className={twJoin('text-text-color')}>
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
