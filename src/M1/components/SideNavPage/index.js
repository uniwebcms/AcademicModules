import React, { useRef, useCallback } from 'react';
import Container from '../_utils/Container';
import { twJoin, website } from '@uniwebcms/module-sdk';
import { SafeHtml, Icon, Link } from '@uniwebcms/core-components';
import { LuDownload, LuExternalLink, LuArrowRight } from 'react-icons/lu';

const SimpleCard = ({ block }) => {
    const { title } = block.getBlockContent();

    const items = block.getBlockItems();

    return (
        <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6">{title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {items.map((item, index) => {
                    const { pretitle, title } = item;

                    return (
                        <div key={index} className="bg-neutral-50 rounded-lg p-4">
                            <h3 className="text-sm text-neutral-600 mb-1">{pretitle}</h3>
                            <p className="text-lg font-medium">{title}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

const News = ({ block }) => {
    const { title, properties } = block.getBlockContent();

    const items = block.getBlockItems();

    const { reversed_layout = false } = properties;

    return (
        <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6">{title}</h2>
            <div className="space-y-6">
                {items.map((item, index) => {
                    const { pretitle, title, subtitle, links } = item;

                    const Wrapper = links[0] ? Link : 'div';
                    const wrapperProps = links[0] ? { to: links[0].href } : {};

                    return (
                        <Wrapper
                            key={index}
                            className={twJoin(
                                'flex gap-6 p-4 bg-neutral-50 rounded-lg',
                                reversed_layout ? 'flex-row-reverse justify-between' : 'flex-row',
                                links[0] ? 'hover:bg-neutral-100' : ''
                            )}
                            {...wrapperProps}
                        >
                            <div
                                className={'text-sm text-neutral-500 whitespace-nowrap mt-0.5 w-32'}
                            >
                                {pretitle}
                            </div>
                            <div>
                                <h3
                                    className={twJoin(
                                        links[0]
                                            ? 'font-medium flex items-center gap-2 mb-1'
                                            : 'font-medium mb-1'
                                    )}
                                >
                                    {title}
                                    {links[0] && (
                                        <LuExternalLink className="w-4 h-4 text-inherit" />
                                    )}
                                </h3>
                                <p className="text-sm text-neutral-600">{subtitle}</p>
                            </div>
                        </Wrapper>
                    );
                })}
            </div>
        </section>
    );
};

const Details = ({ block }) => {
    const { title } = block.getBlockContent();

    const items = block.getBlockItems();

    return (
        <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6">{title}</h2>
            <div className="rounded-lg border shadow-sm">
                <div className="p-6 space-y-8">
                    {items.map((item, index) => {
                        const { title, paragraphs } = item;

                        return (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium">{title}</h3>
                                </div>
                                <SafeHtml value={paragraphs} className="text-neutral-600" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

const Assets = ({ block }) => {
    const { title } = block.getBlockContent();

    const items = block.getBlockItems();

    const [logoItem, colorItem] = items;

    const logoItemFeatures = logoItem?.lists?.[0]?.map((item) => item.paragraphs[0]) || [];

    const colorItemFeatures =
        colorItem?.lists?.[0]?.map((item) => {
            return {
                title: item.paragraphs[0],
                features: item.lists?.[0]?.map((subList) => {
                    return subList.paragraphs[0];
                }),
            };
        })?.[0] || {};

    return (
        <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6">{title}</h2>
            <div className="rounded-lg border shadow-sm">
                <div className="p-6">
                    <div className="grid sm:grid-cols-2 gap-8">
                        {logoItem && (
                            <div>
                                <h3 className="font-medium mb-4">{logoItem.title}</h3>
                                {logoItem.properties?.asset_preview && (
                                    <div className="bg-neutral-100 rounded-lg p-4 mb-4">
                                        <div className="w-full h-32 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-400">
                                            {logoItem.properties.asset_preview.text}
                                        </div>
                                    </div>
                                )}
                                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 h-10 px-4 py-2 w-full mb-4">
                                    <LuDownload className="w-4 h-4 mr-2 text-inherit" />
                                    {logoItem.properties.asset_preview.download_text}
                                </button>
                                <ul className="text-sm space-y-2 text-neutral-600 list-disc pl-4">
                                    {logoItemFeatures.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {colorItem && (
                            <div>
                                <h3 className="font-medium mb-4">{colorItem.title}</h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div
                                                className="w-8 h-8 rounded"
                                                style={{
                                                    backgroundColor:
                                                        colorItem.properties?.colors?.primary
                                                            ?.value,
                                                }}
                                            ></div>
                                            <div>
                                                <div className="text-sm font-medium">
                                                    {colorItem.properties?.colors?.primary?.title}
                                                </div>
                                                <div className="text-sm text-neutral-500">
                                                    {colorItem.properties?.colors?.primary?.value}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {colorItem.properties?.colors?.secondary?.map(
                                            (color, index) => (
                                                <div key={index} className="space-y-1 text-center">
                                                    <div
                                                        className="w-full h-8 rounded"
                                                        style={{ backgroundColor: color.value }}
                                                    ></div>
                                                    <div className="text-xs text-neutral-600">
                                                        {color.title}
                                                        <br />
                                                        {color.value}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">
                                            {colorItemFeatures.title}
                                        </h4>
                                        <div className="space-y-2 text-neutral-600">
                                            {colorItemFeatures.features.map((feature, index) => (
                                                <p key={index}>{feature}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Contact = ({ block }) => {
    const { title, paragraphs } = block.getBlockContent();

    const items = block.getBlockItems();

    const [featureItem, resourceItem] = items;

    const featureItemFeatures = featureItem?.lists?.[0]?.map((item) => item.paragraphs[0]) || [];

    const resourceItemButtons =
        resourceItem?.buttons?.map((button, index) => {
            return {
                text: button.content,
                icon: resourceItem?.icons?.[index],
            };
        }) || [];

    return (
        <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6">{title}</h2>
            <div className="rounded-lg border shadow-sm">
                <div className="p-6 space-y-8">
                    <div>
                        <SafeHtml value={paragraphs} className="text-neutral-600 space-y-2" />
                    </div>
                    <div>
                        <h3 className="font-medium mb-4">{featureItem.title}</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {featureItemFeatures.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-neutral-600">
                                    <LuArrowRight className="w-4 h-4 text-secondary-600" />
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="h-px w-full bg-neutral-200/60 mb-6"></div>
                        <h3 className="font-medium mb-4">{resourceItem.title}</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {resourceItemButtons.map((button, idx) => (
                                <button
                                    key={idx}
                                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 border h-10 px-4 py-2 w-full justify-start btn-secondary"
                                >
                                    {button.icon && (
                                        <Icon
                                            icon={button.icon}
                                            className="w-4 h-4 mr-2 text-inherit"
                                        />
                                    )}
                                    {button.text}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function SideNavPage(props) {
    const { block } = props;

    const { title, subtitle } = block.getBlockContent();

    const { childBlocks } = block;

    // Create refs object to store references to each section
    const sectionRefs = useRef({});

    const naviData = childBlocks.map((childBlock) => {
        const { title, properties } = childBlock.getBlockContent();
        return {
            id: properties.id,
            label: title,
        };
    });

    const scrollToSection = useCallback((sectionId) => {
        const element = sectionRefs.current[sectionId];
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, []);

    return (
        <Container className="max-w-7xl mx-auto">
            <div className="lg:grid lg:grid-cols-[1fr,280px] lg:gap-12">
                <article>
                    <div className="mb-12">
                        <h1 className="text-4xl font-serif mb-4">{title}</h1>
                        <p>{subtitle}</p>
                    </div>
                    {childBlocks.map((childBlock, index) => {
                        const { properties } = childBlock.getBlockContent();

                        const component = properties.component;

                        switch (component) {
                            case 'simple_card':
                                return (
                                    <div
                                        key={index}
                                        ref={(el) => (sectionRefs.current[properties.id] = el)}
                                    >
                                        <SimpleCard block={childBlock} />
                                    </div>
                                );
                            case 'news':
                                return (
                                    <div
                                        key={index}
                                        ref={(el) => (sectionRefs.current[properties.id] = el)}
                                    >
                                        <News block={childBlock} />
                                    </div>
                                );
                            case 'details':
                                return (
                                    <div
                                        key={index}
                                        ref={(el) => (sectionRefs.current[properties.id] = el)}
                                    >
                                        <Details block={childBlock} />
                                    </div>
                                );
                            case 'assets':
                                return (
                                    <div
                                        key={index}
                                        ref={(el) => (sectionRefs.current[properties.id] = el)}
                                    >
                                        <Assets block={childBlock} />
                                    </div>
                                );
                            case 'contact':
                                return (
                                    <div
                                        key={index}
                                        ref={(el) => (sectionRefs.current[properties.id] = el)}
                                    >
                                        <Contact block={childBlock} />
                                    </div>
                                );
                            default:
                                return null;
                        }
                    })}
                </article>
                <nav className="hidden lg:block sticky top-20 h-fit">
                    <div className="pl-6">
                        <h2 className="font-medium mb-3">
                            {website.localize({
                                en: 'Quick Navigation',
                                fr: 'Navigation rapide',
                                es: 'Navegación rápida',
                                zh: '快速导航',
                            })}
                        </h2>
                        <div className="space-y-1">
                            {naviData.map((section) => (
                                <div
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className="block py-1.5 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                                >
                                    {section.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </nav>
            </div>
        </Container>
    );
}
