import React from 'react';
import Container from '../_utils/Container';
import { Image, getPageProfile, Link, twJoin, SafeHtml } from '@uniwebcms/module-sdk';

export default function ContentTeaser(props) {
    const { block } = props;

    const { title, subtitle, links } = block.getBlockContent();
    const items = block.getBlockItems();

    const link = links[0];

    return (
        <Container className="max-w-8xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    {title && (
                        <h2 className="text-xl font-medium md:text-2xl lg:text-3xl mb-2">
                            {title}
                        </h2>
                    )}
                    {subtitle && <p className="mb-6 lg:mb-8 text-base lg:text-lg">{subtitle}</p>}
                </div>
                {link && (
                    <Link to={link.href} className="hover:underline text-sm lg:text-base">
                        {link.label}
                        &nbsp;&rarr;
                    </Link>
                )}
            </div>
            {items.length ? (
                <div className="mt-4 sm:mt-6 lg:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {items.map((item, index) => {
                        const { banner, pretitle, title, paragraphs, links } = item;

                        const link = links[0];

                        const Wrapper = link ? Link : 'div';
                        const wrapperProps = link ? { to: link.href } : {};

                        return (
                            <Wrapper
                                key={index}
                                className={twJoin(
                                    'flex flex-col rounded-lg overflow-hidden shadow-lg',
                                    link && 'hover:shadow-xl'
                                )}
                                {...wrapperProps}
                            >
                                {banner && (
                                    <div className="relative h-48">
                                        <Image
                                            profile={getPageProfile()}
                                            {...banner}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                )}
                                <div className="p-4">
                                    {pretitle && (
                                        <p className="text-xs lg:text-sm text-indigo-600">
                                            {pretitle}
                                        </p>
                                    )}
                                    {title && (
                                        <h3 className="text-lg lg:text-xl font-bold mb-2 mt-1">
                                            {title}
                                        </h3>
                                    )}
                                    {paragraphs && (
                                        <SafeHtml
                                            value={paragraphs}
                                            className="text-sm lg:text-base font-light text-text-color-70 line-clamp-5"
                                        />
                                    )}
                                </div>
                            </Wrapper>
                        );
                    })}
                </div>
            ) : null}
        </Container>
    );
}
