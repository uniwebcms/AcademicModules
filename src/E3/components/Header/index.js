import React, { useState, useEffect, useRef } from 'react';
import {
    HiSearch,
    HiX,
    HiTranslate,
    HiAcademicCap,
    HiSortAscending,
    HiCheck,
    HiArrowLeft,
} from 'react-icons/hi';
import { twJoin, twMerge } from '@uniwebcms/module-sdk';
import client from '../_utils/ajax';

export default function Header(props) {
    const { website } = props;
    const { useNavigate, useLocation } = website.getRoutingComponents();
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const currentSearch = queryParams.get('q') || '';
    const currentLang = queryParams.get('lang') || 'all';
    const currentFaculty = queryParams.get('faculty') || 'all';
    const currentSort = queryParams.get('sort') || 'relevance';

    // Local state for the search input to prevent immediate URL updates
    const [localSearch, setLocalSearch] = useState(currentSearch);
    const [openMenu, setOpenMenu] = useState(null);
    const containerRef = useRef(null);

    // Sync local search with URL if URL changes externally (e.g., back button or "Clear All")
    useEffect(() => {
        setLocalSearch(currentSearch);
    }, [currentSearch]);

    const { data: experts = [], loading = false } = uniweb.useCompleteQuery(
        `getExperts_${currentSearch}`,
        async () => {
            if (!currentSearch) return [];

            const response = await client.get('experts.php', {
                params: {
                    action: 'searchExperts',
                    siteId: website.getSiteId(),
                    query: currentSearch,
                    lang: website.getLanguage(),
                },
            });
            return response.data.map((expert) => ({
                ...expert,
                title: expert.title.trim(),
            }));
        }
    );

    // 1. Calculate Options
    const languages = [
        {
            value: 'all',
            label: website.localize({ en: 'All Languages', fr: 'Toutes les langues' }),
        },
    ];
    const faculties = [
        {
            value: 'all',
            label: website.localize({ en: 'All Faculties', fr: 'Toutes les facultés' }),
        },
    ];
    const sorts = [
        { value: 'relevance', label: 'Relevance' },
        { value: 'asce', label: 'Name (Asc)' },
        { value: 'desc', label: 'Name (Desc)' },
    ];

    if (experts.length) {
        const uniqueLanguages = Array.from(
            new Set(experts.map((e) => e.language).filter(Boolean))
        ).map((lang) => ({
            value: lang,
            label: { english: 'English only', french: 'Français seulement' }[lang] || lang,
        }));
        languages.push(...uniqueLanguages);

        const uniqueFaculties = Array.from(
            new Set(experts.map((e) => e.caption?.split(',')?.[0]?.trim()).filter(Boolean))
        ).map((faculty) => ({ value: faculty, label: faculty }));
        faculties.push(...uniqueFaculties);
    }

    // 2. Validate Filter Selection
    // If the data updates and the current filter is no longer valid, reset it
    useEffect(() => {
        // Only run this logic when the request has finished successfully
        if (!loading) {
            const updates = {};

            // Case A: No experts found - Reset all active filters to default
            if (experts.length === 0) {
                if (currentLang !== 'all') updates.lang = 'all';
                if (currentFaculty !== 'all') updates.faculty = 'all';
            }
            // Case B: Experts found - Check if current selections still exist in new data
            else {
                if (currentLang !== 'all' && !languages.some((l) => l.value === currentLang)) {
                    updates.lang = 'all';
                }
                if (
                    currentFaculty !== 'all' &&
                    !faculties.some((f) => f.value === currentFaculty)
                ) {
                    updates.faculty = 'all';
                }
            }

            // Only navigate if there is actually a change to be made
            if (Object.keys(updates).length > 0) {
                updateUrl(updates);
            }
        }
    }, [experts, loading, currentLang, currentFaculty]);
    // Added currentLang/Faculty to dependencies to ensure sync accuracy

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpenMenu(null);
            }
        };
        if (openMenu) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openMenu]);

    const updateUrl = (paramsUpdate) => {
        const nextParams = new URLSearchParams(location.search);
        Object.entries(paramsUpdate).forEach(([key, value]) => {
            if (!value || value === 'all' || value === 'relevance') {
                nextParams.delete(key);
            } else {
                nextParams.set(key, value);
            }
        });
        navigate(`${location.pathname}?${nextParams.toString()}`);
        setOpenMenu(null);
    };

    const handleSearchSubmit = () => {
        updateUrl({ q: localSearch });
    };

    const clearFiltersOnly = () => {
        const nextParams = new URLSearchParams(location.search);
        nextParams.delete('lang');
        nextParams.delete('faculty');
        navigate(`${location.pathname}?${nextParams.toString()}`);
        setOpenMenu(null);
    };

    const clearAll = () => {
        setLocalSearch('');
        navigate(location.pathname);
        setOpenMenu(null);
    };

    const FilterTrigger = ({
        id,
        icon: Icon,
        label,
        active,
        options,
        currentValue,
        paramKey,
        alignRight,
    }) => (
        <div className="relative w-full @4xl:w-32 @5xl:w-40 @6xl:w-44 shrink-0">
            <button
                disabled={loading}
                onClick={() => setOpenMenu(openMenu === id ? null : id)}
                className={twMerge(
                    'flex items-center gap-2 p-2 border border-text-color/20 w-full rounded-[var(--border-radius)] transition-all focus:outline-none',
                    active
                        ? 'bg-text-color-0'
                        : 'bg-[color-mix(in_lch,var(--text-color)_4%,transparent)]',
                    openMenu === id && 'ring-1 ring-[#8F001A] border-[#8F001A] bg-text-color-0',
                    loading
                        ? 'bg-text-color/20 cursor-not-allowed'
                        : 'focus-within:border-[#8F001A] focus-within:ring-1 focus-within:ring-[#8F001A]'
                )}
            >
                <Icon className="shrink-0 text-lg" />
                <span className="truncate text-xs flex-1 text-left">{label}</span>
            </button>

            {!loading && openMenu === id && (
                <div
                    className={twJoin(
                        'absolute top-[calc(100%+4px)] min-w-[10rem] w-full bg-text-color-0 border border-text-color/20 shadow-xl z-50 overflow-y-auto max-h-64 rounded-[var(--border-radius)] animate-in fade-in zoom-in-95 duration-100',
                        alignRight ? 'right-0' : 'left-0'
                    )}
                >
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            onClick={() => updateUrl({ [paramKey]: opt.value })}
                            className={twMerge(
                                'px-3 py-2 text-sm cursor-pointer hover:bg-text-color-5 flex justify-between items-center',
                                currentValue === opt.value ? 'font-bold' : 'text-gray-700'
                            )}
                        >
                            <span className="truncate">{opt.label}</span>
                            {currentValue === opt.value && (
                                <HiCheck className="shrink-0 text-[#8F001A]" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const hasAnyFilters = currentLang !== 'all' || currentFaculty !== 'all';

    return (
        <header
            id="expert_searching_header"
            className="@container sticky top-0 z-20 bg-text-color-0 shadow-sm border-b"
        >
            <div className="max-w-7xl mx-auto p-3 flex flex-col @4xl:flex-row @4xl:items-center gap-4 @4xl:gap-6">
                <div className="flex flex-col @4xl:flex-row @4xl:items-center flex-1 gap-3 @4xl:gap-6">
                    <button
                        onClick={() => navigate('')}
                        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-tight text-text-color/70 hover:text-current transition-colors shrink-0 py-1 @4xl:py-0"
                    >
                        <HiArrowLeft className="text-sm" />
                        <span>{website.localize({ en: 'Start Over', fr: 'Recommencer' })}</span>
                    </button>

                    {/* Search Input Box */}
                    <div
                        className={twMerge(
                            'flex items-center flex-1 gap-2 px-3 py-2 border border-text-color/20 rounded-[var(--border-radius)] bg-[color-mix(in_lch,var(--text-color)_4%,transparent)] transition-all',
                            loading
                                ? 'bg-text-color/20 opacity-70 cursor-not-allowed'
                                : 'focus-within:border-[#8F001A] focus-within:bg-text-color-0 focus-within:ring-1 focus-within:ring-[#8F001A]'
                        )}
                    >
                        <input
                            type="text"
                            placeholder={website.localize({
                                en: 'Search experts...',
                                fr: 'Rechercher des experts...',
                            })}
                            className="flex-1 bg-transparent outline-none text-sm min-w-0 cursor-[inherit]"
                            value={localSearch}
                            disabled={loading}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && localSearch.trim() && handleSearchSubmit()
                            }
                        />
                        {localSearch ? (
                            <HiSearch
                                className={twJoin(
                                    'cursor-pointer opacity-60 hover:opacity-100 text-lg',
                                    loading && 'pointer-events-none'
                                )}
                                onClick={handleSearchSubmit}
                            />
                        ) : (
                            <HiSearch className="shrink-0 opacity-40" />
                        )}
                    </div>
                </div>

                <div
                    ref={containerRef}
                    className="grid grid-cols-3 @4xl:flex items-end @4xl:items-center gap-x-5 gap-y-1 @4xl:gap-4"
                >
                    {/* Mobile Headers */}
                    <div className="col-span-2 flex items-center justify-between @4xl:hidden">
                        <p className="text-[11px] uppercase tracking-wider font-bold opacity-50">
                            {website.localize({ en: 'Filter:', fr: 'Filtrer:' })}
                        </p>
                        <button
                            onClick={clearAll}
                            className="flex items-center gap-1 text-[11px] uppercase font-bold text-text-color/60 hover:text-[#8F001A]"
                        >
                            <HiX /> {website.localize({ en: 'Clear All', fr: 'Tout Effacer' })}
                        </button>
                    </div>
                    <div className="col-span-1 @4xl:hidden">
                        <p className="text-[11px] uppercase tracking-wider font-bold opacity-50">
                            {website.localize({ en: 'Sort:', fr: 'Trier:' })}
                        </p>
                    </div>

                    <div className="flex flex-col @4xl:flex-row @4xl:items-center gap-1 @4xl:gap-2">
                        <p className="hidden @5xl:block text-sm font-semibold opacity-70">
                            {website.localize({ en: 'Filter:', fr: 'Filtrer:' })}
                        </p>
                        <FilterTrigger
                            id="lang"
                            paramKey="lang"
                            icon={HiTranslate}
                            label={languages.find((l) => l.value === currentLang)?.label}
                            active={currentLang !== 'all'}
                            options={languages}
                            currentValue={currentLang}
                        />
                    </div>

                    <div className="flex items-center gap-1">
                        <FilterTrigger
                            id="faculty"
                            paramKey="faculty"
                            icon={HiAcademicCap}
                            label={faculties.find((f) => f.value === currentFaculty)?.label}
                            active={currentFaculty !== 'all'}
                            options={faculties}
                            currentValue={currentFaculty}
                        />
                        <button
                            onClick={clearFiltersOnly}
                            disabled={!hasAnyFilters || loading}
                            className={twMerge(
                                'hidden @4xl:block pl-1.5 transition-all shrink-0 text-xs',
                                hasAnyFilters && !loading
                                    ? 'text-current opacity-100 hover:underline'
                                    : 'opacity-50'
                            )}
                        >
                            {website.localize({ en: 'Clear All', fr: 'Tout Effacer' })}
                        </button>
                    </div>

                    <div className="flex flex-col @4xl:flex-row @4xl:items-center gap-1 @4xl:gap-2">
                        <p className="hidden @5xl:block text-sm font-semibold opacity-70">
                            {website.localize({ en: 'Sort:', fr: 'Trier:' })}
                        </p>
                        <FilterTrigger
                            id="sort"
                            paramKey="sort"
                            icon={HiSortAscending}
                            label={sorts.find((s) => s.value === currentSort)?.label}
                            active={currentSort !== 'relevance'}
                            options={sorts}
                            currentValue={currentSort}
                            alignRight={true}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
