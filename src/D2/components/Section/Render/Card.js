import React, { useRef } from 'react';
import { twJoin, website } from '@uniwebcms/module-sdk';
import { Link, Asset, FileLogo } from '@uniwebcms/core-components';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { IoDownload } from 'react-icons/io5';

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
        targetId,
        title,
        type,
        hidden,
        info,
        displayMode,
    } = props;

    if (hidden) {
        return null;
    }

    switch (type) {
        case 'event':
            return <Event {...{ title, caption, href, address, datetime, contact }}></Event>;
        case 'address':
            return <Address {...{ title, caption, href, address, date, contact }}></Address>;
        case 'document':
            return <Document {...{ title, caption, document, displayMode }}></Document>;
        default:
            return <Basic {...{ title, caption, href }}></Basic>;
    }
}

const Event = (props) => {
    const { title, caption, href, address, datetime, contact } = props;

    let phoneNumber, extension, cleanedPhoneNum;

    if (contact) {
        [phoneNumber, extension] = contact.split('|').map((part) => part.trim());
        cleanedPhoneNum = phoneNumber.replace(/[^+\d]/g, '');
    }

    const Wrapper = href ? Link : 'div';
    const wrapperProps = href ? { to: href } : {};

    return (
        <Wrapper
            {...wrapperProps}
            className={twJoin(
                'block not-prose border rounded-lg p-6 text-center w-full max-w-full sm:max-w-[calc(50%-12px)] shadow-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
                href ? 'hover:shadow-xl' : ''
            )}
        >
            {title ? (
                <h3
                    className={
                        'text-xl lg:text-2xl font-semibold text-slate-800 dark:text-slate-200'
                    }
                >
                    {title}
                </h3>
            ) : null}
            {caption ? (
                <p
                    className={
                        'mt-2 text-base lg:text-lg text-slate-700 dark:text-slate-300 font-medium'
                    }
                >
                    {caption}
                </p>
            ) : null}
            {datetime ? (
                <p
                    className={
                        'mt-4 text-base lg:text-lg font-medium text-slate-500 dark:text-slate-400'
                    }
                >
                    {datetime}
                </p>
            ) : null}
            {address ? (
                <p
                    className={
                        'mt-4 text-sm lg:text-base text-slate-700 dark:text-slate-300 !leading-relaxed'
                    }
                >
                    {address.formatted_address}
                </p>
            ) : null}
            {contact && (
                <span className="block mt-2 text-sm lg:text-base text-text-color-80">
                    {href ? (
                        <span>{phoneNumber}</span>
                    ) : (
                        <a
                            href={`tel:${cleanedPhoneNum}`}
                            className="text-inherit hover:text-sky-500"
                        >
                            {phoneNumber}
                        </a>
                    )}
                    {extension && <span> ext. {extension}</span>}
                </span>
            )}
        </Wrapper>
    );
};

const Address = (props) => {
    const { title, caption, href, address, date, contact } = props;

    let phoneNumber, extension, cleanedPhoneNum;

    if (contact) {
        [phoneNumber, extension] = contact.split('|').map((part) => part.trim());
        cleanedPhoneNum = phoneNumber.replace(/[^+\d]/g, '');
    }

    const Wrapper = href ? Link : 'div';
    const wrapperProps = href ? { to: href } : {};

    return (
        <Wrapper
            {...wrapperProps}
            className={twJoin(
                'not-prose flex flex-col gap-4 border rounded-lg p-6 w-full max-w-full sm:max-w-[calc(50%-12px)] shadow-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
                href ? 'hover:shadow-xl' : ''
            )}
        >
            <div className="flex-1 text-left">
                {title ? (
                    <h3 className="text-xl lg:text-2xl font-semibold text-slate-800 dark:text-slate-200">
                        {title}
                    </h3>
                ) : null}
                {caption ? (
                    <p className="text-base lg:text-lg text-slate-700 dark:text-slate-300 font-medium">
                        {caption}
                    </p>
                ) : null}
                {date ? (
                    <p className="mt-2 text-sm lg:text-base font-medium text-slate-500 dark:text-slate-400">
                        {date}
                    </p>
                ) : null}
                {address ? (
                    <p className="mt-2 text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                        {address.formatted_address}
                    </p>
                ) : null}
                {contact && (
                    <span className="block mt-2 text-sm lg:text-base text-slate-600 dark:text-slate-300">
                        {href ? (
                            <span>{phoneNumber}</span>
                        ) : (
                            <a
                                href={`tel:${cleanedPhoneNum}`}
                                className="text-inherit hover:text-sky-500"
                            >
                                {phoneNumber}
                            </a>
                        )}
                        {extension && <span> ext. {extension}</span>}
                    </span>
                )}
            </div>
            <div className="w-full h-48 md:h-auto md:flex-1 md:min-h-[192px] rounded-md overflow-hidden shadow-md">
                <MapComponent address={address} />
            </div>
        </Wrapper>
    );
};

const Document = (props) => {
    const { caption, document, displayMode } = props;

    const assetRef = useRef(null);

    if (!document) {
        return null;
    }

    const data = document.at('info');

    const displayName = data.name;
    const { url } = data.metadata;

    return (
        <div className="not-prose border rounded-lg w-full max-w-full sm:max-w-[calc(50%-12px)] shadow-lg overflow-hidden bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div
                className={twJoin(
                    'h-48',
                    displayMode !== 'card_file_content' && 'absolute inset-0 -z-10'
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
            {displayMode === 'card_file_logo' && (
                <div className="h-48 w-full flex items-center justify-center">
                    <FileLogo filename={url} size="24"></FileLogo>
                </div>
            )}
            <div
                className={twJoin(
                    'px-6 py-3 flex items-center justify-between gap-x-2 text-left',
                    displayMode !== 'link' && 'border-t border-slate-200 dark:border-slate-700'
                )}
            >
                <div className="max-w-[calc(100%-40px)]">
                    <h3
                        className="text-base lg:text-lg font-semibold line-clamp-1 text-slate-800 dark:text-slate-200"
                        title={displayName}
                    >
                        {displayName}
                    </h3>
                    {caption ? (
                        <p className="text-sm lg:text-base text-slate-700 dark:text-slate-300 font-medium">
                            {caption}
                        </p>
                    ) : null}
                </div>
                <div
                    className="w-8 p-0.5 cursor-pointer group"
                    onClick={() => {
                        if (assetRef.current) {
                            assetRef.current.triggerDownload();
                        }
                    }}
                >
                    <IoDownload className="w-7 h-7 text-slate-600 dark:text-slate-400 hover:text-sky-500" />
                </div>
            </div>
        </div>
    );
};

const Basic = (props) => {
    const { title, caption, href } = props;

    return (
        <div className="not-prose border rounded-lg p-6 w-full max-w-full sm:max-w-[calc(50%-12px)] shadow-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            {title ? (
                <h3 className="text-xl lg:text-2xl font-semibold text-slate-800 dark:text-slate-200">
                    {title}
                </h3>
            ) : null}
            {caption ? (
                <p className="mt-2 text-base lg:text-lg text-slate-700 dark:text-slate-300 font-medium">
                    {caption}
                </p>
            ) : null}
            {href && (
                <Link
                    to={href}
                    className="mt-4 inline-block text-sm lg:text-base text-sky-500 hover:underline"
                >
                    {href}
                </Link>
            )}
        </div>
    );
};
