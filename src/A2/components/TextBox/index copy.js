import React, { useState } from 'react';
import {
    LuMaximize as Maximize,
    LuMinimize as Minimize,
    LuArrowRight as ArrowRight,
    LuType as Type,
    LuImage as ImageIcon,
    LuMoveVertical as MoveVertical,
    LuMousePointer2 as MousePointer2,
} from 'react-icons/lu';

/**
 * ContentBlock V9
 * * A universal content section that adapts to any layout.
 * * * FIXES:
 * - Smart Spacing: Fixed issue where "Bottom" media position had zero gap in Contained mode.
 * - Added logic to apply gaps vertically when needed, and handle padding correctly in vertical Edge-to-Edge layouts.
 */
const ContentBlock = ({
    // Content
    kicker,
    title,
    subhead,
    media,
    ctaText,

    // Layout Strategy
    mediaPosition = 'left', // 'top', 'bottom', 'left', 'right', 'background'
    layoutMode = 'contained', // 'edge-to-edge' | 'contained'

    // Spacing & Sizing
    density = 'normal', // 'compact', 'normal', 'spacious'
    textWidth = 'standard', // 'narrow', 'standard', 'wide'

    // Typography & Styling
    textScale = 'medium', // 'small', 'medium', 'large', 'xl'
    fontProfile = 'clean', // 'clean', 'elegant', 'technical'
    ctaStyle = 'soft', // 'sharp', 'soft', 'round'

    // Media Styling
    mediaWidth = 'half', // 'third', 'half', 'wide' (For horizontal layouts)
    mediaAspect = 'video', // 'auto', 'square', 'video', 'portrait'
    mediaFit = 'cover', // 'cover' | 'contain'
    cornerRadius = 'medium', // 'none', 'small', 'medium', 'large'

    // Text Styling
    align = 'left', // 'left', 'center', 'right'
    kickerStyle = 'standard', // 'standard' | 'pill' | 'highlight'
    theme = 'light',
    intent = 'block', // 'hero', 'block', 'card'

    className = '',
}) => {
    // --- Theme Logic ---
    const themes = {
        light: {
            wrapper: 'bg-white text-slate-900',
            kickerStandard: 'text-blue-600',
            kickerPill: 'bg-blue-100 text-blue-700',
            kickerHighlight: 'text-blue-600 border-l-4 border-blue-600 pl-3',
            title: 'text-slate-900',
            subhead: 'text-slate-600',
            cta: 'bg-slate-900 text-white hover:bg-slate-800',
            border: 'border-slate-200',
        },
        dark: {
            wrapper: 'bg-slate-900 text-white',
            kickerStandard: 'text-blue-400',
            kickerPill: 'bg-blue-900/50 text-blue-200 border border-blue-800',
            kickerHighlight: 'text-blue-400 border-l-4 border-blue-500 pl-3',
            title: 'text-white',
            subhead: 'text-slate-400',
            cta: 'bg-white text-slate-900 hover:bg-slate-100',
            border: 'border-slate-800',
        },
        brand: {
            wrapper: 'bg-blue-600 text-white',
            kickerStandard: 'text-blue-200',
            kickerPill: 'bg-white/10 text-white border border-white/20',
            kickerHighlight: 'text-white border-l-4 border-white pl-3',
            title: 'text-white',
            subhead: 'text-blue-100',
            cta: 'bg-white text-blue-600 hover:bg-blue-50',
            border: 'border-blue-500',
        },
    };
    const t = themes[theme] || themes.light;

    // --- Layout Helper Logic ---
    const isHorizontal = ['left', 'right'].includes(mediaPosition);
    const isOverlay = mediaPosition === 'background';
    const isEdgeToEdge = layoutMode === 'edge-to-edge';

    // --- Density Configuration ---
    const densityConfig = {
        compact: {
            py: 'py-8 md:py-12',
            gap: 'gap-6 md:gap-8',
            textPad: 'p-6 md:p-10',
            stackSpace: 'space-y-3',
        },
        normal: {
            py: 'py-12 md:py-20',
            gap: 'gap-8 md:gap-16',
            textPad: 'p-8 md:p-16',
            stackSpace: 'space-y-5',
        },
        spacious: {
            py: 'py-20 md:py-32',
            gap: 'gap-12 md:gap-24',
            textPad: 'p-12 md:p-24',
            stackSpace: 'space-y-8',
        },
    };
    const d = densityConfig[density] || densityConfig.normal;

    // --- Text Scale Logic ---
    const scaleConfig = {
        small: {
            title: 'text-xl md:text-2xl',
            sub: 'text-sm md:text-base',
        },
        medium: {
            title: 'text-3xl md:text-4xl',
            sub: 'text-lg md:text-xl',
        },
        large: {
            title: 'text-4xl md:text-6xl',
            sub: 'text-xl md:text-2xl',
        },
        xl: {
            title: 'text-5xl md:text-7xl',
            sub: 'text-2xl md:text-3xl',
        },
    };
    const s = scaleConfig[textScale] || scaleConfig.medium;

    // --- Font Profile Logic ---
    const fontConfig = {
        clean: {
            title: 'font-sans font-bold tracking-tight',
            sub: 'font-sans font-normal',
            kicker: 'font-sans',
            cta: 'font-sans font-medium',
        },
        elegant: {
            title: 'font-serif font-medium tracking-normal',
            sub: 'font-sans font-light italic',
            kicker: 'font-sans tracking-[0.2em]',
            cta: 'font-sans uppercase tracking-wider text-xs font-bold',
        },
        technical: {
            title: 'font-mono font-bold tracking-tighter uppercase',
            sub: 'font-mono text-opacity-80',
            kicker: 'font-mono lowercase',
            cta: 'font-mono uppercase tracking-widest text-xs',
        },
    };
    const f = fontConfig[fontProfile] || fontConfig.clean;

    // --- CTA Style Logic ---
    const ctaRadius = {
        sharp: 'rounded-none',
        soft: 'rounded-lg',
        round: 'rounded-full',
    }[ctaStyle];

    // --- Text Width Configuration ---
    const textWidthConfig = {
        narrow: 'max-w-sm',
        standard: 'max-w-lg',
        wide: 'max-w-2xl',
    };
    const maxTextClass = textWidthConfig[textWidth] || textWidthConfig.standard;

    // Aspect Ratios
    const aspectClasses = {
        auto: 'aspect-auto',
        square: 'aspect-square',
        video: 'aspect-video',
        portrait: 'aspect-[3/4]',
    };

    // Radius
    const radiusClasses = {
        none: 'rounded-none',
        small: 'rounded-sm',
        medium: 'rounded-xl',
        large: 'rounded-[2rem]',
    };

    // Container Width Logic
    // V9 Update: Vertical layouts in Contained mode should basically act like normal blocks,
    // but if Edge-to-Edge, they fill the screen.
    const containerClass = isEdgeToEdge
        ? 'w-full h-full'
        : `max-w-7xl mx-auto px-4 md:px-6 ${d.py}`;

    // --- Kicker Style Helper ---
    const getKickerClass = () => {
        const base = `text-xs uppercase tracking-widest inline-block mb-1 ${f.kicker}`;
        switch (kickerStyle) {
            case 'pill':
                return `${base} px-3 py-1 rounded-full text-[10px] tracking-wider ${t.kickerPill}`;
            case 'highlight':
                return `${base} tracking-wider ${t.kickerHighlight}`;
            default: // standard
                return `${base} font-bold ${t.kickerStandard}`;
        }
    };

    // --- CSS Container Query Injection ---
    const css = `
    .content-block-root {
      container-type: inline-size;
      container-name: cblock;
    }
    @container cblock (max-width: 700px) {
      .responsive-flex { flex-direction: column !important; }
      .responsive-flex-reverse { flex-direction: column-reverse !important; }
      .responsive-media { width: 100% !important; min-height: 0 !important; }
      
      /* Force gap on mobile to prevent touching */
      .responsive-gap { gap: 2rem !important; } 
    }
  `;

    // --- Dynamic Layout Classes ---
    let flexDir = 'flex-col';
    if (media && mediaPosition === 'left') flexDir = 'flex-row responsive-flex';
    if (media && mediaPosition === 'right') flexDir = 'flex-row-reverse responsive-flex-reverse';
    if (media && mediaPosition === 'bottom') flexDir = 'flex-col-reverse'; // Bottom = media is second child, reversed to bottom

    // Text Alignment
    const alignClass = {
        left: 'text-left items-start',
        center: 'text-center items-center mx-auto',
        right: 'text-right items-end ml-auto',
    }[align];

    // --- Spacing Logic V9 (Smart Spacing) ---
    // When do we apply the semantic gap?
    // 1. Always in 'contained' mode (fixes the vertical button touching issue).
    // 2. In 'edge-to-edge' mode, usually only when horizontal (because we use textPad for internal spacing).
    // But on mobile, we always want a gap.
    const spacingClass = !isEdgeToEdge || (isHorizontal && media) ? d.gap : 'gap-0';

    // When do we apply internal text padding?
    // 1. Edge-to-Edge layouts (both horizontal and vertical need it to avoid hitting screen edges).
    // 2. Overlay mode.
    // 3. Contained mode usually relies on container padding, BUT if we are in 'card' intent, we might want internal padding?
    //    For now, keeping it simple: Edge-to-Edge needs structure.
    const shouldApplyTextPad = isEdgeToEdge || isOverlay || (intent === 'card' && !isEdgeToEdge);

    // --- Render Helpers ---
    const renderMedia = () => {
        if (!media) return null;

        const widthClass = isHorizontal
            ? mediaWidth === 'third'
                ? 'w-1/3'
                : mediaWidth === 'wide'
                ? 'w-2/3'
                : 'w-1/2'
            : 'w-full';

        const effectiveRadius =
            !isEdgeToEdge || intent === 'card' ? radiusClasses[cornerRadius] : 'rounded-none';

        const isFixedAspect = mediaAspect !== 'auto';
        const useAbsoluteLayout = isHorizontal && isFixedAspect;

        const imgClass = `transition-transform duration-700 hover:scale-105 ${
            mediaFit === 'contain' ? 'object-contain bg-slate-50' : 'object-cover'
        } ${useAbsoluteLayout ? 'absolute inset-0 w-full h-full' : 'w-full h-full'}`;

        return (
            <div
                className={`media-pane relative shrink-0 overflow-hidden ${widthClass} ${aspectClasses[mediaAspect]} ${effectiveRadius} responsive-media`}
            >
                <img src={media} alt="Visual" className={imgClass} />
            </div>
        );
    };

    return (
        <>
            <style>{css}</style>

            <div
                className={`content-block-root w-full relative transition-all duration-300 ${
                    t.wrapper
                } ${className} ${
                    intent === 'card'
                        ? `border ${t.border} ${radiusClasses[cornerRadius]} overflow-hidden`
                        : ''
                }`}
            >
                {/* Background Overlay Mode */}
                {isOverlay && media && (
                    <div className="absolute inset-0 z-0">
                        <img src={media} alt="" className="w-full h-full object-cover" />
                        <div
                            className={`absolute inset-0 bg-gradient-to-t ${
                                theme === 'dark'
                                    ? 'from-slate-900 via-slate-900/60'
                                    : 'from-white via-white/80'
                            } to-transparent`}
                        />
                    </div>
                )}

                {/* Main Content Layout */}
                <div
                    className={`
          relative z-10 flex h-full
          ${containerClass}
          ${flexDir}
          ${spacingClass}
          responsive-gap
        `}
                >
                    {!isOverlay && renderMedia()}

                    {/* Text Content */}
                    <div
                        className={`
            flex flex-col justify-center flex-1 
            ${alignClass}
            ${shouldApplyTextPad ? d.textPad : ''}
            responsive-text
          `}
                    >
                        <div className={`${d.stackSpace} w-full ${maxTextClass}`}>
                            {kicker && <div className={getKickerClass()}>{kicker}</div>}

                            <h2
                                className={`leading-[1.1] ${t.title} ${s.title} ${f.title} text-balance`}
                            >
                                {title}
                            </h2>

                            {subhead && (
                                <p
                                    className={`leading-relaxed text-pretty ${t.subhead} ${s.sub} ${f.sub}`}
                                >
                                    {subhead}
                                </p>
                            )}

                            {ctaText && (
                                <div className="pt-4">
                                    <button
                                        className={`px-6 py-3 transition-all flex items-center gap-2 ${t.cta} ${ctaRadius} ${f.cta}`}
                                    >
                                        {ctaText} <ArrowRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

/**
 * Playground App
 */
export default function App() {
    const [settings, setSettings] = useState({
        kicker: 'Typography',
        title: 'The right font changes everything',
        subhead:
            "We've added semantic controls for 'Text Scale' and 'Font Profile'. This lets you change the voice of the content without writing custom CSS.",
        ctaText: 'See styles',
        media: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop',

        // Core Layout
        mediaPosition: 'bottom', // Changed default to 'bottom' to verify fix
        layoutMode: 'contained',
        align: 'left',

        // Spacing & Sizing
        density: 'normal',
        textWidth: 'standard',

        // Typography & Buttons
        textScale: 'medium',
        fontProfile: 'clean',
        ctaStyle: 'soft',

        // Styling
        mediaAspect: 'auto',
        cornerRadius: 'medium',
        theme: 'light',
        kickerStyle: 'standard',
        intent: 'block',
    });

    const update = (k, v) => setSettings((p) => ({ ...p, [k]: v }));

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
            {/* Sidebar Controls */}
            <aside className="w-full md:w-80 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 shadow-sm h-screen sticky top-0 overflow-y-auto z-20">
                <div>
                    <h1 className="text-lg font-bold text-slate-900 mb-1">Universal Block</h1>
                    <p className="text-xs text-slate-500">One component, infinite layouts.</p>
                </div>

                {/* Layout Mode */}
                <div>
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        Layout Strategy
                    </h2>
                    <div className="flex bg-slate-100 p-1 rounded-lg mb-4">
                        <button
                            onClick={() => update('layoutMode', 'contained')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-xs ${
                                settings.layoutMode === 'contained'
                                    ? 'bg-white shadow text-blue-600 font-bold'
                                    : 'text-slate-500'
                            }`}
                        >
                            <Minimize size={14} /> Contained
                        </button>
                        <button
                            onClick={() => update('layoutMode', 'edge-to-edge')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-xs ${
                                settings.layoutMode === 'edge-to-edge'
                                    ? 'bg-white shadow text-blue-600 font-bold'
                                    : 'text-slate-500'
                            }`}
                        >
                            <Maximize size={14} /> Full Width
                        </button>
                    </div>

                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Media Position
                    </label>
                    <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg mb-4">
                        {['top', 'bottom', 'left', 'right', 'background'].map((pos) => (
                            <button
                                key={pos}
                                onClick={() => update('mediaPosition', pos)}
                                className={`capitalize text-[10px] py-1.5 rounded-md transition-all ${
                                    settings.mediaPosition === pos
                                        ? 'bg-white shadow text-blue-600 font-bold'
                                        : 'text-slate-500'
                                }`}
                            >
                                {pos}
                            </button>
                        ))}
                    </div>
                </div>

                {/* SPACING & DENSITY */}
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <MoveVertical size={14} /> Spacing & Density
                    </h2>

                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Breathability (Density)
                    </label>
                    <div className="flex bg-white p-1 rounded-lg border border-blue-100 mb-4 shadow-sm">
                        {['compact', 'normal', 'spacious'].map((d) => (
                            <button
                                key={d}
                                onClick={() => update('density', d)}
                                className={`flex-1 capitalize text-[10px] py-1.5 rounded-md transition-all ${
                                    settings.density === d
                                        ? 'bg-blue-100 text-blue-700 font-bold'
                                        : 'text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>

                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Text Column Width
                    </label>
                    <div className="flex bg-white p-1 rounded-lg border border-blue-100 shadow-sm">
                        {['narrow', 'standard', 'wide'].map((w) => (
                            <button
                                key={w}
                                onClick={() => update('textWidth', w)}
                                className={`flex-1 capitalize text-[10px] py-1.5 rounded-md transition-all ${
                                    settings.textWidth === w
                                        ? 'bg-blue-100 text-blue-700 font-bold'
                                        : 'text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                {w}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TYPOGRAPHY */}
                <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                    <h2 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Type size={14} /> Typography
                    </h2>

                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Text Scale
                    </label>
                    <div className="flex bg-white p-1 rounded-lg border border-purple-100 mb-4 shadow-sm">
                        {['small', 'medium', 'large', 'xl'].map((s) => (
                            <button
                                key={s}
                                onClick={() => update('textScale', s)}
                                className={`flex-1 capitalize text-[10px] py-1.5 rounded-md transition-all ${
                                    settings.textScale === s
                                        ? 'bg-purple-100 text-purple-700 font-bold'
                                        : 'text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Font Profile (Vibe)
                    </label>
                    <div className="flex bg-white p-1 rounded-lg border border-purple-100 mb-4 shadow-sm">
                        {['clean', 'elegant', 'technical'].map((f) => (
                            <button
                                key={f}
                                onClick={() => update('fontProfile', f)}
                                className={`flex-1 capitalize text-[10px] py-1.5 rounded-md transition-all ${
                                    settings.fontProfile === f
                                        ? 'bg-purple-100 text-purple-700 font-bold'
                                        : 'text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CTA STYLE */}
                <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                    <h2 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <MousePointer2 size={14} /> Button Style
                    </h2>

                    <div className="flex bg-white p-1 rounded-lg border border-orange-100 shadow-sm">
                        {['sharp', 'soft', 'round'].map((s) => (
                            <button
                                key={s}
                                onClick={() => update('ctaStyle', s)}
                                className={`flex-1 capitalize text-[10px] py-1.5 rounded-md transition-all ${
                                    settings.ctaStyle === s
                                        ? 'bg-orange-100 text-orange-700 font-bold'
                                        : 'text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Media Details */}
                <div>
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <ImageIcon size={14} /> Media Styling
                    </h2>

                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Aspect Ratio
                    </label>
                    <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg mb-4">
                        {['auto', 'square', 'video', 'portrait'].map((ar) => (
                            <button
                                key={ar}
                                onClick={() => update('mediaAspect', ar)}
                                className={`capitalize text-[10px] py-1.5 rounded-md transition-all ${
                                    settings.mediaAspect === ar
                                        ? 'bg-white shadow text-blue-600 font-bold'
                                        : 'text-slate-500'
                                }`}
                            >
                                {ar}
                            </button>
                        ))}
                    </div>

                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Corner Radius
                    </label>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        {['none', 'medium', 'large'].map((r) => (
                            <button
                                key={r}
                                onClick={() => update('cornerRadius', r)}
                                className={`flex-1 capitalize text-[10px] py-1.5 rounded-md transition-all ${
                                    settings.cornerRadius === r
                                        ? 'bg-white shadow text-blue-600 font-bold'
                                        : 'text-slate-500'
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Theme */}
                <div>
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        Theme
                    </h2>
                    <div className="flex gap-2">
                        {['light', 'dark', 'brand'].map((t) => (
                            <button
                                key={t}
                                onClick={() => update('theme', t)}
                                className={`h-8 flex-1 rounded border capitalize text-xs ${
                                    settings.theme === t
                                        ? 'border-blue-500 ring-1 ring-blue-500'
                                        : 'border-slate-200'
                                } ${
                                    t === 'light'
                                        ? 'bg-white'
                                        : t === 'dark'
                                        ? 'bg-slate-800 text-white'
                                        : 'bg-blue-600 text-white'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Preview Area */}
            <main className="flex-1 overflow-auto bg-slate-200 p-4 md:p-12">
                <div className="max-w-7xl mx-auto space-y-16">
                    {/* Active Preview */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider">
                                Live Preview
                            </h3>
                            <span className="text-xs text-slate-400">
                                Type: {settings.fontProfile} / {settings.textScale}
                            </span>
                        </div>

                        {/* The Component Rendered */}
                        <div className="bg-white shadow-xl rounded-xl overflow-hidden min-h-[400px] flex flex-col border border-slate-200">
                            <ContentBlock {...settings} />
                        </div>
                    </section>

                    {/* Gallery of Variants */}
                    <section>
                        <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider mb-6">
                            Semantic Examples
                        </h3>

                        <div className="grid grid-cols-1 gap-12">
                            {/* Example 1: Elegant Editorial */}
                            <div>
                                <span className="text-xs font-mono text-slate-400 mb-2 block flex items-center gap-2">
                                    <Type size={12} />
                                    <span>
                                        The "Editorial" Look: fontProfile="elegant" |
                                        textScale="large"
                                    </span>
                                </span>
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                                    <ContentBlock
                                        layoutMode="contained"
                                        mediaPosition="right"
                                        mediaAspect="portrait"
                                        cornerRadius="none"
                                        density="spacious"
                                        textWidth="standard"
                                        fontProfile="elegant"
                                        textScale="large"
                                        ctaStyle="sharp"
                                        kicker="The Collection"
                                        kickerStyle="standard"
                                        title="A Return to Classics"
                                        subhead="Note the serif headlines, the lighter italic subheads, and the sharp buttons. This feels high-end fashion, not SaaS."
                                        media="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop"
                                        ctaText="View Lookbook"
                                    />
                                </div>
                            </div>

                            {/* Example 2: Technical SaaS */}
                            <div>
                                <span className="text-xs font-mono text-slate-400 mb-2 block flex items-center gap-2">
                                    <Minimize size={12} />
                                    <span>
                                        The "Developer" Look: fontProfile="technical" |
                                        ctaStyle="sharp"
                                    </span>
                                </span>
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 max-w-2xl">
                                    <ContentBlock
                                        layoutMode="contained"
                                        mediaPosition="left"
                                        mediaAspect="square"
                                        mediaWidth="third"
                                        cornerRadius="small"
                                        density="compact"
                                        textWidth="wide"
                                        fontProfile="technical"
                                        textScale="small"
                                        ctaStyle="sharp"
                                        align="left"
                                        kicker="v2.0.0-beta"
                                        kickerStyle="highlight"
                                        title="API Reference"
                                        subhead="Monospaced headers, uppercase buttons, and tight tracking create a technical documentation feel instantly."
                                        media="https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2000&auto=format&fit=crop"
                                        ctaText="Read Docs"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
