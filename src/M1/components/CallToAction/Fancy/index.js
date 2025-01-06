import React from 'react';
import Container from '../../_utils/Container';
import { twJoin, SafeHtml, Link } from '@uniwebcms/module-sdk';

const FloatingParticle = ({ className = '' }) => (
    <div
        className={twJoin(
            'absolute w-1 h-1 rounded-full animate-float',
            'bg-secondary-500/50',
            className
        )}
    ></div>
);

export default function Fancy(props) {
    const { title, subtitle, paragraphs, links } = props;

    const [firstLink, secondLink] = links;

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
                    className={twJoin(
                        'absolute top-1/4 -left-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse',
                        'bg-secondary-500/20'
                    )}
                ></div>
                <div
                    className={twJoin(
                        'absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse delay-1000',
                        'bg-primary-500/10'
                    )}
                ></div>
                <div
                    className={twJoin(
                        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl animate-pulse delay-500',
                        'bg-secondary-400/5'
                    )}
                ></div>
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                    }}
                ></div>
                <FloatingParticle className="top-1/4 left-1/4" />
                <FloatingParticle className="top-3/4 left-1/3 delay-1000" />
                <FloatingParticle className="top-1/3 right-1/4 delay-2000" />
                <FloatingParticle className="bottom-1/4 right-1/3 delay-3000" />
                <FloatingParticle className="top-1/2 left-1/2 delay-4000" />
            </div>
            <div className="relative max-w-4xl mx-auto px-8 text-center">
                <div
                    className={twJoin(
                        'inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8 transform hover:rotate-12 transition-all duration-300 group',
                        'bg-secondary-500/10'
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
                        className={twJoin(
                            'h-10 w-10 transform group-hover:scale-110 transition-transform duration-300'
                        )}
                    >
                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                        <path d="M20 3v4"></path>
                        <path d="M22 5h-4"></path>
                        <path d="M4 17v2"></path>
                        <path d="M5 18H3"></path>
                    </svg>
                </div>
                <h2
                    className={twJoin(
                        'text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r bg-clip-text animate-gradient-x',
                        'from-heading-color via-secondary-100 to-heading-color text-transparent'
                    )}
                >
                    {title}
                </h2>
                <SafeHtml
                    value={paragraphs}
                    className={twJoin('text-lg mb-12', 'text-neutral-400')}
                />
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {firstLink && (
                        <Link to={firstLink.href}>
                            <button className="group relative flex items-center px-8 py-4 rounded-xl font-medium transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg overflow-hidden">
                                {firstLink.label}
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
                                    className="lucide lucide-arrow-right ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300 text-inherit"
                                >
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                </svg>
                            </button>
                        </Link>
                    )}
                    {secondLink && (
                        <Link to={secondLink.href}>
                            <button
                                className={twJoin(
                                    'px-8 py-4 rounded-xl font-medium border backdrop-blur-sm transform transition-all duration-300 hover:translate-y-[-2px] btn-secondary',
                                    'border-neutral-700/50'
                                )}
                            >
                                {secondLink.label}
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </Container>
    );
}
