import React from 'react';
import Container from '../_utils/Container';
import { useLoadProfileBody, stripTags, getPageProfile } from '@uniwebcms/module-sdk';
import { Image, Link, MediaIcon } from '@uniwebcms/core-components';
import { getMediaLinkType } from '../_utils/media';

const ItemsRenderer = ({ items, aspectRatio, website }) => {
    return items.map((item, index) => {
        const { banner, title, subtitle, links } = item;

        return (
            <li key={index}>
                {banner ? (
                    <div className="relative rounded-2xl overflow-hidden">
                        <Image
                            profile={getPageProfile()}
                            {...banner}
                            className="h-auto w-full rounded-2xl object-cover"
                            style={{ aspectRatio }}
                        />
                        {banner.caption ? (
                            <figcaption className="absolute bottom-0 w-full">
                                <div
                                    className={`text-center tracking-normal text-sm outline-none text-text-color-10 bg-text-color/70`}
                                >
                                    {banner.caption}
                                </div>
                            </figcaption>
                        ) : null}
                    </div>
                ) : null}
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{stripTags(title)}</h3>
                <p className="text-text-color-80">{stripTags(subtitle)}</p>
                <ul role="list" className="mt-3 flex gap-x-3">
                    {links.map((link, index) => {
                        const type = getMediaLinkType(link);

                        return (
                            <Link key={index} to={link.href}>
                                <span className="sr-only">{'website link'}</span>
                                <MediaIcon type={type} size="5" className="hover:scale-105" />
                            </Link>
                        );
                    })}
                </ul>
            </li>
        );
    });
};

const ProfilesRenderer = ({ profiles, aspectRatio, website }) => {
    return profiles.map((profile, index) => {
        const { title, subtitle } = profile.getBasicInfo();

        let mediaLinks = [];

        if (useLoadProfileBody(profile)) {
            mediaLinks = profile.getSocialMediaLinks('social_media_links');
        }

        return (
            <li key={index}>
                <Image
                    profile={profile}
                    type="avatar"
                    className="h-auto w-full rounded-2xl object-cover"
                    style={{ aspectRatio }}
                />
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{title}</h3>
                <p className="text-text-color-80">{subtitle}</p>
                <ul role="list" className="mt-3 flex gap-x-3">
                    {mediaLinks.map((link, index) => {
                        const { url, type } = link;

                        return (
                            <Link key={index} to={url}>
                                <MediaIcon type={type} size="5" />
                            </Link>
                        );
                    })}
                </ul>
            </li>
        );
    });
};

export default function TeamRoster(props) {
    const { block, website, input } = props;
    const { main } = block;

    const items = block.getBlockItems();

    const {
        aspect_ratio = '3/2',
        vertical_padding = 'lg',
        card_size = 'lg',
    } = block.getBlockProperties();

    const { title = '', subtitle = '' } = main.header || {};

    const members = input.profiles.filter((p) => p.contentType === 'members');

    if (!members.length && !items.length) return null;

    let py = '';

    if (vertical_padding === 'none') {
        py = 'py-0 lg:py-0';
    } else if (vertical_padding === 'sm') {
        py = 'py-6 lg:py-12';
    } else if (vertical_padding === 'md') {
        py = 'py-8 lg:py-16';
    } else if (vertical_padding === 'lg') {
        py = 'py-12 lg:py-24';
    }

    let gridClass = '';

    if (card_size === 'sm') {
        gridClass =
            'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-8';
    } else if (card_size === 'md') {
        gridClass = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8';
    } else if (card_size === 'lg') {
        gridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12';
    }

    return (
        <Container py={py}>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        {stripTags(title)}
                    </h2>
                    {subtitle ? (
                        <p className="mt-2 text-lg leading-8 sm:text-xl text-text-color-80">
                            {stripTags(subtitle)}
                        </p>
                    ) : null}
                </div>
                <ul
                    role="list"
                    className={`mx-auto ${title || subtitle ? 'mt-8' : ''} grid ${gridClass}`}
                >
                    {members.length ? (
                        <ProfilesRenderer
                            profiles={members}
                            aspectRatio={aspect_ratio}
                            website={website}
                        />
                    ) : items.length ? (
                        <ItemsRenderer items={items} aspectRatio={aspect_ratio} website={website} />
                    ) : null}
                </ul>
            </div>
        </Container>
    );
}
