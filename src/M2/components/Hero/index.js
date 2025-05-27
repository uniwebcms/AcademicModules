import React from 'react';
import { SafeHtml, Link, twJoin } from '@uniwebcms/module-sdk';
import { LuArrowRight } from 'react-icons/lu';

export default function Hero(props) {
    const { block } = props;

    const { title, paragraphs, links } = block.getBlockContent();

    return (
        <div className="relative px-6 pt-[80px] xl:pt-[180px] pb-[80px] min-h-[100px] max-w-[1200px] mx-auto">
            <div className="flex flex-col max-w-[965px] mx-auto">
                <div className="max-w-[800px] mx-auto">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-center">
                        <SafeHtml value={title} />
                    </h1>
                </div>
                <div className="max-w-[500px] xl:max-w-[965px] mx-auto mt-6 xl:mt-8">
                    <SafeHtml
                        value={paragraphs}
                        className="text-center text-xl text-heading-color-70 leading-[150%]"
                    />
                </div>
                {links.length ? (
                    <div className="flex flex-col md:flex-row gap-x-8 gap-y-6 md:justify-center mt-6 xl:mt-8">
                        {links.map((link, index) => {
                            const { label, href } = link;
                            return (
                                <Link
                                    key={index}
                                    href={href}
                                    className={twJoin(
                                        'pl-6 pr-5 py-3 text-base flex items-center justify-center rounded-lg gap-2 text-bg-color bg-text-color hover:bg-text-color/90'
                                    )}
                                >
                                    {label}
                                    <LuArrowRight className="w-4 h-4 text-inherit" />
                                </Link>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
