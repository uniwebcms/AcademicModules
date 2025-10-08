import React from 'react';
import Container from '../_utils/Container';
import { twJoin, getPageProfile } from '@uniwebcms/module-sdk';
import { Icon, Link, SafeHtml, Image } from '@uniwebcms/core-components';
import { motion } from 'framer-motion';

export default function Feature(props) {
    const { block } = props;
    const { banner, pretitle, icons, title, subtitle, links, paragraphs } = block.getBlockContent();
    const [firstLink, secondLink] = links;

    const ChildBlockRenderer = block.getChildBlockRenderer();

    const {
        appearance = 'standard',
        sub_content_layout = 'grid_sm',
        child_card_roundness = 'none',
    } = block.getBlockProperties();

    const gridClassName = [];

    if (sub_content_layout === 'grid_sm') {
        gridClassName.push(
            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-6 lg:gap-8'
        );
    } else if (sub_content_layout === 'grid_md') {
        gridClassName.push('grid lg:grid-cols-3 gap-12 md:gap-6 lg:gap-8');
    } else if (sub_content_layout === 'grid_lg') {
        gridClassName.push('grid lg:grid-cols-2 gap-12 md:gap-8 lg:gap-12');
    } else if (sub_content_layout === 'full') {
        gridClassName.push('grid grid-cols-1 gap-12 md:gap-4');
    }

    if (child_card_roundness === 'small') {
        gridClassName.push('[&>*]:rounded-sm');
    } else if (child_card_roundness === 'medium') {
        gridClassName.push('[&>*]:rounded-md');
    } else if (child_card_roundness === 'large') {
        gridClassName.push('[&>*]:rounded-lg');
    } else if (child_card_roundness === 'extra_large') {
        gridClassName.push('[&>*]:rounded-xl');
    } else if (child_card_roundness === 'double_extra_large') {
        gridClassName.push('[&>*]:rounded-2xl');
    }

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
        <Link to={secondLink.href} className="text-text-color-50 hover:underline">
            <span className="text-sm">{secondLink.label}</span>
        </Link>
    ) : null;

    if (appearance === 'standard') {
        return (
            <Container py="md" className="relative max-w-8xl mx-auto">
                <div className={twJoin('text-center', title || subtitle ? 'mb-10 lg:mb-16' : '')}>
                    {title && <h2 className={'text-4xl font-bold mb-4'}>{title}</h2>}
                    {subtitle && (
                        <p className="text-lg font-base max-w-3xl mx-auto text-pretty">
                            {subtitle}
                        </p>
                    )}
                </div>
                {hasChildBlocks ? (
                    <div className={twJoin(gridClassName)}>
                        <ChildBlockRenderer
                            block={block}
                            childBlocks={childBlocks}
                        ></ChildBlockRenderer>
                    </div>
                ) : null}
                {primaryLink || secondLink ? (
                    <div
                        className={twJoin(
                            'flex flex-col items-center space-y-3',
                            hasChildBlocks ? 'mt-12 lg:mt-20' : 'mt-12 lg:mt-16'
                        )}
                    >
                        {primaryLink}
                        {secondaryLink}
                    </div>
                ) : null}
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
                    <div
                        className={twJoin(
                            'mt-12 sm:mt-16 lg:mt-20 max-w-8xl mx-auto',
                            gridClassName
                        )}
                    >
                        <ChildBlockRenderer
                            block={block}
                            childBlocks={childBlocks}
                        ></ChildBlockRenderer>
                    </div>
                ) : null}
                <div
                    className={twJoin(
                        'flex flex-col items-center space-y-5',
                        hasChildBlocks ? 'mt-12 lg:mt-20' : 'mt-12 lg:mt-16'
                    )}
                >
                    {primaryLink}
                    {secondaryLink}
                </div>
            </Container>
        );
    }

    if (appearance === 'iconic') {
        const icon = icons[0];

        return (
            <Container py="lg" className="border-t border-text-color/20">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={twJoin('text-center', hasChildBlocks ? 'mb-12' : '')}
                    >
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Icon icon={icon} className="w-5 h-5" />
                            <h2 className="text-2xl font-bold">{title}</h2>
                        </div>
                        <p className="max-w-2xl mx-auto">{subtitle}</p>
                    </motion.div>
                    {hasChildBlocks ? (
                        <div className={twJoin(gridClassName)}>
                            <ChildBlockRenderer
                                block={block}
                                childBlocks={childBlocks}
                            ></ChildBlockRenderer>
                        </div>
                    ) : null}
                </div>
            </Container>
        );
    }

    if (appearance === 'detailed') {
        const hasExtraContent = paragraphs.length > 0 || links.length > 0;

        return (
            <Container py="none" px="none" className="relative">
                {/* Background */}
                {banner && (
                    <div className="absolute inset-0">
                        <Image
                            profile={getPageProfile()}
                            {...banner}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}
                {/* Content */}
                <div
                    className={
                        'max-w-8xl mx-auto space-y-8 sm:space-y-12 lg:space-y-16 py-12 lg:py-24 px-6 md:px-8 lg:px-16 xl:px-24'
                    }
                >
                    <div className="max-w-2xl mx-auto text-center relative z-10">
                        {pretitle && (
                            <p className="text-xs md:text-sm lg:text-base font-semibold uppercase mb-1.5 text-heading-color-80">
                                {pretitle}
                            </p>
                        )}
                        {title && (
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="mt-3 text-sm md:text-base lg:text-lg text-balance text-heading-color-90">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {hasChildBlocks ? (
                        <div className={twJoin('relative z-10', gridClassName)}>
                            <ChildBlockRenderer
                                block={block}
                                childBlocks={childBlocks}
                            ></ChildBlockRenderer>
                        </div>
                    ) : null}
                    {hasExtraContent && (
                        <div className="flex flex-col items-center space-y-5 relative z-10">
                            {paragraphs.length > 0 && (
                                <SafeHtml
                                    value={paragraphs}
                                    className="text-sm md:text-base lg:text-lg italic"
                                />
                            )}
                            {links.length > 0 && (
                                <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-x-5 gap-y-3">
                                    {links.map((link, index) => {
                                        const { href, label } = link;
                                        const icon = icons[index];

                                        return (
                                            <div
                                                className={twJoin(
                                                    'flex items-center gap-2',
                                                    index % 2 === 0 ? '' : 'md:flex-row-reverse'
                                                )}
                                                key={index}
                                            >
                                                <Link
                                                    to={href}
                                                    target="_blank"
                                                    className="text-sm md:text-base hover:underline"
                                                >
                                                    {label}
                                                </Link>
                                                {icon && (
                                                    <Icon
                                                        icon={icon}
                                                        className="w-4 h-4 md:w-5 md:h-5"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Container>
        );
    }

    if (appearance === 'island') {
        return (
            <Container py="none" px="none" className="relative">
                {/* Content */}
                <div className={'max-w-8xl mx-auto py-8 lg:py-12 px-0 lg:px-16 xl:px-24'}>
                    <div
                        className={
                            'w-full space-y-8 lg:space-y-10 py-8 lg:py-12 px-4 md:px-6 lg:px-8 bg-primary-50 lg:rounded-lg'
                        }
                    >
                        <div className="max-w-2xl mx-auto text-center relative z-10">
                            {/* {pretitle && (
                                <p className="text-xs md:text-sm lg:text-base font-semibold uppercase mb-1.5 text-heading-color-80">
                                    {pretitle}
                                </p>
                            )} */}
                            {title && (
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                                    {title}
                                </h2>
                            )}
                            {subtitle && (
                                <p className="mt-1 md:mt-2 lg:mt-3 text-sm md:text-base lg:text-lg text-balance text-heading-color-70">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {hasChildBlocks ? (
                            <div className={twJoin('relative z-10', gridClassName)}>
                                <ChildBlockRenderer
                                    block={block}
                                    childBlocks={childBlocks}
                                ></ChildBlockRenderer>
                            </div>
                        ) : null}
                        {paragraphs.length > 0 && (
                            <SafeHtml
                                value={paragraphs}
                                className="text-sm md:text-base lg:text-lg text-center text-text-color-70"
                            />
                        )}
                    </div>
                </div>
            </Container>
        );
    }
}
