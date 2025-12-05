import React from 'react';
import Container from '../_utils/Container';
import { twJoin } from '@uniwebcms/module-sdk';
import { SafeHtml, Icon } from '@uniwebcms/core-components';

export default function TextBox(props) {
    const { block, extra, website } = props;

    const {
        pretitle: eyebrow,
        title,
        subtitle,
        paragraphs,
        links,
        icons,
    } = block.getBlockContent();

    const { useNavigate } = website.getRoutingComponents();
    const navigate = useNavigate();

    const {
        // --- LAYOUT SETTINGS ---
        textInset = 'standard', // 'standard', 'none'
        // --- MACRO SETTINGS (Bundled) ---
        textDensity = 'normal', // 'compact', 'normal', 'spacious'
        textWidth = 'regular', // 'narrow', 'regular', 'wide'
        textScale = 'normal', // 'small', 'normal', 'large', 'xlarge'

        // --- LAYOUT SETTINGS ---
        textAlign = 'left', // 'left', 'center', 'right'
        centerHeadings = false, // New Boolean: centers title/eyebrow even if text is left
        textColumns = '1', // '1', '2', '3'

        // --- MICRO STYLE SETTINGS (The "Personality") ---
        headingStyle = 'bold', // 'bold', 'light', 'serif', 'slab'
        eyebrowStyle = 'default', // 'default', 'uppercase', 'accent'
    } = block.getBlockProperties();

    // 1. Alignment Logic: Hybrid approach
    // If centerHeadings is true, force center on headers, otherwise inherit textAlign
    const headerAlign =
        textAlign === 'left' && centerHeadings
            ? 'text-center self-center justify-center'
            : `text-${textAlign} self-${
                  textAlign === 'center' ? 'center' : textAlign === 'right' ? 'end' : 'start'
              }`;

    const bodyAlign = `text-${textAlign}`;

    // This moves the actual narrow box to the Left, Center, or Right of the parent container
    const positionConfig = {
        left: 'mr-auto', // Pushes box to the left (Standard)
        center: 'mx-auto', // Pushes box to the center (Intro/Hero)
        right: 'ml-auto', // Pushes box to the right (Caption/Note)
    };

    // Container alignment (flex-col items-...)
    // const containerAlignItems = {
    //     left: 'items-start',
    //     center: 'items-center',
    //     right: 'items-end',
    // };

    // If we have mixed alignment (Left body, Center head), the container must generally stretch
    // or center depending on the dominant content. Usually 'items-center' is safest for mixed,
    // or 'items-start' if only the text is left.
    // Simpler approach: Just align the container based on the Body Text, as headers handle their own text-align.
    // const wrapperAlign = containerAlignItems[textAlign];

    // 2. Density: Controls Padding, Gaps, and Button sizes
    // const densityConfig = {
    //     compact: {
    //         padding: '@xs:p-4 @md:py-6 @lg:py-8',
    //         space: '@xs:space-y-3 @md:space-y-4', // Tighter vertical rhythm
    //         gap: '@xs:gap-2 @md:gap-3', // Button/Grid gaps
    //         tracking: 'tracking-tight',
    //         btnPad: '@xs:px-4 @xs:py-2',
    //         lineHeight: '!leading-snug',
    //     },
    //     normal: {
    //         padding: '@xs:p-6 @md:py-8 @lg:py-10',
    //         space: '@xs:space-y-4 @md:space-y-6',
    //         gap: '@xs:gap-3 @md:gap-4',
    //         tracking: 'tracking-normal',
    //         btnPad: '@xs:px-6 @xs:py-3',
    //         lineHeight: '!leading-normal',
    //     },
    //     spacious: {
    //         padding: '@xs:p-8 @md:py-12 @lg:py-16',
    //         space: '@xs:space-y-6 @md:space-y-8', // Luxurious whitespace
    //         gap: '@xs:gap-4 @md:gap-6',
    //         tracking: 'tracking-wide',
    //         btnPad: '@xs:px-8 @xs:py-4',
    //         lineHeight: '!leading-loose',
    //     },
    // };
    const densityConfig = {
        compact: {
            // Base: p-3 -> @xs: p-4
            padding: 'p-3 @xs:p-4 @md:py-6 @lg:py-8',
            // Base: space-y-2 -> @xs: space-y-3
            space: 'space-y-2 @xs:space-y-3 @md:space-y-4',
            // Base: gap-1.5 or gap-2
            gap: 'gap-2 @xs:gap-2 @md:gap-3',
            tracking: 'tracking-tight',
            // Base: px-3 py-1.5 (Smaller button)
            btnPad: 'px-3 py-1.5 @xs:px-4 @xs:py-2',
            btnGap: 'gap-1 @xs:gap-1.5',
            lineHeight: '!leading-snug',
            eyebrowPad: 'px-1.5 py-0.5 @xs:px-2 @xs:py-1',
        },
        normal: {
            // Base: p-4
            padding: 'p-4 @xs:p-6 @md:py-8 @lg:py-10',
            // Base: space-y-3
            space: 'space-y-3 @xs:space-y-4 @md:space-y-6',
            // Base: gap-2
            gap: 'gap-2 @xs:gap-3 @md:gap-4',
            tracking: 'tracking-normal',
            // Base: px-4 py-2
            btnPad: 'px-4 py-2 @xs:px-6 @xs:py-3',
            btnGap: 'gap-2 @xs:gap-2.5',
            lineHeight: '!leading-normal',
            eyebrowPad: 'px-2 py-0.5 @xs:px-2.5 @xs:py-1',
        },
        spacious: {
            // Base: p-5
            padding: 'p-5 @xs:p-8 @md:py-12 @lg:py-16',
            // Base: space-y-4
            space: 'space-y-4 @xs:space-y-6 @md:space-y-8',
            // Base: gap-3
            gap: 'gap-3 @xs:gap-4 @md:gap-6',
            tracking: 'tracking-wide',
            // Base: px-5 py-2.5
            btnPad: 'px-5 py-2.5 @xs:px-8 @xs:py-4',
            btnGap: 'gap-3 @xs:gap-3.5',
            lineHeight: '!leading-loose',
            eyebrowPad: 'px-2.5 py-1 @xs:px-3 @xs:py-1.5',
        },
    };

    // 3. Scale: Uses Container Queries (@xs, @md) to resize uniformly
    // const scaleConfig = {
    //     small: {
    //         eyebrow: '@xs:text-xs @md:text-sm',
    //         title: '@xs:text-xl @md:text-2xl',
    //         subtitle: '@xs:text-lg @md:text-xl',
    //         body: '@xs:text-sm @md:text-base',
    //         btn: 'text-sm',
    //     },
    //     normal: {
    //         eyebrow: '@xs:text-sm @md:text-base',
    //         title: '@xs:text-3xl @md:text-4xl',
    //         // Update Subtitle: Distinct size + Fixed "Snug" leading
    //         subtitle: '@xs:text-xl @md:text-2xl !leading-snug',
    //         body: '@xs:text-base @md:text-lg',
    //         btn: 'text-base',
    //     },
    //     large: {
    //         eyebrow: '@xs:text-base @md:text-lg',
    //         title: '@xs:text-4xl @md:text-5xl',
    //         subtitle: '@xs:text-xl @md:text-2xl',
    //         body: '@xs:text-lg @md:text-xl',
    //         btn: 'text-lg',
    //     },
    //     xlarge: {
    //         eyebrow: '@xs:text-lg @md:text-xl',
    //         title: '@xs:text-5xl @md:text-6xl',
    //         subtitle: '@xs:text-2xl @md:text-3xl',
    //         body: '@xs:text-xl @md:text-2xl',
    //         btn: 'text-xl',
    //     },
    // };
    const scaleConfig = {
        small: {
            // Base: 10px -> @xs: text-xs
            eyebrow: 'text-[10px] @xs:text-xs @md:text-sm',
            // Base: text-lg -> @xs: text-xl
            title: 'text-lg @xs:text-xl @md:text-2xl',
            // Base: text-sm -> @xs: text-lg
            subtitle: 'text-sm @xs:text-lg @md:text-xl',
            // Base: text-xs -> @xs: text-sm
            body: 'text-xs @xs:text-sm @md:text-base',
            btn: 'text-xs @xs:text-sm',
        },
        normal: {
            // Base: text-xs -> @xs: text-sm
            eyebrow: 'text-xs @xs:text-sm @md:text-base',
            // Base: text-xl -> @xs: text-3xl
            title: 'text-xl @xs:text-3xl @md:text-4xl',
            // Base: text-base -> @xs: text-xl
            subtitle: 'text-base @xs:text-xl @md:text-2xl !leading-snug',
            // Base: text-sm -> @xs: text-base
            body: 'text-sm @xs:text-base @md:text-lg',
            btn: 'text-sm @xs:text-base',
        },
        large: {
            // Base: text-sm -> @xs: text-base
            eyebrow: 'text-sm @xs:text-base @md:text-lg',
            // Base: text-2xl -> @xs: text-4xl
            title: 'text-2xl @xs:text-4xl @md:text-5xl',
            // Base: text-lg -> @xs: text-xl
            subtitle: 'text-lg @xs:text-xl @md:text-2xl',
            // Base: text-base -> @xs: text-lg
            body: 'text-base @xs:text-lg @md:text-xl',
            btn: 'text-base @xs:text-lg',
        },
        xlarge: {
            // Base: text-base -> @xs: text-lg
            eyebrow: 'text-base @xs:text-lg @md:text-xl',
            // Base: text-3xl -> @xs: text-5xl
            title: 'text-3xl @xs:text-5xl @md:text-6xl',
            // Base: text-xl -> @xs: text-3xl
            subtitle: 'text-xl @xs:text-2xl @md:text-3xl', // Adjusted xs base to match progression
            // Base: text-lg -> @xs: text-xl
            body: 'text-lg @xs:text-xl @md:text-2xl',
            btn: 'text-lg @xs:text-xl',
        },
    };

    // 4. Personality / Styles
    // This replaces "Profile" with specific typographic intents
    // const headingStyles = {
    //     bold: 'font-extrabold tracking-tight', // Modern Business
    //     light: 'font-light tracking-wide', // Minimalist / Art
    //     serif: 'font-serif font-bold', // Academic / Scholar
    //     slab: 'font-slab font-black uppercase', // Brutalist / Impact
    // };
    const headingStyles = {
        bold: 'font-extrabold !leading-tight tracking-tight',
        light: 'font-light !leading-tight tracking-wide',
        serif: 'font-serif font-bold !leading-tight',
        slab: 'font-slab font-black uppercase !leading-none', // Slab often looks best with 1.0 line height
    };

    const eyebrowStyles = {
        default: 'font-medium text-[var(--callout)]',
        uppercase: 'font-bold uppercase tracking-wider text-[var(--callout)]',
        accent: 'font-bold px-2 py-1 rounded-[var(--border-radius)] border-text-color/20 text-[var(--callout)] bg-[color:color-mix(in_srgb,var(--callout,var(--text-color))_10%,transparent)]',
    };

    const widthConfig = {
        narrow: 'max-w-2xl',
        regular: 'max-w-4xl',
        wide: 'max-w-6xl',
    };

    const columnConfig = {
        1: 'columns-1',
        2: 'columns-1 @md:columns-2',
        3: 'columns-1 @md:columns-2 @lg:columns-3',
    };

    return (
        <Container
            className={'h-full'} // Ensure height fills if used in grid
            maxWidth={'7xl'}
            {...extra}
        >
            <div
                className={twJoin(
                    'flex flex-col', // Ensure height fills if used in grid
                    // Add the position config here:
                    positionConfig[textAlign],

                    // Existing alignment logic for children
                    textAlign === 'center'
                        ? 'items-center'
                        : textAlign === 'right'
                        ? 'items-end'
                        : 'items-start',
                    // wrapperAlign,
                    textInset === 'standard' ? densityConfig[textDensity].padding : '',
                    densityConfig[textDensity].space,
                    densityConfig[textDensity].tracking,
                    widthConfig[textWidth]
                )}
                // maxWidth={widthConfig[textWidth]}
            >
                {/* Header Group: Wrapped to handle "Center Heading + Left Body" scenarios better if needed, 
                but here strictly following the vertical stack logic */}

                {eyebrow && (
                    <div
                        className={twJoin(
                            headerAlign,
                            scaleConfig[textScale].eyebrow,
                            eyebrowStyles[eyebrowStyle],
                            'mb-1',
                            eyebrowStyle === 'accent' && densityConfig[textDensity].eyebrowPad
                        )}
                    >
                        {eyebrow}
                    </div>
                )}

                {title && (
                    <h2
                        className={twJoin(
                            headerAlign,
                            scaleConfig[textScale].title,
                            headingStyles[headingStyle]
                        )}
                    >
                        {title}
                    </h2>
                )}

                {/* {subtitle && (
                <p
                    className={twJoin(
                        headerAlign,
                        scaleConfig[textScale].subtitle,
                        'text-gray-600 font-medium opacity-90'
                    )}
                >
                    {subtitle}
                </p>
            )} */}

                {subtitle && (
                    <p
                        className={twJoin(
                            headerAlign,
                            scaleConfig[textScale].subtitle,
                            // CHANGE: Lighter color (text-gray-500 or opacity-80), Medium weight, Bottom margin
                            'text-[var(--text-color)] opacity-75 font-medium'
                            // 'mb-4'
                        )}
                    >
                        {subtitle}
                    </p>
                )}

                {/* Content Body */}
                {/* {paragraphs.length > 0 && (
                <div className={twJoin('w-full', bodyAlign)}>
                    <SafeHtml
                        value={paragraphs}
                        className={twJoin(
                            scaleConfig[textScale].body,
                            columnConfig[textColumns],
                            // Pass gap to columns if multi-column
                            textColumns !== '1' && densityConfig[textDensity].gap,
                            'prose prose-neutral max-w-none' // Tailwind Typography plugin is recommended here for rich text
                        )}
                    />
                </div>
            )} */}

                {paragraphs.length > 0 && (
                    <div className={twJoin('w-full', bodyAlign)}>
                        <SafeHtml
                            value={paragraphs}
                            className={twJoin(
                                scaleConfig[textScale].body,
                                columnConfig[textColumns],
                                textColumns !== '1' && densityConfig[textDensity].gap,
                                // CHANGE: Add the line height here
                                densityConfig[textDensity].lineHeight,
                                'prose max-w-none'
                            )}
                        />
                    </div>
                )}

                {/* Actions */}
                {links.length > 0 && (
                    <div
                        className={twJoin(
                            'flex flex-wrap pt-2', // Add a little visual separation from text
                            // Alignment for buttons usually follows body alignment
                            textAlign === 'center'
                                ? 'justify-center'
                                : textAlign === 'right'
                                ? 'justify-end'
                                : 'justify-start',
                            densityConfig[textDensity].gap
                        )}
                    >
                        {links.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    navigate(link.href);
                                }}
                                type="button"
                                className={twJoin(
                                    'inline-flex items-center justify-center rounded-[var(--border-radius)] transition-all duration-200',
                                    index === 0
                                        ? '' // Primary
                                        : 'btn-secondary border border-btn-alt-text-color/30', // Secondary
                                    densityConfig[textDensity].btnPad,
                                    densityConfig[textDensity].btnGap,
                                    scaleConfig[textScale].btn,
                                    // Personality tweak: if heading is Serif, maybe buttons are serif too?
                                    headingStyle === 'serif' ? 'font-serif' : 'font-semibold'
                                )}
                            >
                                {link.label}
                                {icons[index] && (
                                    <Icon
                                        {...icons[index]}
                                        // className="ml-2 w-[1.2em] h-[1.2em]" // Relative sizing to text
                                        className={twJoin(
                                            'w-[1.2em] h-[1.2em] transition-colors',
                                            index === 0
                                                ? '[&_svg]:text-btn-text-color group-hover:bg-btn-hover-color'
                                                : '[&_svg]:text-btn-alt-text-color group-hover:bg-btn-alt-hover-color'
                                        )}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </Container>
    );
}
