import React from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import Container from '../_utils/Container';
import { Link, Icon } from '@uniwebcms/core-components';

export default function NavigationBand(props) {
    const { block, website } = props;

    const { links, icons } = block.getBlockContent();

    const [previousLink, currentLink, nextLink] = links;
    const [previousIcon, currentIcon, nextIcon] = icons;

    return (
        <Container py="sm" className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Previous Feature */}
                {previousLink && (
                    <Link
                        to={previousLink.href}
                        className="group flex items-center gap-3 px-4 py-4 sm:px-6 bg-text-color-0 rounded-xl border border-text-color/10 hover:border-text-color/20 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out flex-1"
                        // className="group flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 bg-text-color-0 rounded-xl border border-text-color/10 hover:border-text-color/20 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out flex-1"
                        style={{
                            transitionTimingFunction: 'cubic-bezier(0, 0, 0.5, 1)',
                        }}
                    >
                        <LuChevronLeft className="hidden lg:block w-5 h-5 text-text-color/60 group-hover:text-link-color transition-colors flex-shrink-0" />
                        <div className="text-left flex-1">
                            <div className="hidden lg:block text-xs text-text-color/70 mb-1">
                                {website.localize({
                                    en: 'Previous',
                                    fr: 'Précédent',
                                    es: 'Anterior',
                                    zh: '上一个',
                                })}
                            </div>
                            <div className="flex items-center gap-2 justify-center lg:justify-start">
                                {previousIcon && (
                                    <Icon
                                        icon={previousIcon}
                                        className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                                    />
                                )}
                                <span className="font-medium text-text-color group-hover:text-link-color transition-colors">
                                    {previousLink.label}
                                </span>
                            </div>
                        </div>
                    </Link>
                )}

                {/* All Features */}
                {currentLink && (
                    <Link
                        to={currentLink.href}
                        className="flex items-center justify-center gap-2 px-4 py-4 sm:px-6 text-text-color/80 hover:text-link-color bg-text-color-0 lg:bg-transparent rounded-xl border border-text-color/10 lg:border-0 hover:border-text-color/20 lg:hover:border-transparent hover:shadow-lg lg:hover:shadow-none hover:scale-[1.02] lg:hover:scale-100 transition-all lg:transition-none duration-300 ease-out"
                    >
                        {currentIcon && <Icon icon={currentIcon} className="w-5 h-5" />}
                        <span className="font-medium">{currentLink.label}</span>
                    </Link>
                )}

                {/* Next Feature */}
                {nextLink && (
                    <Link
                        to={nextLink.href}
                        className="group flex items-center gap-3 px-4 py-4 sm:px-6 bg-text-color-0 rounded-xl border border-text-color/10 hover:border-text-color/20 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out flex-1"
                        style={{
                            transitionTimingFunction: 'cubic-bezier(0, 0, 0.5, 1)',
                        }}
                    >
                        <div className="text-right flex-1">
                            <div className="hidden lg:block text-xs text-text-color/70 mb-1">
                                {website.localize({
                                    en: 'Next',
                                    fr: 'Suivant',
                                    es: 'Siguiente',
                                    zh: '下一个',
                                })}
                            </div>
                            <div className="flex flex-row-reverse lg:flex-row items-center gap-2 justify-center lg:justify-end">
                                <span className="font-medium text-text-color group-hover:text-link-color transition-colors">
                                    {nextLink.label}
                                </span>
                                {nextIcon && (
                                    <Icon
                                        icon={nextIcon}
                                        className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                                    />
                                )}
                            </div>
                        </div>
                        <LuChevronRight className="hidden lg:block w-5 h-5 text-text-color/60 group-hover:text-link-color transition-colors flex-shrink-0" />
                    </Link>
                )}
            </div>
        </Container>
    );
}
