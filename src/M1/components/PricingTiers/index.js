import React, { useCallback, useState, useEffect } from 'react';
import Container from '../_utils/Container';
import { formatToCAD } from '../_utils/pricing';
import { twJoin, website } from '@uniwebcms/module-sdk';
import { Link, Icon, SafeHtml } from '@uniwebcms/core-components';
import { AiOutlineQuestion } from 'react-icons/ai';
import { HiCheck } from 'react-icons/hi';
import { Switch } from '@headlessui/react';
import Fancy from './Fancy';
import Modal from './components/Modal';

const primaryTireRingStyle = 'ring-2 ring-primary-600';
const secondaryTireRingStyle = 'ring-2 ring-secondary-600';

const primaryTirePretitleStyle = 'text-primary-600';
const secondaryTirePretitleStyle = 'text-secondary-600';

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
        properties,
        billingCycle,
        calculateDisplayPrice,
        cardSize,
        setActiveFeature,
    } = props;

    const link = links[0];
    const badge = buttons?.[0];
    const features = lists[0]?.map((item) => item.paragraphs[0]) || [];
    const icon = icons[0];

    const popup = properties['popup'];

    let borderStyle = badge
        ? badge.attrs.style === 'primary'
            ? primaryTireRingStyle
            : badge.attrs.style === 'secondary'
            ? secondaryTireRingStyle
            : 'ring-1 ring-text-color-30'
        : 'ring-1 ring-text-color-30';

    let pretitleStyle = badge
        ? badge.attrs.style === 'primary'
            ? primaryTirePretitleStyle
            : badge.attrs.style === 'secondary'
            ? secondaryTirePretitleStyle
            : ''
        : '';

    const price = (
        <p className="flex items-baseline gap-x-1">
            <span
                className={twJoin(
                    'font-semibold tracking-tight',
                    cardSize === 'small' && 'text-xl md:text-2xl lg:text-3xl',
                    cardSize === 'medium' && 'text-2xl md:text-3xl lg:text-4xl'
                )}
            >
                {!isNaN(amount) ? calculateDisplayPrice(amount) : amount}
            </span>
            {!isNaN(amount) && (
                <span
                    className={twJoin(
                        'text-sm/6 font-medium text-text-color-60',
                        'text-neutral-300',
                        cardSize === 'small' ? 'text-sm' : 'text-base'
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
            )}
        </p>
    );

    return (
        <div
            className={twJoin(
                'relative w-full h-full flex flex-col rounded-3xl p-8 group',
                borderStyle
            )}
            onClick={() => {
                if (popup) {
                    setActiveFeature(popup);
                }
            }}
        >
            <div className="flex flex-col flex-grow">
                {pretitle && (
                    <div className={twJoin('mb-3 flex items-center gap-x-3', pretitleStyle)}>
                        {icon && <Icon icon={icon} className="h-6 w-6 flex-none text-inherit" />}
                        <span
                            className={twJoin(
                                'font-semibold',
                                cardSize === 'small' && 'text-base lg:text-lg',
                                cardSize === 'medium' && 'text-lg lg:text-xl'
                            )}
                        >
                            {pretitle}
                        </span>
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
                                className="h-5 w-5 flex-none text-green-600"
                            />
                            <SafeHtml
                                value={feature}
                                className={twJoin(
                                    'text-text-color-80',
                                    cardSize === 'small' ? 'text-sm' : 'text-sm lg:text-base'
                                )}
                            />
                        </li>
                    ))}
                </ul>
            </div>

            {link && (
                <Link
                    to={website.makeHref(link.href)}
                    className={twJoin(
                        'mt-8 block rounded-md px-3 py-2 text-center text-sm lg:text-base/7 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                        'text-btn-text-color bg-btn-color hover:text-btn-hover-text-color hover:bg-btn-hover-color'
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
            {popup && (
                <div className="absolute invisible group-hover:visible top-4 right-4 h-5 w-5 border border-text-color-90 p-0.5 rounded-full cursor-pointer">
                    <AiOutlineQuestion className="w-full h-full text-text-color" />
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
                    billingCycle === 'yearly' ? 'text-green-500' : 'text-text-color-50'
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
        card_size = 'medium',
    } = block.getBlockProperties();

    const [billingCycle, setBillingCycle] = useState(default_billing_cycle);
    const [activeFeature, setActiveFeature] = useState(null);
    const [sectionStyle, setSectionStyle] = useState({});

    // this is for the Dialog (Modal) to use all css variables from the section
    useEffect(() => {
        const sourceElement = document.getElementById(`Section${block.id}`);

        if (sourceElement) {
            const styleObject = {};

            // Loop through inline styles explicitly set on the element
            const inlineStyles = sourceElement.style;

            for (let i = 0; i < inlineStyles.length; i++) {
                const key = inlineStyles[i];
                const value = inlineStyles.getPropertyValue(key);

                styleObject[key] = value;
            }

            // Store the styles in the state
            setSectionStyle(styleObject);
        }
    }, [block.id]);

    const calculateDisplayPrice = useCallback(
        (price) => {
            let displayPrice = price;
            if (billingCycle === 'yearly' && default_billing_cycle === 'monthly') {
                displayPrice = price * yearly_price_multiplier;
            } else if (billingCycle === 'monthly' && default_billing_cycle === 'yearly') {
                displayPrice = price / yearly_price_multiplier;
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
                    <div
                        className={twJoin(
                            'mt-12 sm:mt-16 lg:mt-20 px-6 md:px-8 lg:px-16 xl:px-24 max-w-8xl mx-auto grid',
                            card_size === 'medium' &&
                                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10',
                            card_size === 'small' &&
                                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                        )}
                    >
                        {items.map((item, index) => (
                            <PriceTier
                                key={index}
                                {...item}
                                billingCycle={billingCycle}
                                calculateDisplayPrice={calculateDisplayPrice}
                                cardSize={card_size}
                                setActiveFeature={setActiveFeature}
                            />
                        ))}
                    </div>
                ) : null}
                <FeaturePopup
                    feature={activeFeature}
                    setFeature={setActiveFeature}
                    modalProps={{ theme: block.themeName, style: sectionStyle }}
                />
            </Container>
        );
    } else {
        return (
            <>
                <Fancy
                    {...{
                        title,
                        subtitle,
                        promotion: paragraphs[0],
                        items,
                        billingCycle,
                        calculateDisplayPrice,
                        setActiveFeature,
                        billing_cycle_switcher,
                        setBillingCycle,
                        card_size,
                    }}
                />
                <FeaturePopup
                    feature={activeFeature}
                    setFeature={setActiveFeature}
                    modalProps={{ theme: block.themeName, style: sectionStyle, darkMode: true }}
                />
            </>
        );
    }
}

const FeaturePopup = ({ feature, setFeature, modalProps }) => {
    return (
        <Modal
            open={!!feature}
            onClose={() => {
                setFeature(null);
            }}
            {...feature}
            {...modalProps}
        />
    );
};
