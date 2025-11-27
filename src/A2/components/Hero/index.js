// import React, { useState, useEffect } from 'react';
// import { Link, Icon, Image } from '@uniwebcms/core-components';
// import { twJoin } from '@uniwebcms/module-sdk';

// export default function Hero(props) {
//     const { block, website, page } = props;

//     const {
//         layout = 'full-width', // 'side-by-side', 'full-width', 'centered-card'
//         height = 'auto', // 'auto', 'full'
//     } = block.getBlockProperties();

//     const {
//         banner: backgroundImage, // background image object that can pass into the Image component
//         pretitle: eyebrow,
//         title,
//         subtitle,
//         links, // array of objects with { label, href } that can pass into the Link component (to: href, children: label)
//         icons, // array of objects that can pass into the Icon component directly, placed beside each link，
//         form: statsData = [], // array of object each with stats data (key: [number, text])
//     } = block.getBlockContent();

//     const {
//         banner: picture, // picture object that can pass into the Image component, used when in 'side-by-side' or 'centered-card' layout
//         form: sideExtraInfo = {}, // object with extra information about the side content (key: [for,department,university,link:{label,href},new-items:[{title,date}]])
//     } = block.getBlockItems()?.[0] || {}; // side content

//     const [extraTopPadding, setExtraTopPadding] = useState(0);

//     // check if the header is overlaying the hero section and get the height of the header, this is the extra padding we need to add to the hero section to better center the content
//     useEffect(() => {
//         const isHeaderOverlay =
//             page.blockGroups?.header?.[0]?.getBlockProperties()?.header_placement ===
//             'overlay_hero';
//         const mainNavbar = document.querySelector('#main-navbar');
//         if (isHeaderOverlay && mainNavbar) {
//             setExtraTopPadding(mainNavbar.offsetHeight);
//         }
//     }, [page]);

//     return <section></section>;
// }

import React, { useState, useEffect } from 'react';
import { Link, Icon, Image } from '@uniwebcms/core-components';
import { twJoin, getPageProfile } from '@uniwebcms/module-sdk';

export default function Hero(props) {
    const { block, website, page } = props;

    const isHeaderOverlay =
        page.blockGroups?.header?.[0]?.getBlockProperties()?.header_placement === 'overlay_hero';

    const { useNavigate } = website.getRoutingComponents();
    const navigate = useNavigate();

    const { layout = 'full-width', height = 'auto' } = block.getBlockProperties();

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
    // const [extraTopPadding, setExtraTopPadding] = useState(0);

    // Dynamic padding for overlay header
    useEffect(() => {
        const mainNavbar = document.querySelector('#main-navbar');
        if (mainNavbar) {
            setHeaderHeight(mainNavbar.offsetHeight);
            // setExtraTopPadding(mainNavbar.offsetHeight);
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
        layout,
    }) => (
        <div
            className={twJoin('max-w-4xl space-y-6')}
            style={{
                textAlign: align,
            }}
        >
            {eyebrow && (
                <p
                    className={twJoin(
                        'border rounded-[var(--border-radius)] px-3 py-1 border-text-color/20 text-sm md:text-base font-bold uppercase tracking-wider text-[var(--callout)] bg-[color:color-mix(in_srgb,var(--callout,var(--text-color))_10%,transparent)] w-fit',
                        align === 'center' ? 'mx-auto' : ''
                    )}
                >
                    {eyebrow}
                </p>
            )}
            {title && (
                <h1
                    className={twJoin(
                        'font-extrabold',
                        size === 'lg' && 'text-6xl md:text-7xl lg:text-8xl',
                        size === 'md' && 'text-5xl md:text-6xl lg:text-7xl',
                        size === 'sm' && 'text-4xl md:text-5xl lg:text-6xl'
                    )}
                >
                    {title}
                </h1>
            )}
            {subtitle && (
                <p
                    className={twJoin(
                        align === 'center' ? 'max-w-2xl mx-auto' : '',
                        size === 'sm' ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'
                    )}
                >
                    {subtitle}
                </p>
            )}
            {statsData?.length > 0 && <StatsBlock statsData={statsData} />}
            <div
                className={twJoin(
                    'flex flex-wrap items-center gap-4 pt-6',
                    align === 'center' ? 'justify-center' : ''
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

    // Base classes for the section
    const sectionClasses = twJoin(
        'relative overflow-hidden bg-bg-color',
        height === 'full'
            ? isHeaderOverlay
                ? 'min-h-screen'
                : `min-h-[calc(100vh-${headerHeight})]`
            : '',
        height === 'full' && 'flex flex-col justify-center'
    );

    const extraTopPadding = height !== 'full' && isHeaderOverlay ? headerHeight : 0;

    // Unified padding for the section
    const sectionPaddingStyle = {
        paddingTop: `${extraTopPadding + 96}px`, // 96px for py-24 (6rem) + extraTopPadding
        paddingBottom: '96px', // 96px for py-24 (6rem)
    };

    let content;

    switch (layout) {
        case 'side-by-side':
            content = (
                <div
                    className={twJoin(
                        'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
                        height === 'full' ? 'h-full flex items-center' : ''
                    )}
                >
                    {/* Background image overlay (Chronos Initiative) */}
                    {backgroundImage && (
                        <div className="absolute inset-0">
                            <Image
                                profile={getPageProfile()}
                                {...backgroundImage}
                                className="w-full h-full object-cover opacity-75"
                            />
                        </div>
                    )}

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Left Side: Content Block */}
                        <div className="space-y-8 order-2 md:order-1">
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

                        {/* Right Side: Image and/or Extra Info Card */}
                        <div className="flex justify-center md:justify-end order-1 md:order-2 relative">
                            {sidePicture && (
                                <div
                                    className={twJoin(
                                        'relative',
                                        sideExtraInfo?.for === 'scholar'
                                            ? 'max-w-md py-6'
                                            : 'max-w-md rounded-[var(--border-radius)] overflow-hidden'
                                    )}
                                >
                                    <div
                                        className={twJoin(
                                            'overflow-hidden w-full',
                                            sideExtraInfo?.for === 'scholar'
                                                ? 'aspect-[3/4] rounded-[var(--border-radius)]'
                                                : 'aspect-[0.9]'
                                        )}
                                    >
                                        <Image
                                            profile={getPageProfile()}
                                            {...sidePicture}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {!sideExtraInfo && (
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

        case 'centered-card':
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
                            <div className="p-8 md:p-12 cols-span-1 lg:col-span-2 bg-primary-700">
                                <ContentBlock
                                    eyebrow={eyebrow}
                                    title={title}
                                    subtitle={subtitle}
                                    links={links}
                                    icons={icons}
                                    size={'sm'}
                                />
                            </div>
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

        case 'full-width':
            content = (
                <div
                    className={twJoin(
                        'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
                        height === 'full' ? 'h-full flex items-center justify-center' : ''
                    )}
                >
                    {/* Background image (Institute of Future Sciences) */}
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
                        className={twJoin('relative z-20 space-y-8 text-center mx-auto max-w-4xl')}
                    >
                        {/* Main Content */}
                        <ContentBlock
                            eyebrow={eyebrow}
                            title={title}
                            subtitle={subtitle}
                            links={links}
                            icons={icons}
                            align={'center'}
                            size={'md'}
                        />
                    </div>
                </div>
            );
            break;
    }

    return (
        <section className={sectionClasses} style={sectionPaddingStyle}>
            {content}
        </section>
    );
}
