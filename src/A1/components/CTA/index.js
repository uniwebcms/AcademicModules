import React, { useState } from 'react';
import { getPageProfile } from '@uniwebcms/module-sdk';
import { Image, Link, SafeHtml } from '@uniwebcms/core-components';
import Container from '../_utils/Container';

export default function CTA({ block, website }) {
    const { main } = block;

    const [width, setWidth] = useState(window.innerWidth);

    // update state triggers re-render to update image position
    window.onresize = () => {
        setWidth(window.innerWidth);
    };

    const { banner, pretitle, title, subtitle, images, links } = block.getBlockContent();

    const image = banner || images[0];

    return (
        <Container py="0" className="flex flex-col lg:flex-row">
            {image && ((banner && window.innerWidth >= 1024) || window.innerWidth < 1024) && (
                <div className="relative w-full overflow-hidden lg:w-1/2">
                    <Image
                        profile={getPageProfile()}
                        url={image.url}
                        value={image.value}
                        alt={image.alt}
                        className="object-cover w-full h-full"
                        href={image.href}
                    />
                    {image.caption ? (
                        <figcaption className="absolute bottom-0 w-full">
                            <div
                                className={`text-center tracking-normal text-sm outline-none text-text-color-10 bg-text-color/70`}
                            >
                                {image.caption}
                            </div>
                        </figcaption>
                    ) : null}
                </div>
            )}
            <div className="flex flex-col justify-center w-full px-6 sm:px-8 md:px-16 lg:px-20 xl:px-24 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 lg:w-1/2">
                <div className="2xl:px-24">
                    <SafeHtml
                        as="div"
                        value={pretitle}
                        className="text-base sm:text-lg font-semibold leading-7 rich-text"
                    />
                    <SafeHtml
                        as="h2"
                        value={title}
                        className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl rich-text"
                    />
                    <SafeHtml
                        as="h3"
                        value={subtitle}
                        className="mt-6 text-lg sm:text-xl rich-text"
                    />

                    <div className="mt-8 flex flex-wrap gap-x-4 gay-y-3">
                        {links.map((link, index) => {
                            const { href, label } = link;
                            return (
                                <Link
                                    key={index}
                                    to={href}
                                    className="inline-flex rounded-md bg-link-color/20 hover:bg-link-color/10 px-4 py-2.5 text-sm font-semibold shadow-sm hover:scale-105 transition-all duration-150"
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
            {image && !banner && window.innerWidth >= 1024 && (
                <div className="relative w-full overflow-hidden lg:w-1/2">
                    <Image
                        profile={getPageProfile()}
                        value={image.value}
                        url={image.url}
                        alt={image.alt}
                        href={image.href}
                        className="object-cover w-full h-full"
                    />
                    {image.caption ? (
                        <figcaption className="absolute bottom-0 w-full">
                            <div
                                className={`text-center tracking-normal text-sm outline-none text-text-color/70 bg-text-color/70`}
                            >
                                {image.caption}
                            </div>
                        </figcaption>
                    ) : null}
                </div>
            )}
        </Container>
    );
}
