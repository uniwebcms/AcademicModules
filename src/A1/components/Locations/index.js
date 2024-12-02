import React, { useRef } from 'react';
import Container from '../_utils/Container';
import { twJoin, stripTags, website } from '@uniwebcms/module-sdk';
import { MdDateRange } from 'react-icons/md';
import { HiOutlineDevicePhoneMobile } from 'react-icons/hi2';
import { BsPinMap } from 'react-icons/bs';
import { getLocationsFromInput, getAddressesFromCards } from '../_utils/map';
import Map from './map';

const formatPhoneNumber = (phoneNumber, ext) => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, ''); // Remove non-numeric characters
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);

    const extension = ext ? ` ${website.localize({ en: `ext.`, fr: `poste` })} ${ext}` : '';

    if (match) {
        return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}${extension}`;
    } else {
        return `${phoneNumber}${extension}`;
    }
};

export default function Locations(props) {
    const { website, block, input } = props;

    const { show_single_map = false, zoom } = block.getBlockProperties();

    const { title = '' } = block.main?.header || {};
    const alignment = block.main?.header?.alignment || 'left';
    const cards = block.main?.body?.cards || [];

    const addresses = Object.values(getAddressesFromCards(cards)).flat();

    const locations = Object.values(getLocationsFromInput(input, true)).flat();

    const entries = [...addresses, ...locations];

    entries.sort((a, b) => a.title.localeCompare(b.title));

    return (
        <Container>
            <div className="px-6 mx-auto max-w-7xl lg:px-8 mb-12 md:mb-16">
                <h2
                    className={twJoin(
                        'text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl',
                        alignment === 'center' ? 'text-center' : '',
                        alignment === 'right' ? 'text-right' : '',
                        alignment === 'left' ? 'text-left' : ''
                    )}
                >
                    {stripTags(title)}
                </h2>
            </div>
            {show_single_map ? (
                <Single locations={entries} website={website} zoom={zoom} />
            ) : (
                <Multi locations={entries} website={website} zoom={zoom} />
            )}
        </Container>
    );
}

const Multi = ({ locations, zoom, website }) => {
    return (
        <div className="px-6 mx-auto max-w-7xl lg:px-8 space-y-16">
            {locations.map((location, index) => {
                const { title, address, geo, startDate, endDate, contact } = location;

                let phoneNumber, extension, cleanedPhoneNum;

                if (contact) {
                    [phoneNumber, extension] = contact.split('|').map((part) => part.trim());
                    cleanedPhoneNum = phoneNumber.replace(/[^+\d]/g, '');
                }

                const dateRange = [startDate, endDate]
                    .map((item) => {
                        if (!item) return null;
                        const date = new Date(item);

                        return date.toLocaleDateString(website.getLanguage(), {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        });
                    })
                    .filter(Boolean)
                    .join(' - ');

                return (
                    <div key={index} className="space-y-6 lg:space-y-0 lg:space-x-0 lg:flex">
                        <div className="w-full lg:w-2/5">
                            {title ? (
                                <h3 className="text-lg font-semibold md:text-xl lg:text-2xl text-text-color">
                                    {stripTags(title)}
                                </h3>
                            ) : null}
                            <p className="text-lg font-light md:text-xl lg:text-2xl mt-3 mb-4 text-text-color-80">
                                {stripTags(address)}
                            </p>
                            {dateRange ? (
                                <div className="mt-4 flex items-center space-x-2.5">
                                    <MdDateRange className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                                    <p className="text-base md:text-lg lg:text-xl text-text-color-70">
                                        {dateRange}
                                    </p>
                                </div>
                            ) : null}
                            {contact ? (
                                <div className="mt-4 flex items-center space-x-2.5">
                                    <HiOutlineDevicePhoneMobile className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                                    <a
                                        href={`tel:${cleanedPhoneNum}`}
                                        className="text-base md:text-lg lg:text-xl hover:underline text-text-color-80"
                                    >
                                        {formatPhoneNumber(phoneNumber, extension)}
                                    </a>
                                </div>
                            ) : null}
                        </div>
                        <div className="w-full lg:w-3/5 lg:pl-12">
                            <div className="rounded-xl overflow-hidden w-full h-full">
                                <Map
                                    apiKey={website.getMapAPIKey()}
                                    language={website.getLanguage()}
                                    style={{ height: '400px', width: '100%' }}
                                    addresses={[{ title, geo }]}
                                    zoom={zoom}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const Single = ({ locations, zoom, website }) => {
    const map = useRef(null);

    return (
        <div className="px-6 mx-auto max-w-7xl lg:px-8 lg:flex space-y-6 lg:space-y-0 lg:space-x-0">
            <div className="w-full lg:w-2/5 space-y-4 divide-y divide-text-color-40">
                {locations.map((location, index) => {
                    const { title, address, startDate, endDate, contact } = location;

                    let phoneNumber, extension, cleanedPhoneNum;

                    if (contact) {
                        [phoneNumber, extension] = contact.split('|').map((part) => part.trim());
                        cleanedPhoneNum = phoneNumber.replace(/[^+\d]/g, '');
                    }

                    const dateRange = [startDate, endDate]
                        .map((item) => {
                            if (!item) return null;
                            const data = new Date(item);

                            return data.toLocaleDateString(website.getLanguage(), {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            });
                        })
                        .filter(Boolean)
                        .join(' - ');

                    return (
                        <div
                            key={index}
                            className={twJoin(
                                'pl-2 pb-4 relative group',
                                index > 0 ? 'pt-6' : 'pt-2'
                            )}
                        >
                            {title ? (
                                <h3 className="text-lg font-semibold md:text-xl lg:text-2xl group-hover:pr-9 text-text-color">
                                    {stripTags(title)}
                                </h3>
                            ) : null}
                            <p className="text-lg font-light md:text-xl lg:text-2xl mt-3 mb-4 text-text-color-80">
                                {stripTags(address)}
                            </p>
                            {dateRange ? (
                                <div className="mt-4 flex items-center space-x-2.5">
                                    <MdDateRange className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                                    <p className="text-base md:text-lg lg:text-xl text-text-color-70">
                                        {dateRange}
                                    </p>
                                </div>
                            ) : null}
                            {contact ? (
                                <div className="mt-4 flex items-center space-x-2.5">
                                    <HiOutlineDevicePhoneMobile className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                                    <a
                                        href={`tel:${cleanedPhoneNum}`}
                                        className="text-base md:text-lg lg:text-xl hover:underline text-text-color-80"
                                    >
                                        {formatPhoneNumber(phoneNumber, extension)}
                                    </a>
                                </div>
                            ) : null}
                            <div
                                className="absolute right-0 top-4 cursor-pointer invisible group-hover:visible w-0 group-hover:w-9 h-9 bg-text-color-10 hover:bg-text-color-20 rounded-lg p-2"
                                onClick={() => {
                                    if (map.current) {
                                        map.current.updateCenter(location.geo);
                                    }
                                }}
                            >
                                <BsPinMap className="w-full h-full text-text-color-80" />
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="relative w-full lg:w-3/5 lg:pl-12">
                <div
                    className="rounded-xl overflow-hidden w-full sticky top-20"
                    style={{ height: locations.length > 1 ? '600px' : '400px', maxHeight: '85vh' }}
                >
                    <Map
                        ref={map}
                        apiKey={website.getMapAPIKey()}
                        language={website.getLanguage()}
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                        addresses={locations.map((location) => ({
                            title: location.title,
                            address: location.address,
                            geo: location.geo,
                        }))}
                        zoom={zoom}
                        config={{ showAddressInInfoWindow: true }}
                    />
                </div>
            </div>
        </div>
    );
};
