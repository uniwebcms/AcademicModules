import React from 'react';
import Container from '../../_utils/Container';
import { twJoin, Link, Icon, SafeHtml } from '@uniwebcms/module-sdk';

const bgStyleDefault = '';
const bgStyleSky = 'from-[rgba(32,113,175,0.3)] to-white';

const titleColorDefault = '';
const titleColorSky = 'text-black';

const featureItemOverlayStyleDefault = 'from-text-color-10 to-text-color-10';
const featureItemOverlayStyleSky = 'from-slate-300 to-slate-300';

const featureItemBgColorDefault = 'bg-bg-color';
const featureItemBgColorSky = 'bg-white';

const featureItemIconStyleDefault = 'bg-primary-50 text-primary-500';
const featureItemIconColorSky = [
    'bg-blue-50 text-blue-500',
    'bg-orange-50 text-orange-500',
    'bg-green-50 text-green-500',
];

const featureItemTitleColorDefault = 'text-text-color';
const featureItemTitleColorSky = 'text-black';

const featureItemSubtitleColorDefault = 'text-text-color-60';
const featureItemSubtitleColorSky = 'text-gray-600';

const featureItemLinkStyleDefault = '';
const featureItemLinkStyleSky = [
    'text-blue-500 hover:text-blue-600',
    'text-orange-500 hover:text-orange-600',
    'text-green-500 hover:text-green-600',
];

export default function Fancy(props) {
    const { title, subtitle, items, uiPreset } = props;

    return (
        <Container
            px="none"
            py="none"
            className={twJoin(
                'relative overflow-hidden bg-gradient-to-b',
                uiPreset === 'sky' ? bgStyleSky : bgStyleDefault
            )}
        >
            <div className="relative max-w-7xl mx-auto px-4 py-24">
                <div className="text-center mb-20">
                    <h2
                        className={twJoin(
                            'text-4xl font-bold text-black mb-4',
                            uiPreset === 'sky' ? titleColorSky : titleColorDefault
                        )}
                    >
                        {title}
                    </h2>
                    <p className="text-lg font-base">{subtitle}</p>
                </div>
                <div className="grid lg:grid-cols-3 gap-8">
                    {items.map((item, index) => {
                        const { title, icons, paragraphs, links } = item;

                        const [titleIcon, linkIcon] = icons;
                        const link = links[0];

                        const Wrapper = link ? Link : 'div';
                        const wrapperProps = link ? { to: link.href } : {};

                        return (
                            <Wrapper
                                key={index}
                                {...wrapperProps}
                                className="group relative cursor-pointer"
                                role={link ? 'link' : 'button'}
                            >
                                <div
                                    className={twJoin(
                                        'absolute -inset-px bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm',
                                        uiPreset === 'sky'
                                            ? featureItemOverlayStyleSky
                                            : featureItemOverlayStyleDefault
                                    )}
                                ></div>
                                <div
                                    className={twJoin(
                                        'relative h-full rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300',
                                        uiPreset === 'sky'
                                            ? featureItemBgColorSky
                                            : featureItemBgColorDefault
                                    )}
                                >
                                    <div className="h-12 mb-6">
                                        <div
                                            className={twJoin(
                                                'inline-flex p-3 rounded-xl',
                                                uiPreset === 'sky'
                                                    ? featureItemIconColorSky[index]
                                                    : featureItemIconStyleDefault
                                            )}
                                        >
                                            <Icon
                                                icon={titleIcon}
                                                className="w-6 h-6 text-inherit"
                                            />
                                        </div>
                                    </div>
                                    <h3
                                        className={twJoin(
                                            'text-xl font-semibold mb-4',
                                            uiPreset === 'sky'
                                                ? featureItemTitleColorSky
                                                : featureItemTitleColorDefault
                                        )}
                                    >
                                        {title}
                                    </h3>
                                    <SafeHtml
                                        value={paragraphs}
                                        className={twJoin(
                                            'mb-6',
                                            uiPreset === 'sky'
                                                ? featureItemSubtitleColorSky
                                                : featureItemSubtitleColorDefault
                                        )}
                                    />
                                    {link && (
                                        <div
                                            className={twJoin(
                                                'inline-flex items-center font-medium',
                                                uiPreset === 'sky'
                                                    ? featureItemLinkStyleSky[index]
                                                    : featureItemLinkStyleDefault
                                            )}
                                        >
                                            {link.label}
                                            <Icon
                                                icon={linkIcon}
                                                className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform text-inherit"
                                            />
                                        </div>
                                    )}
                                </div>
                            </Wrapper>
                        );
                    })}
                </div>
            </div>
        </Container>
    );
}
