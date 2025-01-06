import React, { useCallback, useState } from 'react';
import Container from '../_utils/Container';
import { formatToCAD } from '../_utils/pricing';
import { Link, twJoin, SafeHtml, Icon, website } from '@uniwebcms/module-sdk';
import { HiCheck } from 'react-icons/hi';
import { Switch } from '@headlessui/react';
import Fancy from './Fancy';

const primaryTireRingStyle = 'ring-2 ring-primary-600';
const secondaryTireRingStyle = 'ring-2 ring-secondary-600';
const defaultTireRingStyle = 'ring-1 ring-text-color-70';

const primaryTirePretitleStyle = 'text-primary-600';
const secondaryTirePretitleStyle = 'text-secondary-600';

const primaryTireButtonStyle = 'bg-primary-600 text-white shadow-sm hover:bg-primary-500';
const secondaryTireButtonStyle = 'bg-secondary-600 text-white shadow-sm hover:bg-secondary-500';
const defaultBadgedTireButtonStyle = 'text-bg-color bg-text-color-70 hover:bg-text-color-60';
const defaultTireButtonStyle =
    'text-text-color-70 ring-1 ring-inset ring-text-color-20 hover:ring-text-color-30';

const PriceTier = (props) => {
    const {
        pretitle,
        title: amount,
        subtitle,
        paragraphs,
        links,
        buttons,
        lists,
        icons,
        billingCycle,
        calculateDisplayPrice,
    } = props;

    const link = links[0];
    const badge = buttons?.[0];
    const features = lists[0]?.map((item) => item.paragraphs[0]) || [];
    const icon = icons[0];

    let borderStyle = badge
        ? badge.attrs.style === 'primary'
            ? primaryTireRingStyle
            : badge.attrs.style === 'secondary'
            ? secondaryTireRingStyle
            : 'ring-1 ring-text-color-20'
        : 'ring-1 ring-text-color-20';

    let pretitleStyle = badge
        ? badge.attrs.style === 'primary'
            ? primaryTirePretitleStyle
            : badge.attrs.style === 'secondary'
            ? secondaryTirePretitleStyle
            : ''
        : '';

    let buttonStyle = badge
        ? badge.attrs.style === 'primary'
            ? primaryTireButtonStyle
            : badge.attrs.style === 'secondary'
            ? secondaryTireButtonStyle
            : // : defaultBadgedTireButtonStyle
              defaultTireButtonStyle
        : defaultTireButtonStyle;

    const price = (
        <p className="flex items-baseline gap-x-1">
            <span className="text-4xl font-semibold tracking-tight">
                {!isNaN(amount) ? calculateDisplayPrice(amount) : amount}
            </span>
            {!isNaN(amount) && (
                <span className="text-sm/6 font-medium text-text-color-60">
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
            )}
        </p>
    );
    // let price;

    // if (title.endsWith('/month')) {
    //     const [amount, period] = title.split('/');

    //     price = (
    //         <p className="flex items-baseline gap-x-1">
    //             <span className="text-4xl font-semibold tracking-tight">{amount}</span>
    //             <span className="text-sm/6 font-medium text-text-color-60">/{period}</span>
    //         </p>
    //     );
    // } else {
    //     price = <p className="text-4xl font-semibold tracking-tight">{title}</p>;
    // }

    return (
        <div
            className={twJoin('relative w-full h-full flex flex-col rounded-3xl p-8', borderStyle)}
        >
            <div className="flex flex-col flex-grow">
                {pretitle && (
                    <div className={twJoin('mb-3 flex items-center gap-x-3', pretitleStyle)}>
                        {icon && <Icon icon={icon} className="h-6 w-6 flex-none text-inherit" />}
                        <span className="text-lg lg:text-xl font-semibold">{pretitle}</span>
                    </div>
                )}
                {price}
                {subtitle && (
                    <p className="mt-2 text-sm lg:text-base font-light text-text-color-50 line-clamp-2">
                        {subtitle}
                    </p>
                )}
                {paragraphs.length ? (
                    <SafeHtml
                        value={paragraphs}
                        className="mt-1.5 block text-center text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 text-text-color-40"
                    />
                ) : null}
                <ul role="list" className="mt-6 space-y-3">
                    {features.map((feature, index) => (
                        <li key={index} className="flex gap-x-3">
                            <HiCheck
                                aria-hidden="true"
                                className="h-6 w-5 flex-none text-green-600"
                            />
                            <SafeHtml
                                value={feature}
                                className="text-sm lg:text-base text-text-color-60"
                            />
                        </li>
                    ))}
                </ul>
            </div>

            {link && (
                <Link
                    to={link.route}
                    className={twJoin(
                        'mt-8 block rounded-md px-3 py-2 text-center text-sm lg:text-base/7 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                        buttonStyle
                    )}
                >
                    {link.label}
                </Link>
            )}

            {badge && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div
                        className={twJoin(
                            'px-2 py-0.5 text-xs font-semibold rounded-3xl',
                            badge.attrs.style === 'primary'
                                ? 'bg-primary-600 text-white'
                                : badge.attrs.style === 'secondary'
                                ? 'bg-secondary-600 text-white'
                                : 'bg-text-color text-bg-color'
                        )}
                    >
                        {badge.content}
                    </div>
                </div>
            )}
        </div>
    );
};

const BillingCycleSwitch = ({ billingCycle, setBillingCycle, paragraphs }) => {
    const toggleSwitch = () => {
        setBillingCycle((prev) => (prev === 'monthly' ? 'yearly' : 'monthly'));
    };

    const isYearlyBilling = billingCycle === 'yearly';

    return (
        <div className="flex flex-col items-center gap-y-4">
            <Switch.Group>
                <div className="flex items-center gap-x-3">
                    <span
                        className={twJoin(
                            'mr-3 text-sm lg:text-base cursor-pointer w-44 text-right group max-w-[35vw] truncate',
                            billingCycle === 'monthly'
                                ? 'font-semibold text-text-color'
                                : 'text-text-color-60 group-hover:text-text-color-80'
                        )}
                        onClick={() => setBillingCycle('monthly')}
                    >
                        {website.localize({
                            en: 'Monthly Billing',
                            fr: 'Facturation mensuelle',
                            es: 'Facturación mensual',
                            zh: '每月账单',
                        })}
                    </span>
                    <Switch
                        as="div"
                        checked={isYearlyBilling}
                        onChange={toggleSwitch}
                        className={`${
                            isYearlyBilling ? 'bg-secondary-500' : 'bg-text-color-10'
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2`}
                    >
                        <span
                            className={`${
                                isYearlyBilling ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                    </Switch>
                    <span
                        className="ml-3 text-sm lg:text-base cursor-pointer w-44 text-left group max-w-[35vw] truncate"
                        onClick={() => setBillingCycle('yearly')}
                    >
                        <span
                            className={twJoin(
                                'text-sm lg:text-base cursor-pointer',
                                billingCycle === 'yearly'
                                    ? 'font-semibold text-text-color'
                                    : 'text-text-color-60 group-hover:text-text-color-80'
                            )}
                        >
                            {website.localize({
                                en: 'Annual Billing',
                                fr: 'Facturation annuelle',
                                es: 'Facturación anual',
                                zh: '年度账单',
                            })}
                        </span>
                    </span>
                </div>
            </Switch.Group>
            <SafeHtml
                value={paragraphs}
                className={twJoin(
                    'text-sm font-medium',
                    billingCycle === 'yearly' ? 'text-green-500' : 'text-text-color-30'
                )}
            />
        </div>
    );
};

export default function PricingTiers(props) {
    const { block } = props;
    const { title, subtitle, paragraphs } = block.getBlockContent();

    const items = block.getBlockItems();

    const {
        default_billing_cycle = 'monthly',
        billing_cycle_switcher = false,
        yearly_price_multiplier = 12,
        appearance = 'subtle',
    } = block.getBlockProperties();

    const [billingCycle, setBillingCycle] = useState(default_billing_cycle);

    const calculateDisplayPrice = useCallback(
        (price) => {
            let displayPrice = price;
            if (billingCycle === 'yearly' && default_billing_cycle === 'monthly') {
                displayPrice = price * yearly_price_multiplier;
            } else if (billingCycle === 'monthly' && default_billing_cycle === 'yearly') {
                displayPrice = (price / yearly_price_multiplier).toFixed(2);
            }

            return formatToCAD(displayPrice);
        },
        [billingCycle, default_billing_cycle, yearly_price_multiplier]
    );

    if (appearance === 'subtle') {
        return (
            <Container px="none">
                <div className="px-6 md:px-8 lg:px-16 xl:px-24 max-w-6xl mx-auto">
                    {title && (
                        <h2 className="text-xl font-bold md:text-2xl lg:text-3xl text-center text-pretty">
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <h3 className="mt-4 lg:mt-5 px-0 lg:px-8 text-base md:text-lg text-text-color-60 text-center text-pretty">
                            {subtitle}
                        </h3>
                    )}
                    {billing_cycle_switcher ? (
                        <div className={twJoin(title || subtitle ? 'mt-12' : '')}>
                            <BillingCycleSwitch
                                billingCycle={billingCycle}
                                setBillingCycle={setBillingCycle}
                                paragraphs={paragraphs}
                            />
                        </div>
                    ) : null}
                </div>
                {items.length ? (
                    <div className="mt-12 sm:mt-16 lg:mt-20 px-6 md:px-8 lg:px-16 xl:px-24 max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
                        {items.map((item, index) => (
                            <PriceTier
                                key={index}
                                {...item}
                                billingCycle={billingCycle}
                                calculateDisplayPrice={calculateDisplayPrice}
                            />
                        ))}
                    </div>
                ) : null}
            </Container>
        );
    } else {
        return (
            <Fancy
                {...{
                    title,
                    subtitle,
                    promotion: paragraphs[0],
                    items,
                    billingCycle,
                    calculateDisplayPrice,
                    billing_cycle_switcher,
                    setBillingCycle,
                }}
            />
        );
    }
}
