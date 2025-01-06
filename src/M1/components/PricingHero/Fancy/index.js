import React, { useState, useRef } from 'react';
import Container from '../../_utils/Container';
import { twJoin, stripTags, Link } from '@uniwebcms/module-sdk';

// declare const variables
const primaryCardHalationStartPosition = { x: 1, y: 0.35 };

export default function Fancy({ pretitle, title, subtitle, items }) {
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
            className={twJoin(
                'min-h-[70vh]',
                'bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950'
            )}
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-0">
                    <div className="inline-block mb-6">
                        <div
                            className={twJoin(
                                'px-4 py-1.5 rounded-full border',
                                'bg-secondary-500/10 border-secondary-500/20'
                            )}
                        >
                            <span className={twJoin('text-sm font-light', 'text-secondary-300')}>
                                {pretitle}
                            </span>
                        </div>
                    </div>
                    <h1 className={twJoin('text-4xl md:text-5xl font-light mb-4')}>{title}</h1>
                    <p className={twJoin('text-lg max-w-2xl mx-auto mb-8')}>{subtitle}</p>
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
                                <div className="absolute -inset-[0.5px] rounded-2xl bg-gradient-to-b from-heading-color/20 to-heading-color/0"></div>
                                <div className="absolute -inset-[0.5px] rounded-2xl bg-gradient-to-r from-heading-color/10 via-transparent to-heading-color/10"></div>
                                <div className="relative rounded-xl overflow-hidden backdrop-blur-sm">
                                    <div className={twJoin('relative p-8', 'bg-neutral-900/80')}>
                                        <div
                                            className="absolute inset-0 transition-all duration-500"
                                            style={{
                                                background: `radial-gradient(circle at ${
                                                    mousePosition.x * 100
                                                }% ${
                                                    mousePosition.y * 100
                                                }%, var(--callout), transparent 50%)`,
                                            }}
                                        ></div>
                                        <div
                                            className={twJoin(
                                                'absolute inset-0 bg-gradient-to-br to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300',
                                                'from-heading-color/10'
                                            )}
                                        ></div>
                                        <div className="relative">
                                            <div className="mb-8">
                                                <div className="m-auto text-center">
                                                    <h3
                                                        className={twJoin(
                                                            'text-xl font-medium mb-2 transition-colors duration-300 tracking-wide',
                                                            'text-secondary-300 group-hover:text-secondary-200'
                                                        )}
                                                    >
                                                        {firstItem?.title}
                                                    </h3>
                                                    <div
                                                        className={twJoin(
                                                            'h-px w-full bg-gradient-to-r from-transparent transition-colors duration-300',
                                                            'via-secondary-500/50 to-transparent group-hover:via-secondary-400/70'
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
                                                                'text-neutral-200'
                                                            )}
                                                        >
                                                            <div
                                                                className={twJoin(
                                                                    'mr-3 w-6 h-px bg-gradient-to-r group-hover/item:w-8 transition-all duration-300',
                                                                    'from-secondary-500/50 to-transparent group-hover:from-secondary-400/70'
                                                                )}
                                                            ></div>
                                                            {stripTags(item)}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                        {firstItem?.links?.[0] && (
                                            <div>
                                                <div className="relative group/badge">
                                                    <div
                                                        className={twJoin(
                                                            'absolute -inset-[0.5px] rounded-full bg-gradient-to-r blur-sm opacity-60 group-hover/badge:opacity-100 transition-opacity duration-300',
                                                            'from-secondary-500/50 via-accent-500/50 to-secondary-500/50'
                                                        )}
                                                    ></div>
                                                    <Link
                                                        to={firstItem.links[0].href}
                                                        className={twJoin(
                                                            'block text-center relative w-full px-3 py-3 text-xs font-light rounded-full border transition-colors duration-300 cursor-pointer',
                                                            'text-secondary-100 bg-neutral-900/90 border-secondary-500/20 hover:border-secondary-400/40'
                                                        )}
                                                    >
                                                        <div className="text-lg font-semibold">
                                                            {firstItem.links[0].label}
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
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
                                    'text-secondary-200'
                                )}
                            >
                                {secondItem?.title}
                            </h2>
                            <div className={twJoin('text-neutral-300')}>
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
                                                        'w-5 h-5 mt-0.5 shrink-0',
                                                        'text-secondary-500'
                                                    )}
                                                >
                                                    <path d="M20 6 9 17l-5-5"></path>
                                                </svg>
                                                <span>{stripTags(item)}</span>
                                            </li>
                                        ))}
                                </ul>
                                <p className={twJoin('mt-8', 'text-neutral-500')}>
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
