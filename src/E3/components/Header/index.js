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

    const [openMenu, setOpenMenu] = useState(null);
    const containerRef = useRef(null);

    const { data: experts, error } = uniweb.useCompleteQuery(
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

    console.log('experts', experts, error);

    const languages = [
        { value: 'all', label: 'All Languages' },
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'Français' },
    ];
    const faculties = [
        { value: 'all', label: 'All Faculties' },
        { value: 'arts', label: 'Arts' },
        { value: 'science', label: 'Science' },
        { value: 'engineering', label: 'Engineering' },
        { value: 'medicine', label: 'Medicine' },
    ];
    const sorts = [
        { value: 'relevance', label: 'Relevance' },
        { value: 'asce', label: 'Name (Asc)' },
        { value: 'desc', label: 'Name (Desc)' },
    ];

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

    const clearFiltersOnly = () => {
        const nextParams = new URLSearchParams(location.search);
        nextParams.delete('lang');
        nextParams.delete('faculty');
        navigate(`${location.pathname}?${nextParams.toString()}`);
    };

    const clearAll = () => navigate(location.pathname);

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
                onClick={() => setOpenMenu(openMenu === id ? null : id)}
                className={`flex items-center gap-2 p-2 border border-text-color/20 focus-within:border-[#8F001A] w-full rounded-[var(--border-radius)] transition-all focus-within:ring-1 focus-within:ring-[#8F001A] focus:outline-none
                    ${active ? 'bg-text-color-0' : 'bg-text-color/5'}
                    ${
                        openMenu === id
                            ? '!bg-text-color-0 ring-1 ring-[#8F001A] border-[#8F001A]'
                            : ''
                    }`}
            >
                <Icon className="shrink-0 text-lg" />
                <span className="truncate text-xs flex-1 text-left">{label}</span>
            </button>

            {openMenu === id && (
                <div
                    className={`absolute top-[calc(100%+4px)] ${alignRight ? 'right-0' : 'left-0'} 
                    min-w-[10rem] w-full bg-text-color-0 border border-text-color/20 shadow-xl z-50 overflow-y-auto max-h-64 
                    rounded-[var(--border-radius)] animate-in fade-in zoom-in-95 duration-100`}
                >
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            onClick={() => updateUrl({ [paramKey]: opt.value })}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-text-color-5 flex justify-between items-center
                                ${currentValue === opt.value ? 'font-bold' : 'text-gray-700'}`}
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
        <header className="@container sticky top-0 z-20 bg-text-color-0 shadow-sm border-b">
            <div className="max-w-7xl mx-auto p-3 flex flex-col @4xl:flex-row @4xl:items-center gap-4 @4xl:gap-6">
                {/* Search & Start Over Section */}
                <div className="flex flex-col @4xl:flex-row @4xl:items-center flex-1 gap-3 @4xl:gap-6">
                    <button
                        onClick={() => navigate('')}
                        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-tight text-text-color/70 hover:text-current transition-colors shrink-0 py-1 @4xl:py-0"
                    >
                        <HiArrowLeft className="text-sm" />
                        <span>
                            {website.localize({
                                en: 'Start Over',
                                fr: 'Recommencer',
                            })}
                        </span>
                    </button>

                    <div className="flex items-center flex-1 gap-2 px-3 py-2 border border-text-color/20 focus-within:border-[#8F001A] rounded-[var(--border-radius)] bg-text-color/5 focus-within:bg-text-color-0 focus-within:ring-1 focus-within:ring-[#8F001A] transition-all">
                        <HiSearch className="shrink-0 opacity-60" />
                        <input
                            type="text"
                            placeholder="Search experts..."
                            className="flex-1 bg-transparent outline-none text-sm min-w-0"
                            value={currentSearch}
                            onChange={(e) => updateUrl({ q: e.target.value })}
                        />
                        {currentSearch && (
                            <HiX
                                className="cursor-pointer opacity-50 hover:opacity-100"
                                onClick={() => updateUrl({ q: '' })}
                            />
                        )}
                    </div>
                </div>

                <div
                    ref={containerRef}
                    className="grid grid-cols-3 @4xl:flex items-end @4xl:items-center gap-x-5 gap-y-1 @4xl:gap-4"
                >
                    {/* Filter Group Header (Mobile Only Row) */}
                    <div className="col-span-2 flex items-center justify-between @4xl:hidden">
                        <p className="text-[11px] uppercase tracking-wider font-bold opacity-50">
                            {website.localize({
                                en: 'Filter:',
                                fr: 'Filtrer:',
                            })}
                        </p>
                        <button
                            onClick={clearAll}
                            className="flex items-center gap-1 text-[11px] uppercase font-bold text-text-color/60 hover:text-[#8F001A] transition-colors"
                        >
                            <HiX />{' '}
                            {website.localize({
                                en: 'Clear All',
                                fr: 'Tout Effacer',
                            })}
                        </button>
                    </div>
                    <div className="col-span-1 @4xl:hidden">
                        <p className="text-[11px] uppercase tracking-wider font-bold opacity-50">
                            {website.localize({
                                en: 'Sort:',
                                fr: 'Trier:',
                            })}
                        </p>
                    </div>

                    {/* Language */}
                    <div className="flex flex-col @4xl:flex-row @4xl:items-center gap-1 @4xl:gap-2">
                        <p className="hidden @5xl:block text-sm font-semibold opacity-70">
                            {website.localize({
                                en: 'Filter:',
                                fr: 'Filtrer:',
                            })}
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

                    {/* Faculty + Clear Filters Divider */}
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
                            className={`hidden @4xl:block pl-1.5 transition-all shrink-0 ${
                                hasAnyFilters
                                    ? 'text-current opacity-100 hover:underline'
                                    : 'opacity-60'
                            }`}
                            disabled={!hasAnyFilters}
                        >
                            <span className="text-xs">
                                {website.localize({
                                    en: 'Clear All',
                                    fr: 'Tout Effacer',
                                })}
                            </span>
                        </button>
                    </div>

                    {/* Sort */}
                    <div className="flex flex-col @4xl:flex-row @4xl:items-center gap-1 @4xl:gap-2">
                        <p className="hidden @5xl:block text-sm font-semibold opacity-70">
                            {website.localize({
                                en: 'Sort:',
                                fr: 'Trier:',
                            })}
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
