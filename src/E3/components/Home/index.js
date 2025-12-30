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
        <main className="@container flex items-center justify-center w-full h-[800px]">
            <div className="max-w-3xl w-full px-6 flex flex-col items-center text-center">
                {/* Titles */}
                <h2 className="text-4xl @sm:text-5xl @md:text-6xl font-extrabold tracking-tight mb-4">
                    {title}
                </h2>
                <p className="text-lg @md:text-xl text-text-color/90 mb-10 max-w-2xl">{subtitle}</p>

                {/* Search Box Container */}
                <form onSubmit={handleSearch} className="w-full">
                    <div className="group flex items-center w-full gap-3 px-5 py-4 border-2 border-text-color/20 rounded-[var(--border-radius)] bg-text-color-0 shadow-sm focus-within:border-[#8F001A] focus-within:ring-1 focus-within:ring-current transition-all duration-200">
                        <HiSearch className="text-2xl text-text-color/70 group-focus-within:text-current" />

                        <input
                            type="text"
                            placeholder={website.localize({
                                en: 'Search by name, faculty, or keywords...',
                                fr: 'Rechercher par nom, faculté ou mots-clés...',
                            })}
                            className="flex-1 bg-transparent outline-none text-lg placeholder:text-text-color/70"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="p-1 hover:bg-text-color/10 rounded-full transition-colors group/icon focus:outline-none"
                        >
                            <HiArrowRight className="w-5 h-5 text-text-color/70 group-hover/icon:text-[#8F001A] group-focus-within:text-text-color/90" />
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
