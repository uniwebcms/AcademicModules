import React, { useState } from 'react';
import { HiSearch, HiX, HiArrowRight } from 'react-icons/hi';

export default function Home(props) {
    const { website, block } = props;
    const { title, subtitle } = block.getBlockContent();
    const { useNavigate } = website.getRoutingComponents();
    const navigate = useNavigate();

    // Local state for the home search input before navigation
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchValue.trim()) return;

        const params = new URLSearchParams();
        params.set('q', searchValue);
        // Navigate to the browser/search results page
        navigate(`experts?${params.toString()}`);
    };

    return (
        <main className="@container flex items-center justify-center w-full h-[var(--container-height)]">
            <div className="max-w-3xl w-full p-3 @xl:p-4 @2xl:p-5 flex flex-col items-center text-center">
                {/* Titles */}
                <h2 className="text-3xl @2xl:text-4xl @4xl:text-5xl font-bold tracking-[-1px] mb-4">
                    {title}
                </h2>
                <p className="text-sm @2xl:text-base @4xl:text-lg text-text-color/90 mb-6 @2xl:mb-8 @4xl:mb-10 max-w-2xl">
                    {subtitle}
                </p>

                {/* Search Box Container */}
                <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
                    <div className="group flex items-center w-full gap-3 px-3.5 py-2.5 @2xl:px-4 @2xl:py-3 @4xl:px-5 @4xl:py-4 border-2 border-text-color/20 rounded-[var(--border-radius)] bg-text-color-0 shadow-sm focus-within:border-[var(--highlight)] focus-within:ring-1 focus-within:ring-current transition-all duration-200">
                        <HiSearch className="text-lg @2xl:text-xl @4xl:text-2xl text-text-color/70 group-focus-within:text-current" />

                        <input
                            type="text"
                            placeholder={website.localize({
                                en: 'Search by name, faculty, or keywords...',
                                fr: 'Rechercher par nom, faculté ou mots-clés...',
                            })}
                            className="flex-1 bg-transparent outline-none text-sm @2xl:text-base @4xl:text-l placeholder:text-text-color/70"
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
