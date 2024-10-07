import React, { useRef } from 'react';
import {
    Link,
    Icon,
    stripTags,
    website,
    MediaIcon,
    SafeHtml,
    twJoin,
    getPageProfile,
    Image,
    Disclaimer,
} from '@uniwebcms/module-sdk';
import { getMediaLinkType } from '../_utils/media';
import { MdEmail } from 'react-icons/md';
import { BiSolidChevronUp } from 'react-icons/bi';

const Branding = ({ logo, title, subtitle, mediaLinks }) => {
    mediaLinks.map((link) => {
        const type = getMediaLinkType(link);

        if (type) {
            link.type = type;
        }
    });

    return (
        <div className="w-full">
            <div className="w-full flex flex-wrap items-center gap-4">
                {logo ? (
                    <Link to="" title="website logo" className="block">
                        <div className="h-12 w-fit">{logo}</div>
                    </Link>
                ) : null}
                <p className="text-base sm:text-lg font-semibold text-text-color">
                    {stripTags(title)}
                </p>
            </div>
            <p className="mt-2 text-md sm:text-base font-medium text-text-color-80">
                {stripTags(subtitle)}
            </p>
            <div className="flex flex-wrap mt-6">
                {mediaLinks.map((link, index) => {
                    const { label, href, type } = link;

                    const linkTitle = {
                        en: `${label || type} link of the main website`,
                        fr: `Lien ${label || type} du site principal`,
                    };

                    return (
                        <a
                            key={index}
                            className="mr-4"
                            href={href}
                            target="_blank"
                            title={website.localize(linkTitle)}
                        >
                            <span className="sr-only">{type}</span>
                            <MediaIcon type={type} className="w-6 h-6 hover:scale-105" />
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

const Navigation = ({ groupedLinks, colSpan }) => {
    const pages = website.getPageHierarchy({
        nested: true,
        filterEmpty: true,
        // pageOnly: true
    });

    const groupedPages = [];

    const pageLinks = pages
        .map((page) => {
            const { label, route, hasData, child_items } = page;

            if (hasData) return { label, href: website.makeHref(route) };
            else if (child_items.length) {
                groupedPages.push({
                    label: label,
                    links: child_items.map((child) => {
                        const { label, route } = child;
                        return { label, href: website.makeHref(route) };
                    }),
                });
            }
        })
        .filter(Boolean);

    const linkGroups = groupedLinks.map((group) => {
        const label = group.paragraphs?.[0] || '';
        const list = group.lists?.[0] || [];

        const listLinks = list.map((item) => item.links?.[0]).filter(Boolean);

        return { label, links: listLinks };
    });

    linkGroups.unshift(...groupedPages);

    linkGroups.unshift({
        label: website.localize({
            en: 'Pages',
            fr: 'Pages',
        }),
        links: pageLinks,
    });

    return (
        <div className="w-full flex flex-wrap gap-y-6">
            {linkGroups.map((group, index) => {
                const { label, links } = group;

                return (
                    <div
                        key={index}
                        className="pr-2"
                        style={{
                            width: `${100 / colSpan}%`,
                        }}
                    >
                        <p className="text-base font-semibold uppercase text-text-color-70">
                            {stripTags(label)}
                        </p>
                        <ul className="mt-4 space-y-2">
                            {links.map((link, index) => {
                                const { label, href } = link;

                                return (
                                    <li key={index}>
                                        <Link
                                            to={href}
                                            className="text-base font-medium hover:underline"
                                        >
                                            {stripTags(label)}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};

const Newsletter = (props) => {
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        const email = inputRef.current.value;

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
        <div className="w-full space-y-4 lg:space-y-8">
            <div className="flex items-start space-x-2">
                <MdEmail className="flex-shrink-0 w-5 h-5 mt-0.5" />
                <p className="text-base font-semibold text-text-color-60">
                    {website.localize({
                        en: 'Stay up to date on the latest from us',
                        fr: 'Restez à jour sur les dernières nouvelles de nous',
                    })}
                </p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="w-full max-w-xs">
                    <label htmlFor="email-address" className="sr-only">
                        Email address
                    </label>
                    <div className="border-b border-text-color-90 py-2 px-1">
                        <input
                            ref={inputRef}
                            id="email-address"
                            name="email-address"
                            type="email"
                            autoComplete="email"
                            required
                            className="bg-inherit block w-full text-base text-text-color placeholder:text-text-color-60 focus:outline-none"
                            placeholder={website.localize({
                                en: 'Enter your email',
                                fr: 'Entrez votre adresse e-mail',
                            })}
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <input
                        type="submit"
                        className="px-4 py-2 text-base font-medium text-center text-primary-800 bg-primary-300 border border-primary-300 cursor-pointer hover:bg-primary-200 focus:outline-none"
                        value={website.localize({
                            en: 'Subscribe',
                            fr: 'Souscrire',
                        })}
                    ></input>
                </div>
            </form>
        </div>
    );
};

const BackToTop = ({ size }) => {
    return (
        <button
            className="focus:outline-none flex flex-col items-center group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <span className="sr-only">Back to top</span>
            <BiSolidChevronUp
                className={twJoin(
                    size === 'sm' && 'w-6 h-6 p-0.5',
                    size === 'md' && 'w-6 h-6 p-0.5 sm:w-8 sm:h-8 sm:p-1',
                    'bg-primary-200 text-primary-800 rounded-full group-hover:bg-primary-100'
                )}
            />
            <span
                className={twJoin(
                    size === 'sm' && 'text-xs lg:text-sm',
                    size === 'md' && 'text-xs sm:text-md lg:text-base',
                    'mt-1.5 text-text-color-80 group-hover:text-text-color uppercase'
                )}
            >
                {website.localize({
                    en: 'Back to top',
                    fr: 'Retour en haut',
                })}
            </span>
        </button>
    );
};

export default function MediaFooter(props) {
    const { block } = props;
    const { themeName, main, mainHeader } = block;

    const { title = '', subtitle = '' } = mainHeader || {};
    const banner = main?.banner;
    const firstIcon = main?.body?.icons?.[0];
    const images = [];
    const mediaLinks = main?.body?.links || [];
    const groupedLinks = main?.body?.lists?.[0] || [];

    const copyright = main?.body?.paragraphs || [];

    const { with_newsletter = true, with_back_to_top = false } = block.getBlockProperties();

    const smallScreen = window.innerWidth < 1024;

    if (main?.body?.imgs?.length) {
        images.push(...main?.body?.imgs);
    }

    if (banner) {
        images.unshift(banner);
    }

    let logo = null;

    if (firstIcon) {
        logo = <Icon icon={firstIcon} className="w-full h-full" />;
    } else {
        if (images.length) {
            let logoImg = images.find((img) => {
                const theme = themeName.split('__')[1];

                return img.caption === `logo-${theme}`;
            });

            if (!logoImg) {
                logoImg = images[0];
            }

            logo = (
                <Image
                    profile={getPageProfile()}
                    url={logoImg.url}
                    value={logoImg.value}
                    alt={logoImg.alt}
                    className="w-full h-full object-contain"
                />
            );
        }
    }

    return (
        <footer className="pt-16 pb-8 lg:pt-24 lg:pb-10 bg-bg-color-90">
            <div className="px-6 md:px-8">
                <div className="relative mx-auto max-w-10xl grid gap-12 lg:grid-cols-6 lg:gap-18">
                    <div className="col-span-2">
                        <Branding
                            title={title}
                            subtitle={subtitle}
                            logo={logo}
                            mediaLinks={mediaLinks}
                        />
                    </div>
                    <div
                        className={twJoin(
                            with_newsletter ? 'col-span-2' : 'col-span-4',
                            !with_newsletter && with_back_to_top && 'pr-[90px] sm:pr-[100px]'
                        )}
                    >
                        <Navigation
                            {...props}
                            groupedLinks={groupedLinks}
                            colSpan={smallScreen ? 3 : with_newsletter ? 2 : 4}
                        />
                    </div>
                    {with_newsletter ? (
                        <div
                            className={twJoin(
                                'relative col-span-2',
                                with_back_to_top && 'pr-[100px]'
                            )}
                        >
                            <Newsletter />
                        </div>
                    ) : null}
                    {with_back_to_top ? (
                        <>
                            <div
                                className={twJoin(
                                    'absolute top-0 lg:row-start-1',
                                    with_newsletter || groupedLinks.length > 2
                                        ? 'right-0'
                                        : 'right-0 lg:right-[15%]',
                                    with_newsletter ? 'row-start-3' : 'row-start-2'
                                )}
                            >
                                <BackToTop
                                    size={with_newsletter || groupedLinks.length > 3 ? 'sm' : 'md'}
                                />
                            </div>
                        </>
                    ) : null}
                </div>
                <hr className="my-8 border-text-color-70" />
                <SafeHtml
                    value={copyright}
                    className="font-normal text-center text-text-color-60"
                />
                <div className="flex justify-center pt-4 pb-1 text-text-color-70 text-sm">
                    <Disclaimer {...props} />
                </div>
            </div>
        </footer>
    );
}
