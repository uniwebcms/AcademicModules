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
                    'w-full h-full flex items-center mx-auto max-w-8xl',
                    alignment === 'left' && 'justify-start',
                    alignment === 'center' && 'justify-center',
                    alignment === 'right' && 'justify-end'
                )}
            >
                <div className="relative z-10 max-w-[60rem]">
                    {title && (
                        <h1
                            className="text-3xl font-bold md:text-4xl lg:text-5xl text-center sm:text-left"
                            style={{
                                lineHeight: '1.1',
                            }}
                        >
                            {title}
                        </h1>
                    )}
                    {subtitle && (
                        <h2 className="mt-4 sm:mt-6 md:mt-8 text-xl md:text-2xl lg:text-3xl !leading-tight text-center sm:text-left">
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
                        <div className="mt-8 sm:mt-16 md:mt-20 lg:mt-24 2xl:mt-28 flex flex-wrap gap-x-6 2xl:gap-x-12 gap-y-6 px-4 lg:px-8 2xl:px-12">
                            {links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className={twJoin(
                                        'px-6 py-3.5 text-lg font-medium rounded-3xl mx-auto sm:mx-[unset]',
                                        index === 0 &&
                                            'bg-text-color text-bg-color border border-bg-color',
                                        index === 1 && 'border border-text-color text-text-color'
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
