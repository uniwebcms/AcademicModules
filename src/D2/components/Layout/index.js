import React from 'react';
import { twJoin } from '@uniwebcms/module-sdk';

function ProseWrapper({ children }) {
    return (
        <div
            className={twJoin(
                'prose prose-slate max-w-none dark:prose-invert dark:text-slate-300',
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

export default function Layout(props) {
    const { page, header, footer, body, leftPanel, rightPanel } = props;

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900/95">
            {/* Top Fixed Header */}
            <header className="fixed top-0 z-50 h-16 w-screen">{header}</header>
            {/* Header placeholder */}
            <div className="h-16 w-full opacity-0" />

            {/* Main Content Area */}
            <div className="relative w-full max-w-[88rem] mx-auto flex flex-1 md:px-8 lg:px-12 xl:px-16">
                {/* Left Sidebar */}
                <aside className="hidden lg:block fixed top-16 lg:left-12 xl:left-[max(48px,calc((100vw-88rem)/2))] w-64 h-[calc(100vh-64px)] overflow-y-auto">
                    {leftPanel}
                </aside>

                {/* Center Content */}
                <main className="mx-0 lg:ml-64 xl:mr-64 px-6 py-8 w-full lg:w-[calc(100%-16rem)] xl:w-[calc(100%-32rem)]">
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
    );
}
