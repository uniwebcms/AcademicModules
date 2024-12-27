import React from 'react';
import Container from '../../_utils/Container';
import { twJoin, stripTags, website, Icon, Link } from '@uniwebcms/module-sdk';

const containerBgDefault = 'bg-bg-color';
const containerBgOcean = 'bg-slate-900';

const containerBgGradientColorDefault = 'from-bg-color via-primary-50 to-bg-color';
const containerBgGradientColorOcean = 'from-blue-950 via-slate-900 to-slate-900';

const containerBgHalationTopLeftColorDefault = 'bg-primary-50';
const containerBgHalationTopLeftColorOcean = 'bg-blue-500/10';

const containerBgHalationBottomRightColorDefault = 'bg-primary-100';
const containerBgHalationBottomRightColorOcean = 'bg-blue-400/5';

const titleColorDefault = '';
const titleColorOcean = 'text-white';

const subtitleColorDefault = 'text-text-color-80';
const subtitleColorOcean = 'text-slate-400';

const billingCycleTextColorDefault = 'text-text-color-60';
const billingCycleTextColorOcean = 'text-slate-400';

const billingCycleTextActiveColorDefault = 'text-text-color';
const billingCycleTextActiveColorOcean = 'text-white';

const billingCycleSwitchBgDefault = 'bg-text-color-30';
const billingCycleSwitchBgOcean = 'bg-slate-700';

const promotionColorDefault = 'text-green-500';
const promotionColorOcean = 'text-blue-500';

const tierItemCardStyleDefault = 'bg-text-color/10 border-text-color/30 hover:bg-text-color/0';
const tierItemCardStyleOcean = 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70';

const tierItemIconColorDefault = 'text-primary-600';
const tierItemIconColorOcean = [
    'text-blue-500',
    'text-orange-500',
    'text-green-500',
    'text-blue-500',
    'text-orange-500',
    'text-green-500',
];

const tierItemTitleColorDefault = '';
const tierItemTitleColorOcean = 'text-white';

const tierItemAmountColorDefault = '';
const tierItemAmountColorOcean = 'text-white';

const tierItemAmountCycleColorDefault = 'text-text-color-60';
const tierItemAmountCycleColorOcean = 'text-slate-400';

const tierItemDescriptionColorDefault = 'text-text-color-60';
const tierItemDescriptionColorOcean = 'text-slate-400';

const tierItemDividerStyleDefault = 'via-primary-500';
const tierItemDividerStyleOcean = [
    'via-blue-500/50',
    'via-orange-500/50',
    'via-green-500/50',
    'via-blue-500/50',
    'via-orange-500/50',
    'via-green-500/50',
];

const tierItemFeatureStyleDefault = 'text-text-color-80';
const tierItemFeatureStyleOcean = 'text-slate-300';

const tierItemFeatureBulletFromDefault = 'from-primary-500';
const tierItemFeatureBulletFromOcean = [
    'from-blue-500/50',
    'from-orange-500/50',
    'from-green-500/50',
];

const tierItemFeatureBulletHoverDefault = 'from-primary-600';
const tierItemFeatureBulletHoverOcean = [
    'from-blue-400/70',
    'from-orange-400/70',
    'from-green-400/70',
];

const tierItemActionLinkStyleDefault = 'bg-text-color-70 hover:bg-text-color-60 text-text-color-10';
const tierItemActionLinkStyleOcean = 'bg-slate-700 hover:bg-slate-600 text-white';

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
        uiPreset,
    } = props;

    const toggleSwitch = () => {
        setBillingCycle((prev) => (prev === 'monthly' ? 'yearly' : 'monthly'));
    };

    const isAnnual = billingCycle === 'yearly';

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
            <div className="max-w-7xl mx-auto px-8 relative">
                <div className="text-center mb-12">
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
                            uiPreset === 'ocean' ? subtitleColorOcean : subtitleColorDefault
                        )}
                    >
                        {subtitle}
                    </p>
                    {billing_cycle_switcher && (
                        <>
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <span
                                    className={twJoin(
                                        'text-sm',
                                        uiPreset === 'ocean'
                                            ? !isAnnual
                                                ? billingCycleTextActiveColorOcean
                                                : billingCycleTextColorOcean
                                            : !isAnnual
                                            ? billingCycleTextActiveColorDefault
                                            : billingCycleTextColorDefault
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
                                        uiPreset === 'ocean'
                                            ? billingCycleSwitchBgOcean
                                            : billingCycleSwitchBgDefault
                                    )}
                                    onClick={toggleSwitch}
                                >
                                    <span className="sr-only">Toggle billing period</span>
                                    <span
                                        className={twJoin(
                                            isAnnual ? 'translate-x-6' : 'translate-x-1',
                                            'inline-block h-4 w-4 transform rounded-full bg-blue-500 transition'
                                        )}
                                    ></span>
                                </button>
                                <span
                                    className={twJoin(
                                        'text-sm',
                                        uiPreset === 'ocean'
                                            ? isAnnual
                                                ? billingCycleTextActiveColorOcean
                                                : billingCycleTextColorOcean
                                            : isAnnual
                                            ? billingCycleTextActiveColorDefault
                                            : billingCycleTextColorDefault
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
                        <p
                            className={twJoin(
                                'text-sm font-medium',
                                uiPreset === 'ocean' ? promotionColorOcean : promotionColorDefault
                            )}
                        >
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
                                    uiPreset === 'ocean'
                                        ? tierItemCardStyleOcean
                                        : tierItemCardStyleDefault,
                                    badge && 'ring-2 ring-blue-500'
                                )}
                            >
                                {badge && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
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
                                                        uiPreset === 'ocean'
                                                            ? tierItemIconColorOcean[index]
                                                            : tierItemIconColorDefault
                                                    )}
                                                />
                                            )}
                                        </div>
                                        <h3
                                            className={twJoin(
                                                'text-xl font-bold',
                                                uiPreset === 'ocean'
                                                    ? tierItemTitleColorOcean
                                                    : tierItemTitleColorDefault
                                            )}
                                        >
                                            {pretitle}
                                        </h3>
                                    </div>
                                    <div className="mb-6">
                                        {!isNaN(title) ? (
                                            <>
                                                <span
                                                    className={twJoin(
                                                        'text-4xl font-bold',
                                                        uiPreset === 'ocean'
                                                            ? tierItemAmountColorOcean
                                                            : tierItemAmountColorDefault
                                                    )}
                                                >
                                                    {calculateDisplayPrice(title)}
                                                </span>
                                                <span
                                                    className={twJoin(
                                                        uiPreset === 'ocean'
                                                            ? tierItemAmountCycleColorOcean
                                                            : tierItemAmountCycleColorDefault
                                                    )}
                                                >
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
                                                    uiPreset === 'ocean'
                                                        ? tierItemAmountColorOcean
                                                        : tierItemAmountColorDefault
                                                )}
                                            >
                                                {title}
                                            </span>
                                        )}
                                    </div>
                                    <p
                                        className={twJoin(
                                            'text-sm mb-0 h-10 line-clamp-2',
                                            uiPreset === 'ocean'
                                                ? tierItemDescriptionColorOcean
                                                : tierItemDescriptionColorDefault
                                        )}
                                    >
                                        {subtitle}
                                    </p>
                                </div>
                                <div
                                    className={twJoin(
                                        'h-px w-full bg-gradient-to-r from-transparent to-transparent group-hover:via-blue-400/70 transition-colors duration-300',
                                        uiPreset === 'ocean'
                                            ? tierItemDividerStyleOcean[index]
                                            : tierItemDividerStyleDefault
                                    )}
                                ></div>
                                <div className="flex flex-col flex-grow p-6">
                                    <ul className="flex-grow space-y-3 mb-8">
                                        {features.map((feature, f_index) => (
                                            <li
                                                key={f_index}
                                                className={twJoin(
                                                    'group/item flex items-center',
                                                    uiPreset === 'ocean'
                                                        ? tierItemFeatureStyleOcean
                                                        : tierItemFeatureStyleDefault
                                                )}
                                            >
                                                <div
                                                    className={twJoin(
                                                        'mr-3 w-6 h-px bg-gradient-to-r group-hover/item:w-8 transition-all duration-300 to-transparent',
                                                        uiPreset === 'ocean'
                                                            ? tierItemFeatureBulletFromOcean[
                                                                  index % 3
                                                              ]
                                                            : tierItemFeatureBulletFromDefault,
                                                        uiPreset === 'ocean'
                                                            ? tierItemFeatureBulletHoverOcean[
                                                                  index % 3
                                                              ]
                                                            : tierItemFeatureBulletHoverDefault
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
                                                uiPreset === 'ocean'
                                                    ? tierItemActionLinkStyleOcean
                                                    : tierItemActionLinkStyleDefault
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
