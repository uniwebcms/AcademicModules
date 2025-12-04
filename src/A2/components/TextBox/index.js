import React from 'react';
import Container from '../_utils/Container';
import { twJoin } from '@uniwebcms/module-sdk';
import { SafeHtml, Icon } from '@uniwebcms/core-components';

export default function TextBox(props) {
    const { block, extra } = props;

    const {
        pretitle: eyebrow,
        title,
        subtitle,
        paragraphs,
        links,
        icons,
    } = block.getBlockContent();

    const {
        textDensity = 'normal', // choices: 'compact', 'normal', 'spacious'l,
        textWidth = 'normal', // choices: 'narrow', 'regular', 'wide'
        textScale = 'normal', // choices: 'small', 'normal', 'large', 'xlarge',
        textColumns = '1', // choices: '1', '2', '3',
        textAlignment = 'left', // choices: 'left', 'center', 'right',
        textProfile = 'default', // choices: 'default', 'scholar'
    } = block.getBlockProperties();

    const alignmentConfig = {
        left: 'items-start text-left mr-auto',
        center: 'items-center text-center mx-auto',
        right: 'items-end text-right ml-auto',
    };

    const densityConfig = {
        compact: {
            padding: '@xs:p-4 @md:py-6 @lg:py-8',
            stackSpace: '@xs:space-y-2 @md:space-y-4 @lg:space-y-6',
            btnGroupGap: '@xs:gap-2 @md:gap-4 @lg:gap-6',
            textTracking: 'tracking-tight',
            buttonPadding: '@xs:px-3 @md:px-4 @lg:px-5 @xs:py-2 @md:py-3 @lg:py-4',
            buttonGap: '@xs:gap-1 @md:gap-2 @lg:gap-3',
            columnGap: '@xs:gap-2 @md:gap-4 @lg:gap-6',
        },
        normal: {
            padding: '@xs:p-6 @md:py-8 @lg:py-10',
            stackSpace: '@xs:space-y-3 @md:space-y-5 @lg:space-y-7',
            btnGroupGap: '@xs:gap-3 @md:gap-5 @lg:gap-7',
            textTracking: 'tracking-normal',
            buttonPadding: '@xs:px-6 @md:px-7 @lg:px-8 @xs:py-3 @md:py-4 @lg:py-6',
            buttonGap: '@xs:gap-2 @md:gap-3 @lg:gap-4',
            columnGap: '@xs:gap-3 @md:gap-5 @lg:gap-7',
        },
        spacious: {
            padding: '@xs:p-8 @md:py-10 @lg:py-12',
            stackSpace: '@xs:space-y-4 @md:space-y-6 @lg:space-y-8',
            btnGroupGap: '@xs:gap-4 @md:gap-6 @lg:gap-8',
            textTracking: 'tracking-wide',
            buttonPadding: '@xs:px-8 @md:px-9 @lg:px-10 @xs:py-4 @md:py-5 @lg:py-7',
            buttonGap: '@xs:gap-4 @md:gap-5 @lg:gap-6',
            columnGap: '@xs:gap-4 @md:gap-6 @lg:gap-8',
        },
    };

    const scaleConfig = {
        small: {
            eyebrow: '@xs:text-sm @md:text-base',
            title: '@xs:text-2xl @md:text-3xl',
            subtitle: '@xs:text-lg @md:text-xl',
            paragraphs: '@xs:text-base @md:text-lg',
            btn: '@xs:text-sm @md:text-base',
            btnIcon: '@xs:w-4 @md:w-5 @xs:h-4 @md:h-5',
        },
        normal: {
            eyebrow: '@xs:text-base @md:text-lg',
            title: '@xs:text-3xl @md:text-4xl',
            subtitle: '@xs:text-xl @md:text-2xl',
            paragraphs: '@xs:text-lg @md:text-xl',
            btn: '@xs:text-base @md:text-lg',
            btnIcon: '@xs:w-5 @md:w-6 @xs:h-5 @md:h-6',
        },
        large: {
            eyebrow: '@xs:text-lg @md:text-xl',
            title: '@xs:text-4xl @md:text-5xl',
            subtitle: '@xs:text-2xl @md:text-3xl',
            paragraphs: '@xs:text-xl @md:text-2xl',
            btn: '@xs:text-lg @md:text-xl',
            btnIcon: '@xs:w-6 @md:w-7 @xs:h-6 @md:h-7',
        },
        xlarge: {
            eyebrow: '@xs:text-xl @md:text-2xl',
            title: '@xs:text-5xl @md:text-6xl',
            subtitle: '@xs:text-3xl @md:text-4xl',
            paragraphs: '@xs:text-2xl @md:text-3xl',
            btn: '@xs:text-xl @md:text-2xl',
            btnIcon: '@xs:w-7 @md:w-8 @xs:h-7 @md:h-8',
        },
    };

    const widthConfig = {
        narrow: 'max-w-2xl',
        regular: 'max-w-4xl',
        wide: 'max-w-6xl',
    };

    const columnConfig = {
        1: '@xs:columns-1',
        2: '@xs:columns-1 @md:columns-2',
        3: '@xs:columns-1 @lg:columns-2 @xl:columns-3',
    };

    const profileConfig = {
        default: {
            eyebrow: 'font-bold uppercase',
            title: 'font-extrabold',
            subtitle: 'font-semibold',
            paragraphs: 'font-normal',
            btn: 'font-normal',
        },
        scholar: {
            eyebrow: 'font-normal',
            title: 'font-bold uppercase',
            subtitle: 'font-medium',
            paragraphs: 'font-normal',
            btn: 'font-light uppercase',
        },
    };

    return (
        <Container
            className={twJoin(
                'flex flex-col',
                alignmentConfig[textAlignment],
                densityConfig[textDensity].padding,
                densityConfig[textDensity].stackSpace,
                densityConfig[textDensity].textTracking
            )}
            maxWidth={widthConfig[textWidth]}
            {...extra}
        >
            {eyebrow && (
                <p
                    className={twJoin(
                        'text-[var(--callout)]',
                        scaleConfig[textScale].eyebrow,
                        profileConfig[textProfile].eyebrow
                    )}
                >
                    {eyebrow}
                </p>
            )}
            {title && (
                <h2
                    className={twJoin(
                        scaleConfig[textScale].title,
                        profileConfig[textProfile].title
                    )}
                >
                    {title}
                </h2>
            )}
            {subtitle && (
                <p
                    className={twJoin(
                        scaleConfig[textScale].subtitle,
                        profileConfig[textProfile].subtitle
                    )}
                >
                    {subtitle}
                </p>
            )}
            {paragraphs.length > 0 && (
                <SafeHtml
                    value={paragraphs}
                    className={twJoin(
                        scaleConfig[textScale].paragraphs,
                        columnConfig[textColumns],
                        densityConfig[textDensity].columnGap
                    )}
                />
            )}
            {links.length > 0 && (
                <div
                    className={twJoin(
                        'flex flex-wrap items-center',
                        densityConfig[textDensity].btnGroupGap
                    )}
                >
                    {links.map((link, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(link.href)}
                            type="button"
                            className={twJoin(
                                'inline-flex items-center justify-center rounded-[var(--border-radius)] font-semibold transition-colors group',
                                index === 0
                                    ? ''
                                    : 'btn-secondary border border-btn-alt-text-color/40',
                                densityConfig[textDensity].buttonPadding,
                                densityConfig[textDensity].buttonGap,
                                scaleConfig[textScale].btn
                            )}
                        >
                            {link.label}
                            {icons[index] && (
                                <Icon
                                    {...icons[index]}
                                    className={twJoin(
                                        'transition-colors',
                                        index === 0
                                            ? '[&_svg]:text-btn-text-color group-hover:bg-btn-hover-color'
                                            : '[&_svg]:text-btn-alt-text-color group-hover:bg-btn-alt-hover-color',
                                        scaleConfig[textScale].btnIcon
                                    )}
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </Container>
    );
}
