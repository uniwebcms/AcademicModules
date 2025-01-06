import React from 'react';
import Container from '../../_utils/Container';
import { twJoin, Icon } from '@uniwebcms/module-sdk';
import { formatToCAD } from '../../_utils/pricing';

const addonIconColors = ['text-blue-500', 'text-orange-500', 'text-green-500', 'text-blue-500'];

export default function Fancy(props) {
    const { title, subtitle, promotions, items } = props;

    return (
        <Container px="none" py="lg" className={twJoin('relative')}>
            <div className="absolute inset-0">
                <div
                    className={twJoin(
                        'absolute inset-0 bg-gradient-to-br',
                        'from-neutral-900 via-primary-950/10 to-neutral-900'
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
                        'bg-secondary-400/10'
                    )}
                ></div>
                <div
                    className={twJoin(
                        'absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl',
                        'bg-primary-500/5'
                    )}
                ></div>
            </div>
            <div className="max-w-6xl mx-auto px-8 relative">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-12">
                    <div className="max-w-3xl col-span-2">
                        <h2 className={twJoin('text-3xl font-bold mb-4')}>{title}</h2>
                        <p className={twJoin('text-base')}>{subtitle}</p>
                    </div>
                    <div
                        className={twJoin(
                            'border rounded-lg p-4 mx-8 gap-y-2',
                            'bg-secondary-500/10 border-secondary-500/20'
                        )}
                    >
                        {promotions.map((promotion, index) => (
                            <div key={index}>
                                <p
                                    className={twJoin(
                                        'font-semibold text-sm mb-2',
                                        'text-secondary-400'
                                    )}
                                >
                                    {promotion.title}
                                </p>
                                <p className={twJoin('font-base text-sm', 'text-secondary-400')}>
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
                                    'bg-neutral-800/50 border-neutral-700/50'
                                )}
                            >
                                <div className="p-6 flex justify-between items-center">
                                    <h3
                                        className={twJoin(
                                            'text-xl font-bold',
                                            'text-heading-color'
                                        )}
                                    >
                                        {title}
                                    </h3>
                                </div>
                                <div
                                    className={twJoin(
                                        'h-px w-full bg-gradient-to-r',
                                        'from-transparent via-neutral-600/70 to-transparent'
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
                                                        addonIconColors[index]
                                                    )}
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center justify-between">
                                                    <h4 className={twJoin('text-lg font-medium')}>
                                                        {feature.text}
                                                    </h4>
                                                    <div className="text-right">
                                                        <span
                                                            className={twJoin(
                                                                'text-xl font-bold',
                                                                'text-heading-color'
                                                            )}
                                                        >
                                                            {feature.price}
                                                        </span>
                                                        <span>/{feature.period}</span>
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
