import React, { useState, Fragment } from 'react';

import Preview from './Preview';
import Panel from './Panel';
import { Popover, Transition } from '@headlessui/react';
import Styles from './sidebar.module.scss';
import LibrarySection from './LibrarySection';
import { SafeHtml } from '@uniwebcms/module-sdk';

export default function ProductCatalog(props) {
    const { input, website } = props;

    const [screen, setScreen] = useState('desktop');

    const profile = input.profile;
    let handle = profile ? profile.getHandle() || profile.getId() : '';

    let src = `/sites/${handle}`;

    const boxStyle =
        'w-[20rem] flex-shrink-0 rounded-md h-full bg-white pointer-events-none overflow-hidden transform transition ease-in-out duration-500 shadow border hidden lg:flex';

    const templateSite = profile.getId();
    const info = profile.getBasicInfo();
    const { title: name, subtitle: description } = info;

    return (
        <div className="relative w-screen flex bg-neutral-950/90 max-w-full flex-grow lg:flex-row flex-col py-6 h-screen gap-5 px-5 sm:px-6 md:px-8">
            <div className={`${boxStyle}`}>
                <div className="pointer-events-auto w-full transition flex-shrink-0">
                    <Panel {...{ profile, website, input, screen, setScreen }}></Panel>
                </div>
            </div>
            <div
                className={`py-2 px-4 bg-neutral-50 w-full flex items-center justify-between lg:hidden rounded`}
            >
                <div className={`flex items-center gap-3`}>
                    <h2 className={`text-sm font-bold`}>{name}</h2>
                    <Popover className="relative">
                        {({ open }) => (
                            <>
                                <Popover.Button
                                    as="div"
                                    className={`
                                ${open ? 'text-secondary-800' : 'text-secondary-500'}
                                group inline-flex items-center rounded-md text-sm cursor-pointer `}
                                >
                                    <span className={`text-sm text-secondary-500 cursor-pointer`}>
                                        {website.localize({ en: 'Info', fr: 'Info' })}
                                    </span>
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
                                    <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-neutral-950/5">
                                            <div className="relative grid gap-2 bg-neutral-50 p-7 lg:grid-cols-2">
                                                <h2 className={`text-lg font-bold`}>{name}</h2>
                                                {description ? (
                                                    <div
                                                        className={
                                                            `text-neutral-600 mt-2 max-h-[300px] overflow-y-auto text-[13px] break-words leading-[140%] flex flex-col space-y-3` +
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
                    className={`flex items-center rounded-full h-8 text-sm text-blue-500 hover:text-blue-700 hover:underline cursor-pointer`}
                    style={{ width: 'fit-content' }}
                >
                    <p className={`font-medium tracking-wide`}>
                        {website.localize({
                            en: 'Use This Template',
                            fr: 'Utiliser ce modèle',
                        })}
                    </p>
                </button>
            </div>
            <Preview iframeSrc={src} {...{ screen }} />
        </div>
    );
}
