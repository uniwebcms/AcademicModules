import React from 'react';
import Container from '../_utils/Container';
import { SafeHtml, Icon, Link, twJoin } from '@uniwebcms/module-sdk';
import Fancy from './Fancy';

export default function Feature(props) {
    const { block } = props;
    const { title, subtitle, links } = block.getBlockContent();
    const [firstLink, secondLink] = links;

    const ChildBlockRenderer = block.getChildBlockRenderer();

    const { appearance = 'standard' } = block.getBlockProperties(); // loose, iconic, standard

    const { childBlocks } = block;

    const hasChildBlocks = childBlocks.length > 0;

    const primaryLink = firstLink ? (
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
    ) : null;

    const secondaryLink = secondLink ? (
        <Link href={secondLink.href} className="text-text-color-50 hover:underline">
            <span className="text-sm">{secondLink.label}</span>
        </Link>
    ) : null;

    if (appearance === 'standard') {
        return (
            <Container py="lg" className="relative max-w-8xl mx-auto">
                <div className="text-center mb-20">
                    {title && <h2 className={'text-4xl font-bold mb-4'}>{title}</h2>}
                    {subtitle && <p className="text-lg font-base">{subtitle}</p>}
                </div>
                {hasChildBlocks ? (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <ChildBlockRenderer
                            block={block}
                            childBlocks={[childBlocks[0]]}
                            pure={true}
                        ></ChildBlockRenderer>
                    </div>
                ) : null}
                <div
                    className={twJoin(
                        'flex flex-col items-center space-y-3',
                        hasChildBlocks ? 'mt-12 sm:mt-16 lg:mt-24' : 'mt-6 sm:mt-12 lg:mt-16'
                    )}
                >
                    {primaryLink}
                    {secondaryLink}
                </div>
            </Container>
        );
    }

    if (appearance === 'loose') {
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
                {hasChildBlocks ? (
                    <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-8xl mx-auto gap-x-12 md:gap-x-16 xl:gap-x-24">
                        <ChildBlockRenderer
                            block={block}
                            childBlocks={[childBlocks[0]]}
                            pure={true}
                        ></ChildBlockRenderer>
                    </div>
                ) : null}
                <div
                    className={twJoin(
                        'flex flex-col items-center space-y-5',
                        hasChildBlocks ? 'mt-12 sm:mt-16 lg:mt-24' : 'mt-6 sm:mt-12 lg:mt-16'
                    )}
                >
                    {primaryLink}
                    {secondaryLink}
                </div>
            </Container>
        );
    }

    if (appearance === 'iconic') {
        return null;
    }
}