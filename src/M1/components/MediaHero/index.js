import React from 'react';
import Container from '../_utils/Container';
import { Image, getPageProfile, Media, SafeHtml, twJoin, Link } from '@uniwebcms/module-sdk';
import { LuChevronRight } from 'react-icons/lu';

const parseButtonContent = (content) => {
    if (!content) return null;

    const container = document.createElement('div');
    container.innerHTML = content.trim();

    const link = container.firstElementChild;

    // is a link
    if (link && link.tagName.toLowerCase() === 'a') {
        return {
            target: link.getAttribute('target') || null,
            href: link.getAttribute('href') || null,
            label: link.textContent || '',
        };
    }

    return content;
};

export default function MediaHero(props) {
    const { block } = props;

    const { banner, title, subtitle, paragraphs, videos, images, links, buttons } =
        block.getBlockContent();

    const video = videos[0];
    const image = images[0];
    const button = buttons[0];

    const buttonLink = button ? parseButtonContent(button.content) : null;

    return (
        <Container className="w-screen min-h-96" py="lg">
            {banner && (
                <div className="absolute inset-0">
                    <Image
                        profile={getPageProfile()}
                        {...banner}
                        className="object-cover w-full h-full"
                    />
                </div>
            )}
            <div className="relative flex flex-col items-center justify-center mx-auto max-w-4xl z-10">
                {title && (
                    <h1
                        className="text-3xl font-semibold md:text-4xl lg:text-5xl text-center tracking-wide text-pretty"
                        style={{
                            lineHeight: '1.1',
                        }}
                    >
                        {title}
                    </h1>
                )}
                {subtitle && (
                    <h2 className="mt-4 lg:mt-6 px-0 lg:px-8 text-lg md:text-xl lg:text-2xl font-light text-center tracking-wide text-pretty">
                        {subtitle}
                    </h2>
                )}
                {paragraphs.filter(Boolean).length ? (
                    <SafeHtml
                        value={paragraphs}
                        className="mt-4 lg:mt-6 lg:px-8 text-lg lg:text-xl text-center tracking-wide text-pretty"
                    >
                        {subtitle}
                    </SafeHtml>
                ) : null}
                {links.length ? (
                    <div className="flex flex-wrap gap-6 mt-6 justify-center">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className={twJoin(
                                    'pl-5 pr-3 py-2 text-sm lg:text-base font-semibold rounded-lg flex items-center gap-2 transition-all',
                                    index === 0 &&
                                        'bg-text-color/80 text-bg-color hover:bg-text-color',
                                    index === 1 &&
                                        'border-2 border-text-color/80 bg-bg-color text-text-color/80 hover:bg-text-color/10 hover:text-text-color'
                                )}
                            >
                                {link.label}
                                <LuChevronRight className="w-4 h-4 text-inherit" />
                            </Link>
                        ))}
                    </div>
                ) : null}
                {/* Gradient border styled button */}
                {buttonLink ? (
                    <div className="mt-6 relative inline-flex rounded-3xl overflow-hidden hover:scale-105 transition-transform duration-500 ease-in-out">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-500" />
                        <Link
                            href={buttonLink.href}
                            className="relative py-2 px-8 lg:px-12 bg-bg-color m-0.5 rounded-3xl"
                        >
                            <span className="font-bold">{buttonLink.label}</span>
                        </Link>
                    </div>
                ) : null}
                {video || image ? (
                    <div
                        className={twJoin(
                            'w-full mx-auto mt-8',
                            video ? 'lg:mt-12 max-w-[44rem]' : 'lg:mt-10 max-w-2xl'
                        )}
                    >
                        <Media
                            profile={getPageProfile()}
                            media={video || image}
                            className={twJoin('shadow-xl', video ? 'rounded-3xl' : '')}
                        />
                    </div>
                ) : null}
            </div>
        </Container>
    );
}
