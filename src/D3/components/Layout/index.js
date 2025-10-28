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
                // 'prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:px-[16px] prose-pre:py-[12px] prose-pre:text-base',
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
                <p className="text-sm font-medium">{JSON.parse(parent.label)[activeLang]}</p>
            )}
            {title && <h1 className="text-3xl tracking-tight">{JSON.parse(title)[activeLang]}</h1>}
        </div>
    );
}

const MobileSidebar = ({ children }) => {
    const { isOpen, closeSidebar } = useSidebar();

    const activeRoute = website.activePage.activeRoute;

    useEffect(() => {
        closeSidebar();
    }, [activeRoute]);

    return (
        <div
            className={`md:hidden fixed top-16 left-0 w-full h-[calc(100vh-64px)] z-50 transition-transform transform ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <button className="absolute top-5 right-6 focus:outline-none" onClick={closeSidebar}>
                <HiX className="h-5 w-5" />
            </button>
            <div className="pl-6 pr-14">{children}</div>
        </div>
    );
};

export default function Layout(props) {
    const { page, header, footer, body, leftPanel, rightPanel } = props;

    const { sticky: stickyHeader = true, mode: headerMode = 'full_screen' } =
        page.blockGroups.header[0].getBlockProperties();

    return (
        <SidebarProvider>
            <div className="context__light flex flex-col min-h-screen [background:var(--bg-gradient,var(--bg-color))]">
                {/* Top Fixed Header */}
                <header
                    className={twJoin(
                        'w-screen',
                        headerMode === 'full_screen' ? 'h-16' : 'h-16 desktop:h-20',
                        stickyHeader ? 'fixed top-0 z-50 [&>div]:!bg-[unset]' : ''
                    )}
                >
                    {header}
                </header>
                {/* Header placeholder */}
                <div className="h-16 w-full opacity-0" />
                {/* Mobile Left Sidebar */}
                <MobileSidebar>{leftPanel}</MobileSidebar>

                {/* Main Content Area */}
                <div className="relative w-full max-w-8xl mx-auto flex flex-1 md:px-8 lg:px-12 xl:px-16">
                    {/* Left Sidebar */}
                    <aside className="hidden md:block fixed top-16 md:left-8 lg:left-12 xl:left-[max(48px,calc((100vw-88rem)/2))] w-64 h-[calc(100vh-64px)] overflow-y-auto">
                        {leftPanel}
                    </aside>

                    {/* Center Content */}
                    <main className="mx-0 md:ml-64 xl:mr-64 px-6 py-8 w-full md:w-[calc(100%-16rem)] xl:w-[calc(100%-32rem)]">
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
                    <aside className="hidden xl:block fixed top-16 xl:right-[max(48px,calc((100vw-88rem)/2))] w-64 h-[calc(100vh-64px)] overflow-y-auto">
                        {rightPanel}
                    </aside>
                </div>
            </div>
        </SidebarProvider>
    );
}
