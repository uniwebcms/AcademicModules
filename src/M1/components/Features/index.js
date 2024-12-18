import React from 'react';
import Container from '../_utils/Container';
import { SafeHtml, Icon, Link, twJoin } from '@uniwebcms/module-sdk';

export default function Features(props) {
    const { block } = props;
    const { title, subtitle, links } = block.getBlockContent();
    const [firstLink, secondLink] = links;

    const items = block.getBlockItems();

    return (
        <Container py="lg" className="max-w-8xl mx-auto">
            <div className="max-w-[47rem] mx-auto">
                {title && (
                    <h2 className="text-2xl font-light md:text-3xl lg:text-4xl text-center tracking-wide text-pretty">
                        {title}
                    </h2>
                )}
                {subtitle && (
                    <p className="mt-4 lg:mt-6 px-0 lg:px-6 text-lg md:text-xl lg:text-2xl font-light text-center">
                        {subtitle}
                    </p>
                )}
            </div>
            {items.length ? (
                <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-8xl mx-auto gap-x-12 md:gap-x-16 xl:gap-x-24">
                    {items.map((item, index) => {
                        const { icons, title, paragraphs, links } = item;

                        const icon = icons[0];

                        const [firstLink, secondLink] = links;

                        return (
                            <div
                                className="flex-1 flex flex-col max-w-md mx-auto w-full"
                                key={index}
                            >
                                {icon && <Icon icon={icon} className="w-16 h-16 mx-auto" />}
                                {title && (
                                    <h3 className="mt-4 text-lg font-bold truncate">{title}</h3>
                                )}
                                {paragraphs && (
                                    <SafeHtml
                                        value={paragraphs}
                                        className="mt-1 text-base !leading-snug line-clamp-2 h-12"
                                    />
                                )}
                                <div className="flex items-center justify-between mt-4">
                                    {firstLink && (
                                        <Link
                                            to={firstLink.href}
                                            className="bg-btn-color text-btn-text-color flex items-center justify-center py-1 px-3 rounded-3xl max-w-[48%]"
                                        >
                                            <span className="truncate text-sm">
                                                {firstLink.label}
                                            </span>
                                        </Link>
                                    )}
                                    {secondLink && (
                                        <Link
                                            to={secondLink.href}
                                            className="text-btn-alt-text-color flex items-center justify-center max-w-[48%] hover:underline"
                                        >
                                            <span className="truncate text-sm">
                                                {secondLink.label}
                                            </span>
                                            &nbsp;&rarr;
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : null}
            {firstLink && (
                <div
                    className={twJoin(
                        items.length ? 'mt-12 sm:mt-16 lg:mt-24 ' : 'mt-6 sm:mt-12 lg:mt-16',
                        'flex justify-center'
                    )}
                >
                    <div className="relative inline-flex rounded-3xl overflow-hidden hover:scale-105 transition-transform duration-500 ease-in-out">
                        {/* Gradient border styled element */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-500" />
                        <Link
                            href={firstLink.href}
                            className="relative py-2 px-8 lg:px-12 bg-bg-color m-0.5 rounded-3xl"
                        >
                            <span className="font-bold">{firstLink.label}</span>
                        </Link>
                    </div>
                </div>
            )}
            {secondLink && (
                <div className="mt-4 flex justify-center">
                    <Link href={secondLink.href} className="text-text-color-50 hover:underline">
                        <span className="text-sm">{secondLink.label}</span>
                    </Link>
                </div>
            )}
        </Container>
    );
}
