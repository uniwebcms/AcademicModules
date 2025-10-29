import React, { useEffect } from 'react';
import { twJoin, website } from '@uniwebcms/module-sdk';
import { SidebarProvider, useSidebar } from '../_utils/SidebarContext';
import { HiX } from 'react-icons/hi';

function ProseWrapper({ children }) {
    return (
        <div
            className={twJoin(
                'prose prose-sm lg:prose-base prose-slate max-w-none dark:prose-invert dark:text-slate-300',
                // headings
                'prose-headings:font-normal',
                // lead
                'prose-lead:text-slate-500 dark:prose-lead:text-slate-300 prose-lead:mt-0',
                // links
                'prose-a:font-semibold dark:prose-a:text-sky-400',
                // link underline
                'prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,theme(colors.sky.300))] hover:prose-a:[--tw-prose-underline-size:6px] dark:[--tw-prose-background:theme(colors.slate.900)] dark:prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,theme(colors.sky.800))] dark:hover:prose-a:[--tw-prose-underline-size:6px]',
                // pre
                'prose-pre:rounded-xl prose-pre:bg-slate-700 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10 prose-pre:px-[16px] prose-pre:py-[12px] prose-pre:text-base',
                // hr
                'dark:prose-hr:border-slate-700'
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
                <p className="text-sm font-medium text-sky-500">
                    {JSON.parse(parent.label)[activeLang]}
                </p>
            )}
            {title && (
                <h1 className="text-3xl tracking-tight text-slate-900 dark:text-white">
                    {JSON.parse(title)[activeLang]}
                </h1>
            )}
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
            className={`md:hidden fixed top-16 left-0 w-full h-[calc(100vh-64px)] bg-white dark:bg-slate-900/95 z-50 transition-transform transform ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <button className="absolute top-5 right-6 focus:outline-none" onClick={closeSidebar}>
                <HiX className="h-5 w-5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300" />
            </button>
            <div className="pl-6 pr-14">{children}</div>
        </div>
    );
};

export default function Layout(props) {
    const { page, header, footer, body, leftPanel, rightPanel } = props;
    //bg-white dark:bg-slate-900/95
    return (
        <SidebarProvider>
            <div className="context__light flex flex-col min-h-screen [background:var(--bg-gradient,white)_fixed] dark:[background:var(--bg-gradient,theme(colors.slate.900/95))_fixed]">
                {/* Top Fixed Header */}
                <header className="fixed top-0 z-50 h-16 w-screen">{header}</header>
                {/* Header placeholder */}
                <div className="h-16 w-full opacity-0" />
                {/* Mobile Left Sidebar */}
                <MobileSidebar>{leftPanel}</MobileSidebar>

                {/* Main Content Area */}
                <div className="relative w-full max-w-[88rem] mx-auto flex flex-1 md:px-8 lg:px-12 xl:px-16">
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
