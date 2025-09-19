import React, { useState } from 'react';
import Container from '../_utils/Container';
import { formatToCAD } from '../_utils/pricing';
import { twJoin, website } from '@uniwebcms/module-sdk';
import { Icon } from '@uniwebcms/core-components';
import { LuLayers2, LuCrown, LuGem, LuBlocks } from 'react-icons/lu';
import { Switch } from '@headlessui/react';

const icons = {
    layer: LuLayers2,
    crown: LuCrown,
    gem: LuGem,
    block: LuBlocks,
};

const CalculatorOptionButton = ({ title, price, priceText, icon, selected, onClick }) => {
    const Icon = icons[icon] || null;

    return (
        <div
            className={twJoin(
                'group px-4 py-2 rounded-xl border transition-all duration-300 cursor-pointer',
                selected
                    ? ' border-primary-200 bg-gradient-to-br from-primary-50 to-primary-50/30 shadow-sm'
                    : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
            )}
            onClick={() => (selected ? onClick(null) : onClick(price))}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className={twJoin(
                            'p-1.5 rounded-lg',
                            selected
                                ? ' bg-primary-100/50'
                                : 'bg-neutral-100 group-hover:bg-neutral-200'
                        )}
                    >
                        {Icon && (
                            <Icon
                                className={`h-4 w-4 ${
                                    selected ? 'text-primary-600' : 'text-neutral-500'
                                }`}
                            />
                        )}
                    </div>
                    <span className="font-medium text-sm">{title}</span>
                </div>
                <span className="text-sm text-primary-600">{priceText}</span>
            </div>
        </div>
    );
};

const CalculatorOptionNumber = ({ title, price, priceText, value, onChange }) => {
    return (
        <div className="px-0 md:px-4 py-2 rounded-xl">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <span className="text-sm text-neutral-700">{title}</span>
                    <span className="text-xs text-neutral-500 block">{priceText}</span>
                </div>
                <input
                    type="number"
                    min="0"
                    value={value > 0 ? value / price : 0}
                    onChange={(e) => onChange((parseInt(e.target.value) || 0) * price)}
                    className={twJoin(
                        'w-16 p-1.5 border border-neutral-200 rounded-lg text-right text-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50',
                        value > 0
                            ? 'border-primary-200 bg-gradient-to-br from-primary-50 to-primary-50/30 shadow-sm'
                            : ''
                    )}
                />
            </div>
        </div>
    );
};

const CalculatorOptionSwitch = ({ title, priceText, selected, onChange }) => {
    return (
        <div className="px-0 md:px-4 py-2 rounded-xl">
            <Switch.Group>
                <div className="flex items-center justify-between gap-3">
                    <Switch.Label>
                        <div>
                            <span className="text-sm text-neutral-700">{title}</span>
                            <span className="text-xs text-neutral-500 block">{priceText}</span>
                        </div>
                    </Switch.Label>
                    <Switch
                        checked={!!selected}
                        onChange={() => onChange(!selected)}
                        className={`${
                            selected ? 'bg-primary-600' : 'bg-neutral-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ring-primary-500 ring-opacity-50`}
                    >
                        <span
                            className={`${
                                selected ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-neutral-50 transition-transform`}
                        />
                    </Switch>
                </div>
            </Switch.Group>
        </div>
    );
};

const initTotalCost = (properties) => {
    const { steps = [], total } = properties;

    let totalCost = {};

    if (total.basePrice) {
        totalCost.basePrice = total.basePrice;
    }

    steps.forEach((step) => {
        if (step.options) {
            step.options.forEach((option) => {
                if (option.type === 'button' && option.defaultSelected) {
                    totalCost[`${step.title}_${option.title}`] = option.price;
                }
            });
        }
    });

    return totalCost;
};

const calculateTotalCost = (totalCost, yearlyDiscountFactor) => {
    const total = Object.values(totalCost).reduce((acc, value) => {
        return acc + value;
    }, 0);

    if (yearlyDiscountFactor) {
        return total * yearlyDiscountFactor;
    }

    return total;
};

const CalculatorBox = ({ item, isAnnual }) => {
    const { title, subtitle, icons, properties } = item;
    const icon = icons[0];

    const { steps = [], total, yearlyPromotionText, yearlyDiscountFactor } = properties;

    const [totalCost, setTotalCost] = useState(initTotalCost(properties));

    const updateTotalCost = (name, value, unique) => {
        if (!value) {
            // remove the key if value is null
            const { [name]: removedKey, ...rest } = totalCost;
            setTotalCost(rest);
        } else {
            if (unique) {
                // remove all other keys with the same step title and then add the new key
                const stepTitle = name.split('_')[0];

                const newTotal = Object.keys(totalCost).reduce((acc, key) => {
                    if (key.startsWith(stepTitle)) {
                        return acc;
                    }
                    return { ...acc, [key]: totalCost[key] };
                }, {});

                setTotalCost({ ...newTotal, [name]: value });
            } else {
                setTotalCost({ ...totalCost, [name]: value });
            }
        }
    };

    return (
        <div className="relative overflow-hidden bg-neutral-50/80 backdrop-blur-sm border border-neutral-200/60 shadow-xl rounded-xl">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500/30 via-primary-500/30 to-primary-500/30"></div>
            <div className="p-8">
                <div className="flex items-start gap-4 mb-8">
                    <Icon icon={icon} className="h-5 w-5 text-primary-600 mt-1 shrink-0" />
                    <div>
                        <h3 className="font-light text-xl mb-2 text-neutral-800">{title}</h3>
                        <p className="text-sm text-neutral-600">{subtitle}</p>
                    </div>
                </div>
                {steps.map((step, index) => {
                    return (
                        <div key={index} className="mb-8 md:mb-6">
                            <p className="block mb-4 font-medium text-sm text-neutral-700">
                                {step.title}
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                {step.options.map((option, index) => {
                                    if (option.type === 'button') {
                                        return (
                                            <CalculatorOptionButton
                                                key={index}
                                                {...option}
                                                onClick={(price) => {
                                                    const key = `${step.title}_${option.title}`;
                                                    updateTotalCost(key, price, step.unique);
                                                }}
                                                selected={
                                                    totalCost[`${step.title}_${option.title}`]
                                                }
                                            />
                                        );
                                    }

                                    if (option.type === 'number') {
                                        return (
                                            <CalculatorOptionNumber
                                                key={index}
                                                {...option}
                                                value={
                                                    totalCost[`${step.title}_${option.title}`] || 0
                                                }
                                                onChange={(value) => {
                                                    const key = `${step.title}_${option.title}`;

                                                    updateTotalCost(key, value, step.unique);
                                                }}
                                            />
                                        );
                                    }

                                    if (option.type === 'switch') {
                                        return (
                                            <CalculatorOptionSwitch
                                                key={index}
                                                {...option}
                                                selected={
                                                    totalCost[`${step.title}_${option.title}`]
                                                }
                                                onChange={(selected) => {
                                                    const key = `${step.title}_${option.title}`;

                                                    updateTotalCost(
                                                        key,
                                                        selected ? option.price : null,
                                                        step.unique
                                                    );
                                                }}
                                            />
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    );
                })}
                <div className="p-6 rounded-xl bg-gradient-to-br from-primary-100/50 to-primary-50/30 border border-primary-100/50">
                    <div className="flex justify-between items-center pb-0 border-b border-primary-100/30">
                        <div>
                            <div className="text-sm font-medium text-neutral-900">
                                {total.title}
                            </div>
                            <div className="text-xs text-neutral-500">{total.description}</div>
                        </div>
                        <div className="relative min-w-[90px] text-right">
                            <span className="text-2xl font-bold text-neutral-900">
                                {formatToCAD(
                                    calculateTotalCost(
                                        totalCost,
                                        isAnnual ? yearlyDiscountFactor : null
                                    )
                                )}
                            </span>
                            {isAnnual && yearlyPromotionText ? (
                                <span className="absolute -bottom-4 right-0 text-xs text-accent-600 whitespace-nowrap">
                                    {yearlyPromotionText}
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DiscountBox = ({ item, isAnnual }) => {
    const { title, subtitle, icons, lists, properties } = item;
    const icon = icons[0];

    const feature =
        lists[0]?.map((item) => {
            return {
                title: item.paragraphs[0],
                features: item.lists?.[0]?.map((subList) => {
                    return subList.paragraphs[0];
                }),
            };
        })?.[0] || {};

    const { discount, example, yearlyPromotionText, yearlyDiscountFactor } = properties;

    return (
        <div className="relative overflow-hidden bg-neutral-50/80 backdrop-blur-sm border border-neutral-200/60 shadow-xl rounded-xl">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary-500/40 via-secondary-500/40 to-secondary-500/40"></div>
            <div className="p-8">
                <div className="flex items-start gap-4 mb-8">
                    <Icon icon={icon} className="h-5 w-5 text-secondary-600 mt-1 shrink-0" />
                    <div>
                        <h3 className="font-light text-xl mb-2 text-neutral-800">{title}</h3>
                        <p className="text-sm text-neutral-600">{subtitle}</p>
                    </div>
                </div>
                <div className="space-y-8">
                    <div>
                        <label className="block mb-2 font-medium text-sm text-gray-700">
                            {discount.title}
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {discount.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="group relative p-4 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-50/0 border border-neutral-200 hover:border-secondary-200 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-secondary-50/50 via-transparent to-transparent rounded-xl transition-opacity duration-300" />
                                    <div className="relative space-y-2">
                                        <div className="text-sm text-neutral-800 font-medium">
                                            {item.title}
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xl font-bold bg-gradient-to-r from-secondary-600 to-secondary-800 bg-clip-text text-transparent">
                                                {item.discountValue}
                                            </span>
                                            <span className="text-sm text-neutral-500">
                                                {website.localize({
                                                    en: 'off',
                                                    fr: 'de rabais',
                                                    es: 'de descuento',
                                                    zh: '折扣',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block mb-2 font-medium text-sm text-neutral-700">
                            {feature.title}
                        </label>
                        <div className="text-sm text-neutral-600">
                            <ul className="space-y-2">
                                {feature.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <div className="h-px w-4 bg-gradient-to-r from-secondary-500/70 via-secondary-500/50 to-transparent"></div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-secondary-100/50 to-secondary-50/30 border border-secondary-100/50">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-sm font-medium text-neutral-900">
                                    {example.title}
                                </div>
                                <div className="text-xs text-neutral-500">
                                    {example.description}
                                </div>
                            </div>
                            <div className="relative min-w-[90px] text-right">
                                <span className="text-2xl font-bold text-neutral-900">
                                    {formatToCAD(
                                        example.cost * (isAnnual ? yearlyDiscountFactor : 1)
                                    )}
                                </span>
                                {isAnnual && yearlyPromotionText ? (
                                    <span className="absolute -bottom-4 right-0 text-xs text-accent-600 whitespace-nowrap">
                                        {yearlyPromotionText}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Fancy(props) {
    const { block } = props;
    const { title, subtitle } = block.getBlockContent();

    const [calculatorItem, discountItem] = block.getBlockItems();
    const { billing_cycle_switcher = false } = block.getBlockProperties();

    const [billingCycle, setBillingCycle] = useState('monthly');

    const toggleSwitch = () => {
        setBillingCycle((prev) => (prev === 'monthly' ? 'yearly' : 'monthly'));
    };

    const isAnnual = billingCycle === 'yearly';

    return (
        <Container px="none" py="lg" className={twJoin('relative')}>
            <div className="max-w-7xl mx-auto px-8 relative">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-light mb-3 bg-gradient-to-b from-neutral-900 to-neutral-800 bg-clip-text text-transparent">
                        {title}
                    </h2>
                    <p className="text-neutral-600 max-w-2xl mx-auto">{subtitle}</p>
                </div>
                {billing_cycle_switcher && (
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <button
                            className={twJoin(
                                'relative inline-flex h-6 w-11 items-center rounded-full',
                                'transition-colors duration-200 ease-in-out',
                                isAnnual ? 'bg-secondary-600' : 'bg-neutral-300',
                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-opacity-50'
                            )}
                            aria-pressed={isAnnual}
                            aria-label="Toggle annual billing"
                            onClick={toggleSwitch}
                        >
                            <span className="sr-only">
                                {isAnnual
                                    ? 'Switch to monthly billing'
                                    : 'Switch to annual billing'}
                            </span>
                            <span
                                className={twJoin(
                                    'inline-block h-4 w-4 transform rounded-full bg-neutral-50 shadow',
                                    'transition duration-200 ease-in-out',
                                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                                )}
                            />
                        </button>
                        <span
                            className={twJoin(
                                ' text-sm font-medium',
                                isAnnual ? 'text-neutral-900' : 'text-neutral-500'
                            )}
                        >
                            {website.localize({
                                en: 'Annual Billing',
                                fr: 'Facturation Annuelle',
                                es: 'Facturación Anual',
                                zh: '年度账单',
                            })}
                        </span>
                    </div>
                )}
                <div className="grid md:grid-cols-2 gap-8">
                    {calculatorItem && <CalculatorBox item={calculatorItem} isAnnual={isAnnual} />}
                    {discountItem && <DiscountBox item={discountItem} isAnnual={isAnnual} />}
                </div>
            </div>
        </Container>
    );
}
