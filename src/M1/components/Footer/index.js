import React, { useState, useRef, useEffect } from 'react';
import { Icon, Image, Link, getPageProfile, SafeHtml } from '@uniwebcms/module-sdk';
import { getMediaLinkType, getMediaIcon } from '../_utils/media';
import { GoGlobe } from 'react-icons/go';
import { IoIosSend } from 'react-icons/io';
import { HiChevronDown, HiCheck } from 'react-icons/hi';

const parseBlockData = (block) => {
    const { themeName, main } = block;

    const banner = main?.banner;
    const icons = main?.body?.icons || [];
    const images = main?.body?.imgs || [];
    const links = main?.body?.links || [];
    const lists = main?.body?.lists || [];
    const paragraphs = main?.body?.paragraphs || [];

    let logo = null;

    if (icons[0]) {
        logo = {
            Element: Icon,
            props: { icon: icons[0] },
        };
    } else if (images.length) {
        let logoImg = images.find((img) => {
            const theme = themeName.split('__')[1];
            return img.caption === `logo-${theme}`;
        });

        if (!logoImg) {
            logoImg = images[0];
        }

        logo = {
            Element: Image,
            props: {
                profile: getPageProfile(),
                url: logoImg.url,
                value: logoImg.value,
                alt: logoImg.alt,
            },
        };
    }

    let mediaLinks = [],
        legalLinks = [],
        groupedLinks = [];

    links.forEach((link) => {
        const type = getMediaLinkType(link);

        if (type) {
            link.mt = type;
            mediaLinks.push(link);
        } else {
            legalLinks.push(link);
        }
    });

    if (lists[0]) {
        lists[0].forEach((list) => {
            const title = list.paragraphs?.[0] || '';
            const listItems = list.lists?.[0] || [];

            const listLinks = listItems.map((item) => item.links?.[0]).filter(Boolean);

            groupedLinks.push({
                title,
                links: listLinks,
            });
        });
    }

    return {
        background: banner,
        logo,
        mediaLinks,
        legalLinks,
        groupedLinks,
        copyright: paragraphs,
    };
};

const LanguageSelector = ({ website }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = website.getLanguages();
    const currentLanguage = website.getLanguage();
    const currentLanguageLabel = languages.find((lang) => lang.value === currentLanguage)?.label;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Dropdown Menu - Positioned Above */}
            {isOpen && (
                <div className="absolute bottom-full z-10 w-52 mb-2 bg-white border rounded-lg shadow-lg">
                    <ul className="py-1">
                        {languages.map((language, index) => (
                            <li key={index}>
                                <div
                                    onClick={() => {
                                        if (language.value !== currentLanguage)
                                            website.changeLanguage(language.value);
                                        setIsOpen(false);
                                    }}
                                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-200/80"
                                >
                                    <span>{language.label}</span>
                                    {currentLanguage === language.value && (
                                        <HiCheck className="w-4 h-4 text-blue-500" />
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Language Selector Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-52 focus:outline-none cursor-pointer text-text-color-90 hover:text-text-color"
            >
                <GoGlobe className="w-5 h-5" />
                <span className="mx-2 text-sm">{currentLanguageLabel}</span>
                <HiChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                    }`}
                />
            </div>
        </div>
    );
};

export default function Footer(props) {
    const { block, website } = props;

    const { background, logo, mediaLinks, legalLinks, groupedLinks, copyright } =
        parseBlockData(block);

    const emailInputRef = useRef(null);

    const handleSubmit = (e) => {
        const email = emailInputRef.current.value;

        e.preventDefault();

        website.submitWebsiteForm('newsletter', { email }).then((res) => {
            alert(
                website.localize({
                    en: 'Thank you for your interest.',
                    fr: 'Merci pour votre intérêt.',
                })
            );
        });
    };

    return (
        <footer className="relative w-screen py-8 lg:py-16 xl:py-24">
            {/* background */}
            {background && (
                <div className="absolute inset-0">
                    <Image
                        profile={getPageProfile()}
                        {...background}
                        className="object-cover w-full h-full"
                    />
                </div>
            )}
            {/* content */}
            <div className="relative px-16 lg:px-24 max-w-8xl mx-auto z-10">
                {/* navigation */}
                <div className="w-full flex flex-col lg:flex-row lg:gap-x-20 xl:gap-x-24 2xl:gap-x-28 gap-y-8">
                    {/* logo && media links && newsletter */}
                    <div className="flex flex-col max-w-full lg:max-w-64 mt-2">
                        {logo && (
                            <Link to="/" title="company logo" className="block h-12 lg:h-16">
                                <logo.Element
                                    {...logo.props}
                                    className="h-full w-auto max-w-full object-contain"
                                />
                            </Link>
                        )}
                        {/* media links */}
                        <div className="flex flex-wrap gap-3 mt-4">
                            {mediaLinks.map((link, index) => {
                                const { label, href, mt: type } = link;

                                const linkTitle = {
                                    en: `${label || type} link of the main website`,
                                    fr: `Lien ${label || type} du site principal`,
                                };

                                const Icon = getMediaIcon(type);

                                return (
                                    <a
                                        key={index}
                                        className="block w-12 h-12 rounded-full bg-icon-color/10 backdrop-blur-md p-3"
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={website.localize(linkTitle)}
                                    >
                                        <span className="sr-only">{type}</span>
                                        <Icon className="w-6 h-6 hover:scale-105" />
                                    </a>
                                );
                            })}
                        </div>
                        {/* newsletter */}
                        <div className="mt-4 lg:mt-16">
                            <p className="pl-2 text-lg lg:text-xl border-text-color-90">
                                {website.localize({
                                    en: 'Signup to our newsletter',
                                    fr: 'Inscrivez-vous à notre newsletter',
                                })}
                            </p>
                            <form onSubmit={handleSubmit} className="relative mt-4">
                                <div className="w-72 lg:w-full">
                                    <label htmlFor="email-address" className="sr-only">
                                        Email address
                                    </label>
                                    <div className="border border-text-color-90 rounded-3xl py-3 px-5">
                                        <input
                                            ref={emailInputRef}
                                            id="email-address"
                                            name="email-address"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="bg-inherit block w-full text-base placeholder:text-text-color-80 focus:outline-none"
                                            placeholder={website.localize({
                                                en: 'Type your email',
                                                fr: 'Entrez votre email',
                                            })}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 !bg-inherit"
                                >
                                    <IoIosSend className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                    {/* grouped links */}
                    <div className="flex-grow grid grid-col-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-9">
                        {groupedLinks.map((group, gIndex) => (
                            <div key={`g_${gIndex}`}>
                                <h3 className="text-lg lg:text-xl font-extralight text-text-color-80">
                                    {group.title}
                                </h3>
                                <ul role="list" className="mt-3">
                                    {group.links.map((link, lIndex) => (
                                        <li key={`l_${lIndex}`}>
                                            <Link
                                                to={link.href}
                                                className="block py-1.5 font-light text-text-color hover:underline w-fit"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                {/* legal */}
                <div className="w-full flex flex-col lg:flex-row lg:justify-between lg:items-start gap-x-6 gap-y-4 mt-12 lg:mt-24 border-t border-text-color/50 pt-6 lg:border-0 lg:pt-0">
                    <div className="flex flex-wrap items-center gap-x-5">
                        {/* copy right */}
                        {copyright && (
                            <SafeHtml
                                value={copyright}
                                className="text-sm font-light mr-3 w-screen mb-2 lg:w-auto lg:mb-0 text-text-color/90"
                            />
                        )}
                        {/* legal links */}
                        {legalLinks.map((link, index) => (
                            <React.Fragment key={index}>
                                <Link
                                    key={index}
                                    to={link.href}
                                    className="text-sm font-light hover:underline"
                                >
                                    {link.label}
                                </Link>
                                {index < legalLinks.length - 1 && (
                                    <span className="text-text-color-70">|</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    {/* language */}
                    <LanguageSelector website={website} />
                </div>
            </div>
        </footer>
    );
}
