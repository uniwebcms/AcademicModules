import React, { useState, useEffect } from 'react';
import { Link, Icon, Image } from '@uniwebcms/core-components';
import { twJoin, getPageProfile } from '@uniwebcms/module-sdk';

export default function Hero(props) {
    const { block, website, page } = props;

    const isHeaderOverlay =
        page.blockGroups?.header?.[0]?.getBlockProperties()?.header_placement === 'overlay_hero';

    const { useNavigate } = website.getRoutingComponents();
    const navigate = useNavigate();

    const {
        variant = 'content-only', // choices: 'content-avatar', 'big-card', 'content-only'
        avatar_placement = 'right', // choices: 'left', 'right',
        avatar_style = 'square', // choices:: 'circle', 'square', 'portrait', 'landscape', 'square_spinning'
        avatar_size = 'medium', // choices: 'small', 'medium',
        avatar_gradient = false, // boolean to control gradient overlay on avatar image
        content_alignment = 'center', // choices: 'left', 'center', 'right',
        content_feature = 'none', // choices: 'none', 'big-title-decorative-line',
        big_card_bg_gradient = false, // boolean to control gradient overlay on big-card variant
        height = 'auto',
    } = block.getBlockProperties(); // settings for the hero section

    const {
        banner: backgroundImage,
        pretitle: eyebrow,
        title,
        subtitle,
        links,
        icons,
        form: statsData = [],
    } = block.getBlockContent();

    const { banner: sidePicture, form: sideExtraInfo } = block.getBlockItems()?.[0] || {};

    const [headerHeight, setHeaderHeight] = useState(0);

    // Dynamic padding for overlay header
    useEffect(() => {
        const mainNavbar = document.querySelector('#main-navbar');
        if (mainNavbar) {
            setHeaderHeight(mainNavbar.offsetHeight);
        }
    }, [page]);

    const ContentBlock = ({
        eyebrow,
        title,
        subtitle,
        links,
        icons,
        align = 'left', // 'left', 'center'
        statsData,
        size = 'lg', // 'lg', 'md', or 'sm'
        feature = 'none', // 'none', 'big-title-decorative-line'
        className = '',
    }) => (
        <div
            className={twJoin('space-y-6', className)}
            style={{
                textAlign: align,
            }}
        >
            {eyebrow && (
                <p
                    className={twJoin(
                        'border rounded-[var(--border-radius)] px-3 py-1 border-text-color/20 text-sm md:text-base font-bold uppercase tracking-wider text-[var(--callout)] bg-[color:color-mix(in_srgb,var(--callout,var(--text-color))_10%,transparent)] w-fit',
                        align === 'center' ? 'mx-auto' : '',
                        align === 'right' ? 'ml-auto' : ''
                    )}
                >
                    {eyebrow}
                </p>
            )}
            {title && (
                <h1
                    className={twJoin(
                        'font-extrabold',
                        feature === 'big-title-decorative-line' &&
                            'text-7xl md:text-8xl lg:text-9xl',
                        feature !== 'big-title-decorative-line' &&
                            size === 'lg' &&
                            'text-6xl md:text-7xl lg:text-8xl',
                        feature !== 'big-title-decorative-line' &&
                            size === 'md' &&
                            'text-5xl md:text-6xl lg:text-7xl',
                        feature !== 'big-title-decorative-line' &&
                            size === 'sm' &&
                            'text-4xl md:text-5xl lg:text-6xl'
                    )}
                >
                    {title}
                </h1>
            )}
            {subtitle && feature === 'big-title-decorative-line' ? (
                <div
                    className={twJoin(
                        'flex gap-4 items-center',
                        align === 'center' && 'justify-center'
                    )}
                >
                    <div className="w-1 h-full bg-primary-700 min-h-[3rem]"></div>
                    <p
                        className={twJoin(
                            align === 'center' ? 'max-w-2xl' : '',
                            size === 'sm' ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'
                        )}
                    >
                        {subtitle}
                    </p>
                </div>
            ) : subtitle ? (
                <p
                    className={twJoin(
                        align === 'center' ? 'max-w-2xl mx-auto' : '',
                        size === 'sm' ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'
                    )}
                >
                    {subtitle}
                </p>
            ) : null}
            {statsData?.length > 0 && <StatsBlock statsData={statsData} />}
            <div
                className={twJoin(
                    'flex flex-wrap items-center gap-4 pt-6',
                    align === 'center' ? 'justify-center' : '',
                    align === 'right' ? 'justify-end' : ''
                )}
            >
                {links.map((link, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(link.href)}
                        type="button"
                        className={twJoin(
                            'inline-flex items-center justify-center gap-2 rounded-[var(--border-radius)] px-8 py-3 text-lg font-semibold transition-colors group',
                            index === 0 ? '' : 'btn-secondary border border-text-color/40' // App handles primary/secondary button styles
                        )}
                    >
                        {link.label}
                        {icons[index] && (
                            <Icon
                                {...icons[index]}
                                className={twJoin(
                                    'w-5 h-5 transition-colors',
                                    index === 0
                                        ? '[&_svg]:text-btn-text-color group-hover:bg-btn-hover-color'
                                        : '[&_svg]:text-btn-alt-text-color group-hover:bg-btn-alt-hover-color'
                                )}
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );

    const StatsBlock = ({ statsData }) => (
        <div className="flex flex-wrap gap-8 border-t border-text-color/20 pt-8 !mt-12">
            {statsData.map((stat, index) => (
                <div key={index} className="flex flex-col">
                    <p className="text-4xl font-extrabold text-heading-color">{stat.number}</p>
                    <p className="text-base font-medium tracking-wide text-text-color/80">
                        {stat.text}
                    </p>
                </div>
            ))}
        </div>
    );

    const SideExtraInfo = ({ sideExtraInfo }) => {
        const extraFor = sideExtraInfo?.for;

        if (extraFor === 'scholar') {
            const { department, university } = sideExtraInfo;

            return (
                <div className="absolute -left-6 -bottom-6 z-10 p-4 bg-text-color-0 border border-text-color/20 shadow-lg rounded-[var(--border-radius)] max-w-64">
                    <p className="flex items-center text-sm text-primary-700">
                        <span className="pb-1">&#x2022;</span>
                        <span className="ml-2 text-text-color/60 font-semibold uppercase">
                            {website.localize({
                                en: 'Affiliation',
                                fr: 'Affiliation',
                                es: 'Afiliación',
                                zh: '隶属机构',
                            })}
                        </span>
                    </p>
                    {department && (
                        <p className="text-base text-heading-color/90 font-semibold">
                            {department}
                        </p>
                    )}
                    {university && (
                        <p className="mt-1 text-sm font-medium text-text-color/80">{university}</p>
                    )}
                </div>
            );
        }

        if (extraFor === 'news') {
            const { title, link, 'new-items': newItems } = sideExtraInfo;

            return (
                <div className="bg-bg-color rounded-[var(--border-radius)] shadow-2xl p-6 space-y-4 max-w-sm w-full border border-text-color/20">
                    <div className="flex justify-between items-center">
                        <p className="text-base md:text-lg font-semibold">{title}</p>
                        {link && (
                            <Link to={link.href} className="text-sm md:text-base hover:underline">
                                {link.label}
                            </Link>
                        )}
                    </div>
                    {newItems && newItems.length > 0 && (
                        <div className="pt-4 border-t border-text-color/20 space-y-3">
                            {newItems.map((item, index) => (
                                <div key={index}>
                                    <p className="mb-1 text-xs md:text-sm font-semibold text-text-color/60">
                                        {item.date}
                                    </p>
                                    <p className="text-sm md:text-base font-medium">{item.title}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return null;
    };

    // Helper function to get avatar style classes
    const getAvatarStyleClasses = () => {
        const baseClasses = 'overflow-hidden w-full';

        switch (avatar_style) {
            case 'circle':
                return twJoin(baseClasses, 'rounded-full aspect-square');
            case 'square':
                return twJoin(baseClasses, 'rounded-[var(--border-radius)] aspect-square');
            case 'portrait':
                return twJoin(baseClasses, 'rounded-[var(--border-radius)] aspect-[3/4]');
            case 'landscape':
                return twJoin(baseClasses, 'rounded-[var(--border-radius)] aspect-[4/3]');
            case 'square_spinning':
                return twJoin(baseClasses, 'rounded-2xl aspect-square');
            default:
                return twJoin(baseClasses, 'rounded-[var(--border-radius)] aspect-square');
        }
    };

    // Helper function to get grid column classes based on avatar_size
    const getGridColClasses = () => {
        if (avatar_size === 'small') {
            return 'grid grid-cols-1 md:grid-cols-10';
        }
        return 'grid grid-cols-1 md:grid-cols-2';
    };

    // Helper function to get content and avatar column spans
    const getColSpanClasses = () => {
        if (avatar_size === 'small') {
            return {
                content: 'md:col-span-7',
                avatar: 'md:col-span-3',
            };
        }
        return {
            content: 'md:col-span-1',
            avatar: 'md:col-span-1',
        };
    };

    const sectionClasses = twJoin(
        'relative overflow-hidden bg-bg-color',
        height === 'full' && 'flex flex-col justify-center'
    );

    const extraTopPadding = height !== 'full' && isHeaderOverlay ? headerHeight : 0;

    const sectionStyle = {
        paddingTop: `${extraTopPadding + 96}px`, // 96px for py-24 (6rem) + extraTopPadding
        paddingBottom: '96px', // 96px for py-24 (6rem),
        minHeight:
            height === 'full'
                ? isHeaderOverlay
                    ? '100vh'
                    : `calc(100vh - ${headerHeight}px)`
                : 'auto',
    };

    let content;

    switch (variant) {
        case 'content-avatar':
            const colSpans = getColSpanClasses();
            const contentOrder =
                avatar_placement === 'left' ? 'order-2 md:order-2' : 'order-2 md:order-1';
            const avatarOrder =
                avatar_placement === 'left' ? 'order-1 md:order-1' : 'order-1 md:order-2';
            const avatarJustify =
                avatar_placement === 'left'
                    ? 'justify-center md:justify-start'
                    : 'justify-center md:justify-end';

            content = (
                <div
                    className={twJoin(
                        'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
                        height === 'full' ? 'h-full flex items-center' : ''
                    )}
                >
                    {backgroundImage && (
                        <div className="absolute inset-0">
                            <Image
                                profile={getPageProfile()}
                                {...backgroundImage}
                                className="w-full h-full object-cover opacity-75"
                            />
                        </div>
                    )}

                    <div
                        className={twJoin(
                            'relative z-10',
                            getGridColClasses(),
                            'gap-12 items-center'
                        )}
                    >
                        {/* Content Block */}
                        <div className={twJoin('space-y-8', contentOrder, colSpans.content)}>
                            <ContentBlock
                                eyebrow={eyebrow}
                                title={title}
                                subtitle={subtitle}
                                links={links}
                                icons={icons}
                                statsData={statsData}
                                size={'lg'}
                            />
                        </div>

                        {/* Avatar/Side Content */}
                        <div
                            className={twJoin(
                                'flex relative',
                                avatarJustify,
                                avatarOrder,
                                colSpans.avatar
                            )}
                        >
                            {sidePicture && (
                                <div
                                    className={twJoin(
                                        'relative',
                                        sideExtraInfo?.for === 'scholar' ? 'py-6' : '',
                                        avatar_style === 'square_spinning' ? 'group' : '',
                                        avatar_size === 'small' ? 'max-w-xs' : 'max-w-md'
                                    )}
                                >
                                    {avatar_style === 'square_spinning' && (
                                        <div className="absolute inset-0 bg-blue-900 rounded-2xl rotate-3 opacity-10 group-hover:rotate-6 transition-transform duration-500"></div>
                                    )}
                                    <div className={getAvatarStyleClasses()}>
                                        <Image
                                            profile={getPageProfile()}
                                            {...sidePicture}
                                            className={twJoin(
                                                'w-full h-full object-cover',
                                                avatar_style === 'square_spinning' &&
                                                    'group-hover:scale-105 transition-transform duration-500'
                                            )}
                                        />
                                    </div>
                                    {avatar_gradient && !sideExtraInfo && (
                                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-bg-color to-transparent" />
                                    )}
                                    {sideExtraInfo?.for === 'scholar' && (
                                        <SideExtraInfo sideExtraInfo={sideExtraInfo} />
                                    )}
                                </div>
                            )}
                            {sideExtraInfo?.for === 'news' && (
                                <SideExtraInfo sideExtraInfo={sideExtraInfo} />
                            )}
                        </div>
                    </div>
                </div>
            );
            break;

        case 'big-card':
            content = (
                <div
                    className={twJoin(
                        'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
                        height === 'full' ? 'h-full' : ''
                    )}
                >
                    {/* The Card */}
                    <div
                        className={twJoin(
                            'relative z-10 w-full rounded-[var(--border-radius)] shadow-2xl overflow-hidden'
                        )}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 items-center">
                            {/* Left Side: Content */}
                            <div
                                className={twJoin(
                                    'p-8 md:p-12 bg-primary-700',
                                    sidePicture
                                        ? 'cols-span-1 lg:col-span-2'
                                        : 'cols-span-1 lg:col-span-3',
                                    big_card_bg_gradient
                                        ? content_alignment === 'left'
                                            ? 'bg-gradient-to-r from-primary-700 to-primary-950'
                                            : content_alignment === 'right'
                                            ? 'bg-gradient-to-l from-primary-700 to-primary-950'
                                            : content_alignment === 'center' &&
                                              'bg-gradient-to-r from-primary-950 via-primary-700 to-primary-950'
                                        : ''
                                )}
                            >
                                <ContentBlock
                                    eyebrow={eyebrow}
                                    title={title}
                                    subtitle={subtitle}
                                    links={links}
                                    icons={icons}
                                    align={content_alignment}
                                    size={'sm'}
                                    className={
                                        content_alignment === 'center' ? 'max-w-4xl mx-auto' : ''
                                    }
                                />
                            </div>
                            {/* Right Side: Gradient Overlay */}
                            {/* {big_card_bg_gradient && (
                                <div
                                    className={twJoin(
                                        'absolute inset-0 z-20',
                                        content_alignment === 'left' &&
                                            'bg-gradient-to-r from-primary-700 to-primary-950',
                                        content_alignment === 'right' &&
                                            'bg-gradient-to-l from-primary-700 to-primary-950',
                                        content_alignment === 'center' &&
                                            'bg-gradient-to-b from-primary-950 via-primary-700 to-primary-950'
                                    )}
                                />
                            )} */}
                            {/* Right Side: Image */}
                            {sidePicture && (
                                <div className="relative w-full h-full min-h-[300px] hidden lg:block">
                                    <Image
                                        profile={getPageProfile()}
                                        {...sidePicture}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 z-10 bg-primary-950/50" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
            break;

        case 'content-only':
            content = (
                <div
                    className={twJoin(
                        'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
                        height === 'full' ? 'h-full flex items-center justify-center' : ''
                    )}
                >
                    {backgroundImage && (
                        <div className="absolute inset-0">
                            <Image
                                profile={getPageProfile()}
                                {...backgroundImage}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-bg-color/90"></div>
                        </div>
                    )}
                    <div
                        className={twJoin(
                            'relative z-20 space-y-8'
                            // content_alignment === 'left' && 'text-left',
                            // content_alignment === 'center' && 'max-w-4xl mx-auto'
                            // content_alignment === 'right' && 'text-right'
                        )}
                    >
                        {/* Main Content */}
                        <ContentBlock
                            eyebrow={eyebrow}
                            title={title}
                            subtitle={subtitle}
                            links={links}
                            icons={icons}
                            align={content_alignment}
                            size={'md'}
                            feature={content_feature}
                            className={content_alignment === 'center' ? 'max-w-4xl mx-auto' : ''}
                        />
                    </div>
                </div>
            );
            break;
    }

    return (
        <section className={sectionClasses} style={sectionStyle}>
            {content}
        </section>
    );
}
