import React from 'react';
import { useLoadProfileBody, getPageProfile } from '@uniwebcms/module-sdk';
import { Image, Link, MediaIcon } from '@uniwebcms/core-components';
import { getMediaLinkType } from '../_utils/media';
import Container from '../_utils/Container';

const IMAGE_SIZE_CLASSES = {
    rounded: {
        sm: 'w-24 h-24 lg:w-32 lg:h-32',
        md: 'w-32 h-32 lg:w-44 lg:h-44',
        lg: 'w-40 h-40 lg:w-56 lg:h-56',
        xl: 'w-48 h-48 lg:w-72 lg:h-72',
        full: 'w-full aspect-square',
    },
    square: {
        sm: 'w-24 h-24 lg:w-32 lg:h-32',
        md: 'w-32 h-32 lg:w-44 lg:h-44',
        lg: 'w-40 h-40 lg:w-56 lg:h-56',
        xl: 'w-48 h-48 lg:w-72 lg:h-72',
        full: 'w-full aspect-square',
    },
    landscape: {
        sm: 'w-32 h-20 lg:w-44 lg:h-28',
        md: 'w-44 h-28 lg:w-60 lg:h-36',
        lg: 'w-56 h-36 lg:w-80 lg:h-48',
        xl: 'w-72 h-44 lg:w-96 lg:h-60',
        full: 'w-full aspect-[16/9]',
    },
    portrait: {
        sm: 'w-20 h-32 lg:w-28 lg:h-44',
        md: 'w-28 h-44 lg:w-36 lg:h-60',
        lg: 'w-36 h-56 lg:w-48 lg:h-80',
        xl: 'w-44 h-72 lg:w-60 lg:h-96',
        full: 'w-full aspect-[3/4]',
    },
};

const getImageProps = (block) => {
    const { image_shape: shape = 'rounded', image_size: size = 'md' } = block.getBlockProperties();

    const shapeKey = IMAGE_SIZE_CLASSES[shape] ? shape : 'rounded';
    const sizeKey = IMAGE_SIZE_CLASSES[shapeKey][size] ? size : 'md';
    return {
        rounded: shapeKey === 'rounded',
        className: IMAGE_SIZE_CLASSES[shapeKey][sizeKey],
    };
};

export default function Aside(props) {
    const { block, input, website } = props;

    const profile = input.profile;
    const imageProps = getImageProps(block);

    return (
        <Container as="aside" className="!py-0">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                {profile ? (
                    <Profile profile={profile} website={website} imageProps={imageProps} />
                ) : (
                    <Content main={block.main} website={website} imageProps={imageProps} />
                )}
            </div>
        </Container>
    );
}

const Profile = ({ profile, imageProps }) => {
    const { title, subtitle } = profile.getBasicInfo();

    let mediaLinks = [];

    if (useLoadProfileBody(profile)) {
        mediaLinks = profile.getSocialMediaLinks('social_media_links');
    }

    return (
        <>
            <Image
                profile={profile}
                type={profile.contentType === 'members' ? 'avatar' : 'banner'}
                rounded={imageProps.rounded}
                className={imageProps.className}
            />
            <h2 className="mt-5 font-bold tracking-tight text-xl md:text-2xl lg:text-3xl">
                {title}
            </h2>
            <h3 className="mt-1 leading-8 text-base md:text-lg text-text-color-80">{subtitle}</h3>
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gpy-y-2">
                {mediaLinks.map((link, index) => (
                    <Link key={index} href={link.href} className="hover:scale-105">
                        <span className="sr-only">{link.type}</span>
                        <MediaIcon type={link.type} size="7" />
                    </Link>
                ))}
            </div>
        </>
    );
};

const Content = ({ main, website, imageProps }) => {
    let image, title, subtitle, links;

    ({ title = '', subtitle = '' } = main?.header || {});

    image = main?.banner;
    links = main?.body?.links || [];

    let mediaLinks = [],
        plainLinks = [];

    links.map((link) => {
        const type = getMediaLinkType(link);

        if (type) {
            link.type = type;
            mediaLinks.push(link);
        } else {
            plainLinks.push(link);
        }
    });

    return (
        <>
            {image ? (
                <Image
                    profile={getPageProfile()}
                    value={image.value}
                    alt={image.alt}
                    url={image.url}
                    href={image.href}
                    rounded={imageProps.rounded}
                    className={imageProps.className}
                />
            ) : null}
            {title ? (
                <h2 className="mt-5 font-bold tracking-tight text-xl md:text-2xl lg:text-3xl">
                    {title}
                </h2>
            ) : null}
            {subtitle ? (
                <h3 className="mt-1 leading-8 text-base md:text-lg text-text-color-80">
                    {subtitle}
                </h3>
            ) : null}
            {plainLinks.length ? (
                <div className="mt-2 flex flex-col items-center w-full gap-y-1">
                    {plainLinks.map((link, index) => (
                        <Link
                            key={index}
                            to={link.href}
                            className="text-sm font-medium md:text-base lg:text-lg hover:underline truncate max-w-full"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            ) : null}
            {mediaLinks.length ? (
                <div className="mt-6 flex flex-wrap justify-center gap-x-4 gpy-y-2">
                    {mediaLinks.map((link, index) => (
                        <Link key={index} href={link.href} className="hover:scale-105">
                            <span className="sr-only">{link.type}</span>
                            <MediaIcon type={link.type} size="7" />
                        </Link>
                    ))}
                </div>
            ) : null}
        </>
    );
};
