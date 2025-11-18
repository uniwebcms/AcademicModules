import React, { useState, useEffect, useRef } from 'react';
import Container from '../_utils/Container';
import { AnimatePresence, motion } from 'framer-motion';
import {
    LuPaintbrush,
    LuLayoutGrid,
    LuBook,
    LuSearch,
    LuChartNoAxesColumn,
    LuListTodo,
    LuFolderKanban,
    LuSparkles,
    LuSmile,
    LuLayers,
    LuWrench,
    LuSquareDashed,
    LuPanelLeft,
    LuColumns2,
    LuImage,
} from 'react-icons/lu';
import { HiChevronDown } from 'react-icons/hi';
import { website } from '@uniwebcms/module-sdk';

export default function ThemeConfigDemo(props) {
    const { title, subtitle } = props.block.getBlockContent();

    return (
        <Container px="lg" className="border-y border-text-color/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="min-h-[380px]">
                    <ConfigurationVisual />
                </div>
                <div className="text-center lg:text-left lg:order-first">
                    <h2 className="text-3xl font-semibold max-w-3xl mx-auto lg:mx-0">{title}</h2>
                    <p className="text-lg leading-relaxed mt-6 max-w-3xl mx-auto lg:mx-0">
                        {subtitle}
                    </p>
                </div>
            </div>
        </Container>
    );
}

const ConfigurationVisual = () => {
    const [index, setIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false); // Track hover state
    const [userInteracted, setUserInteracted] = useState(false); // Track click interaction
    const intervalRef = useRef(null);

    // Card data
    const cards = [
        {
            icon: LuPaintbrush,
            title: website.localize({
                en: '1. Configure Branding',
                fr: '1. Configurer la marque',
                es: '1. Configurar la marca',
                zh: '1. 配置品牌',
            }),
            description: website.localize({
                en: 'Apply color palettes, fonts, and icon libraries.',
                fr: "Appliquer des palettes de couleurs, des polices et des bibliothèques d'icônes.",
                es: 'Aplicar paletas de colores, fuentes y bibliotecas de iconos.',
                zh: '应用色彩方案、字体和图标库。',
            }),
            content: (
                // --- NEW VISUAL CONTENT FOR CARD 1 ---
                <div className="space-y-5">
                    {/* Mock Color Palette */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-neutral-600">
                            {website.localize({
                                en: 'Base Colors',
                                fr: 'Couleurs de base',
                                es: 'Colores base',
                                zh: '基础色彩',
                            })}
                        </label>
                        <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-lg border border-neutral-200 bg-secondary-600"></div>
                            <div className="w-8 h-8 rounded-lg border border-neutral-200 bg-primary-500"></div>
                            <div className="w-8 h-8 rounded-lg border border-neutral-200 bg-heading-color"></div>
                            <div className="w-8 h-8 rounded-lg border border-neutral-200 bg-neutral-400"></div>
                            <div className="w-8 h-8 rounded-lg border border-neutral-200 bg-neutral-200 flex items-center justify-center">
                                <LuSparkles className="w-4 h-4 text-neutral-500" />
                            </div>
                        </div>
                    </div>

                    {/* Mock Font Selector */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-neutral-600">
                            {website.localize({
                                en: 'Typography',
                                fr: 'Typographie',
                                es: 'Tipografía',
                                zh: '排版',
                            })}
                        </label>
                        <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 p-3 rounded-lg">
                            <div>
                                <span className="text-xs text-neutral-500">
                                    {website.localize({
                                        en: 'Headings',
                                        fr: 'Titres',
                                        es: 'Encabezados',
                                        zh: '标题',
                                    })}
                                </span>
                                <p className="font-medium text-neutral-800">Geist</p>
                            </div>
                            <div>
                                <span className="text-xs text-neutral-500">
                                    {website.localize({
                                        en: 'Body',
                                        fr: 'Corps de texte',
                                        es: 'Cuerpo de texto',
                                        zh: '正文',
                                    })}
                                </span>
                                <p className="font-medium text-neutral-800">Geist</p>
                            </div>
                            <HiChevronDown className="w-5 h-5 text-neutral-400" />
                        </div>
                    </div>

                    {/* Mock Icon Selector */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-neutral-600">
                            {website.localize({
                                en: 'Icon Library',
                                fr: "Bibliothèque d'icônes",
                                es: 'Biblioteca de iconos',
                                zh: '图标库',
                            })}
                        </label>
                        <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                                <LuSmile className="w-5 h-5 text-neutral-500" />
                                <LuLayers className="w-5 h-5 text-neutral-500" />
                                <LuWrench className="w-5 h-5 text-neutral-500" />
                            </div>
                            <span className="font-medium text-neutral-800 text-sm">
                                {website.localize({
                                    en: '50,000+ Icons',
                                    fr: '50 000+ icônes',
                                    es: 'Más de 50,000 iconos',
                                    zh: '超过50,000个图标',
                                })}
                            </span>
                            <HiChevronDown className="w-5 h-5 text-neutral-400" />
                        </div>
                    </div>
                </div>
                // --- END NEW VISUAL CONTENT ---
            ),
        },
        {
            icon: LuLayoutGrid,
            title: website.localize({
                en: '2. Adjust Layout Styles',
                fr: '2. Ajuster les styles de mise en page',
                es: '2. Ajustar estilos de diseño',
                zh: '2. 调整布局样式',
            }),
            description: website.localize({
                en: 'Apply high-level layouts and section styles.',
                fr: 'Appliquer des mises en page de haut niveau et des styles de section.',
                es: 'Aplicar diseños de alto nivel y estilos de sección.',
                zh: '应用高级布局和部分样式。',
            }),
            content: (
                // --- CONTENT UPDATED ---
                <div className="space-y-5">
                    <MockSectionLayoutSelector />
                    <MockSectionStyleSelector />
                </div>
                // --- END CONTENT UPDATE ---
            ),
        },
        {
            icon: LuBook,
            title: website.localize({
                en: '3. Set Domain & Content',
                fr: '3. Définir le domaine et le contenu',
                es: '3. Establecer dominio y contenido',
                zh: '3. 设置域名和内容',
            }), // <-- Title updated
            description: website.localize({
                en: 'Toggle features and dynamic content sources.',
                fr: 'Activer les fonctionnalités et les sources de contenu dynamique.',
                es: 'Activar funciones y fuentes de contenido dinámico.',
                zh: '切换功能和动态内容源。',
            }), // <-- Description updated
            content: (
                <div className="space-y-3">
                    <MockToggle
                        icon={LuSearch}
                        label={website.localize({
                            en: 'Enable Site Search',
                            fr: 'Activer la recherche sur le site',
                            es: 'Habilitar búsqueda en el sitio',
                            zh: '启用站点搜索',
                        })}
                        active={true}
                    />
                    {/* --- UPDATED TOGGLE --- */}
                    <MockToggle
                        icon={LuChartNoAxesColumn} // <-- UPDATED
                        label={website.localize({
                            en: 'Enable Analytics',
                            fr: "Activer l'analyse",
                            es: 'Habilitar análisis',
                            zh: '启用分析',
                        })}
                        active={true}
                    />
                    {/* --- UPDATED TOGGLE --- */}
                    <MockToggle
                        icon={LuListTodo} // <-- UPDATED
                        label={website.localize({
                            en: 'Enable Forms',
                            fr: 'Activer les formulaires',
                            es: 'Habilitar formularios',
                            zh: '启用表单',
                        })}
                        active={false}
                    />
                    {/* --- NEWLY ADDED TOGGLE --- */}
                    <MockToggle
                        icon={LuFolderKanban}
                        label={website.localize({
                            en: 'Enable Dynamic Content',
                            fr: 'Activer le contenu dynamique',
                            es: 'Habilitar contenido dinámico',
                            zh: '启用动态内容',
                        })}
                        active={true}
                    />
                    {/* --- END NEW TOGGLE --- */}
                </div>
            ),
        },
    ];

    // Auto-play timer
    useEffect(() => {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Start a new interval ONLY if user has not interacted AND is not hovering
        if (!userInteracted && !isHovering) {
            intervalRef.current = setInterval(() => {
                setIndex((prev) => (prev + 1) % cards.length);
            }, 3500); // Change card every 3.5 seconds
        }

        // Cleanup function
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [userInteracted, isHovering, cards.length]); // Re-run effect if these states change

    const currentCard = cards[index];

    // Handler for clicking the stepper dots
    const handleDotClick = (i) => {
        setUserInteracted(true); // Stop auto-play permanently
        setIndex(i); // Set the card index
    };

    return (
        <div
            className="relative w-full max-w-md mx-auto"
            onMouseEnter={() => setIsHovering(true)} // Set hover state
            onMouseLeave={() => setIsHovering(false)} // Clear hover state
        >
            {/* The Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={index} // Key change triggers animation
                    className="relative bg-text-color-0 rounded-2xl shadow-2xl border border-neutral-200 p-8 h-[433px]"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{
                        duration: 0.5,
                        type: 'spring',
                        stiffness: 100,
                        damping: 20,
                    }}
                >
                    {/* Card Header */}
                    <div className="flex items-center gap-4">
                        <span className={'inline-block p-3 bg-secondary-600/10 rounded-lg'}>
                            <currentCard.icon className={'w-6 h-6 text-secondary-600'} />
                        </span>
                        <div>
                            <h3 className={'text-xl font-semibold'}>{currentCard.title}</h3>
                            <p className="text-sm text-neutral-500">{currentCard.description}</p>
                        </div>
                    </div>

                    {/* Card Content */}
                    <div className="mt-6 border-t border-neutral-200 pt-6">
                        {currentCard.content}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Stepper Dots */}
            <div className="flex justify-center gap-2 mt-6">
                {cards.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => handleDotClick(i)} // Use new handler
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                            i === index
                                ? 'bg-secondary-600 scale-110'
                                : 'bg-neutral-300 hover:bg-neutral-400'
                        }`}
                        aria-label={`Go to step ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

const MockToggle = ({ icon: Icon, label, active }) => (
    <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 p-3 rounded-lg">
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-neutral-500" />
            <span className="font-medium text-neutral-700">{label}</span>
        </div>
        <div
            className={`relative w-12 h-6 rounded-full transition-colors ${
                active ? 'bg-secondary-600' : 'bg-neutral-300'
            }`}
        >
            <div
                className={`absolute top-1 left-1 w-4 h-4 bg-text-color-0 rounded-full transition-transform ${
                    active ? 'translate-x-6' : 'translate-x-0'
                }`}
            />
        </div>
    </div>
);

const MockSectionLayoutSelector = () => {
    const [activeLayout, setActiveLayout] = useState('Grid');

    const layouts = [
        { name: 'Hero', icon: LuSquareDashed },
        { name: 'Sidebar', icon: LuPanelLeft },
        { name: 'Grid', icon: LuLayoutGrid },
        { name: 'Features', icon: LuColumns2 },
    ];

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-600">
                {website.localize({
                    en: 'Section Layouts',
                    fr: 'Mises en page de section',
                    es: 'Diseños de sección',
                    zh: '部分布局',
                })}
            </label>
            <div className="grid grid-cols-2 gap-2">
                {layouts.map((layout) => (
                    <button
                        key={layout.name}
                        onClick={() => setActiveLayout(layout.name)}
                        className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg border-2 transition-all ${
                            activeLayout === layout.name
                                ? 'border-secondary-600 bg-text-color-0 text-secondary-600'
                                : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:border-neutral-300'
                        }`}
                    >
                        <layout.icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{layout.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const MockSectionStyleSelector = () => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-600">
                {website.localize({
                    en: 'Section Styles',
                    fr: 'Styles de section',
                    es: 'Estilos de sección',
                    zh: '部分样式',
                })}
            </label>
            <div className="space-y-2">
                <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <LuImage className="w-5 h-5 text-neutral-500" />
                        <span className="font-medium text-neutral-700">
                            {website.localize({
                                en: 'Background Image',
                                fr: 'Image de fond',
                                es: 'Imagen de fondo',
                                zh: '背景图片',
                            })}
                        </span>
                    </div>
                    <HiChevronDown className="w-5 h-5 text-neutral-400" />
                </div>
            </div>
        </div>
    );
};
