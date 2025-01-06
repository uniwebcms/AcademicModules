import React from 'react';
import Container from '../../_utils/Container';
import { twJoin, stripTags, website, Icon, Link } from '@uniwebcms/module-sdk';

const tierItemIconColors = ['text-secondary-500', 'text-primary-500', 'text-accent-500'];

const tierItemDividerViaColors = [
    'via-secondary-500/50',
    'via-primary-500/50',
    'via-accent-500/50',
];

const tierItemFeatureBulletFromColors = [
    'from-secondary-500/50 hover:from-secondary-400/70',
    'from-primary-500/50 hover:from-primary-400/70',
    'from-accent-500/50 hover:from-accent-400/70',
];

export default function Fancy(props) {
    const {
        title,
        subtitle,
        promotion,
        items,
        billingCycle,
        setBillingCycle,
        calculateDisplayPrice,
        billing_cycle_switcher,
    } = props;

    const toggleSwitch = () => {
        setBillingCycle((prev) => (prev === 'monthly' ? 'yearly' : 'monthly'));
    };

    const isAnnual = billingCycle === 'yearly';

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
            <div className="max-w-7xl mx-auto px-8 relative">
                <div className="text-center mb-12">
                    <h2 className={twJoin('text-3xl font-bold mb-4')}>{title}</h2>
                    <p className={twJoin('text-base mb-8')}>{subtitle}</p>
                    {billing_cycle_switcher && (
                        <>
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <span
                                    className={twJoin(
                                        'text-sm',
                                        isAnnual ? 'text-text-color' : 'text-heading-color'
                                    )}
                                >
                                    {website.localize({
                                        en: 'Monthly',
                                        fr: 'Mensuel',
                                        es: 'Mensual',
                                        zh: '每月',
                                    })}
                                </span>
                                <button
                                    className={twJoin(
                                        'relative inline-flex h-6 w-11 items-center rounded-full',
                                        'bg-neutral-700'
                                    )}
                                    onClick={toggleSwitch}
                                >
                                    <span className="sr-only">Toggle billing period</span>
                                    <span
                                        className={twJoin(
                                            isAnnual ? 'translate-x-6' : 'translate-x-1',
                                            'inline-block h-4 w-4 transform rounded-full bg-secondary-500 transition'
                                        )}
                                    ></span>
                                </button>
                                <span
                                    className={twJoin(
                                        'text-sm',
                                        !isAnnual ? 'text-text-color' : 'text-heading-color'
                                    )}
                                >
                                    {website.localize({
                                        en: 'Annual',
                                        fr: 'Annuel',
                                        es: 'Anual',
                                        zh: '年度',
                                    })}
                                </span>
                            </div>
                        </>
                    )}
                    {promotion && (
                        <p className={twJoin('text-sm font-medium', 'text-secondary-500')}>
                            {stripTags(promotion)}
                        </p>
                    )}
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {items.map((item, index) => {
                        const { pretitle, title, subtitle, buttons, icons, links, lists } = item;

                        const badge = buttons?.[0];
                        const icon = icons?.[0];
                        const features =
                            lists[0]?.map((item) => item.paragraphs[0])?.filter(Boolean) || [];
                        const actionLink = links[0];

                        return (
                            <div
                                key={index}
                                className={twJoin(
                                    'flex flex-col group relative rounded-xl backdrop-blur-sm border transform transition-all duration-300 hover:translate-y-[-2px]',
                                    'bg-neutral-800/50 border-neutral-700/50 hover:bg-neutral-800/70',
                                    badge && 'ring-2 ring-secondary-500'
                                )}
                            >
                                {badge && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-secondary-500 text-heading-color px-3 py-1 rounded-full text-sm font-medium">
                                            {badge.content}
                                        </span>
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                                            {icon && (
                                                <Icon
                                                    icon={icon}
                                                    className={twJoin(
                                                        'h-5 w-5 flex-none',
                                                        tierItemIconColors[index % 3]
                                                    )}
                                                />
                                            )}
                                        </div>
                                        <h3 className={twJoin('text-xl font-bold')}>{pretitle}</h3>
                                    </div>
                                    <div className="mb-6">
                                        {!isNaN(title) ? (
                                            <>
                                                <span
                                                    className={twJoin(
                                                        'text-4xl font-bold',
                                                        'text-heading-color'
                                                    )}
                                                >
                                                    {calculateDisplayPrice(title)}
                                                </span>
                                                <span className={twJoin('text-text-color')}>
                                                    /
                                                    {billingCycle === 'yearly'
                                                        ? website.localize({
                                                              en: 'year',
                                                              fr: 'an',
                                                              es: 'año',
                                                              zh: '年',
                                                          })
                                                        : website.localize({
                                                              en: 'month',
                                                              fr: 'mois',
                                                              es: 'mes',
                                                              zh: '月',
                                                          })}
                                                </span>
                                            </>
                                        ) : (
                                            <span
                                                className={twJoin(
                                                    'text-2xl font-bold',
                                                    'text-heading-color'
                                                )}
                                            >
                                                {title}
                                            </span>
                                        )}
                                    </div>
                                    <p
                                        className={twJoin(
                                            'text-sm mb-0 h-10 line-clamp-2',
                                            'text-text-color'
                                        )}
                                    >
                                        {subtitle}
                                    </p>
                                </div>
                                <div
                                    className={twJoin(
                                        'h-px w-full bg-gradient-to-r from-transparent to-transparent group-hover:via-blue-400/70 transition-colors duration-300',
                                        tierItemDividerViaColors[index % 3]
                                    )}
                                ></div>
                                <div className="flex flex-col flex-grow p-6">
                                    <ul className="flex-grow space-y-3 mb-8">
                                        {features.map((feature, f_index) => (
                                            <li
                                                key={f_index}
                                                className={twJoin(
                                                    'group/item flex items-center',
                                                    'text-neutral-300'
                                                )}
                                            >
                                                <div
                                                    className={twJoin(
                                                        'mr-3 w-6 h-px bg-gradient-to-r group-hover/item:w-8 transition-all duration-300 to-transparent',
                                                        tierItemFeatureBulletFromColors[index % 3]
                                                    )}
                                                ></div>
                                                {stripTags(feature)}
                                            </li>
                                        ))}
                                    </ul>
                                    {actionLink && (
                                        <Link
                                            to={actionLink.route}
                                            className={twJoin(
                                                'block w-full py-2 px-4 rounded-lg font-medium transition-colors opacity-70 text-center cursor-pointer',
                                                'bg-neutral-700 hover:bg-neutral-600 text-heading-color'
                                            )}
                                        >
                                            {actionLink.label}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Container>
    );
}
