import React, { useState, useEffect, useRef } from 'react';
import { Dialog, Button } from '@headlessui/react';
import { getNextBlockContext } from '../_utils/context';
import { Image, Icon, getPageProfile, twJoin, Link, website } from '@uniwebcms/module-sdk';
import { languages } from '../_utils/translate';
import { HiOutlineGlobeAlt, HiSearch, HiX, HiOutlineMenu, HiChevronDown } from 'react-icons/hi';
import { GrRadialSelected } from 'react-icons/gr';
import { AiOutlineUser } from 'react-icons/ai';
import SearchManager from './SearchManager';

// a reusable sign in component in both dropdown and mobile menu
// const SignIn = ({ logo }) => {
//     return (
//         <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
//             <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//                 <div className="flex items-center justify-center h-10">{logo}</div>
//                 <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">
//                     {website.localize({
//                         en: 'Sign in to your account',
//                         fr: 'Connectez-vous à votre compte',
//                         es: 'Inicia sesión en tu cuenta',
//                         ch: '登录您的帐户',
//                     })}
//                 </h2>
//             </div>

//             <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//                 <form action="#" method="POST" className="space-y-6">
//                     <div>
//                         <label htmlFor="email" className="block text-sm/6 font-medium">
//                             {website.localize({
//                                 en: 'Email address',
//                                 fr: 'Adresse e-mail',
//                                 es: 'Correo electrónico',
//                                 ch: '电子邮件地址',
//                             })}
//                         </label>
//                         <div className="mt-2">
//                             <input
//                                 id="email"
//                                 name="email"
//                                 type="email"
//                                 required
//                                 autoComplete="email"
//                                 className="block w-full rounded-md bg-text-color-10 px-3 py-1.5 text-base text-text-color outline outline-1 -outline-offset-1 outline-text-color-20 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6"
//                             />
//                         </div>
//                     </div>

//                     <div>
//                         <div className="flex items-center justify-between">
//                             <label htmlFor="password" className="block text-sm/6 font-medium">
//                                 {website.localize({
//                                     en: 'Password',
//                                     fr: 'Mot de passe',
//                                     es: 'Contraseña',
//                                     ch: '密码',
//                                 })}
//                             </label>
//                             <div className="text-sm">
//                                 <a
//                                     href="#"
//                                     className="font-semibold text-primary-600 hover:text-primary-500"
//                                 >
//                                     {website.localize({
//                                         en: 'Forgot your password?',
//                                         fr: 'Mot de passe oublié?',
//                                         es: '¿Olvidaste tu contraseña?',
//                                         ch: '忘记密码了吗?',
//                                     })}
//                                 </a>
//                             </div>
//                         </div>
//                         <div className="mt-2">
//                             <input
//                                 id="password"
//                                 name="password"
//                                 type="password"
//                                 required
//                                 autoComplete="current-password"
//                                 className="block w-full rounded-md bg-text-color-10 px-3 py-1.5 text-base text-text-color outline outline-1 -outline-offset-1 outline-text-color-20 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6"
//                             />
//                         </div>
//                     </div>

//                     <div>
//                         <button
//                             type="submit"
//                             className="flex w-full justify-center rounded-md !bg-primary-600 px-3 py-1.5 text-sm/6 font-semibold !text-text-color shadow-sm hover:!bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//                         >
//                             {website.localize({
//                                 en: 'Sign in',
//                                 fr: 'Se connecter',
//                                 es: 'Iniciar sesión',
//                                 ch: '登录',
//                             })}
//                         </button>
//                     </div>
//                 </form>

//                 <p className="mt-10 text-center text-sm/6 text-text-color-60">
//                     {website.localize({
//                         en: 'Not a member?',
//                         fr: 'Pas encore membre?',
//                         es: '¿No eres miembro?',
//                         ch: '还不是会员？',
//                     })}{' '}
//                     <a href="#" className="font-semibold text-primary-600 hover:text-primary-500">
//                         {website.localize({
//                             en: 'Start for free',
//                             fr: 'Commencer gratuitement',
//                             es: 'Comience gratis',
//                             ch: '免费开始',
//                         })}
//                     </a>
//                 </p>
//             </div>
//         </div>
//     );
// };

const NavBar = ({ logo, navigation, floatingOnTop, theme, languages, refresh, logoOnLight }) => {
    const [isOpen, setIsOpen] = useState(false);
    // const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isNavHovered, setIsNavHovered] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [mobileContent, setMobileContent] = useState(null);
    const [languageDropdownWidth, setLanguageDropdownWidth] = useState(0);
    const [searchResults, setSearchResults] = useState(null);
    const navRef = useRef(null);
    const placeholderRef = useRef(null);
    const languageBtnRef = useRef(null);
    const searchManagerRef = useRef(null);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    let lastScrollY = 0;
    let ticking = false;

    // Reset state when need refresh
    useEffect(() => {
        setIsOpen(false);
        setActiveDropdown(null);
        setIsNavHovered(false);
        setMobileContent(null);
    }, [refresh]);

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

    // Handle initial opacity setup on mount and when floatingOnTop changes
    useEffect(() => {
        if (!navRef.current) return;

        if (floatingOnTop) {
            // For floating navbar, set opacity based on current scroll
            const currentScrollY = window.scrollY;
            const bgOpacity = Math.min(currentScrollY / 50, 1);
            navRef.current.style.setProperty('--nav-bg-opacity', bgOpacity);
        } else {
            // For non-floating navbar, always solid background
            navRef.current.style.setProperty('--nav-bg-opacity', '1');
        }

        // Set initial shadow opacity
        const bgShadowOpacity = Math.min(window.scrollY / 50, 1);
        navRef.current.style.setProperty('--nav-bg-shadow-opacity', bgShadowOpacity);
    }, [floatingOnTop]);

    // Set the language dropdown width based on the language button position
    useEffect(() => {
        if (!languageBtnRef.current) return;

        const reCalc = () => {
            const leftDistance = languageBtnRef.current.getBoundingClientRect().left;
            const width = languageBtnRef.current.getBoundingClientRect().width;

            let paddingLeft;

            if (window.innerWidth >= 1280) {
                paddingLeft = 96;
            } else if (window.innerWidth >= 1024) {
                paddingLeft = 64;
            } else if (window.innerWidth >= 768) {
                paddingLeft = 32;
            } else {
                paddingLeft = 24;
            }

            const offset =
                window.innerWidth >= 1728
                    ? `${(window.innerWidth - 1728) / 2 + paddingLeft}`
                    : paddingLeft;

            setLanguageDropdownWidth(leftDistance - offset + width);
        };

        window.addEventListener('resize', reCalc);

        reCalc();

        return () => window.removeEventListener('resize', reCalc);
    }, [languageBtnRef.current]);

    // Handle scroll behavior and update navbar states
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const updateNavPosition = () => {
            if (!navRef.current) return;

            const currentScrollY = window.scrollY;
            const navHeight = navRef.current.offsetHeight;

            // Update background opacity while scrolling (only for floating navbar)
            if (floatingOnTop) {
                const bgOpacity = Math.min(currentScrollY / 50, 1);
                navRef.current.style.setProperty('--nav-bg-opacity', bgOpacity);
            }

            // Update shadow opacity while scrolling
            const bgShadowOpacity = Math.min(currentScrollY / 50, 1);
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
            if (!ticking) {
                requestAnimationFrame(updateNavPosition);
                ticking = true;
            }
        };

        // Set initial state
        updateNavPosition();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
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
    };

    // Handle search submit
    const handleSearch = async (e) => {
        if (e.key === 'Enter') {
            await searchManagerRef.current.search(e.target.value);
        }
    };

    const renderDropdownContent = () => {
        const currentLanguage = website.getLanguage();

        switch (activeDropdown) {
            case 'search':
                return (
                    <div className="max-w-4xl mx-auto px-4 pt-10 pb-12">
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
                                    onClick={() => {
                                        setSearchValue('');
                                        setSearchResults(null);
                                        if (searchInputRef.current) {
                                            searchInputRef.current.focus();
                                        }
                                    }}
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
                        <div className="flex flex-col gap-4 mt-6 max-h-[60vh] overflow-scroll">
                            {searchResults?.map((result) => (
                                <Link
                                    key={result.id}
                                    to={result.href}
                                    className="flex flex-col gap-1 px-2 py-1 hover:underline"
                                    style={{ textShadow: '1px 1px 2px var(--bg-color)' }}
                                >
                                    <span className="text-base lg:text-lg">{result.title}</span>
                                    {result.description && (
                                        <span className="text-sm lg:text-base text-text-color-80">
                                            {result.description}
                                        </span>
                                    )}
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
                    <div className="max-w-9xl mx-auto px-6 md:px-8 lg:px-16 xl:px-24 pt-10 pb-12">
                        <div
                            className="flex flex-wrap gap-4 justify-end"
                            style={{
                                width: languageDropdownWidth,
                            }}
                        >
                            {languages.map((lang, index) => (
                                <div
                                    key={index}
                                    className={twJoin(
                                        'relative flex items-center px-6 py-2 rounded-lg group',
                                        currentLanguage === lang.value
                                            ? 'bg-text-color/10 cursor-not-allowed'
                                            : 'bg-transparent cursor-pointer'
                                    )}
                                    onClick={() => website.changeLanguage(lang.value)}
                                >
                                    <span className={twJoin('font-medium text-lg text-text-color')}>
                                        {lang.label}
                                    </span>
                                    {currentLanguage !== lang.value && (
                                        <span
                                            className={twJoin(
                                                'absolute bottom-1 left-6 h-0.5 bg-primary-600 transition-[width] duration-500 ease-out w-0 group-hover:w-[calc(100%-48px)]'
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
                    return (
                        <div className="max-w-9xl mx-auto px-6 md:px-8 lg:px-16 xl:px-24 pt-10 pb-12">
                            <div className="flex flex-col lg:pl-44 xl:pl-48 2xl:pl-52">
                                {navigation[activeDropdown].child_items.map((child, index) => (
                                    <Link
                                        key={index}
                                        to={child.route}
                                        className="block w-fit relative px-3 py-2 group"
                                    >
                                        <span className="text-base">{child.label}</span>
                                        <span
                                            className={twJoin(
                                                'absolute bottom-1.5 left-3 h-0.5 bg-primary-600 transition-[width] duration-500 ease-out w-0 group-hover:w-[calc(100%-24px)]'
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
                                    onClick={() => {
                                        setSearchValue('');
                                        setSearchResults(null);
                                        if (searchInputRef.current) {
                                            searchInputRef.current.focus();
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Display search results */}
                        <div className="flex flex-col gap-4 mt-6 max-h-[60vh] overflow-scroll">
                            {searchResults?.map((result) => (
                                <Link
                                    key={result.id}
                                    to={result.href}
                                    className="flex flex-col gap-1 px-2 py-1 hover:underline"
                                    style={{ textShadow: '1px 1px 2px var(--bg-color)' }}
                                >
                                    <span className="text-base lg:text-lg">{result.title}</span>
                                    {result.description && (
                                        <span className="text-sm lg:text-base text-text-color-80">
                                            {result.description}
                                        </span>
                                    )}
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
                            <Link
                                to="/"
                                className="relative text-center px-4 py-3 bg-gray-50 rounded-lg"
                            >
                                <span className="font-medium text-black">
                                    {website.localize({
                                        en: 'Sign in',
                                        fr: 'Se connecter',
                                        es: 'Iniciar sesión',
                                        ch: '登录',
                                    })}
                                </span>
                            </Link>
                            <Link
                                to="/"
                                className="relative text-center px-4 py-3 bg-primary-600 rounded-lg"
                            >
                                <span className="font-medium text-white">
                                    {website.localize({
                                        en: 'Not a member? Start for free',
                                        fr: 'Pas encore membre? Commencer gratuitement',
                                        es: '¿No eres miembro? Comience gratis',
                                        ch: '还不是会员？免费开始',
                                    })}
                                </span>
                            </Link>
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
                className={twJoin('w-screen fixed z-50', theme)}
                style={{
                    transform: 'translateY(calc(var(--scroll-progress, 0) * -100%))',
                    transition: 'transform 0.3s ease-in-out, background-color 0.3s ease',
                    backgroundColor:
                        'color-mix(in srgb, var(--bg-color), transparent calc(100% - (var(--nav-bg-opacity, 0) * 100%)))',
                    boxShadow:
                        'rgba(0, 0, 0, calc(var(--nav-bg-shadow-opacity, 0) * 0.1)) 0px 4px 6px -1px',
                    top: 0,
                }}
                onMouseLeave={handleMouseLeave}
            >
                <div className="w-full max-w-9xl mx-auto px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-24">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center space-x-12">
                            {/* Logo */}
                            <div className="flex-shrink-0 w-24 md:w-28 lg:w-32 xl:w-36 2xl:w-40">
                                <Link to="">{logo}</Link>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden lg:flex lg:items-center lg:space-x-3 xl:space-x-6">
                                {navigation.map((item, index) => {
                                    const { label, route, child_items } = item;

                                    const Wrapper = route ? Link : 'div';
                                    const wrapperProps = route ? { to: route } : {};

                                    return (
                                        <div
                                            key={index}
                                            onMouseEnter={() => handleMouseEnter(index)}
                                            className="relative"
                                        >
                                            <Wrapper
                                                {...wrapperProps}
                                                className={`inline-flex items-center px-3 py-2`}
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
                            <button
                                className="relative !bg-transparent group px-3 py-2"
                                onMouseEnter={() => handleActionMouseEnter('search')}
                            >
                                <HiSearch className="h-6 w-6" />
                                <span
                                    className={twJoin(
                                        'absolute bottom-[3px] left-3 h-0.5 bg-primary-600 transition-[width] duration-500 ease-out group-hover:w-[calc(100%-24px)]',
                                        activeDropdown === 'search' ? 'w-[calc(100%-24px)]' : 'w-0'
                                    )}
                                />
                            </button>
                            <button
                                ref={languageBtnRef}
                                className="relative !bg-transparent group px-3 py-2"
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
                            <button
                                className="relative !bg-transparent text-lg px-3 py-2 group !text-text-color"
                                onMouseEnter={() => handleActionMouseEnter('login')}
                                // onClick={() => setIsSignInOpen(true)}
                            >
                                {website.localize({
                                    en: 'Login',
                                    fr: 'Connexion',
                                    es: 'Iniciar sesión',
                                    ch: '登录',
                                })}
                                <span
                                    className={twJoin(
                                        'absolute bottom-1.5 left-3 h-0.5 bg-primary-600 transition-[width] duration-500 ease-out w-0 group-hover:w-[calc(100%-24px)]'
                                    )}
                                />
                            </button>
                            <button
                                className="!ml-3 xl:!ml-4 !bg-transparent text-lg !text-text-color whitespace-nowrap px-5 py-2 border-2 rounded-3xl border-text-color transition-[border-color] duration-200 ease-out hover:border-primary-600"
                                onMouseEnter={() => handleActionMouseEnter('signup')}
                            >
                                {website.localize({
                                    en: 'Start for free',
                                    fr: 'Commencer gratuitement',
                                    es: 'Comience gratis',
                                    ch: '免费开始',
                                })}
                            </button>
                        </div>

                        {/* Mobile Actions */}
                        <div className="lg:hidden flex items-center space-x-3.5">
                            <div onClick={() => handleMobileAction('search')}>
                                <HiSearch className="h-6 w-6" />
                            </div>
                            <div onClick={() => handleMobileAction('language')}>
                                <HiOutlineGlobeAlt className="h-6 w-6" />
                            </div>
                            <div
                                onClick={() => handleMobileAction('user')}
                                // onClick={() => setIsSignInOpen(true)}
                            >
                                <AiOutlineUser className="h-6 w-6" />
                            </div>
                            <div onClick={() => handleMobileAction('menu')}>
                                <HiOutlineMenu className="h-6 w-6" />
                                {/* {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />} */}
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

            {/* Sign In Dialog */}
            {/* <Dialog
                open={isSignInOpen}
                onClose={() => setIsSignInOpen(false)}
                className={twJoin('relative z-[100] focus:outline-none', theme)}
            >
                <div className="fixed inset-0 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 backdrop-blur-2xl">
                        <Dialog.Panel className="relative w-full max-w-md rounded-xl bg-bg-color p-6 transform transition-transform duration-300 ease-in-out">
                            <SignIn logo={logo} />

                            <div
                                className="absolute top-4 right-4 cursor-pointer"
                                onClick={() => setIsSignInOpen(false)}
                            >
                                <HiX className="w-6 h-6 text-text-color/50 hover:text-text-color" />
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog> */}

            {/* SearchManager */}
            <SearchManager ref={searchManagerRef} onResultsChange={setSearchResults} />
        </>
    );
};

export default function Header(props) {
    const { block, page } = props;
    const { themeName, main } = block;

    const { theme: nextTheme = '', allowTranslucentTop = false } = getNextBlockContext(block);

    const navigation = block.getBlockLinks({ nested: true });

    const theme = allowTranslucentTop ? nextTheme : themeName;
    const themeVariant = theme.split('__')[1];

    const banner = main?.banner;
    const icon = main?.body?.icons?.[0];
    const images = [banner, ...main?.body?.imgs].filter((img) => img);
    const logoImg = images.find((img) => img.caption === `logo-${themeVariant}`);

    const logo = icon ? (
        <Icon icon={firstIcon} className="w-full h-full" />
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
            logo={logo}
            logoOnLight={logoOnLight}
            floatingOnTop={allowTranslucentTop}
            theme={theme}
            languages={languageMap}
            refresh={activeRoute}
        />
    );
}
