import React from 'react';
import { twJoin, Image, getPageProfile, Link } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

export default function Hero(props) {
    const { block } = props;

    const { alignment = 'left' } = block.getBlockProperties();

    const { banner, title, subtitle, links } = block.getBlockContent();

    const ChildBlockRenderer = block.getChildBlockRenderer();

    const { childBlocks } = block;

    return (
        <Container
            className="w-screen h-screen flex flex-col justify-center"
            style={{ maxHeight: '982px' }}
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
            <div className={twJoin('max-w-8xl mx-auto px-6 py-32 relative')}>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div
                        className={twJoin(
                            'space-y-8 -order-1',
                            alignment === 'right' && 'lg:order-2'
                        )}
                    >
                        {title && (
                            <h1 className="text-5xl font-bold leading-tight bg-gradient-to-r bg-clip-text text-pretty">
                                {title}
                            </h1>
                        )}
                        {subtitle && <p className="text-text-color-70 text-lg">{subtitle}</p>}
                        {links && (
                            <div className="flex flex-wrap gap-8">
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
                        )}
                    </div>
                    {childBlocks[0] ? (
                        <ChildBlockRenderer
                            block={block}
                            childBlocks={[childBlocks[0]]}
                            extra={{ className: 'max-w-xl scale-150' }}
                            pure={true}
                        ></ChildBlockRenderer>
                    ) : null}
                </div>
            </div>
        </Container>
    );
}
