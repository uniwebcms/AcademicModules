import React from 'react';
import Container from '../_utils/Container';
import { Link, twJoin, SafeHtml } from '@uniwebcms/module-sdk';

export default function BasicContent(props) {
    const { block } = props;
    const { pretitle, title, subtitle, paragraphs, links } = block.getBlockContent();

    const [firstLink, secondLink] = links;

    const firstLinkElement = firstLink ? (
        <Link
            href={firstLink.href}
            className="relative py-2 lg:py-3 px-8 lg:px-10 bg-primary-600 hover:bg-primary-500 rounded-md"
        >
            <span className="font-bold text-white">{firstLink.label}</span>
        </Link>
    ) : null;

    const secondLinkElement = secondLink ? (
        <Link href={secondLink.href}>
            <span className="font-medium text-primary-600 hover:underline">{secondLink.label}</span>
        </Link>
    ) : null;

    return (
        <Container px="none">
            <div className="px-6 md:px-8 lg:px-16 xl:px-24 max-w-6xl mx-auto">
                {pretitle && (
                    <p className="mb-4 lg:mb-5 text-base md:text-lg font-medium text-primary-600 text-center">
                        {pretitle}
                    </p>
                )}
                {title && (
                    <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl text-center tracking-wide text-pretty">
                        {title}
                    </h2>
                )}
                {subtitle && (
                    <SafeHtml
                        className="mt-4 lg:mt-6 px-0 lg:px-8 text-base md:text-lg lg:text-xl text-text-color-60 text-center tracking-wide text-pretty"
                        value={subtitle}
                    ></SafeHtml>
                )}
                {firstLink && (
                    <div className="mt-6 lg:mt-8 flex items-center justify-center gap-x-10">
                        {firstLinkElement}
                        {secondLinkElement}
                        {/* <Link
                            href={firstLink.href}
                            className="relative py-2 lg:py-3 px-8 lg:px-12 bg-primary-600 hover:bg-primary-500 rounded-md"
                        >
                            <span className="font-bold text-white">{firstLink.label}</span>
                        </Link> */}
                    </div>
                )}
                {paragraphs.length ? (
                    <SafeHtml
                        value={paragraphs}
                        className="mt-3 text-sm lg:text-base text-text-color-50 text-center"
                    />
                ) : null}
            </div>
        </Container>
    );
}
