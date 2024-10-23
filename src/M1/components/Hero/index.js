import React from 'react';
import { twJoin, Image, getPageProfile, Link } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

export default function Hero(props) {
    const { block } = props;

    const { height = '100vh', gradient = 'none', alignment = 'left' } = block.getBlockProperties();

    const { banner, title, subtitle, paragraphs, links } = block.getBlockContent();

    return (
        <Container className="w-screen" style={{ height }}>
            {banner && (
                <div className="absolute inset-0">
                    <Image
                        profile={getPageProfile()}
                        {...banner}
                        className="object-cover w-full h-full"
                    />
                </div>
            )}
            <div
                className={twJoin(
                    'w-full h-full flex items-center mx-auto max-w-9xl',
                    alignment === 'left' && 'justify-start',
                    alignment === 'center' && 'justify-center',
                    alignment === 'right' && 'justify-end'
                )}
            >
                <div className="relative z-20 max-w-[60rem]">
                    {title && (
                        <h1
                            className="text-4xl font-bold md:text-5xl lg:text-6xl"
                            style={{
                                lineHeight: '1.1',
                            }}
                        >
                            {title}
                        </h1>
                    )}
                    {subtitle && (
                        <h2 className="mt-8 text-xl md:text-2xl lg:text-3xl !leading-tight">
                            {subtitle}
                        </h2>
                    )}
                    {/* {paragraphs && (
                        <SafeHtml
                            value={paragraphs}
                            className="mt-8 text-lg md:text-xl lg:text-2xl !leading-tight"
                        />
                    )} */}
                    {links && (
                        <div className="mt-28 space-x-12 px-12">
                            {links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className={twJoin(
                                        'inline-block px-6 py-3.5 text-lg font-medium rounded-3xl',
                                        index === 0 &&
                                            'bg-text-color text-bg-color border border-bg-color',
                                        index === 1 &&
                                            'bg-bg-color text-text-color border border-text-color'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
}
