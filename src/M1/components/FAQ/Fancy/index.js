import React, { useState } from 'react';
import Container from '../../_utils/Container';
import { twJoin, Icon, SafeHtml } from '@uniwebcms/module-sdk';
import { HiChevronRight } from 'react-icons/hi';

const faqItemIconColors = ['text-secondary-500', 'text-primary-500', 'text-accent-500'];

export default function Fancy(props) {
    const { title, subtitle, items } = props;

    const [openIndex, setOpenIndex] = useState(0);

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
                        'absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl',
                        'bg-secondary-500/10'
                    )}
                ></div>
                <div
                    className={twJoin(
                        'absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl',
                        'bg-accent-400/5'
                    )}
                ></div>
            </div>
            <div className="max-w-4xl mx-auto px-8 relative">
                <div className="text-center mb-12">
                    <div
                        className={twJoin(
                            'inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transform hover:rotate-12 transition-transform duration-300',
                            'bg-icon-color/10'
                        )}
                    >
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
                            className={twJoin('h-8 w-8')}
                        >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <path d="M12 17h.01"></path>
                        </svg>
                    </div>
                    <h2 className={twJoin('text-3xl font-bold mb-4')}>{title}</h2>
                    <p className={twJoin('text-lg')}>{subtitle}</p>
                </div>
                <div className="space-y-4">
                    {items.map((item, index) => {
                        const { title, icons, paragraphs } = item;

                        const icon = icons[0];

                        const isOpen = openIndex === index;

                        return (
                            <div className="group" key={index}>
                                <button
                                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                    className={twJoin(
                                        'w-full backdrop-blur-sm border rounded-xl p-6 transition-all duration-300',
                                        'border-neutral-700/50',
                                        isOpen
                                            ? 'bg-neutral-800/70'
                                            : 'bg-neutral-800/50 hover:bg-neutral-800/70'
                                    )}
                                >
                                    <div className="flex items-start">
                                        <div
                                            className={twJoin(
                                                'w-10 h-10 rounded-lg flex items-center justify-center mr-4 transform transition-transform duration-300',
                                                isOpen
                                                    ? 'rotate-12 scale-110'
                                                    : 'group-hover:rotate-6 group-hover:scale-105'
                                            )}
                                        >
                                            <Icon
                                                icon={icon}
                                                className={twJoin(
                                                    'h-5 w-5',
                                                    faqItemIconColors[index % 3]
                                                )}
                                            />
                                        </div>
                                        <div className="flex-grow text-left">
                                            <div className="flex items-center justify-between pt-1.5">
                                                <h3 className={twJoin('text-lg font-bold')}>
                                                    {title}
                                                </h3>
                                                <HiChevronRight
                                                    className={twJoin(
                                                        'h-5 w-5 transform transition-transform duration-300',
                                                        'text-neutral-400',
                                                        isOpen
                                                            ? 'rotate-90'
                                                            : 'group-hover:translate-x-1'
                                                    )}
                                                />
                                            </div>
                                            <div
                                                className={twJoin(
                                                    'overflow-hidden transition-all duration-300',
                                                    isOpen ? 'max-h-96 mt-4' : 'max-h-0'
                                                )}
                                            >
                                                <div
                                                    className={twJoin(
                                                        'h-px w-full bg-gradient-to-r from-transparent to-transparent mb-4',
                                                        'via-neutral-600/30'
                                                    )}
                                                ></div>
                                                <SafeHtml
                                                    value={paragraphs}
                                                    className="text-text-color"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Container>
    );
}
