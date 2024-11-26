import React from 'react';
import { Link } from '@uniwebcms/module-sdk';
import { HiChevronRight, HiHome, HiDotsHorizontal } from 'react-icons/hi';
import { Popover } from '@headlessui/react';

export default function Breadcrumb(props) {
    const { activeId, folder, website, queryText } = props;

    const ancestors = folder.profiles?.[activeId]?.folder?.ancestors || [];

    let paths = activeId ? [...ancestors, activeId] : [];

    let markup = null;

    if (paths.length > 2) {
        const last = paths.pop();
        const sLast = paths.pop();

        const lastFolder = folder.profiles?.[last]?.folder;
        const sLastFolder = folder.profiles?.[sLast]?.folder;

        const menuStyle = `flex items-center px-4 py-2.5 cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-gray-700 overflow-hidden whitespace-nowrap`;

        markup = (
            <>
                <Popover className="relative">
                    <Popover.Button className="flex items-center">
                        <HiDotsHorizontal
                            className={`h-6 w-6 flex-shrink-0 text-gray-400 hover:text-gray-500 cursor-pointer`}
                        />
                    </Popover.Button>

                    <Popover.Panel className="absolute -left-2 top-8 z-10 bg-white rounded-md !shadow-2xl ring-1 ring-black ring-opacity-20 divide-y divide-gray-200 flex flex-col overflow-hidden">
                        <Popover.Button
                            as="div"
                            key={'all'}
                            className={menuStyle}
                        >
                            <Link className={`w-full block text-sm`} to={''}>
                                {website.localize({
                                    en: 'All experts',
                                    fr: 'Tous les experts',
                                })}
                            </Link>
                        </Popover.Button>
                        {paths.map((item, i) => {
                            let innerFolder = folder.profiles?.[item]?.folder;
                            const { name, fileId } = innerFolder;

                            return (
                                <Popover.Button
                                    as="div"
                                    key={i}
                                    className={menuStyle}
                                >
                                    <Link
                                        className={`w-full block text-sm`}
                                        to={fileId}
                                    >
                                        {name}
                                    </Link>
                                </Popover.Button>
                            );
                        })}
                    </Popover.Panel>
                </Popover>
                <div className={`flex items-center`}>
                    <HiChevronRight
                        className={`flex-shrink-0 h-5 w-5 text-gray-400 mr-1`}
                        aria-hidden="true"
                    />
                    <Link to={sLastFolder.fileId}>
                        <div
                            className={`ml-2 text-sm font-medium text-gray-500 hover:text-gray-700`}
                        >
                            {sLastFolder.name}
                        </div>
                    </Link>
                </div>
                <div className={`flex items-center`}>
                    <HiChevronRight
                        className={`flex-shrink-0 h-5 w-5 text-gray-400`}
                        aria-hidden="true"
                    />
                    <Link to={lastFolder.fileId}>
                        <div
                            className={`ml-2 text-sm font-medium text-gray-500 hover:text-gray-700`}
                        >
                            {lastFolder.name}
                        </div>
                    </Link>
                </div>
            </>
        );
    } else {
        markup = (
            <>
                <li>
                    <div className={`flex items-center`}>
                        <Link to="">
                            <div
                                className={`text-gray-400 hover:text-gray-500`}
                            >
                                <HiHome
                                    className={`flex-shrink-0 h-5 w-5`}
                                    aria-hidden="true"
                                />
                                <span className={`sr-only`}>Home</span>
                            </div>
                        </Link>
                    </div>
                </li>
                {queryText ? (
                    <li key={'query'} className={`block`}>
                        <div className={`flex items-center`}>
                            <HiChevronRight
                                className={`flex-shrink-0 h-5 w-5 text-gray-400 mr-2`}
                                aria-hidden="true"
                            />
                            <Link
                                to={`?query=${queryText}`}
                                className="text-gray-500 text-sm"
                            >
                                {website.localize({
                                    en: 'Search result for',
                                    fr: 'Résultat de recherche pour',
                                })}{' '}
                                <span className="font-semibold text-gray-500 italic">
                                    {queryText}
                                </span>
                            </Link>
                        </div>
                    </li>
                ) : (
                    paths.map((item) => {
                        let innerFolder = folder.profiles?.[item]?.folder;

                        let inner = (
                            <div
                                className={`ml-2 text-sm font-medium text-gray-500 hover:text-gray-700`}
                            >
                                {innerFolder.name}
                            </div>
                        );

                        return (
                            <li key={innerFolder.fileId} className={`block`}>
                                <div className={`flex items-center`}>
                                    <HiChevronRight
                                        className={`flex-shrink-0 h-5 w-5 text-gray-400 mr-1`}
                                        aria-hidden="true"
                                    />
                                    <Link to={item}>{inner}</Link>
                                </div>
                            </li>
                        );
                    })
                )}
                {/* {} */}
            </>
        );
    }

    return (
        <nav
            className={`flex bg-white absolute sm:static left-[3.25rem]`}
            aria-label="Breadcrumb"
        >
            <ol className={`flex items-center space-x-2`}>{markup}</ol>
        </nav>
    );
}
