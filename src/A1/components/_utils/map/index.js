// a class exports helper functions for Locations, ResearchPlaces and InteractiveMap components
import { stripTags } from '@uniwebcms/module-sdk';

const parseLocation = (location) => {
    const { address, description = '', start_date = '', end_date = '' } = location;

    if (!address) {
        return null;
    }

    const { formatted_address, geometry } = address;

    return {
        title: stripTags(description),
        address: formatted_address,
        geo: geometry.location,
        startDate: start_date,
        endDate: end_date,
    };
};

export const getLocationsFromInput = (input, simpleData = false) => {
    if (!input) {
        return {};
    }

    const { profiles } = input;

    const parsed = {};

    profiles.forEach((profile) => {
        const { locationSchema } = profile.getTypeInfo();

        if (locationSchema) {
            const sections = profile.at(locationSchema.section);

            if (sections?.length) {
                const parsedLocations = sections.map(parseLocation).filter(Boolean);

                if (parsedLocations.length) {
                    parsedLocations.forEach((location) => {
                        const { lat, lng } = location.geo;
                        const key = `${lat}_${lng}`;

                        let data;

                        if (simpleData) {
                            data = location;
                        } else {
                            data = {
                                location,
                                profile,
                            };
                        }

                        if (parsed[key]) {
                            parsed[key].push(data);
                        } else {
                            parsed[key] = [data];
                        }
                    });
                }
            }
        }
    });

    return parsed;
};

export const getAddressesFromCards = (cards) => {
    const parsed = {};

    cards.forEach((card) => {
        const { address, date, title, contact, type } = card;

        if (type === 'address' && address) {
            const { formatted_address, geometry } = address;
            const { lat, lng } = geometry.location;
            const key = `${lat}_${lng}`;

            let startDate = '',
                endDate = '';

            if (date) {
                [startDate, endDate] = date.split('/');
            }

            let data = {
                title,
                address: formatted_address,
                geo: geometry.location,
                startDate,
                endDate,
                contact,
            };

            if (parsed[key]) {
                parsed[key].push(data);
            } else {
                parsed[key] = [data];
            }
        }
    });

    return parsed;
};

export const mergeLocationAndAddress = (locations = {}, addresses = {}) => {
    const merged = { ...locations };

    Object.keys(addresses).forEach((key) => {
        addresses[key] = addresses[key].map((address) => ({ location: address, profile: null }));

        if (merged[key]) {
            merged[key].push(...addresses[key]);
        } else {
            merged[key] = addresses[key];
        }
    });

    return merged;
};
