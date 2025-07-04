import React from 'react';
import { Link, MediaIcon, SafeHtml, Disclaimer } from '@uniwebcms/core-components';
import { getMediaLinkType } from '../_utils/media';
import Container from '../_utils/Container';

const getLanguageLabel = (lang) => {
    return (
        {
            en: 'English',
            fr: 'Français',
        }[lang] || ''
    );
};

export default function PageFooter(props) {
    const { block, website, extra } = props;

    const as = extra?.as || 'footer';

    const { mode = 'auto', with_lang_toggle = false } = block.getBlockProperties();

    const pages = website.getPageHierarchy({
        nested: true,
        filterEmpty: false,
    });

    const blockLinks = block.getBlockLinks({ nested: true });

    const socialLinks = [],
        plainLinks = [];

    let navigation = [];

    if (mode == 'auto') {
        if (blockLinks.length) {
            navigation = blockLinks;
        } else {
            navigation = pages;
        }
    } else if (mode == 'manual') {
        navigation = blockLinks;
    } else if (mode == 'page') {
        navigation = pages;
    }

    const { title: copyright = '' } = block.main?.header || {};

    const currentLang = website.getLanguage();
    const langOptions = website.getLanguages();

    const showLangToggle = with_lang_toggle && langOptions.length > 1;

    return (
        <Container as={as} className="pt-9 pb-12 divide-y divide-text-color-60 px-4 bg-bg-color-90">
            <div className="flex flex-wrap px-6 max-w-10xl mx-auto gap-y-4">
                {navigation.map((page, index) => {
                    let { label, route, hasData, child_items } = page;

                    route = route === '/' ? '' : route;

                    return (
                        <div key={index} className="mr-4 md:mr-6 lg:mr-8 xl:mr-12">
                            {hasData ? (
                                <Link
                                    className="text-lg font-semibold hover:underline text-text-color-90 hover:text-text-color"
                                    to={route}
                                >
                                    {label}
                                </Link>
                            ) : (
                                <div className="text-lg font-semibold">{label}</div>
                            )}
                            {child_items.map((child, index) => {
                                const { label, route, hasData } = child;

                                return (
                                    <div key={index} className={index === 0 ? 'mt-2' : 'mt-0'}>
                                        {hasData ? (
                                            <Link
                                                className="text-sm hover:underline text-text-color-90 hover:text-text-color"
                                                to={route}
                                            >
                                                {label}
                                            </Link>
                                        ) : (
                                            <div className="text-sm">{label}</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            <div className="mt-9 pt-9 flex items-start justify-between">
                <div className="w-full px-6 space-y-5 max-w-10xl mx-auto">
                    {socialLinks.length ? (
                        <div className="flex flex-wrap">
                            {socialLinks.map((link, index) => {
                                return (
                                    <Link key={index} className="mr-4" to={link.route}>
                                        <span className="sr-only">{link.type}</span>
                                        <MediaIcon type={link.type} size="6" />
                                    </Link>
                                );
                            })}
                        </div>
                    ) : null}
                    {plainLinks.length ? (
                        <div className="flex flex-wrap">
                            {plainLinks.map((link, index) => {
                                return (
                                    <Link
                                        key={index}
                                        className="text-sm mr-4 hover:underline"
                                        to={website.makeHref(link.route)}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    ) : null}
                    <div className="text-sm text-text-color-70 flex flex-col lg:flex-row justify-between gap-3">
                        {copyright ? (
                            <SafeHtml value={copyright} className="text-sm text-text-color-70" />
                        ) : (
                            <></>
                        )}
                        <Disclaimer {...props} />
                    </div>
                </div>
                {showLangToggle ? (
                    <div className="flex-shrink-0 flex items-center space-x-2 lg:space-x-3 divide-x divide-text-color-60 px-6">
                        {langOptions.map((opt, index) => {
                            return (
                                <p
                                    key={index}
                                    className={`${
                                        opt.value === currentLang
                                            ? 'font-medium text-text-color'
                                            : 'cursor-pointer text-text-color-80 hover:text-text-color'
                                    } ${index > 0 ? 'pl-2 lg:pl-3' : ''}`}
                                    onClick={() => {
                                        if (opt.value !== currentLang) {
                                            website.changeLanguage(opt.value);
                                        }
                                    }}
                                >
                                    {getLanguageLabel(opt.value)}
                                </p>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </Container>
    );
}
