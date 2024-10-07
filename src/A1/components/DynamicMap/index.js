import React, { useRef, useState, useEffect, Suspense, lazy, memo } from 'react';
import { stripTags, twJoin, twMerge, Image, website } from '@uniwebcms/module-sdk';
import ClickAwayListener from 'react-click-away-listener';
import {
    AiFillCaretRight,
    AiFillCaretLeft,
    AiOutlineFullscreen,
    AiOutlineFullscreenExit,
} from 'react-icons/ai';
import { MdOutlineFormatListBulleted } from 'react-icons/md';
import { BiSearch, BiX } from 'react-icons/bi';
import { getLocationsFromInput } from '../_utils/map';
import { getDateRange } from '../_utils/date';
import Container from '../_utils/Container';
import Map from './map';

const width = {
    full: {
        input: '456px',
        sidebar: '576px',
        list: '504px',
        profileBar: '72px',
    },
    standard: {
        input: '304px',
        sidebar: '384px',
        list: '336px',
        profileBar: '48px',
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
    standard: {
        input: '64px',
        sliderOpen: '384px',
        sliderClosed: '48px',
        listOpen: '48px',
        listClosed: '-288px',
    },
};

const font = {
    full: {
        profileBarLabel: '12px',
    },
    standard: {
        profileBarLabel: '10px',
    },
};

const filterLocations = (locations, filter, searchText) => {
    const { type } = filter;

    return locations.filter(({ location, profile }) => {
        const { title } = location;
        const { contentType } = profile;
        const { title: pTitle } = profile.getBasicInfo();

        if (type !== 'all' && contentType !== type) {
            return false;
        }

        if (searchText) {
            return (
                title.toLowerCase().includes(searchText.toLowerCase()) ||
                pTitle.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        return true;
    });
};

const Searcher = ({
    map,
    website,
    navigate,
    location,
    locations,
    showDetail,
    searchText,
    setSearchText,
    showSidePanel,
    setShowSidePanel,
    showMenu,
    setShowMenu,
}) => {
    const { pathname, search } = location;
    const searchParams = new URLSearchParams(search);
    const { type: targetType, id: targetId } = Object.fromEntries(searchParams.entries());
    const inProfileView = showDetail && targetType && targetId;

    const searchResults = searchText
        ? locations.filter(({ profile }) => {
              const { title } = profile.getBasicInfo();
              return title.toLowerCase().includes(searchText.toLowerCase());
          })
        : locations;

    const targetProfile = inProfileView
        ? locations.find(({ profile }) => {
              return profile.contentType === targetType && profile.contentId === targetId;
          })?.profile
        : null;

    const targetProfileTitle = targetProfile ? targetProfile.getBasicInfo().title : null;

    return (
        <ClickAwayListener
            onClickAway={() => {
                setShowMenu(false);
            }}
        >
            <div className="w-full">
                <div className="w-full h-10 border rounded-lg border-neutral-300 !shadow !shadow-neutral-300 bg-neutral-50 focus-within:bg-neutral-50 flex items-center justify-between space-x-1 py-1 px-2 group">
                    <input
                        id="search-input"
                        className="h-full flex-grow bg-inherit focus:outline-none text-neutral-900 placeholder:text-neutral-400"
                        placeholder={
                            targetProfileTitle ||
                            website.localize({ en: 'Search', fr: 'Recherche' })
                        }
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                        value={searchText || ''}
                        onFocus={() => {
                            if (!showDetail) {
                                setShowSidePanel(true);
                            } else {
                                if (
                                    (showSidePanel && inProfileView) ||
                                    (inProfileView && !showSidePanel)
                                ) {
                                    setShowMenu(true);
                                }
                                if (!inProfileView) {
                                    setShowSidePanel(true);
                                }
                            }
                        }}
                    ></input>
                    <div
                        className="cursor-pointer"
                        onClick={() => {
                            if (searchText) {
                                setSearchText('');
                            }

                            if (!showMenu && inProfileView) {
                                navigate(pathname);
                            }
                        }}
                    >
                        {searchText || (!searchText && targetProfileTitle) ? (
                            <BiX className="w-6 h-6 text-neutral-500 hover:text-neutral-700" />
                        ) : (
                            <BiSearch className="w-6 h-6 text-neutral-500" />
                        )}
                    </div>
                </div>
                {showDetail && showMenu ? (
                    <div
                        className="mt-1 w-full overflow-auto rounded-b-lg border border-neutral-400 !shadow-xl !shadow-neutral-500"
                        style={{ maxHeight: 'min(650px, 70vh)' }}
                    >
                        <ul className="divide-y divide-neutral-300">
                            {searchResults.length ? (
                                searchResults.map(({ location, profile }, index) => {
                                    const { title, geo, address, startDate, endDate } = location;
                                    const { title: profileTitle } = profile.getBasicInfo();

                                    const dateRange = getDateRange(startDate, endDate);

                                    return (
                                        <li
                                            key={index}
                                            className="px-4 py-3 bg-neutral-50 hover:bg-neutral-100 cursor-pointer flex items-start space-x-3 group"
                                            onClick={() => {
                                                setSearchText(profileTitle);
                                                setShowMenu(false);
                                                setShowSidePanel(true);
                                                if (map.current) {
                                                    map.current.updateCenterWithOffset(geo, -192);
                                                }
                                                navigate(
                                                    `${pathname}?type=${profile.contentType}&id=${profile.contentId}`
                                                );
                                            }}
                                        >
                                            <div className="flex-shrink-0 w-12 h-12">
                                                <Image
                                                    profile={profile}
                                                    type={
                                                        profile.contentType === 'members'
                                                            ? 'avatar'
                                                            : 'banner'
                                                    }
                                                    rounded
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-[18px] font-semibold text-neutral-800 group-hover:text-neutral-950">
                                                    {title}
                                                </p>
                                                <p className="text-[16px] font-normal text-secondary-800">
                                                    {profileTitle}
                                                </p>
                                                <p className="mt-2 text-[15px] font-medium text-neutral-700 group-hover:text-neutral-800">
                                                    {address}
                                                </p>
                                                {dateRange ? (
                                                    <p className="mt-1 text-[15px] text-neutral-500 group-hover:text-neutral-600">
                                                        {dateRange}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </li>
                                    );
                                })
                            ) : (
                                <li className="py-3.5 bg-neutral-100 text-center text-neutral-700 text-base md:text-lg cursor-not-allowed">
                                    {website.localize({ en: 'No results', fr: 'Aucun résultat' })}
                                </li>
                            )}
                        </ul>
                    </div>
                ) : null}
            </div>
        </ClickAwayListener>
    );
};

const Sidebar = (props) => {
    const {
        locations,
        website,
        map,
        profileTypes,
        showSidePanel,
        searchText,
        setSearchText,
        setShowSidePanel,
        location,
        navigate,
        fullSize,
        showDetail,
        showMenu,
        widthStyle,
        leftStyle,
        fontStyle,
    } = props;

    const { pathname, search } = location;
    const searchParams = new URLSearchParams(search);
    const { type: targetType, tab, id: targetId } = Object.fromEntries(searchParams.entries());

    const inProfileView = showDetail && targetType && targetId;

    const [filter, setFilter] = useState({
        type: targetType || 'all',
    });

    const filteredLocations = filterLocations(locations, filter, searchText);

    const content = inProfileView ? (
        <ProfileViewer {...{ type: targetType, id: targetId, tab }} />
    ) : (
        <ProfileList
            {...{ locations: filteredLocations, website, map, showDetail, pathname, setSearchText }}
        />
    );

    return (
        <div className="relative w-full h-full flex">
            <div
                className="h-full bg-neutral-50 !shadow-md !shadow-neutral-300 flex flex-col items-center pt-6 space-y-4"
                style={{ zIndex: 1, width: widthStyle.profileBar }}
            >
                {profileTypes.map((profileType, index) => {
                    const { label_plural: label, icon: Icon, contentType } = profileType;

                    const active = filter.type === contentType;

                    return (
                        <div
                            key={index}
                            className={twJoin(
                                'flex flex-col items-center justify-center space-y-0.5 cursor-pointer',
                                active
                                    ? 'text-secondary-700'
                                    : 'text-neutral-500 hover:text-neutral-800'
                            )}
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
                            <div className={twJoin(fullSize ? 'w-10 h-10 p-1' : 'w-8 h-8 p-0.5')}>
                                {Icon ? <Icon className="w-full h-full" /> : null}
                            </div>
                            <p
                                className={active ? 'font-medium' : 'font-normal'}
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
                    'absolute h-full bg-neutral-50 !shadow-md !shadow-neutral-400',
                    inProfileView ? 'pt-0' : 'pt-[76px]'
                )}
                style={{
                    zIndex: 0,
                    transition: 'left 0.3s ease',
                    width: widthStyle.list,
                    left: showSidePanel ? leftStyle.listOpen : leftStyle.listClosed,
                }}
            >
                {content}
            </div>
            {showSidePanel && showMenu ? (
                <div className="absolute inset-0 bg-neutral-800/70 z-0"></div>
            ) : null}
        </div>
    );
};

const ProfileViewer = memo(
    ({ type, id, tab }) => {
        const [renderers, setRenderers] = useState({});

        useEffect(() => {
            if (!Object.keys(renderers).includes(type)) {
                const renderer = lazy(() => {
                    return uniweb
                        .getProfileRenderer(`${type}/profile`)
                        .catch(() => ({ default: () => null }));
                });

                setRenderers((prev) => {
                    return {
                        ...prev,
                        [type]: renderer,
                    };
                });
            }
        }, [type, Object.keys(renderers).length]);

        let ContentRenderer = renderers[type] || null;

        return (
            <Suspense
                fallback={
                    <div className="w-full h-full flex items-center justify-center">Loading...</div>
                }
            >
                <div className="w-full h-full divide-y divide-gray-300 overflow-y-auto overscroll-contain">
                    {ContentRenderer ? (
                        <ContentRenderer
                            contentId={id}
                            tab={tab}
                            sectionProps={{
                                width: '100%',
                                rounded: false,
                                noBorder: true,
                                paddingTop: '4',
                                paddingBottom: '4',
                                paddingLeft: '4',
                                paddingRight: '4',
                                headerMarginBottom: '3',
                            }}
                            tabToPrefix={`?type=${type}&id=${id}&tab=`}
                            contentRenderSettings={{
                                containerSize: 'sm',
                                getAddressToUrl: ({ lat, lng }) =>
                                    `?type=${type}&id=${id}&tab=${tab}&lat=${lat}&lng=${lng}`,
                            }}
                        />
                    ) : null}
                </div>
            </Suspense>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.id === nextProps.id &&
            prevProps.tab === nextProps.tab &&
            prevProps.type === nextProps.type
        );
    }
);

const ProfileList = ({ locations, website, map, showDetail, pathname, setSearchText }) => {
    const { useNavigate } = website.getRoutingComponents();
    const navigate = useNavigate();

    return (
        <ul className="h-full w-full overflow-y-auto overscroll-contain divide-y divide-neutral-300">
            {locations.map((entry, index) => {
                const { location, profile } = entry;
                const { title, address, geo, startDate, endDate } = location;
                const { title: profileTitle, subtitle: profileSubtitle } = profile.getBasicInfo();

                const dateRange = getDateRange(startDate, endDate);

                return (
                    <li key={`${profileTitle}_${title}_${index}`}>
                        <div
                            className="p-5 flex items-start space-x-4 bg-neutral-50 hover:bg-neutral-100 cursor-pointer group"
                            onClick={() => {
                                if (map.current) {
                                    map.current.updateCenterWithOffset(geo, -192);
                                }
                                if (showDetail) {
                                    setSearchText(profileTitle);
                                    navigate(
                                        `${pathname}?type=${profile.contentType}&id=${profile.contentId}`
                                    );
                                }
                            }}
                        >
                            <div className="flex-shrink-0 w-16 h-16">
                                <Image
                                    profile={profile}
                                    type={profile.contentType === 'members' ? 'avatar' : 'banner'}
                                    rounded
                                />
                            </div>
                            <div className="flex-grow">
                                <p className="text-sm text-secondary-800">{profileSubtitle}</p>
                                <p className="text-[17px] font-semibold text-neutral-800 group-hover:text-neutral-950">
                                    {profileTitle}
                                </p>
                                <p className="mt-1 text-base font-normal text-secondary-600">
                                    {title}
                                </p>
                                <p className="mt-2 text-sm font-medium text-neutral-700 group-hover:text-neutral-800">
                                    {address}
                                </p>
                                {dateRange ? (
                                    <p className="mt-1 text-sm text-neutral-500 group-hover:text-neutral-600">
                                        {dateRange}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default function DynamicMap(props) {
    const { website, block, input } = props;

    const { useLocation, useNavigate } = website.getRoutingComponents();
    const location = useLocation();
    const navigate = useNavigate();

    const searchParams = new URLSearchParams(location.search);

    const map = useRef(null);
    const [showSidePanel, setShowSidePanel] = useState(!!location.search);
    const [searchText, setSearchText] = useState(null);
    const [showMenu, setShowMenu] = useState(false); // search menu
    const [fullScreen, setFullScreen] = useState(false);

    const locations = getLocationsFromInput(input);

    const sortedLocations = []
        .concat(Object.values(locations))
        .flat()
        .sort((a, b) => a.location.title.localeCompare(b.location.title));

    const { zoom, full_size = false, show_detail = true } = block.getBlockProperties();

    const bigSize = full_size || fullScreen;
    const widthStyle = bigSize ? width.full : width.standard;
    const leftStyle = bigSize ? left.full : left.standard;
    const fontStyle = bigSize ? font.full : font.standard;

    const { title = '' } = block.main?.header || {};

    useEffect(() => {
        if (map.current && searchParams) {
            const searchParams = new URLSearchParams(location.search);
            const searchParamsObj = Object.fromEntries(searchParams.entries());
            const { lat, lng } = searchParamsObj;

            if (lat && lng) {
                if (showSidePanel) {
                    if (!bigSize) {
                        map.current.updateCenterWithOffset({ lat, lng }, -192);
                    } else {
                        map.current.updateCenterWithOffset({ lat, lng }, -288);
                    }
                } else {
                    map.current.updateCenterWithOffset({ lat, lng }, 0);
                }

                searchParams.delete('lat');
                searchParams.delete('lng');

                navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
            }
        }
    }, [location.search, location.pathname, map.current, showSidePanel, bigSize]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);

        const type = searchParams.get('type');
        const id = searchParams.get('id');

        if (type && id) {
            const target = sortedLocations.find(
                (ele) => ele.profile.contentType === type && ele.profile.contentId === id
            );

            if (target) {
                const { title } = target.profile.getBasicInfo();

                if (searchText === null) setSearchText(title);
            }
        }
    }, [searchText, location.search, locations.length]);

    let profileTypes = [];

    sortedLocations.forEach(({ profile }) => {
        const { contentType } = profile;

        if (!profileTypes.some((ele) => ele.contentType === contentType)) {
            profileTypes.push(profile.getTypeInfo());
        }
    });

    if (profileTypes.length === 1) {
        width.full.profileBar = '0px';
        width.standard.profileBar = '0px';
        left.full.input = '24px';
        left.full.sliderOpen = '504px';
        left.full.sliderClosed = '0px';
        left.full.listOpen = '0px';
        left.full.listClosed = '-504px';
        left.standard.input = '16px';
        left.standard.sliderOpen = '336px';
        left.standard.sliderClosed = '0px';
        left.standard.listOpen = '0px';
        left.standard.listClosed = '-336px';
        profileTypes = [];
    } else {
        profileTypes.unshift({
            label_plural: website.localize({ en: 'All', fr: 'Tous' }),
            contentType: 'all',
            label_plural: website.localize({ en: 'All', fr: 'Tous' }),
            icon: MdOutlineFormatListBulleted,
        });
    }

    return (
        <Container
            className={twJoin(
                bigSize ? '!py-0 w-screen h-screen' : 'mx-auto max-w-7xl px-6 md:px-8'
            )}
        >
            {!bigSize && title ? (
                <div className="px-6 mx-auto max-w-7xl lg:px-8 mb-8 md:mb-12">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-left">
                        {stripTags(title)}
                    </h2>
                </div>
            ) : null}
            <div
                className={twMerge(
                    bigSize
                        ? 'w-full h-full'
                        : 'relative w-full h-[800px] max-h-[80vh] border rounded-lg border-neutral-600 overflow-hidden'
                )}
            >
                <div
                    className="absolute top-5 z-[2]"
                    style={{ width: widthStyle.input, left: leftStyle.input }}
                >
                    <Searcher
                        website={website}
                        searchText={searchText}
                        setSearchText={setSearchText}
                        showDetail={show_detail}
                        navigate={navigate}
                        location={location}
                        locations={sortedLocations}
                        showSidePanel={showSidePanel}
                        setShowSidePanel={setShowSidePanel}
                        map={map}
                        showMenu={showMenu}
                        setShowMenu={setShowMenu}
                    />
                </div>
                <div
                    className={'absolute h-full z-[1]'}
                    style={{ width: showSidePanel ? widthStyle.sidebar : widthStyle.profileBar }}
                >
                    <Sidebar
                        locations={sortedLocations}
                        website={website}
                        map={map}
                        profileTypes={profileTypes}
                        showSidePanel={showSidePanel}
                        searchText={searchText}
                        setSearchText={setSearchText}
                        setShowSidePanel={setShowSidePanel}
                        showDetail={show_detail}
                        location={location}
                        navigate={navigate}
                        showMenu={showMenu}
                        leftStyle={leftStyle}
                        widthStyle={widthStyle}
                        fontStyle={fontStyle}
                    />
                </div>
                <button
                    className={twJoin(
                        'absolute top-[calc(50%-12px)] w-6 h-12 bg-neutral-100 hover:bg-neutral-50 rounded-r-lg flex items-center justify-center pr-0.5 border border-l-0 border-neutral-300 focus:outline-none'
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
                        <AiFillCaretLeft className="w-6 h-6 text-neutral-500 hover:text-neutral-700" />
                    ) : (
                        <AiFillCaretRight className="w-6 h-6 text-neutral-500 hover:text-neutral-700" />
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
                    markers={locations}
                    zoom={zoom}
                    initialCenter={sortedLocations[0]?.location?.geo}
                    onItemClicked={
                        show_detail
                            ? (type, id, title) => {
                                  if (!showSidePanel) {
                                      setShowSidePanel(true);
                                  }
                                  setSearchText(title);
                                  navigate(`${location.pathname}?type=${type}&id=${id}`);
                              }
                            : undefined
                    }
                ></Map>
                {!full_size ? (
                    <div className="absolute right-4 top-4">
                        <button
                            onClick={() => {
                                setFullScreen(!fullScreen);
                            }}
                            className="bg-neutral-600/60 hover:bg-neutral-800/60 rounded-lg flex items-center justify-center w-10 h-10 focus:outline-none"
                        >
                            {fullScreen ? (
                                <AiOutlineFullscreenExit className="w-7 h-7 text-neutral-700" />
                            ) : (
                                <AiOutlineFullscreen className="w-7 h-7 text-neutral-700" />
                            )}
                        </button>
                    </div>
                ) : null}
            </div>
        </Container>
    );
}
