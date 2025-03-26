import React from 'react';
import { twJoin, Image, getPageProfile, Link } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

export default function Hero(props) {
    const { block } = props;

    const { height = '100vh', alignment = 'left' } = block.getBlockProperties();

    const { banner, title, subtitle, links } = block.getBlockContent();

    const ChildBlockRenderer = block.getChildBlockRenderer();

    const { childBlocks } = block;

    return (
        <Container
            className={twJoin(
                'w-screen flex flex-col justify-center',
                !childBlocks.length || (childBlocks.length && alignment !== 'center')
                    ? 'lg:max-h-[982px]'
                    : ''
            )}
            py="xl"
            style={{ height }}
        >
            {banner && (
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat">
                    <Image
                        profile={getPageProfile()}
                        {...banner}
                        className="object-cover w-full h-full"
                    />
                </div>
            )}
            <div className={twJoin('max-w-8xl mx-auto px-6 py-12 relative')}>
                <div
                    className={twJoin(
                        'grid gap-12 items-center',
                        alignment === 'center' ? 'lg:grid-cols-1' : 'lg:grid-cols-2'
                    )}
                >
                    <div
                        className={twJoin(
                            '-order-1 max-w-3xl mx-auto',
                            alignment === 'right' && 'lg:order-2 text-right',
                            alignment === 'center' && 'text-center'
                        )}
                    >
                        {title && (
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[var(--callout,var(--heading-color))] via-[var(--muted,var(--heading-color))] to-[var(--highlight,var(--heading-color))] bg-clip-text text-transparent pb-2 mb-6">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p
                                className={twJoin(
                                    links.length ? 'mb-8' : '',
                                    alignment === 'center' ? 'text-xl' : 'text-lg'
                                )}
                            >
                                {subtitle}
                            </p>
                        )}
                        {links.length ? (
                            <div
                                className={twJoin(
                                    'flex flex-wrap gap-8',
                                    alignment === 'left' ? 'justify-start' : '',
                                    alignment === 'center' ? 'justify-center' : '',
                                    alignment === 'right' ? 'justify-end' : ''
                                )}
                            >
                                {links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        className={twJoin(
                                            'pl-6 pr-5 py-3 text-lg font-semibold rounded-full flex items-center gap-2 transition-all',
                                            index === 0 &&
                                                'bg-text-color/90 text-bg-color hover:bg-text-color',
                                            index === 1 &&
                                                'border border-text-color bg-transparent text-text-color/90 hover:bg-text-color/20 hover:text-text-color'
                                        )}
                                    >
                                        {link.label}
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
                                            className="lucide lucide-chevron-right w-4 h-4 text-inherit"
                                        >
                                            <path d="m9 18 6-6-6-6"></path>
                                        </svg>
                                    </Link>
                                ))}
                            </div>
                        ) : null}
                    </div>
                    {childBlocks[0] ? (
                        <ChildBlockRenderer
                            block={block}
                            childBlocks={[childBlocks[0]]}
                            extra={{ className: 'max-w-xl scale-150' }}
                            pure={true}
                        ></ChildBlockRenderer>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
        </Container>
    );
}
