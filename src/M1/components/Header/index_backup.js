// import React, { useEffect, useState } from 'react';
// import { Dialog } from '@headlessui/react';
// import { HiBars3, HiXMark } from 'react-icons/hi2';
// import { Link, twMerge, Image, twJoin, getPageProfile, Icon } from '@uniwebcms/module-sdk';
// import { CgChevronDown } from 'react-icons/cg';
// import PopoverMenu from '../_utils/PopoverMenu';
// // import LanguageToggle from './LanguageToggle';
// // import SiteSearch from './SiteSearch';
// import { getNextBlockContext } from '../_utils/context';
// import './style.css';

// const checkIsParentRoute = (activeRoute, current) => {
//     const { child_items } = current;

//     if (child_items?.length) {
//         if (child_items.some((item) => item.route === activeRoute)) {
//             return true;
//         } else {
//             return child_items.some((item) => checkIsParentRoute(activeRoute, item));
//         }
//     }

//     return false;
// };

// const isActiveRoute = (activeRoute, current) => {
//     return (
//         activeRoute === current ||
//         activeRoute === `${current}/index` ||
//         activeRoute === `${current}/[id]`
//     );
// };

// export default function Header(props) {
//     const { block, website, page } = props;
//     const { themeName: theme, main } = block;
//     const { sticky = false, alignment = 'left', mode = 'page' } = block.getBlockProperties();

//     const nextBlockContext = getNextBlockContext(block);

//     const { theme: nextTheme = '', allowTranslucentTop = false } = nextBlockContext;

//     let navigation = [];

//     if (mode == 'manual') {
//         navigation = block.getBlockLinks({ nested: true });
//     } else if (mode == 'page') {
//         navigation = website.getPageHierarchy({
//             nested: true,
//             filterEmpty: true,
//         });
//     }

//     const [initialPosition, setInitialPosition] = useState(true);
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//     const left_aligned = alignment == 'left';

//     const activeRoute = page.activeRoute;
//     const banner = main?.banner;
//     const firstIcon = main?.body?.icons?.[0];
//     const images = [];

//     window.onscroll = function () {
//         if (window.scrollY > 0 && initialPosition) {
//             setInitialPosition(false);
//         } else if (window.scrollY == 0 && !initialPosition) {
//             setInitialPosition(true);
//         }
//     };

//     useEffect(() => {
//         setMobileMenuOpen(false);
//     }, [activeRoute]);

//     const wrapperClass = ['flex max-w-full w-screen'];

//     let adaptiveTheme = theme;

//     if (allowTranslucentTop) {
//         if (initialPosition || !sticky) {
//             wrapperClass.push('absolute top-0 left-0 z-50 !bg-[unset]');
//         }

//         if (!nextTheme) {
//             adaptiveTheme = theme;
//         } else {
//             adaptiveTheme = `${nextTheme}`;
//         }
//     }

//     wrapperClass.push(adaptiveTheme);

//     if (sticky && !initialPosition) {
//         wrapperClass.push('fixed top-0 left-0 z-50 bg-bg-color');
//     }

//     if (!left_aligned) {
//         wrapperClass.push('justify-center');
//     }

//     if (main?.body?.imgs?.length) {
//         images.push(...main?.body?.imgs);
//     }

//     if (banner) {
//         images.unshift(banner);
//     }

//     let logo = null;

//     if (firstIcon) {
//         logo = <Icon icon={firstIcon} className="w-full h-full" />;
//     } else {
//         if (images.length) {
//             let logoImg = images.find((img) => {
//                 const theme = adaptiveTheme.split('__')[1];

//                 return img.caption === `logo-${theme}`;
//             });

//             if (!logoImg) {
//                 logoImg = images[0];
//             }

//             logo = (
//                 <Image
//                     profile={getPageProfile()}
//                     url={logoImg.url}
//                     value={logoImg.value}
//                     alt={logoImg.alt}
//                     className="w-full h-full object-contain"
//                 />
//             );
//         }
//     }

//     return (
//         <div className={twMerge(wrapperClass, !initialPosition && sticky && '!shadow-2xl')}>
//             <div
//                 className={twMerge(
//                     'transition-transform duration-300 flex items-center w-full px-6 lg:px-10 xl:px-12 2xl:px-16 py-3 lg:py-4 xl:py-5 2xl:py-6 justify-between lg:justify-normal max-w-10xl mx-auto'
//                 )}
//             >
//                 {logo ? (
//                     <Link
//                         to=""
//                         title="company logo"
//                         className="w-fit max-w-[9rem] lg:max-w-[10rem] 2xl:max-w-[12rem] flex-shrink-0"
//                     >
//                         <div className="h-8 lg:h-10 2xl:h-12 w-auto max-w-full">{logo}</div>
//                     </Link>
//                 ) : null}
//                 <nav
//                     className={twJoin(
//                         'hidden lg:flex 2xl:space-x-6 xl:space-x-4 lg:space-x-2 items-center w-full',
//                         left_aligned ? 'justify-start xl:ml-16 lg:ml-10' : 'justify-center'
//                     )}
//                 >
//                     {navigation.map((page, index) => {
//                         if (page.child_items?.length) {
//                             return (
//                                 <NavbarMenu
//                                     key={index}
//                                     {...page}
//                                     activeRoute={activeRoute}
//                                     theme={adaptiveTheme}
//                                 />
//                             );
//                         } else {
//                             const { route, label } = page;

//                             return (
//                                 <Link
//                                     key={index}
//                                     to={route}
//                                     className="inline-block lg:text-base xl:text-lg px-3 py-2"
//                                 >
//                                     {label}
//                                 </Link>
//                             );
//                         }
//                     })}
//                 </nav>
//                 <div className="flex items-center space-x-8 justify-end">
//                     <div className="hidden lg:block whitespace-nowrap">
//                         <span
//                             className={twJoin(
//                                 'lg:text-base xl:text-lg font-medium',
//                                 allowTranslucentTop &&
//                                     sticky &&
//                                     initialPosition &&
//                                     'text-text-color-10'
//                             )}
//                         >
//                             {website.localize({
//                                 en: 'Log in',
//                                 fr: 'Connexion',
//                             })}
//                         </span>
//                     </div>
//                     <div
//                         className={twJoin(
//                             'hidden lg:block whitespace-nowrap px-5 py-2 border border-text-color-70 rounded-3xl',
//                             allowTranslucentTop &&
//                                 sticky &&
//                                 initialPosition &&
//                                 'border-0 bg-text-color/60'
//                         )}
//                     >
//                         <span
//                             className={twJoin(
//                                 'lg:text-base xl:text-lg font-medium',
//                                 allowTranslucentTop &&
//                                     sticky &&
//                                     initialPosition &&
//                                     'text-text-color-10'
//                             )}
//                         >
//                             {website.localize({
//                                 en: 'Start for free',
//                                 fr: 'Commencer gratuitement',
//                             })}
//                         </span>
//                     </div>
//                     <button
//                         type="button"
//                         className="rounded-md p-2.5 lg:hidden !bg-[unset]"
//                         onClick={() => setMobileMenuOpen(true)}
//                     >
//                         <span className="sr-only">Open main menu</span>
//                         <HiBars3
//                             className="w-6 h-6 text-text-color-70 hover:text-text-color-90"
//                             aria-hidden="true"
//                         />
//                     </button>
//                 </div>
//                 <Dialog
//                     as="div"
//                     open={mobileMenuOpen}
//                     onClose={setMobileMenuOpen}
//                     className={adaptiveTheme}
//                 >
//                     <Dialog.Panel className="fixed inset-0 z-50 px-6 py-3 overflow-y-auto lg:hidden bg-bg-color">
//                         <div className="flex flex-row-reverse items-center justify-between">
//                             <button
//                                 type="button"
//                                 className="inline-flex items-center justify-center rounded-md p-2.5"
//                                 onClick={() => setMobileMenuOpen(false)}
//                             >
//                                 <span className="sr-only">Close menu</span>
//                                 <HiXMark
//                                     className="w-6 h-6 text-text-color-70 hover:text-text-color-90"
//                                     aria-hidden="true"
//                                 />
//                             </button>
//                             <a href="#" className="p-1.5 -ml-1.5">
//                                 <span className="sr-only">Your Company</span>
//                                 <div className="h-8 w-auto max-w-full">
//                                     {logo && <div className="w-full h-full">{logo}</div>}
//                                 </div>
//                             </a>
//                         </div>
//                         <div className="mt-6 space-y-5">
//                             {navigation.map((page, index) => {
//                                 if (page.child_items?.length) {
//                                     return (
//                                         <MobileNavbarMenu
//                                             key={index}
//                                             {...page}
//                                             activeRoute={activeRoute}
//                                         />
//                                     );
//                                 } else {
//                                     const { route, label } = page;
//                                     const active = isActiveRoute(activeRoute, route);

//                                     return (
//                                         <Link
//                                             key={index}
//                                             to={route}
//                                             className={twMerge(
//                                                 'mr-2 inline-block px-3 py-2 text-xl font-semibold leading-7 text-text-color'
//                                             )}
//                                         >
//                                             {label}
//                                         </Link>
//                                     );
//                                 }
//                             })}
//                         </div>
//                     </Dialog.Panel>
//                 </Dialog>
//             </div>
//         </div>
//     );
// }

// const MobileNavbarMenu = ({ label, route, child_items, hasData, activeRoute }) => {
//     const active = isActiveRoute(activeRoute, route);

//     return (
//         <div>
//             {hasData ? (
//                 <Link
//                     to={route}
//                     className={twMerge(
//                         'block px-3 py-2 text-xl font-semibold leading-7 text-text-color-90 hover:text-text-color w-fit'
//                     )}
//                 >
//                     {label}
//                 </Link>
//             ) : (
//                 <p
//                     className={twMerge(
//                         'px-3 py-2 text-xl font-semibold leading-7 text-text-color-70'
//                     )}
//                 >
//                     {label}
//                 </p>
//             )}
//             <div className="px-3 mt-1 grid grid-cols-2 md:grid-cols-2 gap-2">
//                 {child_items.map((item, index) => {
//                     const { route, label, child_items, hasData } = item;
//                     const active = isActiveRoute(activeRoute, route);

//                     return (
//                         <div key={index} className={twJoin('')}>
//                             {hasData ? (
//                                 <Link
//                                     key={index}
//                                     to={route}
//                                     className={twMerge(
//                                         'block text-lg font-medium leading-7 text-text-color-90 hover:text-text-color w-fit'
//                                     )}
//                                 >
//                                     {label}
//                                 </Link>
//                             ) : (
//                                 <p className="block text-lg font-medium leading-7 text-text-color-70">
//                                     {label}
//                                 </p>
//                             )}
//                             {child_items?.length ? (
//                                 <ul className="list-disc list-inside">
//                                     {child_items.map((item, index) => {
//                                         const { route, label } = item;
//                                         const active = isActiveRoute(activeRoute, route);

//                                         return (
//                                             <Link
//                                                 key={index}
//                                                 to={route}
//                                                 className={twMerge(
//                                                     'list-item px-3 text-base font-semibold leading-7 text-text-color-90 hover:text-text-color w-fit'
//                                                 )}
//                                             >
//                                                 {label}
//                                             </Link>
//                                         );
//                                     })}
//                                 </ul>
//                             ) : null}
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// const buildNavigationMenu = (items, level, activeRoute) => {
//     return items.map((item, index) => {
//         const { route, label, child_items, hasData } = item;

//         const isFirst = index === 0;
//         const isLast = index === items.length - 1;

//         const active = isActiveRoute(activeRoute, route);
//         const isParentRoute = checkIsParentRoute(activeRoute, { child_items });

//         return (
//             <div
//                 key={index}
//                 className={twJoin(
//                     'bg-text-color-0 hover:bg-text-color-10 relative group w-60 lg:w-72 xl:w-80',
//                     isFirst && 'rounded-t-md',
//                     isLast && 'rounded-b-md'
//                 )}
//             >
//                 {hasData ? (
//                     <Link
//                         key={index}
//                         to={route}
//                         className={twMerge(
//                             'block w-full h-full px-6 py-4 text-base font-medium lg:text-[17px] text-text-color-90 hover:text-text-color',
//                             isParentRoute && 'underline decoration-link-color'
//                         )}
//                     >
//                         {label}
//                     </Link>
//                 ) : (
//                     <p
//                         className="w-full h-full px-6 py-4 text-base font-medium lg:text-[17px] text-text-color-70"
//                         onClick={(e) => {
//                             e.preventDefault();
//                             e.stopPropagation();
//                         }}
//                     >
//                         {label}
//                     </p>
//                 )}
//                 {child_items?.length ? (
//                     <div
//                         className="absolute -top-1 left-[230px] lg:left-[280px] rounded-md shadow ring-1 ring-text-color-20 ring-opacity-10 divide-y divide-text-color-20 invisible group-hover:visible"
//                         style={{ zIndex: level }}
//                         onClick={(e) => {
//                             e.stopPropagation;
//                         }}
//                     >
//                         {buildNavigationMenu(child_items, level + 10, activeRoute)}
//                     </div>
//                 ) : null}
//             </div>
//         );
//     });
// };

// const NavbarMenu = ({ label, route, child_items, hasData, activeRoute, theme }) => {
//     const linkClass = 'inline-flex items-center space-x-1 xl:text-xl lg:text-lg px-3 py-2 group';
//     const iconClass =
//         'w-5 h-5 mb-0.5 text-inherit transition-transform transform group-hover:translate-y-0.5 duration-300';

//     const trigger = hasData ? (
//         <Link to={route} className={linkClass}>
//             <p>{label}</p>
//             <CgChevronDown className={iconClass} />
//         </Link>
//     ) : (
//         <div className={linkClass}>
//             <p>{label}</p>
//             <CgChevronDown className={iconClass} />
//         </div>
//     );

//     return (
//         <PopoverMenu
//             trigger={trigger}
//             options={buildNavigationMenu(child_items, 10, activeRoute, theme)}
//         />
//     );
// };

//v1
// import React, { useState, useEffect } from 'react';
// import { Menu, ChevronDown, Search, Globe, X } from 'lucide-react';

// // Sample navigation data structure
// const navigation = [
//     {
//         name: 'Products',
//         href: '#',
//         children: [
//             { name: 'Analytics', href: '#' },
//             { name: 'Engagement', href: '#' },
//             { name: 'Security', href: '#' },
//             { name: 'Integrations', href: '#' },
//         ],
//     },
//     {
//         name: 'Solutions',
//         href: '#',
//         children: [
//             { name: 'Enterprise', href: '#' },
//             { name: 'Small Business', href: '#' },
//             { name: 'Startups', href: '#' },
//         ],
//     },
//     { name: 'Pricing', href: '#' },
//     { name: 'About', href: '#' },
// ];

// const Navbar = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [activeDropdown, setActiveDropdown] = useState(null);
//     const [prevScrollPos, setPrevScrollPos] = useState(0);
//     const [visible, setVisible] = useState(true);

//     // Handle scroll behavior
//     useEffect(() => {
//         const handleScroll = () => {
//             const currentScrollPos = window.scrollY;
//             const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

//             setPrevScrollPos(currentScrollPos);
//             setVisible(visible);
//         };

//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, [prevScrollPos]);

//     // Handle dropdown hover for desktop
//     const handleMouseEnter = (index) => {
//         if (window.innerWidth >= 1024) {
//             setActiveDropdown(index);
//         }
//     };

//     const handleMouseLeave = () => {
//         if (window.innerWidth >= 1024) {
//             setActiveDropdown(null);
//         }
//     };

//     return (
//         <>
//             <nav
//                 className={`fixed w-full bg-white shadow-md transition-transform duration-300 z-50 ${
//                     visible ? 'translate-y-0' : '-translate-y-full'
//                 }`}
//             >
//                 <div className="max-w-7xl mx-auto px-4">
//                     <div className="flex justify-between h-16 items-center">
//                         {/* Logo */}
//                         <div className="flex-shrink-0">
//                             <a href="#" className="text-xl font-bold">
//                                 Logo
//                             </a>
//                         </div>

//                         {/* Desktop Navigation */}
//                         <div className="hidden lg:flex lg:items-center lg:space-x-8">
//                             {navigation.map((item, index) => (
//                                 <div
//                                     key={item.name}
//                                     className="relative"
//                                     onMouseEnter={() => handleMouseEnter(index)}
//                                     onMouseLeave={handleMouseLeave}
//                                 >
//                                     <button className="inline-flex items-center text-gray-700 hover:text-gray-900 px-3 py-2">
//                                         {item.name}
//                                         {item.children && <ChevronDown className="ml-1 h-4 w-4" />}
//                                     </button>

//                                     {/* Desktop Dropdown */}
//                                     {item.children && activeDropdown === index && (
//                                         <div className="absolute left-0 w-screen bg-white shadow-lg mt-2 -ml-4 transform -translate-x-1/4">
//                                             <div className="grid grid-cols-2 gap-6 px-8 py-6 max-w-7xl mx-auto">
//                                                 {item.children.map((child) => (
//                                                     <a
//                                                         key={child.name}
//                                                         href={child.href}
//                                                         className="text-gray-700 hover:text-gray-900 block px-4 py-2"
//                                                     >
//                                                         {child.name}
//                                                     </a>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Desktop Right Side Actions */}
//                         <div className="hidden lg:flex lg:items-center lg:space-x-4">
//                             <button className="p-2 hover:bg-gray-100 rounded-full">
//                                 <Search className="h-5 w-5" />
//                             </button>
//                             <button className="p-2 hover:bg-gray-100 rounded-full">
//                                 <Globe className="h-5 w-5" />
//                             </button>
//                             <button className="px-4 py-2 text-gray-700 hover:text-gray-900">
//                                 Login
//                             </button>
//                             <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//                                 Sign up
//                             </button>
//                         </div>

//                         {/* Mobile menu button */}
//                         <div className="lg:hidden">
//                             <button
//                                 onClick={() => setIsOpen(!isOpen)}
//                                 className="p-2 rounded-md text-gray-700 hover:text-gray-900"
//                             >
//                                 {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Mobile menu */}
//                 {isOpen && (
//                     <div className="lg:hidden">
//                         <div className="px-2 pt-2 pb-3 space-y-1">
//                             {navigation.map((item) => (
//                                 <div key={item.name}>
//                                     <button
//                                         onClick={() =>
//                                             setActiveDropdown(
//                                                 activeDropdown === item.name ? null : item.name
//                                             )
//                                         }
//                                         className="w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
//                                     >
//                                         <div className="flex justify-between items-center">
//                                             {item.name}
//                                             {item.children && (
//                                                 <ChevronDown
//                                                     className={`h-4 w-4 transform transition-transform ${
//                                                         activeDropdown === item.name
//                                                             ? 'rotate-180'
//                                                             : ''
//                                                     }`}
//                                                 />
//                                             )}
//                                         </div>
//                                     </button>
//                                     {item.children && activeDropdown === item.name && (
//                                         <div className="pl-4 space-y-1">
//                                             {item.children.map((child) => (
//                                                 <a
//                                                     key={child.name}
//                                                     href={child.href}
//                                                     className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
//                                                 >
//                                                     {child.name}
//                                                 </a>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="px-4 py-3 border-t border-gray-200">
//                             <div className="flex flex-col space-y-3">
//                                 <button className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
//                                     <Search className="h-5 w-5 mr-2" />
//                                     Search
//                                 </button>
//                                 <button className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
//                                     <Globe className="h-5 w-5 mr-2" />
//                                     Language
//                                 </button>
//                                 <button className="px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
//                                     Login
//                                 </button>
//                                 <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//                                     Sign up
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </nav>

//             {/* Overlay for desktop dropdowns */}
//             {activeDropdown !== null && window.innerWidth >= 1024 && (
//                 <div
//                     className="fixed inset-0 bg-gray-800/20 backdrop-blur-sm z-40"
//                     onClick={() => setActiveDropdown(null)}
//                 />
//             )}
//         </>
//     );
// };
//
// export default Navbar;

// v2
// import React, { useState, useEffect } from 'react';
// import { Menu, ChevronDown, Search, Globe, X } from 'lucide-react';

// // Sample navigation data structure
// const navigation = [
//     {
//         name: 'Products',
//         href: '#',
//         children: [
//             { name: 'Analytics', href: '#' },
//             { name: 'Engagement', href: '#' },
//             { name: 'Security', href: '#' },
//             { name: 'Integrations', href: '#' },
//         ],
//     },
//     {
//         name: 'Solutions',
//         href: '#',
//         children: [
//             { name: 'Enterprise', href: '#' },
//             { name: 'Small Business', href: '#' },
//             { name: 'Startups', href: '#' },
//         ],
//     },
//     { name: 'Pricing', href: '#' },
//     { name: 'About', href: '#' },
// ];

// const Navbar = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [activeDropdown, setActiveDropdown] = useState(null);
//     const [prevScrollPos, setPrevScrollPos] = useState(0);
//     const [visible, setVisible] = useState(true);
//     const [isNavHovered, setIsNavHovered] = useState(false);

//     // Handle scroll behavior
//     useEffect(() => {
//         const handleScroll = () => {
//             const currentScrollPos = window.scrollY;
//             const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

//             setPrevScrollPos(currentScrollPos);
//             setVisible(visible);
//         };

//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, [prevScrollPos]);

//     // Handle dropdown hover for desktop
//     const handleMouseEnter = (index) => {
//         if (window.innerWidth >= 1024) {
//             setActiveDropdown(index);
//             setIsNavHovered(true);
//         }
//     };

//     const handleMouseLeave = () => {
//         if (window.innerWidth >= 1024) {
//             setIsNavHovered(false);
//             // Small delay to allow moving to dropdown menu
//             setTimeout(() => {
//                 if (!isNavHovered) {
//                     setActiveDropdown(null);
//                 }
//             }, 100);
//         }
//     };

//     return (
//         <>
//             <nav
//                 className={`fixed w-full bg-white shadow-md transition-transform duration-300 z-50 ${
//                     visible ? 'translate-y-0' : '-translate-y-full'
//                 }`}
//                 onMouseLeave={handleMouseLeave}
//             >
//                 <div className="max-w-7xl mx-auto px-4">
//                     <div className="flex justify-between h-16 items-center">
//                         {/* Logo */}
//                         <div className="flex-shrink-0">
//                             <a href="#" className="text-xl font-bold">
//                                 Logo
//                             </a>
//                         </div>

//                         {/* Desktop Navigation */}
//                         <div className="hidden lg:flex lg:items-center lg:space-x-8">
//                             {navigation.map((item, index) => (
//                                 <div
//                                     key={item.name}
//                                     onMouseEnter={() => handleMouseEnter(index)}
//                                     className="relative"
//                                 >
//                                     <button
//                                         className={`inline-flex items-center px-3 py-2 ${
//                                             activeDropdown === index
//                                                 ? 'text-gray-900'
//                                                 : 'text-gray-700 hover:text-gray-900'
//                                         }`}
//                                     >
//                                         {item.name}
//                                         {item.children && <ChevronDown className="ml-1 h-4 w-4" />}
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Desktop Right Side Actions */}
//                         <div className="hidden lg:flex lg:items-center lg:space-x-4">
//                             <button className="p-2 hover:bg-gray-100 rounded-full">
//                                 <Search className="h-5 w-5" />
//                             </button>
//                             <button className="p-2 hover:bg-gray-100 rounded-full">
//                                 <Globe className="h-5 w-5" />
//                             </button>
//                             <button className="px-4 py-2 text-gray-700 hover:text-gray-900">
//                                 Login
//                             </button>
//                             <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//                                 Sign up
//                             </button>
//                         </div>

//                         {/* Mobile menu button */}
//                         <div className="lg:hidden">
//                             <button
//                                 onClick={() => setIsOpen(!isOpen)}
//                                 className="p-2 rounded-md text-gray-700 hover:text-gray-900"
//                             >
//                                 {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Desktop Dropdown - Moved outside the navigation items loop */}
//                 {activeDropdown !== null && navigation[activeDropdown]?.children && (
//                     <div
//                         className="absolute left-0 w-full bg-white shadow-lg border-t"
//                         onMouseEnter={() => setIsNavHovered(true)}
//                         onMouseLeave={() => setIsNavHovered(false)}
//                     >
//                         <div className="max-w-7xl mx-auto px-4 py-6">
//                             <div className="grid grid-cols-2 gap-6">
//                                 {navigation[activeDropdown].children.map((child) => (
//                                     <a
//                                         key={child.name}
//                                         href={child.href}
//                                         className="text-gray-700 hover:text-gray-900 block px-4 py-2"
//                                     >
//                                         {child.name}
//                                     </a>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Mobile menu */}
//                 {isOpen && (
//                     <div className="lg:hidden">
//                         <div className="px-2 pt-2 pb-3 space-y-1">
//                             {navigation.map((item) => (
//                                 <div key={item.name}>
//                                     <button
//                                         onClick={() =>
//                                             setActiveDropdown(
//                                                 activeDropdown === item.name ? null : item.name
//                                             )
//                                         }
//                                         className="w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
//                                     >
//                                         <div className="flex justify-between items-center">
//                                             {item.name}
//                                             {item.children && (
//                                                 <ChevronDown
//                                                     className={`h-4 w-4 transform transition-transform ${
//                                                         activeDropdown === item.name
//                                                             ? 'rotate-180'
//                                                             : ''
//                                                     }`}
//                                                 />
//                                             )}
//                                         </div>
//                                     </button>
//                                     {item.children && activeDropdown === item.name && (
//                                         <div className="pl-4 space-y-1">
//                                             {item.children.map((child) => (
//                                                 <a
//                                                     key={child.name}
//                                                     href={child.href}
//                                                     className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
//                                                 >
//                                                     {child.name}
//                                                 </a>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="px-4 py-3 border-t border-gray-200">
//                             <div className="flex flex-col space-y-3">
//                                 <button className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
//                                     <Search className="h-5 w-5 mr-2" />
//                                     Search
//                                 </button>
//                                 <button className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
//                                     <Globe className="h-5 w-5 mr-2" />
//                                     Language
//                                 </button>
//                                 <button className="px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
//                                     Login
//                                 </button>
//                                 <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//                                     Sign up
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </nav>

//             {/* Overlay for desktop dropdowns */}
//             {activeDropdown !== null && window.innerWidth >= 1024 && (
//                 <div
//                     className="fixed inset-0 bg-gray-800/20 backdrop-blur-sm z-40"
//                     onClick={() => setActiveDropdown(null)}
//                 />
//             )}
//         </>
//     );
// };

// export default Navbar;

// v3
// import React, { useState, useEffect } from 'react';
// import { Menu, ChevronDown, Search, Globe, X } from 'lucide-react';

// // Sample navigation data structure
// const navigation = [
//     {
//         name: 'Products',
//         href: '#',
//         children: [
//             { name: 'Analytics', href: '#' },
//             { name: 'Engagement', href: '#' },
//             { name: 'Security', href: '#' },
//             { name: 'Integrations', href: '#' },
//         ],
//     },
//     {
//         name: 'Solutions',
//         href: '#',
//         children: [
//             { name: 'Enterprise', href: '#' },
//             { name: 'Small Business', href: '#' },
//             { name: 'Startups', href: '#' },
//         ],
//     },
//     { name: 'Pricing', href: '#' },
//     { name: 'About', href: '#' },
// ];

// const Navbar = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [activeDropdown, setActiveDropdown] = useState(null);
//     const [prevScrollPos, setPrevScrollPos] = useState(0);
//     const [visible, setVisible] = useState(true);
//     const [isNavHovered, setIsNavHovered] = useState(false);

//     // Handle scroll behavior
//     useEffect(() => {
//         const handleScroll = () => {
//             const currentScrollPos = window.scrollY;
//             const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

//             setPrevScrollPos(currentScrollPos);
//             setVisible(visible);
//         };

//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, [prevScrollPos]);

//     // Handle scroll locking
//     useEffect(() => {
//         const shouldLockScroll = activeDropdown !== null && window.innerWidth >= 1024;

//         if (shouldLockScroll) {
//             // Store current scroll position
//             const scrollPosition = window.pageYOffset;
//             // Add padding to prevent content shift
//             const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

//             document.body.style.position = 'fixed';
//             document.body.style.top = `-${scrollPosition}px`;
//             document.body.style.width = '100%';
//             document.body.style.paddingRight = `${scrollbarWidth}px`;
//         } else {
//             // Restore scroll position
//             const scrollPosition = document.body.style.top;
//             document.body.style.position = '';
//             document.body.style.top = '';
//             document.body.style.width = '';
//             document.body.style.paddingRight = '';

//             if (scrollPosition) {
//                 window.scrollTo(0, parseInt(scrollPosition.slice(1)) || 0);
//             }
//         }

//         return () => {
//             document.body.style.position = '';
//             document.body.style.top = '';
//             document.body.style.width = '';
//             document.body.style.paddingRight = '';
//         };
//     }, [activeDropdown]);

//     // Handle dropdown hover for desktop
//     const handleMouseEnter = (index) => {
//         if (window.innerWidth >= 1024) {
//             setActiveDropdown(index);
//             setIsNavHovered(true);
//         }
//     };

//     const handleMouseLeave = () => {
//         if (window.innerWidth >= 1024) {
//             setIsNavHovered(false);
//             // Small delay to allow moving to dropdown menu
//             setTimeout(() => {
//                 if (!isNavHovered) {
//                     setActiveDropdown(null);
//                 }
//             }, 100);
//         }
//     };

//     return (
//         <>
//             <nav
//                 className={`fixed w-full bg-white shadow-md transition-transform duration-300 z-50 ${
//                     visible ? 'translate-y-0' : '-translate-y-full'
//                 }`}
//                 onMouseLeave={handleMouseLeave}
//             >
//                 <div className="max-w-7xl mx-auto px-4">
//                     <div className="flex justify-between h-16 items-center">
//                         {/* Logo */}
//                         <div className="flex-shrink-0">
//                             <a href="#" className="text-xl font-bold">
//                                 Logo
//                             </a>
//                         </div>

//                         {/* Desktop Navigation */}
//                         <div className="hidden lg:flex lg:items-center lg:space-x-8">
//                             {navigation.map((item, index) => (
//                                 <div
//                                     key={item.name}
//                                     onMouseEnter={() => handleMouseEnter(index)}
//                                     className="relative"
//                                 >
//                                     <button
//                                         className={`inline-flex items-center px-3 py-2 ${
//                                             activeDropdown === index
//                                                 ? 'text-gray-900'
//                                                 : 'text-gray-700 hover:text-gray-900'
//                                         }`}
//                                     >
//                                         {item.name}
//                                         {item.children && <ChevronDown className="ml-1 h-4 w-4" />}
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Desktop Right Side Actions */}
//                         <div className="hidden lg:flex lg:items-center lg:space-x-4">
//                             <button className="p-2 hover:bg-gray-100 rounded-full">
//                                 <Search className="h-5 w-5" />
//                             </button>
//                             <button className="p-2 hover:bg-gray-100 rounded-full">
//                                 <Globe className="h-5 w-5" />
//                             </button>
//                             <button className="px-4 py-2 text-gray-700 hover:text-gray-900">
//                                 Login
//                             </button>
//                             <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//                                 Sign up
//                             </button>
//                         </div>

//                         {/* Mobile menu button */}
//                         <div className="lg:hidden">
//                             <button
//                                 onClick={() => setIsOpen(!isOpen)}
//                                 className="p-2 rounded-md text-gray-700 hover:text-gray-900"
//                             >
//                                 {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Desktop Dropdown */}
//                 {activeDropdown !== null && navigation[activeDropdown]?.children && (
//                     <div
//                         className="absolute left-0 w-full bg-white shadow-lg border-t"
//                         onMouseEnter={() => setIsNavHovered(true)}
//                         onMouseLeave={() => setIsNavHovered(false)}
//                     >
//                         <div className="max-w-7xl mx-auto px-4 py-6">
//                             <div className="grid grid-cols-2 gap-6">
//                                 {navigation[activeDropdown].children.map((child) => (
//                                     <a
//                                         key={child.name}
//                                         href={child.href}
//                                         className="text-gray-700 hover:text-gray-900 block px-4 py-2"
//                                     >
//                                         {child.name}
//                                     </a>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Mobile menu */}
//                 {isOpen && (
//                     <div className="lg:hidden">
//                         <div className="px-2 pt-2 pb-3 space-y-1">
//                             {navigation.map((item) => (
//                                 <div key={item.name}>
//                                     <button
//                                         onClick={() =>
//                                             setActiveDropdown(
//                                                 activeDropdown === item.name ? null : item.name
//                                             )
//                                         }
//                                         className="w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
//                                     >
//                                         <div className="flex justify-between items-center">
//                                             {item.name}
//                                             {item.children && (
//                                                 <ChevronDown
//                                                     className={`h-4 w-4 transform transition-transform ${
//                                                         activeDropdown === item.name
//                                                             ? 'rotate-180'
//                                                             : ''
//                                                     }`}
//                                                 />
//                                             )}
//                                         </div>
//                                     </button>
//                                     {item.children && activeDropdown === item.name && (
//                                         <div className="pl-4 space-y-1">
//                                             {item.children.map((child) => (
//                                                 <a
//                                                     key={child.name}
//                                                     href={child.href}
//                                                     className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
//                                                 >
//                                                     {child.name}
//                                                 </a>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="px-4 py-3 border-t border-gray-200">
//                             <div className="flex flex-col space-y-3">
//                                 <button className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
//                                     <Search className="h-5 w-5 mr-2" />
//                                     Search
//                                 </button>
//                                 <button className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
//                                     <Globe className="h-5 w-5 mr-2" />
//                                     Language
//                                 </button>
//                                 <button className="px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
//                                     Login
//                                 </button>
//                                 <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//                                     Sign up
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </nav>

//             {/* Overlay for desktop dropdowns */}
//             {activeDropdown !== null && window.innerWidth >= 1024 && (
//                 <div
//                     className="fixed inset-0 bg-gray-800/20 backdrop-blur-sm z-40"
//                     onClick={() => setActiveDropdown(null)}
//                 />
//             )}
//         </>
//     );
// };

// export default Navbar;

// v4 good with links and menu
// import React, { useState, useEffect, useRef } from 'react';
// import { Menu, ChevronDown, Search, Globe, X } from 'lucide-react';

// // Sample navigation data structure
// const navigation = [
//     {
//         name: 'Products',
//         href: '#',
//         children: [
//             { name: 'Analytics', href: '#' },
//             { name: 'Engagement', href: '#' },
//             { name: 'Security', href: '#' },
//             { name: 'Integrations', href: '#' },
//         ],
//     },
//     {
//         name: 'Solutions',
//         href: '#',
//         children: [
//             { name: 'Enterprise', href: '#' },
//             { name: 'Small Business', href: '#' },
//             { name: 'Startups', href: '#' },
//         ],
//     },
//     { name: 'Pricing', href: '#' },
//     { name: 'About', href: '#' },
// ];

// const Navbar = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [activeDropdown, setActiveDropdown] = useState(null);
//     const [prevScrollPos, setPrevScrollPos] = useState(0);
//     const [visible, setVisible] = useState(true);
//     const [isNavHovered, setIsNavHovered] = useState(false);
//     const dropdownRef = useRef(null);

//     // Handle scroll behavior
//     useEffect(() => {
//         const handleScroll = () => {
//             const currentScrollPos = window.scrollY;
//             const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

//             setPrevScrollPos(currentScrollPos);
//             setVisible(visible);
//         };

//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, [prevScrollPos]);

//     // Handle scroll locking
//     useEffect(() => {
//         const shouldLockScroll = activeDropdown !== null && window.innerWidth >= 1024;

//         if (shouldLockScroll) {
//             // Save the current scroll width before locking
//             const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

//             // Lock scroll
//             document.body.style.overflow = 'hidden';
//             // Prevent content shift
//             document.body.style.paddingRight = `${scrollbarWidth}px`;
//         } else {
//             // Unlock scroll
//             document.body.style.overflow = '';
//             document.body.style.paddingRight = '';
//         }

//         return () => {
//             // Cleanup - ensure scroll is unlocked when component unmounts
//             document.body.style.overflow = '';
//             document.body.style.paddingRight = '';
//         };
//     }, [activeDropdown]);

//     // Handle mouse movement for dropdown
//     useEffect(() => {
//         const handleMouseMove = (e) => {
//             if (!dropdownRef.current || window.innerWidth < 1024) return;

//             const dropdownRect = dropdownRef.current.getBoundingClientRect();
//             const isMouseBelowDropdown = e.clientY > dropdownRect.top + dropdownRect.height;

//             if (isMouseBelowDropdown) {
//                 setIsNavHovered(false);
//                 setActiveDropdown(null);
//             }
//         };

//         if (activeDropdown !== null) {
//             window.addEventListener('mousemove', handleMouseMove);
//             return () => window.removeEventListener('mousemove', handleMouseMove);
//         }
//     }, [activeDropdown]);
//     // Handle dropdown hover for desktop
//     const handleMouseEnter = (index) => {
//         if (window.innerWidth >= 1024) {
//             setActiveDropdown(index);
//             setIsNavHovered(true);
//         }
//     };

//     const handleMouseLeave = () => {
//         if (window.innerWidth >= 1024) {
//             setIsNavHovered(false);
//             // Small delay to allow moving to dropdown menu
//             setTimeout(() => {
//                 if (!isNavHovered) {
//                     setActiveDropdown(null);
//                 }
//             }, 100);
//         }
//     };

//     return (
//         <>
//             <nav
//                 className={`fixed w-full bg-white shadow-md transition-transform duration-300 z-50 ${
//                     visible ? 'translate-y-0' : '-translate-y-full'
//                 }`}
//                 onMouseLeave={handleMouseLeave}
//             >
//                 <div className="max-w-7xl mx-auto px-4">
//                     <div className="flex justify-between h-16 items-center">
//                         {/* Logo */}
//                         <div className="flex-shrink-0">
//                             <a href="#" className="text-xl font-bold">
//                                 Logo
//                             </a>
//                         </div>

//                         {/* Desktop Navigation */}
//                         <div className="hidden lg:flex lg:items-center lg:space-x-8">
//                             {navigation.map((item, index) => (
//                                 <div
//                                     key={item.name}
//                                     onMouseEnter={() => handleMouseEnter(index)}
//                                     className="relative"
//                                 >
//                                     <button
//                                         className={`inline-flex items-center px-3 py-2 ${
//                                             activeDropdown === index
//                                                 ? 'text-gray-900'
//                                                 : 'text-gray-700 hover:text-gray-900'
//                                         }`}
//                                     >
//                                         {item.name}
//                                         {item.children && <ChevronDown className="ml-1 h-4 w-4" />}
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Desktop Right Side Actions */}
//                         <div className="hidden lg:flex lg:items-center lg:space-x-4">
//                             <button className="p-2 hover:bg-gray-100 rounded-full">
//                                 <Search className="h-5 w-5" />
//                             </button>
//                             <button className="p-2 hover:bg-gray-100 rounded-full">
//                                 <Globe className="h-5 w-5" />
//                             </button>
//                             <button className="px-4 py-2 text-gray-700 hover:text-gray-900">
//                                 Login
//                             </button>
//                             <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//                                 Sign up
//                             </button>
//                         </div>

//                         {/* Mobile menu button */}
//                         <div className="lg:hidden">
//                             <button
//                                 onClick={() => setIsOpen(!isOpen)}
//                                 className="p-2 rounded-md text-gray-700 hover:text-gray-900"
//                             >
//                                 {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Desktop Dropdown */}
//                 {activeDropdown !== null && navigation[activeDropdown]?.children && (
//                     <div
//                         ref={dropdownRef}
//                         className="absolute left-0 w-full bg-white shadow-lg border-t"
//                         onMouseEnter={() => setIsNavHovered(true)}
//                         onMouseLeave={() => setIsNavHovered(false)}
//                     >
//                         <div className="max-w-7xl mx-auto px-4 py-6">
//                             <div className="grid grid-cols-2 gap-6">
//                                 {navigation[activeDropdown].children.map((child) => (
//                                     <a
//                                         key={child.name}
//                                         href={child.href}
//                                         className="text-gray-700 hover:text-gray-900 block px-4 py-2"
//                                     >
//                                         {child.name}
//                                     </a>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Mobile menu */}
//                 {isOpen && (
//                     <div className="lg:hidden">
//                         <div className="px-2 pt-2 pb-3 space-y-1">
//                             {navigation.map((item) => (
//                                 <div key={item.name}>
//                                     <button
//                                         onClick={() =>
//                                             setActiveDropdown(
//                                                 activeDropdown === item.name ? null : item.name
//                                             )
//                                         }
//                                         className="w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
//                                     >
//                                         <div className="flex justify-between items-center">
//                                             {item.name}
//                                             {item.children && (
//                                                 <ChevronDown
//                                                     className={`h-4 w-4 transform transition-transform ${
//                                                         activeDropdown === item.name
//                                                             ? 'rotate-180'
//                                                             : ''
//                                                     }`}
//                                                 />
//                                             )}
//                                         </div>
//                                     </button>
//                                     {item.children && activeDropdown === item.name && (
//                                         <div className="pl-4 space-y-1">
//                                             {item.children.map((child) => (
//                                                 <a
//                                                     key={child.name}
//                                                     href={child.href}
//                                                     className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
//                                                 >
//                                                     {child.name}
//                                                 </a>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="px-4 py-3 border-t border-gray-200">
//                             <div className="flex flex-col space-y-3">
//                                 <button className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
//                                     <Search className="h-5 w-5 mr-2" />
//                                     Search
//                                 </button>
//                                 <button className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
//                                     <Globe className="h-5 w-5 mr-2" />
//                                     Language
//                                 </button>
//                                 <button className="px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
//                                     Login
//                                 </button>
//                                 <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//                                     Sign up
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </nav>

//             {/* Overlay for desktop dropdowns */}
//             {activeDropdown !== null && window.innerWidth >= 1024 && (
//                 <div
//                     className="fixed inset-0 bg-gray-800/20 backdrop-blur-sm z-40"
//                     onClick={() => setActiveDropdown(null)}
//                 />
//             )}
//         </>
//     );
// };

// export default Navbar;

// v5 good search and language
// import React, { useState, useEffect, useRef } from 'react';
// import { Menu, ChevronDown, Search, Globe, X } from 'lucide-react';

// // Sample navigation data structure
// const navigation = [
//     {
//         name: 'Products',
//         href: '#',
//         children: [
//             { name: 'Analytics', href: '#' },
//             { name: 'Engagement', href: '#' },
//             { name: 'Security', href: '#' },
//             { name: 'Integrations', href: '#' },
//         ],
//     },
//     {
//         name: 'Solutions',
//         href: '#',
//         children: [
//             { name: 'Enterprise', href: '#' },
//             { name: 'Small Business', href: '#' },
//             { name: 'Startups', href: '#' },
//         ],
//     },
//     { name: 'Pricing', href: '#' },
//     { name: 'About', href: '#' },
// ];

// // Language options
// const languages = [
//     { code: 'en', name: 'English', flag: '🇺🇸' },
//     { code: 'es', name: 'Español', flag: '🇪🇸' },
//     { code: 'fr', name: 'Français', flag: '🇫🇷' },
//     { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
//     { code: 'zh', name: '中文', flag: '🇨🇳' },
//     { code: 'ja', name: '日本語', flag: '🇯🇵' },
// ];

// const Navbar = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [activeDropdown, setActiveDropdown] = useState(null);
//     const [prevScrollPos, setPrevScrollPos] = useState(0);
//     const [visible, setVisible] = useState(true);
//     const [isNavHovered, setIsNavHovered] = useState(false);
//     const dropdownRef = useRef(null);
//     const searchInputRef = useRef(null);

//     // Handle scroll behavior
//     useEffect(() => {
//         const handleScroll = () => {
//             const currentScrollPos = window.scrollY;
//             const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

//             setPrevScrollPos(currentScrollPos);
//             setVisible(visible);
//         };

//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, [prevScrollPos]);

//     // Handle scroll locking
//     useEffect(() => {
//         const shouldLockScroll = activeDropdown !== null && window.innerWidth >= 1024;

//         if (shouldLockScroll) {
//             // Save the current scroll width before locking
//             const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

//             // Lock scroll
//             document.body.style.overflow = 'hidden';
//             // Prevent content shift
//             document.body.style.paddingRight = `${scrollbarWidth}px`;
//         } else {
//             // Unlock scroll
//             document.body.style.overflow = '';
//             document.body.style.paddingRight = '';
//         }

//         return () => {
//             // Cleanup - ensure scroll is unlocked when component unmounts
//             document.body.style.overflow = '';
//             document.body.style.paddingRight = '';
//         };
//     }, [activeDropdown]);

//     // Handle mouse movement for dropdown
//     useEffect(() => {
//         const handleMouseMove = (e) => {
//             if (!dropdownRef.current || window.innerWidth < 1024) return;

//             const dropdownRect = dropdownRef.current.getBoundingClientRect();
//             const isMouseBelowDropdown = e.clientY > dropdownRect.top + dropdownRect.height;

//             if (isMouseBelowDropdown) {
//                 setIsNavHovered(false);
//                 setActiveDropdown(null);
//             }
//         };

//         if (activeDropdown !== null) {
//             window.addEventListener('mousemove', handleMouseMove);
//             return () => window.removeEventListener('mousemove', handleMouseMove);
//         }
//     }, [activeDropdown]);

//     // Focus search input when search dropdown opens
//     useEffect(() => {
//         if (activeDropdown === 'search' && searchInputRef.current) {
//             searchInputRef.current.focus();
//         }
//     }, [activeDropdown]);

//     // Handle dropdown hover for desktop
//     const handleMouseEnter = (index) => {
//         if (window.innerWidth >= 1024) {
//             setActiveDropdown(index);
//             setIsNavHovered(true);
//         }
//     };

//     const handleActionMouseEnter = (action) => {
//         if (window.innerWidth >= 1024) {
//             setActiveDropdown(action);
//             setIsNavHovered(true);
//         }
//     };

//     const handleMouseLeave = () => {
//         if (window.innerWidth >= 1024) {
//             setIsNavHovered(false);
//             setTimeout(() => {
//                 if (!isNavHovered) {
//                     setActiveDropdown(null);
//                 }
//             }, 100);
//         }
//     };

//     const renderDropdownContent = () => {
//         switch (activeDropdown) {
//             case 'search':
//                 return (
//                     <div className="max-w-7xl mx-auto px-4 py-6">
//                         <div className="flex items-center gap-4">
//                             <div className="flex-1 relative">
//                                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                                 <input
//                                     ref={searchInputRef}
//                                     type="search"
//                                     placeholder="Search everything..."
//                                     className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                             </div>
//                             <div className="flex flex-col gap-1 text-sm text-gray-500">
//                                 <span>
//                                     Press <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd>{' '}
//                                     to close
//                                 </span>
//                                 <span>
//                                     Press <kbd className="px-2 py-1 bg-gray-100 rounded">↵</kbd> to
//                                     search
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                 );
//             case 'language':
//                 return (
//                     <div className="max-w-7xl mx-auto px-4 py-6">
//                         <div className="flex flex-wrap gap-4 justify-center">
//                             {languages.map((lang) => (
//                                 <button
//                                     key={lang.code}
//                                     className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
//                                 >
//                                     <span className="text-2xl">{lang.flag}</span>
//                                     <span className="font-medium">{lang.name}</span>
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 );
//             default:
//                 if (typeof activeDropdown === 'number' && navigation[activeDropdown]?.children) {
//                     return (
//                         <div className="max-w-7xl mx-auto px-4 py-6">
//                             <div className="grid grid-cols-2 gap-6">
//                                 {navigation[activeDropdown].children.map((child) => (
//                                     <a
//                                         key={child.name}
//                                         href={child.href}
//                                         className="text-gray-700 hover:text-gray-900 block px-4 py-2"
//                                     >
//                                         {child.name}
//                                     </a>
//                                 ))}
//                             </div>
//                         </div>
//                     );
//                 }
//                 return null;
//         }
//     };

//     return (
//         <>
//             <nav
//                 className={`fixed w-full bg-white shadow-md transition-transform duration-300 z-50 ${
//                     visible ? 'translate-y-0' : '-translate-y-full'
//                 }`}
//                 onMouseLeave={handleMouseLeave}
//             >
//                 <div className="max-w-7xl mx-auto px-4">
//                     <div className="flex justify-between h-16 items-center">
//                         {/* Logo */}
//                         <div className="flex-shrink-0">
//                             <a href="#" className="text-xl font-bold">
//                                 Logo
//                             </a>
//                         </div>

//                         {/* Desktop Navigation */}
//                         <div className="hidden lg:flex lg:items-center lg:space-x-8">
//                             {navigation.map((item, index) => (
//                                 <div
//                                     key={item.name}
//                                     onMouseEnter={() => handleMouseEnter(index)}
//                                     className="relative"
//                                 >
//                                     <button
//                                         className={`inline-flex items-center px-3 py-2 ${
//                                             activeDropdown === index
//                                                 ? 'text-gray-900'
//                                                 : 'text-gray-700 hover:text-gray-900'
//                                         }`}
//                                     >
//                                         {item.name}
//                                         {item.children && <ChevronDown className="ml-1 h-4 w-4" />}
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Desktop Right Side Actions */}
//                         <div className="hidden lg:flex lg:items-center lg:space-x-4">
//                             <button
//                                 className="p-2 hover:bg-gray-100 rounded-full"
//                                 onMouseEnter={() => handleActionMouseEnter('search')}
//                             >
//                                 <Search className="h-5 w-5" />
//                             </button>
//                             <button
//                                 className="p-2 hover:bg-gray-100 rounded-full"
//                                 onMouseEnter={() => handleActionMouseEnter('language')}
//                             >
//                                 <Globe className="h-5 w-5" />
//                             </button>
//                             <button className="px-4 py-2 text-gray-700 hover:text-gray-900">
//                                 Login
//                             </button>
//                             <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//                                 Sign up
//                             </button>
//                         </div>

//                         {/* Mobile menu button */}
//                         <div className="lg:hidden">
//                             <button
//                                 onClick={() => setIsOpen(!isOpen)}
//                                 className="p-2 rounded-md text-gray-700 hover:text-gray-900"
//                             >
//                                 {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Desktop Dropdown */}
//                 {activeDropdown !== null && (
//                     <div
//                         ref={dropdownRef}
//                         className="absolute left-0 w-full bg-white shadow-lg border-t"
//                         onMouseEnter={() => setIsNavHovered(true)}
//                         onMouseLeave={() => setIsNavHovered(false)}
//                     >
//                         {renderDropdownContent()}
//                     </div>
//                 )}

//                 {/* Mobile menu */}
//                 {isOpen && (
//                     <div className="lg:hidden">
//                         <div className="px-2 pt-2 pb-3 space-y-1">
//                             {navigation.map((item) => (
//                                 <div key={item.name}>
//                                     <button
//                                         onClick={() =>
//                                             setActiveDropdown(
//                                                 activeDropdown === item.name ? null : item.name
//                                             )
//                                         }
//                                         className="w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
//                                     >
//                                         <div className="flex justify-between items-center">
//                                             {item.name}
//                                             {item.children && (
//                                                 <ChevronDown
//                                                     className={`h-4 w-4 transform transition-transform ${
//                                                         activeDropdown === item.name
//                                                             ? 'rotate-180'
//                                                             : ''
//                                                     }`}
//                                                 />
//                                             )}
//                                         </div>
//                                     </button>
//                                     {item.children && activeDropdown === item.name && (
//                                         <div className="pl-4 space-y-1">
//                                             {item.children.map((child) => (
//                                                 <a
//                                                     key={child.name}
//                                                     href={child.href}
//                                                     className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
//                                                 >
//                                                     {child.name}
//                                                 </a>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="px-4 py-3 border-t border-gray-200">
//                             <div className="flex flex-col space-y-3">
//                                 <button className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
//                                     <Search className="h-5 w-5 mr-2" />
//                                     Search
//                                 </button>
//                                 <button className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
//                                     <Globe className="h-5 w-5 mr-2" />
//                                     Language
//                                 </button>
//                                 <button className="px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
//                                     Login
//                                 </button>
//                                 <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//                                     Sign up
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </nav>

//             {/* Overlay for desktop dropdowns */}
//             {activeDropdown !== null && window.innerWidth >= 1024 && (
//                 <div
//                     className="fixed inset-0 bg-gray-800/20 backdrop-blur-sm z-40"
//                     onClick={() => setActiveDropdown(null)}
//                 />
//             )}
//         </>
//     );
// };

// export default Navbar;

// v6
import React, { useState, useEffect, useRef } from 'react';
import { Menu, ChevronDown, Search, Globe, X, User } from 'lucide-react';

// Sample navigation data structure
const navigation = [
    {
        name: 'Products',
        href: '#',
        children: [
            { name: 'Analytics', href: '#' },
            { name: 'Engagement', href: '#' },
            { name: 'Security', href: '#' },
            { name: 'Integrations', href: '#' },
        ],
    },
    {
        name: 'Solutions',
        href: '#',
        children: [
            { name: 'Enterprise', href: '#' },
            { name: 'Small Business', href: '#' },
            { name: 'Startups', href: '#' },
        ],
    },
    { name: 'Pricing', href: '#' },
    { name: 'About', href: '#' },
];

// Language options
const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [prevScrollPos, setPrevScrollPos] = useState(
        typeof window !== 'undefined' ? window.pageYOffset : 0
    );
    const [visible, setVisible] = useState(true);
    const [isNavHovered, setIsNavHovered] = useState(false);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);
    const [mobileContent, setMobileContent] = useState(null);

    // Handle scroll behavior
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

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

    const handleActionMouseEnter = (action) => {
        if (window.innerWidth >= 1024) {
            setActiveDropdown(action);
            setIsNavHovered(true);
        }
    };

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

    const handleMobileActionClick = (action) => {
        if (window.innerWidth < 1024) {
            setActiveDropdown(activeDropdown === action ? null : action);
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

    const renderDropdownContent = () => {
        switch (activeDropdown) {
            case 'search':
                return (
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="search"
                                    placeholder="Search everything..."
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="hidden lg:flex flex-col gap-1 text-sm text-gray-500">
                                <span>
                                    Press <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd>{' '}
                                    to close
                                </span>
                                <span>
                                    Press <kbd className="px-2 py-1 bg-gray-100 rounded">↵</kbd> to
                                    search
                                </span>
                            </div>
                        </div>
                    </div>
                );
            case 'language':
                return (
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <div className="flex flex-wrap gap-4 justify-center">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <span className="text-2xl">{lang.flag}</span>
                                    <span className="font-medium">{lang.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 'user':
                return (
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <div className="flex flex-col gap-4">
                            <button className="w-full px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md text-left">
                                Login
                            </button>
                            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center">
                                Sign up
                            </button>
                        </div>
                    </div>
                );
            default:
                if (typeof activeDropdown === 'number' && navigation[activeDropdown]?.children) {
                    return (
                        <div className="max-w-7xl mx-auto px-4 py-6">
                            <div className="grid grid-cols-2 gap-6">
                                {navigation[activeDropdown].children.map((child) => (
                                    <a
                                        key={child.name}
                                        href={child.href}
                                        className="text-gray-700 hover:text-gray-900 block px-4 py-2"
                                    >
                                        {child.name}
                                    </a>
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
                    <div className="px-4 py-6">
                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="search"
                                    placeholder="Search everything..."
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'language':
                return (
                    <div className="px-4 py-6">
                        <div className="flex flex-col gap-2">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <span className="text-2xl">{lang.flag}</span>
                                    <span className="font-medium">{lang.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 'user':
                return (
                    <div className="px-4 py-6">
                        <div className="flex flex-col gap-3">
                            <button className="w-full px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-left">
                                Login
                            </button>
                            <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center">
                                Sign up
                            </button>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="px-4 py-6">
                        <div className="space-y-1">
                            {navigation.map((item) => (
                                <div key={item.name}>
                                    <button
                                        onClick={() =>
                                            setActiveDropdown(
                                                activeDropdown === item.name ? null : item.name
                                            )
                                        }
                                        className="w-full text-left px-3 py-4 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md text-lg font-medium"
                                    >
                                        <div className="flex justify-between items-center">
                                            {item.name}
                                            {item.children && (
                                                <ChevronDown
                                                    className={`h-5 w-5 transform transition-transform ${
                                                        activeDropdown === item.name
                                                            ? 'rotate-180'
                                                            : ''
                                                    }`}
                                                />
                                            )}
                                        </div>
                                    </button>
                                    {item.children && activeDropdown === item.name && (
                                        <div className="pl-4 space-y-1 pt-2">
                                            {item.children.map((child) => (
                                                <a
                                                    key={child.name}
                                                    href={child.href}
                                                    className="block px-3 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md text-base"
                                                >
                                                    {child.name}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            <nav
                className={`fixed w-full bg-white shadow-md transition-transform duration-300 z-50 ${
                    visible ? 'translate-y-0' : '-translate-y-full'
                }`}
                onMouseLeave={handleMouseLeave}
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <a href="#" className="text-xl font-bold">
                                Logo
                            </a>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-8">
                            {navigation.map((item, index) => (
                                <div
                                    key={item.name}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    className="relative"
                                >
                                    <button
                                        className={`inline-flex items-center px-3 py-2 ${
                                            activeDropdown === index
                                                ? 'text-gray-900'
                                                : 'text-gray-700 hover:text-gray-900'
                                        }`}
                                    >
                                        {item.name}
                                        {item.children && <ChevronDown className="ml-1 h-4 w-4" />}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Right Side Actions */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-4">
                            <button
                                className="p-2 hover:bg-gray-100 rounded-full"
                                onMouseEnter={() => handleActionMouseEnter('search')}
                            >
                                <Search className="h-5 w-5" />
                            </button>
                            <button
                                className="p-2 hover:bg-gray-100 rounded-full"
                                onMouseEnter={() => handleActionMouseEnter('language')}
                            >
                                <Globe className="h-5 w-5" />
                            </button>
                            <button className="px-4 py-2 text-gray-700 hover:text-gray-900">
                                Login
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Sign up
                            </button>
                        </div>

                        {/* Mobile Actions */}
                        <div className="lg:hidden flex items-center space-x-2">
                            <button
                                className={`p-2 hover:bg-gray-100 rounded-full ${
                                    mobileContent === 'search' ? 'bg-gray-100' : ''
                                }`}
                                onClick={() => handleMobileAction('search')}
                            >
                                <Search className="h-5 w-5" />
                            </button>
                            <button
                                className={`p-2 hover:bg-gray-100 rounded-full ${
                                    mobileContent === 'language' ? 'bg-gray-100' : ''
                                }`}
                                onClick={() => handleMobileAction('language')}
                            >
                                <Globe className="h-5 w-5" />
                            </button>
                            <button
                                className={`p-2 hover:bg-gray-100 rounded-full ${
                                    mobileContent === 'user' ? 'bg-gray-100' : ''
                                }`}
                                onClick={() => handleMobileAction('user')}
                            >
                                <User className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => handleMobileAction('menu')}
                                className={`p-2 hover:bg-gray-100 rounded-full text-gray-700 ${
                                    mobileContent === 'menu' ? 'bg-gray-100' : ''
                                }`}
                            >
                                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Desktop Dropdown */}
                {activeDropdown !== null && window.innerWidth >= 1024 && (
                    <div
                        ref={dropdownRef}
                        className="absolute left-0 w-full bg-white shadow-lg border-t"
                        onMouseEnter={() => setIsNavHovered(true)}
                        onMouseLeave={() => setIsNavHovered(false)}
                    >
                        {renderDropdownContent()}
                    </div>
                )}

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden fixed inset-0 top-16 bg-white z-50">
                        <div className="min-h-[calc(100vh-4rem)]">
                            {/* Mobile Menu Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b">
                                <h2 className="text-lg font-medium">
                                    {mobileContent === 'menu'
                                        ? 'Menu'
                                        : mobileContent === 'search'
                                        ? 'Search'
                                        : mobileContent === 'language'
                                        ? 'Language'
                                        : mobileContent === 'user'
                                        ? 'Account'
                                        : ''}
                                </h2>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setMobileContent(null);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <X className="h-5 w-5" />
                                </button>
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
            {activeDropdown !== null && window.innerWidth >= 1024 && (
                <div
                    className="fixed inset-0 bg-gray-800/20 backdrop-blur-sm z-40"
                    onClick={() => setActiveDropdown(null)}
                />
            )}
        </>
    );
};

export default Navbar;
