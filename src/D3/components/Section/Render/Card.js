import React, { useRef } from 'react';
import { twJoin, website } from '@uniwebcms/module-sdk';
import { Link, Asset, FileLogo, Icon } from '@uniwebcms/core-components';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import {
    LuMapPin,
    LuPhone,
    LuLink,
    LuCalendarDays,
    LuDownload,
    LuExternalLink,
} from 'react-icons/lu';

function getCoverImgUrl(coverImg) {
    if (!coverImg) return null;

    let coverUrl = '';

    if (coverImg.src) {
        coverUrl = coverImg.src;
    } else if (coverImg.identifier) {
        coverUrl =
            new uniweb.Profile(`docufolio/profile`, '_template').getAssetInfo(coverImg.identifier)
                ?.src || '';
    } else if (typeof coverImg === 'string') {
        coverUrl = coverImg;
    }

    return coverUrl;
}

const MapComponent = ({ address }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: website.getMapAPIKey(),
    });

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    const location = address.geometry.location;

    return (
        <GoogleMap
            mapContainerStyle={{
                width: '100%',
                height: '100%',
            }}
            center={location}
            zoom={15}
            options={{
                streetViewControl: false, // Disable Street View control
                mapTypeControl: false, // Disable Map/Satellite switch}
            }}
        >
            <Marker position={location} />
        </GoogleMap>
    );
};

export default function Card(props) {
    const {
        address,
        caption,
        contact,
        date,
        datetime,
        document,
        href,
        // targetId,
        title,
        type,
        hidden,
        // info,
        displayMode,
        coverImg,
        icon,
    } = props;

    if (hidden) {
        return null;
    }

    switch (type) {
        case 'event':
            return (
                <Event
                    {...{ title, caption, href, address, datetime, contact, icon, coverImg }}
                ></Event>
            );
        case 'address':
            return <Address {...{ title, caption, href, address, date, contact }}></Address>;
        case 'document':
            return <Document {...{ title, caption, document, displayMode }}></Document>;
        default:
            return <Basic {...{ title, caption, href, icon, coverImg }}></Basic>;
    }
}

const Event = (props) => {
    const { title, caption, href, address, datetime, contact, coverImg, icon } = props;

    let phoneNumber, extension, cleanedPhoneNum;

    if (contact) {
        [phoneNumber, extension] = contact.split('|').map((part) => part.trim());
        cleanedPhoneNum = phoneNumber.replace(/[^+\d]/g, '');
    }

    const coverImgUrl = getCoverImgUrl(coverImg);

    return (
        <div
            className={twJoin(
                'not-prose w-full max-w-full sm:max-w-[calc(50%-12px)] border-[length:var(--depth-style-outline)] rounded-[var(--border-radius)] [box-shadow:var(--depth-style-shadow)] border-text-color/20 hover:ring-2 hover:ring-[var(--card-ring-color)] bg-[var(--card-background-color)] overflow-hidden',
                coverImgUrl ? '' : 'p-6'
            )}
        >
            {coverImgUrl && (
                <div className="w-full h-40 overflow-hidden">
                    <img
                        src={coverImgUrl}
                        alt={'Card Cover Image'}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            <div className={twJoin('relative', coverImgUrl ? 'px-6 py-4' : '')}>
                {icon.svg && (
                    <div className="mb-4">
                        <Icon icon={icon} className="w-8 h-8" />
                    </div>
                )}
                {datetime ? (
                    <p className="mb-4 text-sm lg:text-base font-medium text-link-color">
                        {datetime}
                    </p>
                ) : null}
                <h3 className="text-lg lg:text-xl font-semibold">{title}</h3>
                {caption ? (
                    <p className="mt-1 text-base lg:text-lg font-medium">{caption}</p>
                ) : null}
                {address ? (
                    <div className="mt-4 flex items-start">
                        <LuMapPin className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-text-color/80" />
                        <p className="text-sm lg:text-base">{address.formatted_address}</p>
                    </div>
                ) : null}
                {contact && (
                    <div className="mt-3 flex items-start">
                        <LuPhone className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-text-color/80" />
                        <p className="text-sm lg:text-base">
                            <a href={`tel:${cleanedPhoneNum}`}>{phoneNumber}</a>
                            {extension && (
                                <span>
                                    {website.localize({
                                        en: ` ext. ${extension}`,
                                        fr: ` poste ${extension}`,
                                        es: ` ext. ${extension}`,
                                        zh: ` 分机 ${extension}`,
                                    })}
                                </span>
                            )}
                        </p>
                    </div>
                )}
                {href && (
                    <div className="mt-3 flex items-start">
                        <LuLink className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-text-color/80" />
                        <Link to={href} className="text-sm lg:text-base hover:underline break-all">
                            {href}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

const Address = (props) => {
    const { title, caption, href, address, date, contact } = props;

    let phoneNumber, extension, cleanedPhoneNum;

    if (contact) {
        [phoneNumber, extension] = contact.split('|').map((part) => part.trim());
        cleanedPhoneNum = phoneNumber.replace(/[^+\d]/g, '');
    }

    return (
        <div className="not-prose w-full max-w-full sm:max-w-[calc(50%-12px)] border-[length:var(--depth-style-outline)] rounded-[var(--border-radius)] [box-shadow:var(--depth-style-shadow)] border-text-color/20 hover:ring-2 hover:ring-[var(--card-ring-color)] bg-[var(--card-background-color)] overflow-hidden">
            <div className="w-full h-40 overflow-hidden">
                <MapComponent address={address} />
            </div>
            <div className="px-6 py-4">
                <h3 className="text-lg lg:text-xl font-semibold">{title}</h3>
                {caption ? (
                    <p className="mt-1 text-base lg:text-lg font-medium">{caption}</p>
                ) : null}
                {address ? (
                    <div className="mt-4 flex items-start">
                        <LuMapPin className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-text-color/80" />
                        <p className="text-sm lg:text-base">{address.formatted_address}</p>
                    </div>
                ) : null}
                {date ? (
                    <div className="mt-4 flex items-start">
                        <LuCalendarDays className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-text-color/80" />
                        <p className="text-sm lg:text-base">{date}</p>
                    </div>
                ) : null}
                {contact && (
                    <div className="mt-3 flex items-start">
                        <LuPhone className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-text-color/80" />
                        <p className="text-sm lg:text-base">
                            <a href={`tel:${cleanedPhoneNum}`}>{phoneNumber}</a>
                            {extension && (
                                <span>
                                    {website.localize({
                                        en: ` ext. ${extension}`,
                                        fr: ` poste ${extension}`,
                                        es: ` ext. ${extension}`,
                                        zh: ` 分机 ${extension}`,
                                    })}
                                </span>
                            )}
                        </p>
                    </div>
                )}
                {href && (
                    <div className="mt-3 flex items-start">
                        <LuLink className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-text-color/80" />
                        <Link to={href} className="text-sm lg:text-base hover:underline break-all">
                            {href}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

const Document = (props) => {
    const { caption, document, displayMode } = props;

    const assetRef = useRef(null);

    const data = document.at('info');

    const displayName = data.name;
    const { url } = data.metadata;

    return (
        <div className="relative not-prose w-full max-w-full sm:max-w-[calc(50%-12px)] border-[length:var(--depth-style-outline)] rounded-[var(--border-radius)] [box-shadow:var(--depth-style-shadow)] border-text-color/20 hover:ring-2 hover:ring-[var(--card-ring-color)] bg-[var(--card-background-color)] overflow-hidden">
            <div
                className={twJoin(
                    'w-full',
                    displayMode === 'card_file_content' && 'h-40',
                    displayMode === 'card_file_logo' && 'h-[72px]'
                )}
            >
                <div
                    className={twJoin(
                        'w-full h-full',
                        displayMode !== 'card_file_content' && 'hidden'
                    )}
                >
                    <Asset
                        {...{
                            ref: assetRef,
                            value: url,
                            profile: document,
                        }}
                    />
                </div>
                <div
                    className={twJoin(
                        'w-full h-full flex items-center px-6 pt-6',
                        displayMode !== 'card_file_logo' && 'hidden'
                    )}
                >
                    <FileLogo filename={url} size="12"></FileLogo>
                </div>
            </div>
            <div
                className={twJoin(
                    'absolute cursor-pointer',
                    displayMode === 'card_file_content'
                        ? 'w-10 h-10 p-2 rounded-full bg-[var(--card-background-color)]'
                        : 'w-6 h-6',
                    displayMode === 'card_file_content' && 'top-4 right-4',
                    displayMode === 'card_file_logo' && 'top-8 right-6',
                    displayMode === 'link' && 'top-1/2 -translate-y-1/2 right-6'
                )}
                onClick={() => {
                    if (assetRef?.current) {
                        assetRef.current.triggerDownload();
                    }
                }}
            >
                <LuDownload className="w-full h-full text-link-color hover:text-link-hover-color" />
            </div>
            <div className="px-6 py-4">
                <div className={twJoin(displayMode === 'link' ? 'w-[calc(100%-40px)]' : 'w-full')}>
                    <h3 className="text-lg lg:text-xl font-semibold">{displayName}</h3>
                    {caption ? (
                        <p className="mt-1 text-base lg:text-lg font-medium">{caption}</p>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

const Basic = (props) => {
    const { title, caption, href, coverImg, icon } = props;

    const coverImgUrl = getCoverImgUrl(coverImg);

    const Wrapper = href ? Link : 'div';
    const wrapperProps = href
        ? {
              to: href,
          }
        : {};

    return (
        <Wrapper
            {...wrapperProps}
            className={twJoin(
                'block not-prose w-full max-w-full sm:max-w-[calc(50%-12px)] border-[length:var(--depth-style-outline)] rounded-[var(--border-radius)] [box-shadow:var(--depth-style-shadow)] border-text-color/20 hover:ring-2 hover:ring-[var(--card-ring-color)] bg-[var(--card-background-color)] overflow-hidden group',
                coverImgUrl ? '' : 'p-6'
            )}
        >
            {coverImgUrl && (
                <div className="w-full h-40 overflow-hidden">
                    <img
                        src={coverImgUrl}
                        alt={'Card Cover Image'}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            <div className={twJoin('relative', coverImgUrl ? 'px-6 py-4' : '')}>
                {icon.svg && (
                    <div className="mb-4">
                        <Icon icon={icon} className="w-8 h-8" />
                    </div>
                )}
                <h3 className="text-lg lg:text-xl font-semibold text-heading-color">{title}</h3>
                {caption ? (
                    <p className="mt-1 text-base lg:text-lg font-medium text-text-color">
                        {caption}
                    </p>
                ) : null}
                {href && !href.startsWith('topic:') && (
                    <div
                        className={twJoin(
                            'absolute inline-block',
                            coverImgUrl ? 'top-4 right-6' : 'top-0 right-0'
                        )}
                    >
                        <LuExternalLink className="w-6 h-6 text-link-color group-hover:text-link-hover-color transition-colors duration-200" />
                    </div>
                )}
            </div>
        </Wrapper>
    );
};
