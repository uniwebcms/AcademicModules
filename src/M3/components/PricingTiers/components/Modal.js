import React from 'react';
import { Dialog } from '@headlessui/react';
import { HiX } from 'react-icons/hi';
import { twJoin } from '@uniwebcms/module-sdk';
import { Link } from '@uniwebcms/core-components';
import {
    LuLayers2,
    LuCrown,
    LuGem,
    LuFileStack,
    LuDatabase,
    LuLayoutPanelTop,
    LuLanguages,
    LuUsers,
    LuFolderInput,
    LuBrainCircuit,
    LuFileLock,
    LuHotel,
    LuServer,
    LuFileCode2,
    LuSearch,
    LuChartLine,
} from 'react-icons/lu';

const icons = {
    'layers-2': LuLayers2,
    gem: LuGem,
    crown: LuCrown,
    'file-stack': LuFileStack,
    database: LuDatabase,
    'layout-panel-top': LuLayoutPanelTop,
    languages: LuLanguages,
    users: LuUsers,
    'folder-input': LuFolderInput,
    'brain-circuit': LuBrainCircuit,
    'file-lock': LuFileLock,
    hotel: LuHotel,
    server: LuServer,
    'file-code-2': LuFileCode2,
    search: LuSearch,
    'chart-line': LuChartLine,
};

export default function Modal(props) {
    const {
        open,
        onClose,
        title,
        subtitle,
        features = [],
        links = [],
        theme,
        style,
        darkMode = false,
    } = props;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            className={twJoin('relative z-50 focus:outline-none', theme)}
            style={style}
        >
            <div className="fixed inset-0 z-50 bg-black/80"></div>
            <Dialog.Panel
                className={twJoin(
                    'fixed left-[50%] top-[50%] z-50 grid w-[95%] translate-x-[-50%] translate-y-[-50%] border px-6 py-6 md:px-8 md:py-8 xl:px-12 xl:py-8 shadow-lg sm:rounded-lg max-w-3xl rounded-xl transform transition-transform duration-300 ease-in-out max-h-[95vh] overflow-y-auto',
                    darkMode ? 'bg-neutral-950 border-neutral-600' : 'bg-gray-50 border-gray-400'
                )}
            >
                <div className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
                    <HiX
                        className={twJoin(
                            'w-6 h-6',
                            darkMode
                                ? 'text-neutral-400 hover:text-neutral-200'
                                : 'text-gray-500 hover:text-gray-600'
                        )}
                    />
                </div>

                <div className="flex flex-col text-center mb-3 md:mb-5">
                    <h2
                        className={twJoin(
                            'font-medium tracking-tight text-xl md:text-2xl lg:text-3xl mb-2',
                            darkMode ? 'text-neutral-50' : 'text-gray-900'
                        )}
                    >
                        {title}
                    </h2>
                    <p
                        className={twJoin(
                            'text-sm md:text-base text-gray-600',
                            darkMode ? 'text-neutral-300' : 'text-gray-600'
                        )}
                    >
                        {subtitle}
                    </p>
                </div>

                <div className="space-y-3">
                    {features.map((feature, index) => {
                        const { icon, title, description } = feature;
                        const Icon = icons[icon];

                        return (
                            <div
                                key={index}
                                className={twJoin(
                                    'p-3 md:p-4 rounded-xl border',
                                    darkMode
                                        ? 'bg-neutral-800 border-neutral-600'
                                        : 'bg-gray-100 border-gray-300'
                                )}
                            >
                                <div className="mb-1 md:mb-2">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        {Icon ? (
                                            <Icon
                                                className={twJoin(
                                                    'w-4 h-4 md:w-5 md:h-5',
                                                    darkMode ? 'text-neutral-200' : 'text-gray-800'
                                                )}
                                            />
                                        ) : null}
                                        <h3
                                            className={twJoin(
                                                'text-base md:text-lg font-semibold',
                                                darkMode ? 'text-neutral-100' : 'text-gray-900'
                                            )}
                                        >
                                            {title}
                                        </h3>
                                    </div>
                                </div>
                                <p
                                    className={twJoin(
                                        'text-sm md:text-base leading-relaxed',
                                        darkMode ? 'text-neutral-300' : 'text-gray-600'
                                    )}
                                >
                                    {description}
                                </p>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-center mt-4 md:mt-6 gap-x-6">
                    {links.map((link, index) => {
                        const { text, url } = link;

                        return (
                            <Link
                                key={index}
                                to={url}
                                className={twJoin(
                                    'px-4 md:px-6 py-2 md:py-3 font-medium rounded-md focus:outline-none ring-0 focus:ring-2 focus:ring-offset-2 text-sm md:text-base',
                                    darkMode
                                        ? index % 2 === 0
                                            ? 'bg-neutral-800 text-neutral-50 ring-neutral-600 hover:bg-neutral-700'
                                            : 'bg-neutral-200 text-neutral-900 ring-neutral-400 border border-neutral-400 hover:bg-neutral-100'
                                        : index % 2 === 0
                                        ? 'bg-gray-900 text-gray-50 ring-gray-800 hover:bg-gray-800'
                                        : 'bg-gray-100 text-gray-900 ring-gray-400 border border-gray-400 hover:bg-gray-50'
                                )}
                            >
                                {text}
                            </Link>
                        );
                    })}
                </div>
            </Dialog.Panel>
        </Dialog>
    );
}
