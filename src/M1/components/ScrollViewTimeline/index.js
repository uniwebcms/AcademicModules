import React, { useEffect, useRef, useState } from 'react';
import { getPageProfile } from '@uniwebcms/module-sdk';
import { SafeHtml } from '@uniwebcms/core-components';

// Extract YouTube video ID from URL
function getYouTubeVideoId(url) {
    const match = url.match(/(?:embed\/|v=|\/v\/|youtu\.be\/|\/embed\/)([^?&"'>]+)/);
    return match ? match[1] : null;
}

function getPosterFromYouTube(videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function getPosterFromImg(image) {
    const { value, url } = image;

    if (url) return url;

    if (value) {
        return getPageProfile().getAssetInfo(value)?.src;
    }
}

const parseBlockItems = (items) => {
    const gradientPresets = {
        green: 'from-green-500 to-green-700',
        blue: 'from-blue-500 to-blue-700',
        red: 'from-red-500 to-red-700',
        purple: 'from-purple-500 to-purple-700',
        yellow: 'from-yellow-500 to-yellow-700',
        gray: 'from-gray-500 to-gray-700',
        pink: 'from-pink-500 to-pink-700',
        indigo: 'from-indigo-500 to-indigo-700',
        teal: 'from-teal-500 to-teal-700',
        orange: 'from-orange-500 to-orange-700',
        cyan: 'from-cyan-500 to-cyan-700',
        lime: 'from-lime-500 to-lime-700',
        amber: 'from-amber-500 to-amber-700',
        emerald: 'from-emerald-500 to-emerald-700',
        rose: 'from-rose-500 to-rose-700',
        sky: 'from-sky-500 to-sky-700',
        fuchsia: 'from-fuchsia-500 to-fuchsia-700',
        violet: 'from-violet-500 to-violet-700',
        slate: 'from-slate-500 to-slate-700',
        zinc: 'from-zinc-500 to-zinc-700',
        stone: 'from-stone-500 to-stone-700',
    };
    return items.map((item) => {
        const { title, subtitle, paragraphs, videos, images, forms, properties } = item;

        const form = forms[0];

        const result = {
            title,
            subtitle,
            paragraphs,
        };

        const video = videos[0];
        const image = images[0];
        const bgColorTone = form ? form.bgColorTone : null;

        if (video) {
            if (video.src.startsWith('https://www.youtube')) {
                result.type = 'youtube';
                result.src = video.src;
                result.poster = getPosterFromYouTube(getYouTubeVideoId(video.src));
            } else if (video.src.endsWith('.mp4')) {
                result.type = 'video';
                result.src = video.src;
                if (image) {
                    result.poster = getPosterFromImg(image);
                }
            }
        }

        if (bgColorTone) {
            result.bgGradient = gradientPresets[bgColorTone] || '';
        }

        return result;
    });
};

export default function ScrollViewTimeline(props) {
    const { block } = props;
    const items = block.getBlockItems();
    const sections = parseBlockItems(items);

    const { text_shadow = false } = block.getBlockProperties();

    const frameRef = useRef(null);
    const firstSectionRef = useRef(null);
    const lastSectionRef = useRef(null);
    const [timelineInset, setTimelineInset] = useState('35% 35%');
    const [loaded, setLoaded] = useState(sections.map(() => false));
    const [videoOffset, setVideoOffset] = useState(0);

    // Calculate video frame inset
    useEffect(() => {
        const updateInset = () => {
            const el = frameRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight || 1;
            const topPct = (rect.top / vh) * 100;
            const botPct = ((vh - rect.bottom) / vh) * 100;
            setTimelineInset(`${topPct.toFixed(2)}% ${botPct.toFixed(2)}%`);
        };
        updateInset();
        window.addEventListener('resize', updateInset);
        return () => window.removeEventListener('resize', updateInset);
    }, []);

    // Track first and last section positions and adjust video frame
    useEffect(() => {
        const handleScroll = () => {
            const vh = window.innerHeight;
            let offset = 0;

            // Handle first section - video stays below viewport until section scrolls in
            if (firstSectionRef.current) {
                const firstRect = firstSectionRef.current.getBoundingClientRect();
                const firstSectionHeight = firstRect.height;
                const videoHeight = frameRef.current?.offsetHeight || 0;

                const triggerPoint = firstSectionHeight / 2 - videoHeight / 2;
                const scrolledIn = vh - firstRect.top;

                // When first section is completely below viewport or moved in a bit (less than trigger point)
                if (firstRect.top >= vh || scrolledIn < triggerPoint) {
                    // Keep video below viewport
                    setVideoOffset(-vh);
                    return;
                }

                // When first section is entering viewport and past trigger point
                if (scrolledIn >= triggerPoint) {
                    const videoMovement = scrolledIn - triggerPoint;
                    const offset = Math.min(0, -1 * (0.5 * vh - videoMovement + 0.5 * videoHeight));
                    // const offset = -1 * (0.5 * vh - videoMovement + 0.5 * videoHeight);

                    setVideoOffset(offset);

                    if (offset < 0) {
                        return;
                    }
                }
            }

            // Handle last section - video moves up with it
            if (lastSectionRef.current) {
                const lastRect = lastSectionRef.current.getBoundingClientRect();

                // When last section's top is below viewport, video stays centered (offset = 0)
                if (lastRect.top >= vh) {
                    setVideoOffset(0);
                    return;
                }

                // When last section is entering/in viewport
                // Calculate how much the section has moved up past the viewport top
                if (lastRect.top < vh) {
                    const scrolledAmount = vh - lastRect.top;
                    // Only start moving video when section has scrolled up past viewport
                    offset = Math.max(0, scrolledAmount - vh);
                    setVideoOffset(offset);
                    return;
                }
            }

            // Default centered position
            setVideoOffset(0);
        };

        handleScroll(); // Initial calculation
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fallback for browsers without view-timeline
    useEffect(() => {
        if (CSS.supports('animation-timeline', 'view()')) return;

        const updateClipPath = () => {
            const sectionsEls = document.querySelectorAll('.experience-section');
            sectionsEls.forEach((section, i) => {
                const layer = document.querySelector(`.video-layer:nth-child(${i + 1})`);
                if (!layer || i === sections.length - 1) return;
                const rect = section.getBoundingClientRect();
                const vh = window.innerHeight;
                const progress = Math.max(0, Math.min(1, (vh - rect.top) / vh));
                layer.style.clipPath = `inset(0 0 ${progress * 100}% 0)`;

                // layer.style.clipPath =
                //     wipeDirection === 'bottom'
                //         ? `inset(0 0 ${progress * 100}% 0)`
                //         : `inset(0 ${progress * 100}% 0 0)`;
            });
        };

        window.addEventListener('scroll', updateClipPath);
        return () => window.removeEventListener('scroll', updateClipPath);
    }, [sections]);

    // Track video/iframe loading
    const handleLoaded = (index) => {
        setLoaded((prev) => {
            const newLoaded = [...prev];
            newLoaded[index] = true;
            return newLoaded;
        });
    };

    // Dynamic timeline scope and animation bindings
    const timelineScope = sections.map((_, i) => `--section-${i}`).join(', ');
    const scopeStyle = { timelineScope };
    const animationBindings = sections
        .map((_, i) =>
            i < sections.length - 1
                ? `.video-layer:nth-child(${i + 1}) { animation-timeline: --section-${i + 1}; }`
                : `.video-layer:nth-child(${i + 1}) { animation-timeline: none; }`
        )
        .join('\n');

    return (
        <>
            <style>{animationBindings}</style>
            <div className="scroll-clip-container relative" style={scopeStyle}>
                {/* Video frame - Fixed position on the right side */}
                <div
                    ref={frameRef}
                    className="video-frame fixed left-full md:left-[70%] lg:left-[60%] xl:left-[55%] z-20 w-full max-w-3xl -translate-y-1/2 overflow-hidden shadow-2xl aspect-video"
                    style={{
                        // backgroundColor: 'rgb(var(--neutral-900))',
                        // backdropFilter: 'blur(10px)',
                        // border: '4px solid rgba(var(--neutral-900) 0.8)',
                        top: `calc(50% - ${videoOffset}px)`,
                    }}
                >
                    {sections.map((section, i) => {
                        const videoId =
                            section.type === 'youtube' ? getYouTubeVideoId(section.src) : null;
                        const youtubeEmbedUrl = videoId
                            ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1`
                            : section.src;

                        return (
                            <div
                                key={section.src}
                                className={`video-layer absolute inset-1 h-[calc(100%-8px)] w-[calc(100%-8px)] object-cover ${
                                    loaded[i] ? 'poster-loaded' : 'poster-loading'
                                }`}
                                style={{
                                    zIndex: sections.length - i,
                                    '--wipe-animation': 'wipe-out-bottom',
                                    // '--wipe-animation':
                                    //     wipeDirection === 'left'
                                    //         ? 'wipe-out-left'
                                    //         : 'wipe-out-bottom',
                                    backgroundImage: section.poster
                                        ? `url(${section.poster})`
                                        : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                {section.type === 'video' ? (
                                    <video
                                        src={section.src}
                                        poster={section.poster || undefined}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        preload="auto"
                                        onCanPlay={() => handleLoaded(i)}
                                        className="h-full w-full object-cover"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <iframe
                                        src={youtubeEmbedUrl}
                                        loading="lazy"
                                        allow="autoplay; fullscreen"
                                        className="h-full w-full"
                                        title={section.title}
                                        onLoad={() => handleLoaded(i)}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Sections - Text content on the left side */}
                <main className="relative z-10">
                    {sections.map((section, i) => (
                        <section
                            ref={
                                i === 0
                                    ? firstSectionRef
                                    : i === sections.length - 1
                                    ? lastSectionRef
                                    : null
                            }
                            // ref={i === sections.length - 1 ? lastSectionRef : null}
                            key={section.src}
                            className={`experience-section flex flex-col justify-center p-8 lg:p-16 pr-8 md:pr-[35%] lg:pr-[45%] xl:pr-[55%] bg-gradient-to-b ${
                                section.bgGradient
                            } ${
                                i === 0
                                    ? 'min-h-[calc(100vh-80px)] md:pb-28 lg:pb-36'
                                    : 'min-h-screen'
                            } ${
                                text_shadow
                                    ? '[&_h2]:[text-shadow:0_1px_2px_rgba(0,0,0,0.2)] [&_p]:[text-shadow:0_1px_2px_rgba(0,0,0,0.2)]'
                                    : ''
                            }`}
                            style={{
                                viewTimelineName: `--section-${i}`,
                                viewTimelineAxis: 'block',
                                viewTimelineInset: timelineInset,
                            }}
                            role="region"
                            aria-label={`Section ${i + 1}: ${section.title}`}
                            tabIndex={0}
                        >
                            <div className="max-w-full animate-fadeIn text-left">
                                <h2 className="text-5xl font-extrabold tracking-tight">
                                    {section.title}
                                </h2>
                                {section.subtitle && (
                                    <p className="mt-6 text-xl leading-relaxed">
                                        {section.subtitle}
                                    </p>
                                )}
                                {section.paragraphs.length > 0 && (
                                    <SafeHtml
                                        value={section.paragraphs}
                                        className="mt-8 text-lg leading-relaxed"
                                    />
                                )}
                            </div>
                        </section>
                    ))}
                </main>
            </div>
        </>
    );
}
