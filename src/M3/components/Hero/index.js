import React from 'react';
import { twJoin, getPageProfile } from '@uniwebcms/module-sdk';
import { Image, Link } from '@uniwebcms/core-components';
import Container from '../_utils/Container';
import { LuChevronRight } from 'react-icons/lu';

export default function Hero(props) {
    const { block } = props;

    const { height = '100vh', alignment = 'left' } = block.getBlockProperties();

    const { banner, title, subtitle, links } = block.getBlockContent();

    const ChildBlockRenderer = block.getChildBlockRenderer();

    const { childBlocks } = block;

    return (
        <Container
            className={twJoin(
                'w-full max-w-screen flex flex-col justify-center',
                !childBlocks.length || (childBlocks.length && alignment !== 'center')
                    ? 'lg:max-h-[982px]'
                    : '',
                height === '100vh' ? 'h-auto lg:h-screen' : 'h-auto'
            )}
            py="xl"
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
            <div className={twJoin('max-w-8xl mx-auto pt-12 lg:pt-0 relative')}>
                <div
                    className={twJoin(
                        'grid gap-12 items-center',
                        alignment === 'center' ? 'lg:grid-cols-1' : 'lg:grid-cols-2'
                    )}
                >
                    <div
                        className={twJoin(
                            '-order-1 max-w-3xl mx-auto',
                            alignment === 'left' && 'lg:text-left text-center',
                            alignment === 'right' && 'lg:order-2 lg:text-right text-center',
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
                                    alignment === 'center' ? 'text-lg md:text-xl' : 'text-lg'
                                )}
                            >
                                {subtitle}
                            </p>
                        )}
                        {links.length ? (
                            <div
                                className={twJoin(
                                    'flex flex-wrap gap-6 lg:gap-8',
                                    alignment === 'left' ? 'justify-center lg:justify-start' : '',
                                    alignment === 'center' ? 'justify-center' : '',
                                    alignment === 'right' ? 'justify-center lg:justify-end' : ''
                                )}
                            >
                                {links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        className={twJoin(
                                            'pl-4 pr-3 lg:pl-6 lg:pr-5 py-2 lg:py-3 text-base lg:text-lg font-semibold rounded-full flex items-center gap-2 transition-all',
                                            index === 0 &&
                                                'bg-text-color/90 text-bg-color hover:bg-text-color',
                                            index === 1 &&
                                                'border border-text-color bg-transparent text-text-color/90 hover:bg-text-color/20 hover:text-text-color'
                                        )}
                                    >
                                        {link.label}
                                        <LuChevronRight className="w-4 h-4 text-inherit" />
                                    </Link>
                                ))}
                            </div>
                        ) : null}
                    </div>
                    {childBlocks[0] ? (
                        <ChildBlockRenderer
                            block={block}
                            childBlocks={[childBlocks[0]]}
                            pure={true}
                        ></ChildBlockRenderer>
                    ) : null}
                </div>
            </div>
        </Container>
    );
}
