import React from 'react';
import Container from '../_utils/Container';
import { Image, getPageProfile, Link, twJoin, SafeHtml } from '@uniwebcms/module-sdk';
import Fancy from './Fancy';

export default function CallToAction(props) {
    const { block } = props;

    const { banner, title, paragraphs, links } = block.getBlockContent();
    const {
        content_position = 'left',
        appearance = 'subtle',
        appearance_preset = 'none',
    } = block.getBlockProperties();

    const [firstLink, secondLink] = links;

    if (appearance === 'subtle') {
        return (
            <Container py="lg" className="relative">
                {/* Background */}
                {banner && (
                    <div className="absolute inset-0">
                        <Image
                            profile={getPageProfile()}
                            {...banner}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}
                {/* Gradient Overlay */}
                <div
                    className={twJoin(
                        'absolute inset-0',
                        'from-bg-color from-50% to-bg-color/10 to-70%',
                        content_position === 'left' ? 'bg-gradient-to-r' : 'bg-gradient-to-l'
                    )}
                />
                {/* Content */}
                <div
                    className={twJoin(
                        'max-w-6xl mx-auto flex',
                        content_position === 'left' ? 'justify-start' : 'justify-end'
                    )}
                >
                    <div className="flex flex-col items-center justify-center w-96 min-h-[28rem]">
                        {title && (
                            <h2 className="relative text-xl font-bold md:text-2xl lg:text-3xl mb-4">
                                {title}
                            </h2>
                        )}
                        {paragraphs && (
                            <SafeHtml
                                value={paragraphs}
                                className="relative text-base lg:text-lg text-text-color-80 text-center mb-6"
                            />
                        )}
                        {firstLink && (
                            <div className="relative inline-flex rounded-3xl overflow-hidden hover:scale-105 transition-transform duration-300 ease-in-out">
                                {/* Gradient border styled element */}
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-500" />
                                <Link
                                    href={firstLink.href}
                                    className="relative py-2 px-7 lg:px-12 bg-bg-color m-0.5 rounded-3xl"
                                >
                                    <span className="text-lg lg:text-xl">{firstLink.label}</span>
                                </Link>
                            </div>
                        )}
                        {secondLink && (
                            <div className="relative mt-6 text-center">
                                <Link
                                    href={secondLink.href}
                                    className="text-base text-text-color-80 font-light hover:underline"
                                >
                                    <span>{secondLink.label}</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        );
    } else {
        return <Fancy {...{ title, paragraphs, links, uiPreset: appearance_preset }} />;
    }
}
