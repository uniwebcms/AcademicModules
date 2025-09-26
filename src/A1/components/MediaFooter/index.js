import React, { useRef } from 'react';
import { stripTags, website, twJoin, getPageProfile } from '@uniwebcms/module-sdk';
import { Link, Icon, Image, MediaIcon, Disclaimer, SafeHtml } from '@uniwebcms/core-components';
import { getMediaLinkType } from '../_utils/media';
import { MdEmail } from 'react-icons/md';
import { BiSolidChevronUp } from 'react-icons/bi';
import toast from '../_utils/Toast';

const Branding = ({ logo, title, subtitle, links }) => {
    const mediaLinks = [],
        regularLinks = [];

    links.forEach((link) => {
        const type = getMediaLinkType(link);

        if (type) {
            link.type = type;
            mediaLinks.push(link);
        } else {
            regularLinks.push(link);
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
            <div className="flex flex-col mt-8">
                {regularLinks.length > 0 && (
                    <div className="flex flex-col space-y-2">
                        {regularLinks.map((link, index) => {
                            const { label, href } = link;

                            return (
                                <Link
                                    key={index}
                                    to={website.makeHref(href)}
                                    className="hover:underline"
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                )}
                {mediaLinks.length > 0 && (
                    <div className="flex flex-wrap mt-4">
                        {mediaLinks.map((link, index) => {
                            return (
                                <Link key={index} className="mr-2 hover:scale-105" to={link.href}>
                                    <span className="sr-only">{link.type}</span>
                                    <MediaIcon type={link.type} size="6" />
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const Navigation = ({ groupedLinks, size = 'sm' }) => {
    const pages = website.getPageHierarchy({
        nested: true,
        filterEmpty: true,
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
        <div
            className="w-full grid gap-x-6 gap-y-8 lg:gap-x-10 lg:gap-y-12 xl:gap-x-14 xl:gap-y-16"
            style={
                size === 'sm'
                    ? { gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }
                    : { gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }
            }
        >
            {linkGroups.map((group, index) => {
                const { label, links } = group;

                return (
                    <div key={index} className="w-full">
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

const Newsletter = ({ block }) => {
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        const email = inputRef.current.value;

        e.preventDefault();

        block.submitWebsiteForm('newsletter', { email }).then((res) => {
            toast(
                website.localize({
                    en: 'Thank you for subscribing!',
                    fr: 'Merci de vous être abonné !',
                }),
                {
                    theme: 'success',
                    position: 'top-center',
                    duration: 2000,
                }
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
                        {website.localize({
                            en: 'Email address',
                            fr: 'Adresse e-mail',
                        })}
                    </label>
                    <div className="border-b border-text-color-50 py-2 px-1">
                        <input
                            ref={inputRef}
                            id="email-address"
                            name="email-address"
                            type="email"
                            autoComplete="email"
                            required
                            className="bg-inherit block w-full text-base text-text-color placeholder:text-text-color-40 focus:outline-none"
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
                        className="px-4 py-2 text-base font-medium text-center cursor-pointer bg-btn-color text-btn-text-color hover:bg-btn-hover-color hover:text-btn-hover-text-color"
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

const BackToTop = () => {
    return (
        <div
            className="flex flex-col items-center group cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <span className="sr-only">Back to top</span>
            <BiSolidChevronUp
                className={twJoin(
                    'w-6 h-6 p-0.5 lg:w-8 lg:h-8 lg:p-1',
                    'bg-primary-200 text-primary-800 rounded-full group-hover:bg-primary-100'
                )}
            />
            <span
                className={twJoin(
                    'text-xs lg:text-md xl:text-base',
                    'mt-1.5 text-text-color-60 group-hover:text-text-color uppercase'
                )}
            >
                {website.localize({
                    en: 'Back to top',
                    fr: 'Retour en haut',
                })}
            </span>
        </div>
    );
};

export default function MediaFooter(props) {
    const { block } = props;
    const { themeName, main, mainHeader } = block;

    const { title = '', subtitle = '' } = mainHeader || {};
    const banner = main?.banner;
    const firstIcon = main?.body?.icons?.[0];
    const images = [];
    const links = main?.body?.links || [];
    const groupedLinks = main?.body?.lists?.[0] || [];

    const copyright = main?.body?.paragraphs || [];

    const { with_newsletter = true, with_back_to_top = false } = block.getBlockProperties();

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
        <footer className="pt-16 pb-8 lg:pt-24 lg:pb-10 px-6 md:px-8">
            <div className="relative mx-auto max-w-9xl">
                <div
                    className={twJoin(
                        'flex flex-col lg:flex-row gap-12 xl:gap-16 2xl:gap-20',
                        with_back_to_top
                            ? 'w-full xl:w-[calc(100%-200px)] 2xl:w-[calc(100%-260px)]'
                            : 'w-full',
                        with_newsletter && 'min-h-[450px]',
                        with_back_to_top && with_newsletter
                            ? 'lg:w-full'
                            : 'lg:w-[calc(100%-160px)]'
                    )}
                >
                    {/* Branding */}
                    <div
                        className={twJoin(
                            'lg:w-[360px] lg:flex-shrink-0',
                            with_back_to_top ? 'w-[calc(100%-120px)]' : 'w-full'
                        )}
                    >
                        <Branding title={title} subtitle={subtitle} logo={logo} links={links} />
                    </div>
                    {/* Navigation */}
                    <div className={twJoin('w-full lg:w-auto lg:flex-grow')}>
                        <Navigation
                            groupedLinks={groupedLinks}
                            size={with_newsletter ? 'sm' : 'lg'}
                        />
                    </div>
                    {/* Newsletter */}
                    {with_newsletter && (
                        <div className="w-full lg:w-[300px] lg:flex-shrink-0">
                            <Newsletter block={block} />
                        </div>
                    )}
                </div>
                {with_back_to_top && (
                    <div
                        className={twJoin(
                            'absolute',
                            with_newsletter
                                ? 'top-2 lg:top-56 right-0 lg:right-[105px] xl:right-0 xl:top-0'
                                : 'top-2 right-0'
                        )}
                    >
                        <BackToTop />
                    </div>
                )}
            </div>

            {/* disclaimer and copyright */}
            <hr className="my-8 border-text-color-70" />
            <SafeHtml value={copyright} className="font-normal text-center text-text-color-60" />
            <div className="flex justify-center pt-4 pb-1 text-text-color-70 text-sm">
                <Disclaimer {...props} />
            </div>
        </footer>
    );
}
