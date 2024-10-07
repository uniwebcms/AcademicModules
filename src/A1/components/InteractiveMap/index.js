import React, { useRef, useState, useEffect } from 'react';
import Container from '../_utils/Container';
import { twJoin, Image, website } from '@uniwebcms/module-sdk';
import { AiFillCaretRight, AiFillCaretLeft } from 'react-icons/ai';
import { MdOutlineFormatListBulleted } from 'react-icons/md';
import { BiSearch, BiX } from 'react-icons/bi';
import { GrMapLocation } from 'react-icons/gr';
import { LiaLayerGroupSolid } from 'react-icons/lia';
import {
    getAddressesFromCards,
    getLocationsFromInput,
    mergeLocationAndAddress,
} from '../_utils/map';
import { getDateRange } from '../_utils/date';
import Map from './map';

const width = {
    full: {
        input: '456px',
        sidebar: '576px',
        list: '504px',
        profileBar: '72px',
    },
};

const left = {
    full: {
        input: '96px',
        sliderOpen: '576px',
        sliderClosed: '72px',
        listOpen: '72px',
        listClosed: '-432px',
    },
};

const font = {
    full: {
        profileBarLabel: '12px',
    },
};

const filterLocations = (locations, filter, searchText) => {
    const { type } = filter;

    return locations.filter(({ location, profile }) => {
        const { title: locationTitle } = location;

        const contentType = profile?.contentType || '_other';
        const profileTitle = profile ? profile.getBasicInfo().title : '';

        if (type !== 'all' && contentType !== type) {
            return false;
        }

        if (searchText) {
            return (
                locationTitle.toLowerCase().includes(searchText.toLowerCase()) ||
                profileTitle.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        return true;
    });
};

export default function InteractiveMap(props) {
    const { website, block, input } = props;

    const { zoom } = block.getBlockProperties();

    const cards = block.main?.body?.cards || [];
    const addresses = getAddressesFromCards(cards);
    const locations = getLocationsFromInput(input);

    const allLocations = mergeLocationAndAddress(locations, addresses);

    const { useLocation, useNavigate } = website.getRoutingComponents();
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);

    const map = useRef(null);
    const [showSidePanel, setShowSidePanel] = useState(!!location.search);
    const [searchText, setSearchText] = useState(null);

    const sortedLocations = []
        .concat(Object.values(allLocations))
        .flat()
        .sort((a, b) => a.location.title.localeCompare(b.location.title));

    const widthStyle = width.full;
    const leftStyle = left.full;
    const fontStyle = font.full;

    useEffect(() => {
        if (map.current && searchParams) {
            const searchParams = new URLSearchParams(location.search);
            const searchParamsObj = Object.fromEntries(searchParams.entries());
            const { lat, lng } = searchParamsObj;

            if (lat && lng) {
                if (showSidePanel) {
                    map.current.updateCenterWithOffset({ lat, lng }, -288);
                } else {
                    map.current.updateCenterWithOffset({ lat, lng }, 0);
                }

                searchParams.delete('lat');
                searchParams.delete('lng');

                navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
            }
        }
    }, [location.search, location.pathname, map.current, showSidePanel]);

    return (
        <Container className="!py-0 w-screen h-screen">
            <div className={'w-full h-full'}>
                <div
                    className="absolute top-5 z-[2] group"
                    style={{ width: widthStyle.input, left: leftStyle.input }}
                >
                    <Searcher
                        website={website}
                        searchText={searchText}
                        setSearchText={setSearchText}
                        showSidePanel={showSidePanel}
                        setShowSidePanel={setShowSidePanel}
                    />
                </div>
                <div
                    className={'absolute h-full z-[1]'}
                    style={{ width: showSidePanel ? widthStyle.sidebar : widthStyle.profileBar }}
                >
                    <Sidebar
                        map={map}
                        locations={sortedLocations}
                        website={website}
                        searchText={searchText}
                        setSearchText={setSearchText}
                        showSidePanel={showSidePanel}
                        setShowSidePanel={setShowSidePanel}
                        location={location}
                        navigate={navigate}
                        leftStyle={leftStyle}
                        widthStyle={widthStyle}
                        fontStyle={fontStyle}
                    />
                </div>
                <button
                    className={twJoin(
                        'absolute top-[calc(50%-12px)] w-6 h-12 bg-neutral-200 hover:bg-neutral-100 rounded-r-lg flex items-center justify-center pr-0.5 border border-l-0 border-neutral-400 focus:outline-none'
                    )}
                    style={{
                        zIndex: 1,
                        transition: 'left 0.3s ease',
                        left: showSidePanel ? leftStyle.sliderOpen : leftStyle.sliderClosed,
                    }}
                    onClick={() => {
                        setShowSidePanel(!showSidePanel);
                    }}
                >
                    {showSidePanel ? (
                        <AiFillCaretLeft className="w-6 h-6 text-neutral-600" />
                    ) : (
                        <AiFillCaretRight className="w-6 h-6 text-neutral-600" />
                    )}
                </button>
                <Map
                    ref={map}
                    apiKey={website.getMapAPIKey()}
                    language={website.getLanguage()}
                    style={{
                        height: '100%',
                        width: '100%',
                    }}
                    markers={allLocations}
                    zoom={zoom}
                    initialCenter={sortedLocations[0]?.location?.geo}
                ></Map>
            </div>
        </Container>
    );
}

const Searcher = ({ website, searchText, setSearchText, showSidePanel, setShowSidePanel }) => {
    return (
        <div className="w-full">
            <div className="w-full h-10 border rounded-lg shadow border-neutral-300 shadow-neutral-400 bg-neutral-100 focus-within:bg-neutral-50 flex items-center justify-between space-x-1 py-1 px-2 group">
                <input
                    id="search-input"
                    className="h-full flex-grow !bg-inherit focus:outline-none"
                    placeholder={website.localize({ en: 'Search', fr: 'Recherche' })}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                    }}
                    value={searchText || ''}
                    onFocus={() => {
                        if (!showSidePanel) {
                            setShowSidePanel(true);
                        }
                    }}
                ></input>
                <div
                    className="cursor-pointer"
                    onClick={() => {
                        if (searchText) {
                            setSearchText('');
                        }
                    }}
                >
                    {searchText ? (
                        <BiX className="w-6 h-6 text-neutral-600 hover:text-neutral-700" />
                    ) : (
                        <BiSearch className="w-6 h-6 text-neutral-600 group-focus:text-neutral-700" />
                    )}
                </div>
            </div>
        </div>
    );
};

const Sidebar = (props) => {
    const {
        locations,
        website,
        map,
        showSidePanel,
        searchText,
        setSearchText,
        setShowSidePanel,
        location,
        navigate,
        widthStyle,
        leftStyle,
        fontStyle,
    } = props;

    const { pathname, search } = location;
    const searchParams = new URLSearchParams(search);
    const { type: targetType } = Object.fromEntries(searchParams.entries());

    const [filter, setFilter] = useState({
        type: targetType || 'all',
    });

    let extraType;
    const profileTypes = [];

    locations.forEach(({ profile }) => {
        if (!profile) {
            if (!extraType)
                extraType = {
                    contentType: '_other',
                    label_plural: website.localize({ en: 'Other', fr: 'Autre' }),
                    icon: LiaLayerGroupSolid,
                };

            return;
        }

        const { contentType } = profile;

        if (!profileTypes.some((ele) => ele.contentType === contentType)) {
            profileTypes.push(profile.getTypeInfo());
        }
    });

    profileTypes.unshift({
        label_plural: website.localize({ en: 'All', fr: 'Tous' }),
        contentType: 'all',
        icon: MdOutlineFormatListBulleted,
    });

    if (extraType) {
        profileTypes.push(extraType);
    }

    const filteredLocations = filterLocations(locations, filter, searchText);

    return (
        <div className="relative w-full h-full flex">
            <div
                className="h-full bg-neutral-200 shadow-md shadow-neutral-700 flex flex-col items-center pt-6 space-y-4"
                style={{ zIndex: 1, width: widthStyle.profileBar }}
            >
                {profileTypes.map((profileType, index) => {
                    const { label_plural: label, icon: Icon, contentType } = profileType;

                    return (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-center space-y-0.5 cursor-pointer group"
                            onClick={() => {
                                setFilter({
                                    ...filter,
                                    type: contentType,
                                });
                                setShowSidePanel(true);
                                if (searchText) {
                                    setSearchText('');
                                }
                                navigate(`${pathname}?type=${contentType}`);
                            }}
                        >
                            <div className="w-10 h-10 p-1">
                                {Icon ? (
                                    <Icon
                                        className={twJoin(
                                            'w-full h-full',
                                            filter.type === contentType
                                                ? 'text-primary-700'
                                                : '!text-neutral-800 group-hover:!text-neutral-900'
                                        )}
                                    />
                                ) : null}
                            </div>
                            <p
                                className={twJoin(
                                    filter.type === contentType
                                        ? 'text-primary-70'
                                        : '!text-neutral-800 group-hover:!text-neutral-900'
                                )}
                                style={{ fontSize: fontStyle.profileBarLabel }}
                            >
                                {website.localize(label)}
                            </p>
                        </div>
                    );
                })}
            </div>
            <div
                className={twJoin(
                    'absolute h-full shadow-md shadow-neutral-700 pt-[76px]',
                    filteredLocations.length > 0 ? ' bg-neutral-50' : ' bg-neutral-700'
                )}
                style={{
                    zIndex: 0,
                    transition: 'left 0.3s ease',
                    width: widthStyle.list,
                    left: showSidePanel ? leftStyle.listOpen : leftStyle.listClosed,
                }}
            >
                <ProfileList {...{ locations: filteredLocations, map }} />
            </div>
        </div>
    );
};

const ProfileList = ({ locations, map }) => {
    return (
        <ul className="h-full w-full overflow-y-auto overscroll-contain divide-y divide-neutral-300">
            {locations.length === 0 ? (
                <div>
                    <p className="text-lg font-semibold text-neutral-100 text-center py-6">
                        {website.localize({ en: 'No results found', fr: 'Aucun résultat trouvé' })}
                    </p>
                </div>
            ) : null}
            {locations.map((entry, index) => {
                const { location, profile } = entry;
                const { title, address, geo, startDate, endDate } = location;

                const profileTitle = profile ? profile.getBasicInfo().title : '';

                const dateRange = getDateRange(startDate, endDate);

                return (
                    <li key={`${profileTitle}_${title}_${index}`}>
                        <div
                            className="p-5 flex items-start space-x-4 bg-neutral-50 hover:bg-neutral-200 cursor-pointer"
                            onClick={() => {
                                if (map.current) {
                                    map.current.updateCenterWithOffset(geo, -192);
                                }
                            }}
                        >
                            <div className="flex-shrink-0 w-16 h-16">
                                {profile ? (
                                    <Image
                                        profile={profile}
                                        type={
                                            profile.contentType === 'members' ? 'avatar' : 'banner'
                                        }
                                        rounded
                                    />
                                ) : (
                                    <div className="w-full h-full border rounded-full p-3 border-neutral-400">
                                        <GrMapLocation className="w-full h-full text-neutral-600" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow">
                                <p className="text-lg font-semibold ">{title}</p>
                                <p className="text-base font-normal text-neutral-700">
                                    {profileTitle}
                                </p>
                                <p className="mt-2 text-sm font-medium !text-neutral-900">
                                    {address}
                                </p>
                                {dateRange ? (
                                    <p className="mt-1 text-sm text-neutral-700">{dateRange}</p>
                                ) : null}
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};
