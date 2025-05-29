import React from 'react';
import { twJoin, Image, Link, SafeHtml, getPageProfile } from '@uniwebcms/module-sdk';

export default function Spotlight(props) {
    const { block } = props;

    const { title, subtitle, paragraphs, images, links } = block.getBlockContent();

    const {
        text_position = 'left',
        vertical_alignment = 'center',
        aspect_ratio = '16 / 9',
    } = block.getBlockProperties();

    const image = images[0];
    const link = links[0];

    return (
        <div className="p-20">
            <div
                className={twJoin(
                    'max-w-[1200px] mx-auto flex flex-col-reverse gap-8 lg:gap-12',
                    vertical_alignment === 'top' && 'items-start',
                    vertical_alignment === 'center' && 'items-center',
                    vertical_alignment === 'bottom' && 'items-end',
                    text_position === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'
                )}
            >
                {/* text content */}
                <div className="text-left w-full lg:w-1/2">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl">{title}</h3>
                    <SafeHtml value={paragraphs} className="mt-4 text-lg">
                        {subtitle}
                    </SafeHtml>
                    {link && (
                        <div className="mt-6">
                            <Link
                                to={link.href}
                                className="inline-block px-6 py-3 rounded-lg bg-neutral-900 text-neutral-50 hover:bg-neutral-800"
                            >
                                {link.label}
                            </Link>
                        </div>
                    )}
                </div>
                <div
                    className="w-full lg:w-1/2 relative"
                    style={{
                        aspectRatio: aspect_ratio,
                    }}
                >
                    <Image
                        profile={getPageProfile()}
                        {...image}
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
}
