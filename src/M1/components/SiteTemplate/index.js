import React, { useState, useEffect } from 'react';
import Preview from './Preview';
import Panel from './Panel';
import { Popover, Transition } from '@headlessui/react';
import { LuInfo } from 'react-icons/lu';
import Styles from './sidebar.module.scss';
import LibrarySection from './LibrarySection';
import { BsArrowLeft } from 'react-icons/bs';
import { SafeHtml, Link } from '@uniwebcms/core-components';
import GuidedTourModal from './GuidedTourModal';
import { HiDevicePhoneMobile } from 'react-icons/hi2';
import { HiX, HiOutlineExternalLink, HiOutlineDesktopComputer } from 'react-icons/hi';

const LG_BREAKPOINT = '(max-width: 800px)'; //"(max-width: 1023px)";

function useBreakpoint(breakpointQuery = LG_BREAKPOINT) {
    const [isMatch, setIsMatch] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(breakpointQuery);

        // Set initial state
        const handleChange = () => {
            setIsMatch(mediaQuery.matches);
        };
        handleChange(); // Run on mount

        // Listen for changes
        mediaQuery.addEventListener('change', handleChange);

        // Cleanup
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [breakpointQuery]);

    return isMatch;
}

const MobileLayout = (props) => {
    const {
        website,
        input,
        mobileView,
        iframeSrc,
        screen,
        setScreen,
        setMobileView,
        handleSelect,
    } = props;

    if (mobileView === 'details') {
        return (
            <Panel
                {...props}
                {...{
                    isMobileLayout: true,
                }}
            ></Panel>
        );
    }

    return (
        <div className={`w-full h-full flex flex-col gap-4`}>
            <div
                className={`py-1.5 px-4 bg-neutral-50 w-full flex items-center justify-between xl:hidden rounded`}
            >
                <div className={`flex items-center gap-4`}>
                    <div
                        className={`flex items-center gap-1 cursor-pointer`}
                        onClick={() => setMobileView('details')}
                    >
                        <BsArrowLeft className={`w-5 h-5 text-neutral-700 mr-1`} />

                        <h2 className={`text-sm font-bold`}>
                            {website.localize({
                                en: 'Details',
                                fr: 'Détails',
                            })}
                        </h2>
                    </div>
                    <div
                        onClick={handleSelect}
                        className={`flex items-center justify-center rounded-lg px-3 py-1.5 text-neutral-50 hover:text-neutral-50 bg-neutral-900 hover:bg-neutral-900 cursor-pointer`}
                    >
                        <p className={`text-xs`}>
                            {website.localize({
                                en: 'Select',
                                fr: 'Sélectionner',
                            })}
                        </p>
                    </div>
                </div>
                <div className={`flex items-center gap-4`}>
                    <div className={`flex items-center bg-neutral-100 p-1 rounded-lg`}>
                        <div
                            onClick={() => setScreen('desktop')}
                            className={`p-1.5 rounded-md transition-all duration-200 !outline-none cursor-pointer border-none ${
                                screen === 'desktop'
                                    ? 'bg-white text-neutral-900 shadow-sm' // Active: Elevated
                                    : 'text-neutral-500 hover:text-neutral-700' // Inactive
                            }`}
                        >
                            <HiOutlineDesktopComputer className={`w-4 h-4`} />
                        </div>
                        <div
                            onClick={() => setScreen('mobile')}
                            className={`p-1.5 rounded-md transition-all duration-200 !outline-none cursor-pointer ${
                                screen === 'mobile'
                                    ? 'bg-white text-neutral-900 shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                        >
                            <HiDevicePhoneMobile className={`w-4 h-4`} />
                        </div>
                    </div>

                    {/* Separator Line */}
                    <div className={`w-px h-5 bg-neutral-200`} />

                    {/* GROUP 2: Pure Actions */}
                    <div className={`flex items-center gap-1`}>
                        <div
                            onClick={() => {
                                window.open(iframeSrc, '_blank');
                            }}
                            className={`p-1.5 rounded-full text-neutral-500 hover:bg-neutral-100 !outline-none cursor-pointer hover:text-neutral-900 transition-colors`}
                            title="Open external"
                        >
                            <HiOutlineExternalLink className={`w-5 h-5`} />
                        </div>
                        <Link
                            className={`p-1.5 rounded-full text-neutral-500 hover:bg-red-50 !outline-none cursor-pointer hover:text-red-600 transition-colors`}
                            to={input.makeHrefToIndex()}
                        >
                            <HiX className={`w-5 h-5`} />
                        </Link>
                    </div>
                </div>
            </div>
            <Preview {...props} {...{ screen, iframeSrc, isMobileLayout: true }} />
        </div>
    );
};

export default function SiteTemplate(props) {
    const { input, website } = props;

    const [screen, setScreen] = useState('desktop');
    const [foundationPreview, setFoundationPreview] = useState({
        open: false,
    });

    const [mobileView, setMobileView] = useState('details'); // 'details' | 'preview'
    const isMobileLayout = useBreakpoint();

    const profile = input.profile;
    let handle = profile ? profile.getHandle() || profile.getId() : '';
    const appDomain = uniweb.getAppDomain();
    let src = `${appDomain}websites/${handle}?preview=true`;
    // let src = `/websites/${handle}?preview=true`;

    // const boxStyle =
    //     'w-[24rem] flex-shrink-0 rounded-md h-full bg-white pointer-events-none overflow-hidden transform transition ease-in-out duration-500 shadow border hidden xl:flex';

    const boxStyle = `${
        isMobileLayout ? 'w-full' : 'w-[24rem]'
    } flex-shrink-0 rounded-md h-full bg-white pointer-events-none overflow-hidden transform transition ease-in-out duration-500 shadow border`;

    const templateSite = profile.getId();
    // const info = profile.getBasicInfo();
    // const { title: name, subtitle: description } = info;

    let body = null;

    if (isMobileLayout) {
        body = (
            <MobileLayout
                iframeSrc={src}
                {...{
                    setFoundationPreview,
                    website,
                    profile,
                    input,
                    screen,
                    setScreen,
                    mobileView,
                    setMobileView,
                    handleSelect: () => {
                        const appDomain = uniweb.getAppDomain();
                        fetch(`${appDomain}/temp_resource.php`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json', // Specify content type
                            },
                            body: JSON.stringify({
                                action: 'store',
                                data: {
                                    templateSite, //:'_blank'
                                },
                            }), // Convert data object to JSON string
                        })
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                return response.json(); // Parse the JSON response
                            })
                            .then((data) => {
                                window.location.replace(data);
                            })
                            .catch((error) => {
                                console.error('Error:', error); // Handle any errors
                            });
                    },
                }}
            />
        );
    } else {
        body = (
            <>
                <div className={`${boxStyle}`}>
                    <div className="pointer-events-auto w-full transition flex-shrink-0 h-full">
                        <Panel
                            {...{
                                profile,
                                website,
                                input,
                                screen,
                                setScreen,
                                iframeSrc: src,
                                setFoundationPreview,
                                setMobileView,
                            }}
                        ></Panel>
                    </div>
                </div>
                <Preview iframeSrc={src} {...{ screen, isMobileLayout }} />
            </>
        );
    }

    return (
        <div className="relative w-full max-w-screen flex bg-neutral-950/90 max-w-full flex-grow py-6 h-screen gap-5 px-5 sm:px-6 md:px-8">
            {/* <div className={`${boxStyle}`}>
                <div className="pointer-events-auto w-full transition flex-shrink-0">
                    <Panel
                        {...{
                            profile,
                            website,
                            input,
                            screen,
                            setScreen,
                            iframeSrc: src,
                            setFoundationPreview,
                        }}
                    ></Panel>
                </div>
            </div> */}
            {/* <div
                className={`py-2 px-4 bg-neutral-50 w-full flex items-center justify-between xl:hidden rounded`}
            >
                <div className={`flex items-center gap-2`}>
                    <Link
                        to={input.makeHrefToIndex()}
                        className={`w-6 h-6 cursor-pointer text-neutral-700 mr-1`}
                    >
                        <BsArrowLeft className={`w-full h-full`} />
                    </Link>
                    <h2 className={`text-sm font-bold`}>{name}</h2>
                    <Popover className="relative flex items-center justify-center">
                        {({ open }) => (
                            <>
                                <Popover.Button
                                    as="div"
                                    className={`
                                ${open ? 'text-secondary-500' : 'text-neutral-500'}
                                group inline-flex items-center rounded-md text-sm cursor-pointer `}
                                >
                                    <LuInfo className="w-5 h-5" />
                                </Popover.Button>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                >
                                    <Popover.Panel className="absolute left-1/2 top-4 z-10 mt-3 w-64 max-w-screen max-w-sm -translate-x-1/2 transform sm:px-0 xl:max-w-3xl shadow-lg">
                                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-neutral-950/5">
                                            <div className="relative grid gap-2 bg-neutral-950 p-4 xl:grid-cols-2">
                                                <h2 className={`text-lg font-bold text-neutral-50`}>
                                                    {name}
                                                </h2>
                                                {description ? (
                                                    <div
                                                        className={
                                                            `text-neutral-300 max-h-[300px] overflow-y-auto text-[13px] break-words leading-[140%] flex flex-col space-y-3` +
                                                            ` ${Styles.Scrollbar}`
                                                        }
                                                    >
                                                        <SafeHtml
                                                            value={description}
                                                            makeLinksExternal={true}
                                                        />
                                                    </div>
                                                ) : null}
                                                <LibrarySection
                                                    {...props}
                                                    info={info}
                                                    darkMode
                                                ></LibrarySection>
                                            </div>
                                        </div>
                                    </Popover.Panel>
                                </Transition>
                            </>
                        )}
                    </Popover>
                </div>
                <button
                    onClick={() => {
                        const appDomain = uniweb.getAppDomain();
                        fetch(`${appDomain}/temp_resource.php`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json', // Specify content type
                            },
                            body: JSON.stringify({
                                action: 'store',
                                data: {
                                    templateSite, //:'_blank'
                                },
                            }), // Convert data object to JSON string
                        })
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                return response.json(); // Parse the JSON response
                            })
                            .then((data) => {
                                window.location.replace(data);
                            })
                            .catch((error) => {
                                console.error('Error:', error); // Handle any errors
                            });
                    }}
                    className={`flex items-center rounded-full h-8 px-4 text-xs bg-blue-100/75 text-blue-600 border border-blue-400`}
                    style={{ width: 'fit-content' }}
                >
                    <p className={`font-medium tracking-wide`}>
                        {website.localize({
                            en: 'Use This Template',
                            fr: 'Utiliser ce modèle',
                        })}
                    </p>
                </button>
            </div> */}
            {body}
            {foundationPreview?.open && (
                <GuidedTourModal
                    website={website}
                    onClose={() => setFoundationPreview({ open: false })}
                    {...foundationPreview}
                />
            )}
        </div>
    );
}
