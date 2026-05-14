import React, { useState } from 'react';
import { twMerge } from '@uniwebcms/module-sdk';
import { HiSearch, HiArrowRight } from 'react-icons/hi';

const verticalClasses = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
};

const horizontalAlignClasses = {
    left: 'items-start',
    center: 'items-center',
    right: 'items-end',
};

const horizontalJustifyClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
};

const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
};

const gapClasses = {
    xs: 'mb-1 @2xl:mb-2 @4xl:mb-3',
    sm: 'mb-6 @2xl:mb-8 @4xl:mb-10',
    md: 'mb-10 @2xl:mb-12 @4xl:mb-16',
    lg: 'mb-16 @2xl:mb-20 @4xl:mb-24',
    xl: 'mb-24 @2xl:mb-28 @4xl:mb-32',
};

export default function Home(props) {
    const { website, block } = props;
    const { title, subtitle } = block.getBlockContent();
    const { useNavigate } = website.getRoutingComponents();
    const navigate = useNavigate();

    const {
        horizontal_alignment = 'center',
        vertical_alignment = 'center',
        text_alignment = 'center',
        gap = 'sm',
    } = block.getBlockProperties();

    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchValue.trim()) return;

        const params = new URLSearchParams();
        params.set('q', searchValue);
        navigate(`experts?${params.toString()}`);
    };

    const verticalClass = verticalClasses[vertical_alignment] || verticalClasses.center;
    const horizontalClass =
        horizontalAlignClasses[horizontal_alignment] || horizontalAlignClasses.center;
    const horizontalJustifyClass =
        horizontalJustifyClasses[horizontal_alignment] || horizontalJustifyClasses.center;
    const textAlignClass = textAlignClasses[text_alignment] || textAlignClasses.center;
    const gapClass = gapClasses[gap] || gapClasses.sm;

    return (
        <main
            className={twMerge(
                '@container flex w-full h-[var(--container-height)]',
                verticalClass,
                horizontalJustifyClass
            )}
        >
            <div
                className={twMerge(
                    'max-w-3xl w-full p-3 @xl:p-4 @2xl:p-5 flex flex-col',
                    horizontalClass
                )}
            >
                <h2
                    className={twMerge(
                        'text-3xl @2xl:text-4xl @4xl:text-5xl font-bold tracking-[-1px] mb-4',
                        textAlignClass
                    )}
                >
                    {title}
                </h2>
                <p
                    className={twMerge(
                        'text-sm @2xl:text-base @4xl:text-lg text-text-color/90 max-w-2xl',
                        textAlignClass,
                        gapClass
                    )}
                >
                    {subtitle}
                </p>

                <form onSubmit={handleSearch} className="w-full max-w-2xl">
                    <div className="group flex items-center w-full gap-3 px-3.5 py-2.5 @2xl:px-4 @2xl:py-3 @4xl:px-5 @4xl:py-4 border-2 border-text-color/20 rounded-[var(--border-radius)] bg-text-color-0 shadow-sm focus-within:border-[var(--highlight)] focus-within:ring-1 focus-within:ring-current transition-all duration-200">
                        <HiSearch className="text-lg @2xl:text-xl @4xl:text-2xl text-text-color/70 group-focus-within:text-current" />

                        <input
                            type="text"
                            placeholder={website.localize({
                                en: 'Search by expert name, faculty or keywords...',
                                fr: "Recherche par nom d'expert, faculté ou mots-clés...",
                            })}
                            className="flex-1 bg-transparent outline-none text-sm @2xl:text-base @4xl:text-l placeholder:text-text-color/70 text-left"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="p-1 hover:bg-text-color/10 rounded-full transition-colors group/icon focus:outline-none"
                        >
                            <HiArrowRight className="text-lg @2xl:text-xl @4xl:text-2xl text-text-color/70 group-hover/icon:text-[var(--highlight)] group-focus-within:text-text-color/90" />
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
