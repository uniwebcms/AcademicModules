import React, { useState, useEffect, useRef } from 'react';
import { getNextBlockContext } from '../_utils/context';
import { getPageProfile, twJoin, website } from '@uniwebcms/module-sdk';
import { Image, Icon, Link } from '@uniwebcms/core-components';
import { languages } from '../_utils/translate';
import { HiOutlineGlobeAlt, HiSearch, HiX, HiOutlineMenu, HiChevronDown } from 'react-icons/hi';
import { GrRadialSelected } from 'react-icons/gr';
import { AiOutlineUser } from 'react-icons/ai';
import SearchManager from './SearchManager';

const NavBar = ({
    logo,
    navigation,
    navigationLinkAlignment,
    accountLinks,
    floatingOnTop,
    theme,
    languages,
    refresh,
    logoOnLight,
    block, // Add block prop for tracking
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isNavHovered, setIsNavHovered] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [mobileContent, setMobileContent] = useState(null);
    const [navWidth, setNavWidth] = useState(document.documentElement.clientWidth);
    const [languageDropdownWidth, setLanguageDropdownWidth] = useState(0);
    const [searchResults, setSearchResults] = useState(null);
    const [navDropdownLayout, setNavDropdownLayout] = useState({
        alignRight: false,
        columns: 1,
        offset: 0,
    });

    const navRef = useRef(null);
    const placeholderRef = useRef(null);
    const languageBtnRef = useRef(null);
    const searchManagerRef = useRef(null);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);
    const navButtonRefs = useRef([]);

    // Search tracking ref to store search term for result clicks
    const searchTrackingRef = useRef({
        lastSearchTerm: '',
    });

    let lastScrollY = 0;
    let ticking = false;

    // Track search events
    const trackSearchEvent = (eventType, extraData = {}) => {
        if (!block || !block.trackEvent || !window.uniweb?.analytics?.initialized) return;

        const searchData = {
            ...extraData,
        };

        // console.log('🔍 Search Event Tracked:', searchData);
        block.trackEvent(eventType, searchData);
    };

    // Reset state when need refresh
    useEffect(() => {
        setIsOpen(false);
        setActiveDropdown(null);
        setIsNavHovered(false);
        setMobileContent(null);
    }, [refresh]);

    // update nav width on resize
    useEffect(() => {
        const updateNavWidth = () => {
            setNavWidth(document.documentElement.clientWidth);
        };

        updateNavWidth(); // initial

        window.addEventListener('resize', updateNavWidth);
        return () => window.removeEventListener('resize', updateNavWidth);
    }, []);

    // Update placeholder height when nav height changes
    useEffect(() => {
        if (!navRef.current || !placeholderRef.current) return;

        const updatePlaceholderHeight = () => {
            const navHeight = navRef.current.offsetHeight;
            placeholderRef.current.style.height = `${navHeight}px`;
        };

        // Initial height update
        updatePlaceholderHeight();

        // Create ResizeObserver to watch for nav height changes
        const resizeObserver = new ResizeObserver(updatePlaceholderHeight);
        resizeObserver.observe(navRef.current);

        return () => resizeObserver.disconnect();
    }, [refresh]);

    // Update dropdown layout for each nav button when resized
    useEffect(() => {
        if (typeof activeDropdown !== 'number') return;
        const button = navButtonRefs.current[activeDropdown];
        if (!button) return;

        const calculateLayout = () => {
            const { left } = button.getBoundingClientRect();
            const width = window.innerWidth;
            const paddingLeft = width >= 1280 ? 96 : width >= 1024 ? 64 : width >= 768 ? 32 : 24;
            const offsetLeft = width >= 1728 ? (width - 1728) / 2 + paddingLeft : paddingLeft;

            const spaceToRight = width - left;

            const offset = left - offsetLeft;
            const alignRight = false;
            const columns =
                spaceToRight < 500 // 500 is the max width of the dropdown grid
                    ? 1
                    : navigation[activeDropdown]?.child_items?.length > 3
                    ? 2
                    : 1;

            setNavDropdownLayout({ alignRight, columns, offset });
        };

        const observer = new ResizeObserver(calculateLayout);
        observer.observe(button);
        window.addEventListener('resize', calculateLayout);
        calculateLayout();

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', calculateLayout);
        };
    }, [activeDropdown, navigation]);

    // Handle initial opacity setup on mount and when floatingOnTop changes
    useEffect(() => {
        if (!navRef.current) return;

        if (floatingOnTop) {
            // For floating navbar, set opacity based on current scroll
            const currentScrollY = window.scrollY;
            // const bgOpacity = Math.min(currentScrollY / 80, 1);
            const bgOpacity = currentScrollY < 80 ? 0.8 : 1;
            navRef.current.style.setProperty('--nav-bg-opacity', bgOpacity);
        } else {
            // For non-floating navbar, always solid background
            navRef.current.style.setProperty('--nav-bg-opacity', '1');
        }

        // Set initial shadow opacity
        const bgShadowOpacity = Math.min(window.scrollY / 80, 1);
        navRef.current.style.setProperty('--nav-bg-shadow-opacity', bgShadowOpacity);
    }, [floatingOnTop]);

    // Set the language dropdown width based on the language button position using ResizeObserver and window resize
    useEffect(() => {
        const button = languageBtnRef.current;
        if (!button) return;

        const calculateWidth = () => {
            const { right } = button.getBoundingClientRect();

            let paddingLeft;
            if (window.innerWidth >= 1280) paddingLeft = 96;
            else if (window.innerWidth >= 1024) paddingLeft = 64;
            else if (window.innerWidth >= 768) paddingLeft = 32;
            else paddingLeft = 24;

            const offset =
                window.innerWidth >= 1728
                    ? (window.innerWidth - 1728) / 2 + paddingLeft
                    : paddingLeft;

            setLanguageDropdownWidth(right - offset);
        };

        const observer = new ResizeObserver(calculateWidth);
        observer.observe(button);

        window.addEventListener('resize', calculateWidth);

        // Initial call with proper offset
        calculateWidth();

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', calculateWidth);
        };
    }, []);

    // Handle scroll behavior and update navbar states
    useEffect(() => {
        if (typeof window === 'undefined') return;

        let isProgrammatic = false;

        const updateNavPosition = () => {
            if (!navRef.current) return;

            const currentScrollY = window.scrollY;
            const navHeight = navRef.current.offsetHeight;

            // Update background opacity while scrolling (only for floating navbar)
            if (floatingOnTop) {
                // const bgOpacity = Math.min(currentScrollY / 80, 1);
                const bgOpacity = currentScrollY < 80 ? 0.8 : 1;
                navRef.current.style.setProperty('--nav-bg-opacity', bgOpacity);
            }

            // Update shadow opacity while scrolling
            const bgShadowOpacity = Math.min(currentScrollY / 80, 1);
            navRef.current.style.setProperty('--nav-bg-shadow-opacity', bgShadowOpacity);

            // Update navbar position for show/hide animation
            if (currentScrollY <= navHeight) {
                // During initial scroll phase - map progress directly
                const progress = currentScrollY / navHeight;
                navRef.current.style.setProperty('--scroll-progress', progress);
            } else {
                // After scroll exceeds navbar height - handle show/hide based on scroll direction
                const isScrollingDown = currentScrollY > lastScrollY;
                const targetProgress = isScrollingDown ? 1 : 0;
                navRef.current.style.setProperty('--scroll-progress', targetProgress);
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        const handleScroll = () => {
            if (isProgrammatic) return;

            if (!ticking) {
                requestAnimationFrame(updateNavPosition);
                ticking = true;
            }
        };

        // Set initial state
        updateNavPosition();

        const onStart = () => (isProgrammatic = true);
        const onEnd = () => (isProgrammatic = false);

        // this two custom event is dispatch in ContentShowcase component, when user click on the button to scroll to the top, we not show the navbar
        window.addEventListener('programmatically-scrolling-start', onStart);
        window.addEventListener('programmatically-scrolling-end', onEnd);

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('programmatically-scrolling-start', onStart);
            window.removeEventListener('programmatically-scrolling-end', onEnd);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [floatingOnTop]);

    // Modified scroll locking
    useEffect(() => {
        const shouldLockScroll =
            (activeDropdown !== null && window.innerWidth >= 1024) ||
            (isOpen && window.innerWidth < 1024);

        if (shouldLockScroll) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [activeDropdown, isOpen]);

    // Handle mouse movement for dropdown
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!dropdownRef.current || window.innerWidth < 1024) return;

            const dropdownRect = dropdownRef.current.getBoundingClientRect();
            const isMouseBelowDropdown = e.clientY > dropdownRect.top + dropdownRect.height;

            if (isMouseBelowDropdown) {
                setIsNavHovered(false);
                setActiveDropdown(null);
            }
        };

        if (activeDropdown !== null) {
            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [activeDropdown]);

    // Focus search input when search dropdown opens
    useEffect(() => {
        if (activeDropdown === 'search' && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [activeDropdown]);

    // Track when search results are received
    useEffect(() => {
        // Only track if we have a search term and results have been set
        if (searchTrackingRef.current.lastSearchTerm && searchResults !== null) {
            trackSearchEvent('search_executed', {
                search_term: searchTrackingRef.current.lastSearchTerm,
                search_results_count: searchResults.length,
            });
        }
    }, [searchResults]);

    // Handle dropdown hover for desktop
    const handleMouseEnter = (index) => {
        if (window.innerWidth >= 1024) {
            setActiveDropdown(index);
            setIsNavHovered(true);
        }
    };

    // Handle action hover for desktop
    const handleActionMouseEnter = (action) => {
        if (window.innerWidth >= 1024) {
            setActiveDropdown(action);
            setIsNavHovered(true);
        }
    };

    // Handle mouse leave for desktop
    const handleMouseLeave = () => {
        if (window.innerWidth >= 1024) {
            setIsNavHovered(false);
            setTimeout(() => {
                if (!isNavHovered) {
                    setActiveDropdown(null);
                }
            }, 100);
        }
    };

    // Handle mobile menu actions
    const handleMobileAction = (action) => {
        if (action === mobileContent) {
            setIsOpen(false);
            setMobileContent(null);
        } else {
            setIsOpen(true);
            setMobileContent(action);
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        // Removed tracking for input typing
    };

    // Handle search submit
    const handleSearch = async (e) => {
        if (e.key === 'Enter') {
            const searchTerm = e.target.value.trim();

            if (searchTerm) {
                // Store search term for result tracking
                searchTrackingRef.current.lastSearchTerm = searchTerm;

                // Execute the search (tracking happens in useEffect when results arrive)
                await searchManagerRef.current.search(searchTerm);
            }
        } else if (e.key === 'Escape') {
            // Clear search on Escape key
            handleSearchClear();
        }
    };

    // Handle search clear
    const handleSearchClear = () => {
        setSearchValue('');
        setSearchResults(null);
        // Removed tracking for search clear

        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    // Handle search result click
    const handleSearchResultClick = (result) => {
        trackSearchEvent('search_result_clicked', {
            search_term: searchTrackingRef.current.lastSearchTerm,
            result_title: result.title,
            result_url: result.href,
        });

        // Reset search value and results after clicking a result
        setSearchValue('');
        // setSearchResults(null);
    };

    const renderDropdownContent = () => {
        const currentLanguage = website.getLanguage();

        switch (activeDropdown) {
            case 'search':
                return (
                    <div className="max-w-4xl mx-auto px-4 pt-8 pb-12">
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                            <div className="flex-1 relative">
                                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder={website.localize({
                                        en: 'Search everything...',
                                        fr: 'Rechercher tout...',
                                        es: 'Buscar todo...',
                                        ch: '搜索所有...',
                                    })}
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleSearch}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent ring-offset-2 ring-offset-gray-400 bg-white text-black"
                                />
                                <HiX
                                    className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer"
                                    onClick={handleSearchClear}
                                />
                            </div>
                            <div className="hidden lg:flex flex-col gap-1 text-sm">
                                <span>
                                    {website.localize({
                                        en: 'Press',
                                        fr: 'Appuyez',
                                        es: 'Presione',
                                        ch: '按',
                                    })}{' '}
                                    <kbd className="px-1 py-0.5 bg-bg-color-70 rounded text-xs">
                                        Esc
                                    </kbd>{' '}
                                    {website.localize({
                                        en: 'to clear',
                                        fr: 'pour effacer',
                                        es: 'para borrar',
                                        ch: '清除',
                                    })}
                                </span>
                                <span>
                                    {website.localize({
                                        en: 'Press',
                                        fr: 'Appuyez',
                                        es: 'Presione',
                                        ch: '按',
                                    })}{' '}
                                    <kbd className="px-1 py-0.5 bg-bg-color-70 rounded">↵</kbd>{' '}
                                    {website.localize({
                                        en: 'to search',
                                        fr: 'pour rechercher',
                                        es: 'para buscar',
                                        ch: '搜索',
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Display search results */}
                        <div className="flex flex-col gap-4 mt-6 max-h-[60vh] overflow-auto">
                            {searchResults?.map((result, index) => (
                                <Link
                                    key={result.id}
                                    to={result.href}
                                    target="_self"
                                    style={{ textShadow: '1px 1px 2px var(--bg-color)' }}
                                >
                                    <div
                                        className="flex flex-col gap-1 px-2 py-1 hover:underline"
                                        onClick={() => handleSearchResultClick(result)}
                                    >
                                        <span className="text-base lg:text-lg">{result.title}</span>
                                        {result.description && (
                                            <span className="text-sm lg:text-base text-text-color-80">
                                                {result.description}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                            {searchValue && searchResults?.length === 0 && (
                                <div className="text-center text-text-color">
                                    {website.localize({
                                        en: 'No results found',
                                        fr: 'Aucun résultat trouvé',
                                        es: 'No se encontraron resultados',
                                        ch: '没有找到结果',
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'language':
                return (
                    <div className="max-w-9xl mx-auto px-6 md:px-8 lg:px-16 xl:px-24 pt-5 pb-12">
                        <div
                            className="flex flex-col items-end"
                            style={{
                                width: languageDropdownWidth,
                            }}
                        >
                            {languages.map((lang, index) => (
                                <div
                                    key={index}
                                    className={twJoin(
                                        'relative flex items-center group py-2',
                                        currentLanguage === lang.value
                                            ? 'text-primary-600 cursor-not-allowed'
                                            : 'text-text-color cursor-pointer'
                                    )}
                                    onClick={() => website.changeLanguage(lang.value)}
                                >
                                    <span className={twJoin('text-base')}>{lang.label}</span>
                                    {currentLanguage !== lang.value && (
                                        <span
                                            className={twJoin(
                                                'absolute bottom-1.5 left-0 h-0.5 bg-primary-600 transition-[width] duration-500 ease-out w-0 group-hover:w-full'
                                            )}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                if (
                    typeof activeDropdown === 'number' &&
                    navigation[activeDropdown]?.child_items?.length
                ) {
                    const items = navigation[activeDropdown].child_items;

                    return (
                        <div className="max-w-9xl mx-auto px-6 md:px-8 lg:px-16 xl:px-24 pt-5 pb-12">
                            <div
                                className="grid gap-x-4 gap-y-1 relative lg:max-w-[400px] xl:max-w-[450px] 2xl:max-w-[500px]"
                                style={{
                                    // gridTemplateColumns:
                                    //     navDropdownLayout.columns === 1 ? 'auto' : 'auto 1fr',
                                    gridTemplateColumns: `repeat(${navDropdownLayout.columns}, 1fr)`,
                                    marginLeft: navDropdownLayout.offset,
                                }}
                            >
                                {items.map((child, index) => (
                                    <Link
                                        key={index}
                                        to={child.route}
                                        className="flex items-center w-fit relative px-3 py-2 group"
                                    >
                                        {child.icon ? (
                                            <Icon
                                                icon={child.icon}
                                                className="flex-shrink-0 h-4 w-4 mr-2 text-text-color-90"
                                            />
                                        ) : null}
                                        <span className="text-base">{child.label}</span>
                                        <span
                                            className={twJoin(
                                                'absolute bottom-1.5 h-0.5 bg-primary-600 transition-[width] duration-500 ease-out w-0',
                                                child.icon
                                                    ? 'left-9 group-hover:w-[calc(100%-48px)]'
                                                    : 'left-3 group-hover:w-[calc(100%-24px)]'
                                            )}
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                }

                return null;
        }
    };

    // Render mobile menu content
    const renderMobileContent = () => {
        switch (mobileContent) {
            case 'search':
                return (
                    <div className="px-6 md:px-8 pt-2 pb-6">
                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="input"
                                    placeholder={website.localize({
                                        en: 'Search everything...',
                                        fr: 'Rechercher tout...',
                                        es: 'Buscar todo...',
                                        ch: '搜索所有...',
                                    })}
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleSearch}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                                    autoFocus
                                />
                                <HiX
                                    className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer"
                                    onClick={handleSearchClear}
                                />
                            </div>
                        </div>

                        {/* Display search results */}
                        <div className="flex flex-col gap-4 mt-6 max-h-[60vh] overflow-auto">
                            {searchResults?.map((result, index) => (
                                <Link key={result.id} to={result.href}>
                                    <div
                                        className="flex flex-col gap-1 px-2 py-1 hover:underline"
                                        onClick={() => handleSearchResultClick(result)}
                                    >
                                        <span className="text-base lg:text-lg text-gray-900">
                                            {result.title}
                                        </span>
                                        {result.description && (
                                            <span className="text-sm lg:text-base text-gray-700">
                                                {result.description}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                            {searchValue && searchResults?.length === 0 && (
                                <div className="text-center text-gray-500">
                                    {website.localize({
                                        en: 'No results found',
                                        fr: 'Aucun résultat trouvé',
                                        es: 'No se encontraron resultados',
                                        ch: '没有找到结果',
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'language':
                return (
                    <div className="px-6 md:px-8 pt-2 pb-6">
                        <div className="flex flex-col gap-3">
                            {languages.map((lang, index) => (
                                <div
                                    key={index}
                                    onClick={() => website.changeLanguage(lang.value)}
                                    className="relative flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg transition-colors"
                                >
                                    <span className="font-medium text-black">{lang.label}</span>
                                    {website.getLanguage() === lang.value && (
                                        <GrRadialSelected className="absolute right-4 h-5 w-5 text-blue-600" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'user':
                return (
                    <div className="px-6 md:px-8 pt-2 pb-6">
                        <div className="flex flex-col gap-5">
                            {accountLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.route}
                                    target="_self"
                                    className={twJoin(
                                        index === accountLinks.length - 1
                                            ? 'relative text-center px-4 py-3 bg-primary-600 rounded-lg'
                                            : 'relative text-center px-4 py-3 bg-gray-50 rounded-lg'
                                    )}
                                >
                                    <span
                                        className={twJoin(
                                            'font-medium',
                                            index === accountLinks.length - 1
                                                ? 'text-white'
                                                : 'text-black'
                                        )}
                                    >
                                        {link.label}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="px-6 md:px-8 pt-2 pb-6">
                        <div className="space-y-1">
                            {navigation.map((item, index) => (
                                <div key={index}>
                                    <div
                                        onClick={() =>
                                            setActiveDropdown(
                                                activeDropdown === item.label ? null : item.label
                                            )
                                        }
                                        className="w-full text-left pl-2 py-3 rounded-md"
                                    >
                                        <div className="flex justify-between items-center">
                                            {item.route ? (
                                                <Link
                                                    className="text-gray-700 text-base font-semibold"
                                                    to={item.route}
                                                >
                                                    {item.label}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-700 text-base font-semibold">
                                                    {item.label}
                                                </span>
                                            )}
                                            {item.child_items.length ? (
                                                <HiChevronDown
                                                    className={`h-6 w-6 text-gray-700 transform transition-transform ${
                                                        activeDropdown === item.label
                                                            ? 'rotate-180'
                                                            : ''
                                                    }`}
                                                />
                                            ) : null}
                                        </div>
                                    </div>
                                    {item.child_items.length && activeDropdown === item.label ? (
                                        <div className="pl-2 space-y-1 pt-2">
                                            {item.child_items.map((child, index) => (
                                                <Link
                                                    key={index}
                                                    to={child.route}
                                                    className="block px-3 py-2 text-gray-900 text-sm"
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            {/* Placeholder div to prevent content jump */}
            {floatingOnTop ? null : <div ref={placeholderRef} />}

            <nav
                ref={navRef}
                className={twJoin('w-full fixed z-50', theme)}
                style={{
                    transform: 'translateY(calc(var(--scroll-progress, 0) * -100%))',
                    transition: 'transform 0.3s ease-in-out, background-color 0.3s ease',
                    backgroundColor:
                        'color-mix(in srgb, var(--bg-color), transparent calc(100% - (var(--nav-bg-opacity, 0) * 100%)))',
                    boxShadow:
                        'rgba(0, 0, 0, calc(var(--nav-bg-shadow-opacity, 0) * 0.1)) 0px 4px 6px -1px',
                    top: 0,
                    maxWidth: navWidth,
                }}
                onMouseLeave={handleMouseLeave}
            >
                <div className="w-full max-w-9xl mx-auto px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-24">
                    <div className="flex justify-between h-20 items-center space-x-2 xl:space-x-4 2xl:space-x-6">
                        <div className="flex items-center lg:space-x-8 xl:space-x-10 2xl:space-x-12 flex-grow">
                            {/* Logo */}
                            <div className="flex-shrink-0 w-24 md:w-28 lg:w-32 xl:w-36 2xl:w-40">
                                <Link to="">{logo}</Link>
                            </div>

                            {/* Desktop Navigation */}
                            <div
                                className={twJoin(
                                    'hidden lg:flex lg:items-center lg:space-x-2 xl:space-x-3 2xl:space-x-4 flex-grow',
                                    navigationLinkAlignment === 'left' && 'justify-start',
                                    navigationLinkAlignment === 'center' && 'justify-center',
                                    navigationLinkAlignment === 'right' && 'justify-end'
                                )}
                            >
                                {navigation.map((item, index) => {
                                    const { label, route, child_items } = item;

                                    const Wrapper = route ? Link : 'div';
                                    const wrapperProps = route ? { to: route } : {};

                                    return (
                                        <div
                                            key={index}
                                            ref={(el) => (navButtonRefs.current[index] = el)}
                                            onMouseEnter={() => handleMouseEnter(index)}
                                            className="relative"
                                        >
                                            <Wrapper
                                                {...wrapperProps}
                                                className={twJoin(
                                                    'inline-flex items-center py-2',
                                                    child_items.length ? 'pl-3 pr-1.5' : 'px-3',
                                                    child_items.length && !route
                                                        ? 'cursor-default'
                                                        : ''
                                                )}
                                            >
                                                <span className="text-lg">{label}</span>
                                                {child_items.length ? (
                                                    <HiChevronDown
                                                        className={twJoin(
                                                            'ml-1 h-5 w-5 transition-transform duration-300 ease-out group-hover:rotate-180',
                                                            activeDropdown === index
                                                                ? 'rotate-180'
                                                                : ''
                                                        )}
                                                    />
                                                ) : null}
                                                <span
                                                    className={twJoin(
                                                        'absolute bottom-1.5 left-3 h-0.5 bg-primary-600 transition-[width] duration-500 ease-out group-hover:w-[calc(100%-24px)]',
                                                        activeDropdown === index
                                                            ? 'w-[calc(100%-24px)]'
                                                            : 'w-0'
                                                    )}
                                                />
                                            </Wrapper>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Desktop Right Side Actions */}
                        <div className="hidden lg:flex lg:items-center space-x-0 xl:space-x-1">
                            {website.isSearchEnabled() && (
                                <button
                                    className="relative !bg-transparent text-text-color group px-3 py-2"
                                    onMouseEnter={() => handleActionMouseEnter('search')}
                                >
                                    <HiSearch className="h-6 w-6" />
                                    <span
                                        className={twJoin(
                                            'absolute bottom-[3px] left-3 h-0.5 bg-primary-600 transition-[width] duration-500 ease-out group-hover:w-[calc(100%-24px)]',
                                            activeDropdown === 'search'
                                                ? 'w-[calc(100%-24px)]'
                                                : 'w-0'
                                        )}
                                    />
                                </button>
                            )}
                            {languages.length > 1 && (
                                <button
                                    ref={languageBtnRef}
                                    className="relative !bg-transparent text-text-color group px-3 py-2"
                                    onMouseEnter={() => handleActionMouseEnter('language')}
                                >
                                    <HiOutlineGlobeAlt className="h-6 w-6" />
                                    <span
                                        className={twJoin(
                                            'absolute bottom-[3px] left-3 h-0.5 bg-primary-600 transition-[width] duration-500 ease-out group-hover:w-[calc(100%-24px)]',
                                            activeDropdown === 'language'
                                                ? 'w-[calc(100%-24px)]'
                                                : 'w-0'
                                        )}
                                    />
                                </button>
                            )}
                            <div className="flex items-center space-x-2.5 xl:space-x-3.5">
                                {accountLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.route}
                                        target="_self"
                                        className={twJoin(
                                            'cursor-pointer',
                                            index === accountLinks.length - 1
                                                ? '!bg-transparent text-lg !text-text-color whitespace-nowrap px-5 py-2 border-2 rounded-3xl border-text-color transition-[border-color] duration-200 ease-out hover:border-primary-600'
                                                : 'relative !bg-transparent text-lg px-3 py-2 group !text-text-color'
                                        )}
                                        onMouseEnter={() =>
                                            handleActionMouseEnter(`account-${index}`)
                                        }
                                    >
                                        {link.label}
                                        {index !== accountLinks.length - 1 && (
                                            <span
                                                className={twJoin(
                                                    'absolute bottom-1.5 left-3 h-0.5 bg-primary-600 transition-[width] duration-500 ease-out w-0 group-hover:w-[calc(100%-24px)]'
                                                )}
                                            />
                                        )}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Actions */}
                        <div className="lg:hidden flex items-center space-x-3.5">
                            {website.isSearchEnabled() && (
                                <div onClick={() => handleMobileAction('search')}>
                                    <HiSearch className="h-6 w-6" />
                                </div>
                            )}
                            {languages.length > 1 && (
                                <div onClick={() => handleMobileAction('language')}>
                                    <HiOutlineGlobeAlt className="h-6 w-6" />
                                </div>
                            )}
                            {accountLinks.length > 0 && (
                                <div onClick={() => handleMobileAction('user')}>
                                    <AiOutlineUser className="h-6 w-6" />
                                </div>
                            )}
                            <div onClick={() => handleMobileAction('menu')}>
                                <HiOutlineMenu className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Dropdown */}
                {activeDropdown !== null && window.innerWidth >= 1024 && (
                    <div
                        ref={dropdownRef}
                        className="absolute left-0 w-full shadow-lg"
                        onMouseEnter={() => setIsNavHovered(true)}
                        onMouseLeave={() => setIsNavHovered(false)}
                        style={{
                            backgroundColor:
                                'color-mix(in srgb, var(--bg-color), transparent calc(100% - (var(--nav-bg-opacity, 0) * 100%)))',
                        }}
                    >
                        {renderDropdownContent()}
                    </div>
                )}

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden fixed inset-0 z-50">
                        <div className="h-screen bg-white">
                            {/* Mobile Menu Header */}
                            <div className="h-20 flex items-center justify-between px-6 md:px-8">
                                <div className="flex-shrink-0 w-24 md:w-28">{logoOnLight}</div>
                                <div
                                    onClick={() => {
                                        setIsOpen(false);
                                        setMobileContent(null);
                                    }}
                                >
                                    <HiX className="h-6 w-6 text-gray-700" />
                                </div>
                            </div>
                            {/* Mobile Menu Content */}
                            <div className="overflow-y-auto h-[calc(100vh-8rem)]">
                                {renderMobileContent()}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Overlay for desktop dropdowns only */}
            {window.innerWidth >= 1024 &&
            activeDropdown !== null &&
            (activeDropdown === 'search' ||
                activeDropdown === 'language' ||
                (typeof activeDropdown === 'number' &&
                    navigation[activeDropdown]?.child_items?.length)) ? (
                <div
                    className={twJoin(theme, 'fixed inset-0 bg-bg-color/40 backdrop-blur-sm z-40')}
                    onClick={() => setActiveDropdown(null)}
                />
            ) : null}

            {/* SearchManager */}
            <SearchManager ref={searchManagerRef} onResultsChange={setSearchResults} />
        </>
    );
};

export default function Header(props) {
    const { block, page } = props;
    const { themeName, main } = block;

    const { theme: nextTheme = '', allowTranslucentTop = false } = getNextBlockContext(block);

    const { navigation_generation_mode = 'auto', navigation_link_alignment = 'left' } =
        block.getBlockProperties();

    let navigation = [],
        accountLinks = [];

    if (navigation_generation_mode === 'manual') {
        const linkGroups = block.getBlockLinks({ nested: true, grouped: true });
        [navigation = [], accountLinks = []] = linkGroups;
    } else {
        navigation = website.getPageHierarchy({
            nested: true,
            filterEmpty: false,
        });
    }

    const theme = allowTranslucentTop ? nextTheme : themeName;
    const themeVariant = theme.split('__')[1];

    const banner = main?.banner;
    const icon = main?.body?.icons?.[0];
    const images = [banner, ...main?.body?.imgs].filter((img) => img);
    const logoImg = images.find((img) => img.caption === `logo-${themeVariant}`);

    const logo = icon ? (
        <Icon icon={icon} className="w-full h-full" />
    ) : logoImg ? (
        <Image profile={getPageProfile()} {...logoImg} className="w-full h-full object-contain" />
    ) : null;

    const logoLightImg = images.find((img) => img.caption === 'logo-light');

    const logoOnLight = logoLightImg ? (
        <Image
            profile={getPageProfile()}
            {...logoLightImg}
            className="w-full h-full object-contain"
        />
    ) : (
        logo
    );

    const langOptions = website.getLanguages();

    const languageMap = langOptions.map((opt) => ({
        value: opt.value,
        label: languages[opt.value] || opt.label,
    }));

    const activeRoute = page.activeRoute;

    return (
        <NavBar
            navigation={navigation}
            navigationLinkAlignment={navigation_link_alignment}
            accountLinks={accountLinks}
            logo={logo}
            logoOnLight={logoOnLight}
            floatingOnTop={allowTranslucentTop}
            theme={theme}
            languages={languageMap}
            refresh={activeRoute}
            block={block} // Pass block for tracking
        />
    );
}
