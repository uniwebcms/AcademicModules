import React from 'react';
import { twJoin, Link, Icon, stripTags } from '@uniwebcms/module-sdk';

export default function PricingTier(props) {
    const { block, website } = props;

    const { title, paragraphs, links } = block.getBlockContent();
    const { month_annual_toggle = false } = block.getBlockProperties();

    const promotion = paragraphs?.[0] || '';
    const link = links[0];

    const items = block.getBlockItems();

    const [billingCycle, setBillingCycle] = React.useState('monthly');
    const isAnnual = billingCycle === 'annual';

    const toggleSwitch = () => {
        setBillingCycle((prev) => (prev === 'monthly' ? 'annual' : 'monthly'));
    };

    return (
        <div className="pt-[60px] pb-10 px-5">
            <div className="text-center">
                <h2 className="text-[42px] md:text-[48px] xl:text-[72px] leading-[118%] md:leading-[112%]">
                    {title}
                </h2>
                {month_annual_toggle && (
                    <div className="flex items-center justify-center gap-4 mt-6 mb-4">
                        <span
                            className={twJoin(
                                'text-sm font-medium cursor-pointer',
                                isAnnual ? 'text-text-color/50' : 'text-text-color'
                            )}
                            onClick={() => {
                                setBillingCycle('monthly');
                            }}
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
                                'relative inline-flex h-5 w-8 items-center rounded-full transform transition-colors focus:outline-none',
                                isAnnual ? 'bg-green-500' : 'bg-neutral-200'
                            )}
                            onClick={toggleSwitch}
                        >
                            <span className="sr-only">Toggle billing period</span>
                            <span
                                className={twJoin(
                                    isAnnual ? 'translate-x-3.5' : 'translate-x-1',
                                    'inline-block h-3.5 w-3.5 transform rounded-full bg-neutral-50 transition'
                                )}
                            ></span>
                        </button>
                        <span
                            className={twJoin(
                                'text-sm font-medium cursor-pointer',
                                isAnnual ? 'text-text-color' : 'text-text-color/50'
                            )}
                            onClick={() => {
                                setBillingCycle('annual');
                            }}
                        >
                            {website.localize({
                                en: 'Annual',
                                fr: 'Annuel',
                                es: 'Anual',
                                zh: '年度',
                            })}
                        </span>
                    </div>
                )}
                {promotion && (
                    <p
                        className={twJoin(
                            'text-base',
                            isAnnual ? 'text-green-500' : 'text-text-color/50'
                        )}
                    >
                        {stripTags(promotion)}
                    </p>
                )}
            </div>
            <div className="grid lg:grid-cols-3 mt-8 gap-4 sm:gap-6 max-w-[1400px] mx-auto">
                {items.map((item, index) => {
                    const {
                        pretitle,
                        title,
                        subtitle,
                        description,
                        links,
                        lists,
                        buttons,
                        properties,
                    } = item;

                    const link = links[0];
                    const list = lists[0];
                    const badge = buttons?.[0];
                    const { promotionPrice } = properties || {};

                    return (
                        <div
                            key={index}
                            className={twJoin(
                                'relative h-full p-6 rounded-[12px] text-left font-light',
                                badge ? 'border-accent-600 border' : 'border border-text-color-30'
                            )}
                        >
                            {badge && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                    <span className="h-7 bg-accent-600 text-bg-color px-4 rounded-full text-sm flex items-center justify-center">
                                        {badge.content}
                                    </span>
                                </div>
                            )}
                            <div className="space-y-1">
                                <p className="text-2xl">{pretitle}</p>
                                <div className="relative h-10 overflow-hidden">
                                    <div
                                        className={twJoin(
                                            'absolute top-0 left-0 w-full transition-transform duration-500 ease-in-out',
                                            isAnnual && promotionPrice
                                                ? '-translate-y-full'
                                                : 'translate-y-0'
                                        )}
                                    >
                                        <p className="text-4xl font-bold">{title}</p>
                                    </div>
                                    <div
                                        className={twJoin(
                                            'absolute top-full left-0 w-full transition-transform duration-500 ease-in-out',
                                            isAnnual ? '-translate-y-full' : 'translate-y-0'
                                        )}
                                    >
                                        <p className="text-4xl font-bold">{promotionPrice}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-text-color-90">{subtitle}</p>
                            </div>
                            <div className="mt-6">
                                <p className="text-lg">{description}</p>
                                <Link
                                    to={link.href}
                                    className={twJoin(
                                        'my-5 block text-center p-4 text-lg hover:bg-btn-hover-color hover:text-btn-hover-text-color shadow-md rounded-lg hover:shadow-lg transition duration-300 ease-in-out',
                                        badge
                                            ? 'bg-btn-alt-color text-bg-color'
                                            : 'bg-btn-color text-btn-text-color'
                                    )}
                                >
                                    <span>{link.label}</span>
                                </Link>
                                <ul className="space-y-3">
                                    {list.map((list, f_index) => {
                                        const feature = list.paragraphs[0];
                                        const icon = list.icons[0];

                                        return (
                                            <li key={f_index} className="flex items-start gap-2">
                                                <Icon
                                                    icon={icon}
                                                    className={twJoin(
                                                        'w-4 h-4 text-text-color-70 flex-shrink-0 pt-1.5'
                                                    )}
                                                />
                                                <span>{feature}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
            {link && (
                <div className="mt-8 text-center">
                    <Link
                        to={website.makeHref(link.href)}
                        className="inline-flex items-center justify-center px-8 py-3 text-lg bg-btn-hover-color text-btn-hover-text-color hover:bg-btn-color hover:text-btn-text-color rounded-lg hover:bg-primary-700 transition-colors duration-300"
                    >
                        {link.label}
                    </Link>
                </div>
            )}
        </div>
    );
}
