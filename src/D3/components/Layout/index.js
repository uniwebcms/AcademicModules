import React, { useEffect } from 'react';
import { twJoin, website } from '@uniwebcms/module-sdk';
import { SidebarProvider, useSidebar } from '../_utils/SidebarContext';
import { HiX } from 'react-icons/hi';

function ProseWrapper({ children }) {
    return (
        <div
            className={twJoin(
                'prose prose-sm lg:prose-base max-w-none',
                // headings
                'prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-heading-color',
                // text
                'prose-p:text-text-color prose-p:leading-7',
                // links
                'prose-a:font-semibold',
                // link underline
                'prose-a:no-underline',
                // pre
                'prose-pre:!my-[2em]',
                // hr
                'prose-hr:border-t-text-color/20'
            )}
        >
            {children}
        </div>
    );
}

function DocHeader({ page }) {
    const { activeLang } = page;
    const parent = page.getParentPage();
    const title = page.options.activeContent.label;

    return (
        <div className="mb-9 space-y-1">
            {parent && (
                <p className="text-sm lg:text-base font-medium text-text-color-80">
                    {JSON.parse(parent.label)[activeLang]}
                </p>
            )}
            {title && <h1 className="text-3xl tracking-tight">{JSON.parse(title)[activeLang]}</h1>}
        </div>
    );
}

// Updated to accept headerSiteNavigation prop
const MobileSidebar = ({ children, headerSiteNavigation = false }) => {
    const { isOpen, closeSidebar } = useSidebar();

    const activeRoute = website.activePage.activeRoute;

    useEffect(() => {
        closeSidebar();
    }, [activeRoute]);

    return (
        <>
            {isOpen && (
                <div
                    className={twJoin(
                        'md:hidden fixed left-0 w-full bg-black/50 z-40',
                        // Conditionally set top and height
                        headerSiteNavigation
                            ? 'top-28 h-[calc(100vh-112px)]'
                            : 'top-16 h-[calc(100vh-64px)]'
                    )}
                    onClick={closeSidebar}
                />
            )}
            <div
                className={twJoin(
                    'md:hidden fixed left-0 w-full z-50 transition-transform transform duration-300',
                    // Conditionally set top and height
                    headerSiteNavigation
                        ? 'top-28 h-[calc(100vh-112px)]'
                        : 'top-16 h-[calc(100vh-64px)]',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <button
                    className="absolute top-4 right-4 focus:outline-none bg-transparent"
                    onClick={closeSidebar}
                >
                    <HiX className="h-6 w-6 text-gray-200 hover:text-gray-100" />
                </button>
                <div className="h-full pr-14 [&>div]:h-full">{children}</div>
            </div>
        </>
    );
};

export default function Layout(props) {
    const { page, header, footer, body, leftPanel, rightPanel } = props;

    const {
        sticky: stickyHeader = true,
        mode: headerMode = 'full_screen',
        site_navigation: headerSiteNavigation = false,
    } = page.blockGroups.header[0].getBlockProperties();

    // Reusable class logic for sticky sidebars
    const sidebarHeightClass = headerSiteNavigation
        ? headerMode === 'island'
            ? 'h-[calc(100vh-112px)] desktop:h-[calc(100vh-128px)]'
            : 'h-[calc(100vh-112px)]'
        : headerMode === 'island'
        ? 'h-[calc(100vh-64px)] desktop:h-[calc(100vh-80px)]'
        : 'h-[calc(100vh-64px)]';

    const sidebarTopClass = headerSiteNavigation
        ? headerMode === 'island'
            ? 'top-28 desktop:top-[128px]'
            : 'top-28'
        : headerMode === 'island'
        ? 'top-16 desktop:top-20'
        : 'top-16';

    return (
        <SidebarProvider>
            <div className="context__light flex flex-col min-h-screen [background:var(--bg-gradient,var(--bg-color))_fixed]">
                {/* Top Fixed Header */}
                <header
                    className={twJoin(
                        'w-screen',
                        headerSiteNavigation
                            ? headerMode === 'full_width'
                                ? 'h-28'
                                : 'h-28 desktop:h-[128px]'
                            : headerMode === 'full_width'
                            ? 'h-16'
                            : 'h-16 desktop:h-20',
                        headerMode !== 'full_width' ? '[&>div]:bg-transparent' : '',
                        stickyHeader ? 'fixed top-0 z-50 [&>div]:!bg-[unset]' : ''
                    )}
                >
                    {header}
                </header>
                {/* Header placeholder */}
                {stickyHeader && (
                    <div
                        className={twJoin(
                            'w-full opacity-0',
                            headerSiteNavigation
                                ? headerMode === 'island'
                                    ? 'h-28 desktop:h-[128px]'
                                    : 'h-28'
                                : headerMode === 'island'
                                ? 'h-16 desktop:h-20'
                                : 'h-16'
                        )}
                    />
                )}
                {/* Mobile Left Sidebar - pass prop */}
                {!!leftPanel && (
                    <MobileSidebar headerSiteNavigation={headerSiteNavigation}>
                        {React.cloneElement(leftPanel, {
                            extra: { headerSiteNavigation },
                        })}
                    </MobileSidebar>
                )}
                {/* Main Content Area */}
                <div className="relative w-full max-w-full desktop:max-w-[88rem] mx-0 desktop:mx-auto flex flex-1 px-6 md:px-8 lg:px-12 desktop:px-0">
                    {/* Left Sidebar */}
                    {!!leftPanel && (
                        <aside
                            className={twJoin(
                                'hidden md:block sticky flex-none w-64 overflow-y-auto',
                                sidebarHeightClass,
                                sidebarTopClass
                            )}
                        >
                            {React.cloneElement(leftPanel, {
                                extra: { headerSiteNavigation },
                            })}
                        </aside>
                    )}

                    {/* Center Content */}
                    <main className="flex-1 min-w-0 py-8">
                        <div className="mx-auto max-w-3xl">
                            {/* Page Title & Subtitle */}
                            <DocHeader page={page} />
                            {/* Actual Content */}
                            <ProseWrapper>{body}</ProseWrapper>
                            {/* Prev / Next */}
                            {footer}
                        </div>
                    </main>

                    {/* Right Section Nav */}
                    {!!{ rightPanel } && (
                        <aside
                            className={twJoin(
                                'hidden xl:block sticky flex-none w-64 overflow-y-auto',
                                sidebarHeightClass,
                                sidebarTopClass
                            )}
                        >
                            {rightPanel}
                        </aside>
                    )}
                </div>
            </div>
        </SidebarProvider>
    );
}
