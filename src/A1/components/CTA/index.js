import React, { useState } from 'react';
import { Link, Image, SafeHtml, getPageProfile } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

export default function CTA({ block, website }) {
    const { main } = block;

    const { header, banner, body } = main;

    const [width, setWidth] = useState(window.innerWidth);

    window.onresize = () => {
        setWidth(window.innerWidth);
    };

    const { pretitle = '', title = '', subtitle = '' } = header || {};

    const image = banner || body?.imgs[0];

    const link = body?.links[0];

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
                    />
                </div>
            )}
            <div className="flex flex-col justify-center w-full px-24 py-24 lg:w-1/2">
                <div className="2xl:px-24">
                    <SafeHtml
                        as="div"
                        value={pretitle}
                        className="text-base font-semibold leading-7"
                    />
                    <SafeHtml
                        as="h2"
                        value={title}
                        className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
                    />
                    <SafeHtml as="h3" value={subtitle} className="mt-6 text-base leading-7" />

                    <div className="mt-8">
                        {link && (
                            <Link to={website.makeHref(link.href)}>
                                <span className="inline-flex rounded-md !bg-primary-200 px-3.5 py-2.5 text-sm font-semibold !text-primary-800 shadow-sm hover:scale-105 transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                    {link.label}
                                </span>
                            </Link>
                        )}
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
                        className="object-cover w-full h-full"
                    />
                </div>
            )}
        </Container>
    );
}
