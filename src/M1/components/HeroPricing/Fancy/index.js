import React, { useState, useRef } from 'react';
import Container from '../../_utils/Container';
import { twJoin, stripTags } from '@uniwebcms/module-sdk';

// declare const variables
const primaryCardHalationStartPosition = { x: 1, y: 0.35 };

const bgStyleDefault = '';
const bgStyleOcean = 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950';

const badgeStyleDefault = 'bg-primary-200 border-primary-300';
const badgeStyleOcean = 'bg-blue-500/10 border-blue-500/20';

const badgeTextStyleDefault = 'text-primary-700';
const badgeTextStyleOcean = 'text-blue-300';

const titleStyleDefault = '';
const titleStyleOcean = 'text-white';

const subtitleStyleDefault = 'text-text-color-50';
const subtitleStyleOcean = 'text-gray-400';

const primaryCardBgColorDefault = 'bg-text-color/10';
const primaryCardBgColorOcean = 'bg-gray-900/80';

const primaryCardBgGradientFromDefault = 'from-primary-100';
const primaryCardBgGradientFromOcean = 'from-white/10';

const primaryCardHalationColor = 'rgba(var(--primary-100))';
const primaryCardHalationColorOcean = 'rgba(59, 130, 246, 0.15)';

const primaryCardTitleStyleDefault = 'text-text-color-70 group-hover:text-text-color-60';
const primaryCardTitleStyleOcean = 'text-blue-300 group-hover:text-blue-200';

const primaryCardTitleUnderlineStyleDefault =
    'via-text-color/40 to-transparent group-hover:via-text-color/60';
const primaryCardTitleUnderlineStyleOcean =
    'via-blue-500/50 to-transparent group-hover:via-blue-400/70';

const primaryCardFeatureItemStyleDefault = 'text-text-color-70';
const primaryCardFeatureItemStyleOcean = 'text-gray-200';

const primaryCardFeatureItemBulletStyleDefault =
    'from-text-color/30 to-transparent group-hover:from-text-color/60';
const primaryCardFeatureItemBulletStyleOcean =
    'from-blue-500/50 to-transparent group-hover:from-blue-400/70';

const primaryCardActionBtnRingStyleDefault = 'from-primary-100 via-primary-200 to-primary-100';
const primaryCardActionBtnRingStyleOcean = 'from-blue-500/50 via-purple-500/50 to-blue-500/50';

const primaryCardActionBtnStyleDefault = 'text-primary-50 bg-primary-600 border-primary-300';
const primaryCardActionBtnStyleOcean =
    'text-blue-100 bg-gray-900/90 border-blue-500/20 hover:border-blue-400/40';

const secondaryCardTitleStyleDefault = 'text-text-color-60';
const secondaryCardTitleStyleOcean = 'text-blue-200';

const secondaryCardFeatureItemStyleDefault = 'text-text-color-50';
const secondaryCardFeatureItemStyleOcean = 'text-gray-300';

const secondaryCardFeatureItemIconColorDefault = 'text-green-600';
const secondaryCardFeatureItemIconColorOcean = 'text-blue-500';

const secondaryCardFeatureDescriptionStyleDefault = 'text-text-color-70';
const secondaryCardFeatureDescriptionStyleOcean = 'text-slate-500';

export default function Fancy({ pretitle, title, subtitle, items, uiPreset }) {
    const [firstItem, secondItem] = items;

    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [mousePosition, setMousePosition] = useState(primaryCardHalationStartPosition);
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const rotateXValue = ((e.clientY - centerY) / (rect.height / 2)) * -4;
        const rotateYValue = ((e.clientX - centerX) / (rect.width / 2)) * 4;

        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        setRotateX(rotateXValue);
        setRotateY(rotateYValue);
        setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
        setMousePosition(primaryCardHalationStartPosition); // Return to default position
    };

    return (
        <Container
            px="none"
            py="lg"
            className={twJoin('min-h-[70vh]', uiPreset === 'ocean' ? bgStyleOcean : bgStyleDefault)}
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-0">
                    <div className="inline-block mb-6">
                        <div
                            className={twJoin(
                                'px-4 py-1.5 rounded-full border',
                                uiPreset === 'ocean' ? badgeStyleOcean : badgeStyleDefault
                            )}
                        >
                            <span
                                className={twJoin(
                                    'text-sm font-light',
                                    uiPreset === 'ocean'
                                        ? badgeTextStyleOcean
                                        : badgeTextStyleDefault
                                )}
                            >
                                {pretitle}
                            </span>
                        </div>
                    </div>
                    <h1
                        className={twJoin(
                            'text-4xl md:text-5xl font-light mb-4',
                            uiPreset === 'ocean' ? titleStyleOcean : titleStyleDefault
                        )}
                    >
                        {title}
                    </h1>
                    <p
                        className={twJoin(
                            'text-lg max-w-2xl mx-auto mb-8',
                            uiPreset === 'ocean' ? subtitleStyleOcean : subtitleStyleDefault
                        )}
                    >
                        {subtitle}
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <div>
                        <div className="p-12 flex items-center justify-center">
                            <div
                                ref={cardRef}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                className="group relative w-full max-w-sm transition-all duration-300 hover:-translate-y-2"
                                style={{
                                    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                                    transition: 'transform 0.1s ease-out',
                                }}
                            >
                                <div className="absolute -inset-[0.5px] rounded-2xl bg-gradient-to-b from-white/20 to-white/0"></div>
                                <div className="absolute -inset-[0.5px] rounded-2xl bg-gradient-to-r from-white/10 via-transparent to-white/10"></div>
                                <div className="relative rounded-xl overflow-hidden backdrop-blur-sm">
                                    <div
                                        className={twJoin(
                                            'relative p-8',
                                            uiPreset === 'ocean'
                                                ? primaryCardBgColorOcean
                                                : primaryCardBgColorDefault
                                        )}
                                    >
                                        <div
                                            className="absolute inset-0 transition-all duration-500"
                                            style={{
                                                background: `radial-gradient(circle at ${
                                                    mousePosition.x * 100
                                                }% ${mousePosition.y * 100}%, ${
                                                    uiPreset === 'ocean'
                                                        ? primaryCardHalationColorOcean
                                                        : primaryCardHalationColor
                                                }, transparent 50%)`,
                                            }}
                                        ></div>
                                        <div
                                            className={twJoin(
                                                'absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300',
                                                uiPreset === 'ocean'
                                                    ? primaryCardBgGradientFromOcean
                                                    : primaryCardBgGradientFromDefault
                                            )}
                                        ></div>
                                        <div className="relative">
                                            <div className="mb-8">
                                                <div className="m-auto text-center">
                                                    <h3
                                                        className={twJoin(
                                                            'text-xl font-medium mb-2 transition-colors duration-300 tracking-wide',
                                                            uiPreset === 'ocean'
                                                                ? primaryCardTitleStyleOcean
                                                                : primaryCardTitleStyleDefault
                                                        )}
                                                    >
                                                        {firstItem?.title}
                                                    </h3>
                                                    <div
                                                        className={twJoin(
                                                            'h-px w-full bg-gradient-to-r from-transparent transition-colors duration-300',
                                                            uiPreset === 'ocean'
                                                                ? primaryCardTitleUnderlineStyleOcean
                                                                : primaryCardTitleUnderlineStyleDefault
                                                        )}
                                                    ></div>
                                                </div>
                                            </div>
                                            <ul className="space-y-4 mb-8 ml-4">
                                                {firstItem?.lists?.[0]
                                                    ?.map((item) => item.paragraphs[0])
                                                    ?.filter(Boolean)
                                                    ?.map((item, index) => (
                                                        <li
                                                            key={index}
                                                            className={twJoin(
                                                                'flex items-center text-sm group/item subpixel-antialiased',
                                                                uiPreset === 'ocean'
                                                                    ? primaryCardFeatureItemStyleOcean
                                                                    : primaryCardFeatureItemStyleDefault
                                                            )}
                                                        >
                                                            <div
                                                                className={twJoin(
                                                                    'mr-3 w-6 h-px bg-gradient-to-r group-hover/item:w-8 transition-all duration-300',
                                                                    uiPreset === 'ocean'
                                                                        ? primaryCardFeatureItemBulletStyleOcean
                                                                        : primaryCardFeatureItemBulletStyleDefault
                                                                )}
                                                            ></div>
                                                            {stripTags(item)}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <div className="relative group/badge">
                                                <div
                                                    className={twJoin(
                                                        'absolute -inset-[0.5px] rounded-full bg-gradient-to-r blur-sm opacity-60 group-hover/badge:opacity-100 transition-opacity duration-300',
                                                        uiPreset === 'ocean'
                                                            ? primaryCardActionBtnRingStyleOcean
                                                            : primaryCardActionBtnRingStyleDefault
                                                    )}
                                                ></div>
                                                <button
                                                    className={twJoin(
                                                        'relative w-full px-3 py-3 text-xs font-light rounded-full border transition-colors duration-300',
                                                        uiPreset === 'ocean'
                                                            ? primaryCardActionBtnStyleOcean
                                                            : primaryCardActionBtnStyleDefault
                                                    )}
                                                >
                                                    <div className="text-lg font-semibold">
                                                        {firstItem?.links?.[0]?.label}
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="px-8 py-0">
                            <h2
                                className={twJoin(
                                    'text-2xl font-normal mb-2 pb-5',
                                    uiPreset === 'ocean'
                                        ? secondaryCardTitleStyleOcean
                                        : secondaryCardTitleStyleDefault
                                )}
                            >
                                {secondItem?.title}
                            </h2>
                            <div
                                className={twJoin(
                                    uiPreset === 'ocean'
                                        ? secondaryCardFeatureItemStyleOcean
                                        : secondaryCardFeatureItemStyleDefault
                                )}
                            >
                                <ul className="space-y-3">
                                    {secondItem?.lists?.[0]
                                        ?.map((item) => item.paragraphs[0])
                                        ?.filter(Boolean)
                                        ?.map((item, index) => (
                                            <li key={index} className="flex items-start space-x-3">
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
                                                        'lucide lucide-check w-5 h-5 mt-0.5 shrink-0',
                                                        uiPreset === 'ocean'
                                                            ? secondaryCardFeatureItemIconColorOcean
                                                            : secondaryCardFeatureItemIconColorDefault
                                                    )}
                                                >
                                                    <path d="M20 6 9 17l-5-5"></path>
                                                </svg>
                                                <span>{stripTags(item)}</span>
                                            </li>
                                        ))}
                                </ul>
                                <p
                                    className={twJoin(
                                        'mt-8',
                                        uiPreset === 'ocean'
                                            ? secondaryCardFeatureDescriptionStyleOcean
                                            : secondaryCardFeatureDescriptionStyleDefault
                                    )}
                                >
                                    {stripTags(secondItem?.paragraphs?.[0])}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
