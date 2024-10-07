import React from 'react';
import Container from '../_utils/Container';
import {
    Image,
    Link,
    MediaIcon,
    useLoadProfileBody,
    stripTags,
    getPageProfile,
} from '@uniwebcms/module-sdk';
import { getMediaLinkType } from '../_utils/media';

const ItemsRenderer = ({ items, aspectRatio, website }) => {
    return items.map((item, index) => {
        const { banner, title, subtitle, links } = item;

        return (
            <li key={index}>
                {banner ? (
                    <Image
                        profile={getPageProfile()}
                        value={banner.value}
                        alt={banner.alt}
                        url={banner.url}
                        className="h-auto w-full rounded-2xl object-cover"
                        style={{ aspectRatio }}
                    />
                ) : null}
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{stripTags(title)}</h3>
                <p className="text-text-color-80">{stripTags(subtitle)}</p>
                <ul role="list" className="mt-3 flex gap-x-3">
                    {links.map((link, index) => {
                        const type = getMediaLinkType(link);

                        let linkTitle;

                        if (!type) {
                            linkTitle = {
                                en: `${stripTags(title)}'s website link`,
                                fr: `Lien vers le site web de ${stripTags(title)}`,
                            };
                        } else {
                            linkTitle = {
                                en: `${stripTags(title)}'s ${type} link`,
                                fr: `Lien vers le ${type} de ${stripTags(title)}`,
                            };
                        }

                        return (
                            <Link
                                key={index}
                                to={link.href}
                                target="_blank"
                                title={website.localize(linkTitle)}
                            >
                                <span className="sr-only">{type || 'website link'}</span>
                                <MediaIcon type={type} size="5" />
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
                        const { url } = link;

                        const type =
                            link.type || website.localize({ en: 'website', fr: 'site web' });

                        let linkTitle = {
                            en: `${title}'s ${type} link`,
                            fr: `Lien vers le ${type} de ${title}`,
                        };

                        return (
                            <Link
                                key={index}
                                to={url}
                                target="_blank"
                                title={website.localize(linkTitle)}
                            >
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
    const aspect_ratio = block.getBlockProperties().aspect_ratio || '3/2';

    const { title = '', subtitle = '' } = main.header || {};

    const members = input.profiles.filter((p) => p.contentType === 'members');

    if (!members.length && !items.length) return null;

    return (
        <Container>
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
                    className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
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
