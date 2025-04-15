import React from 'react';
import { Dialog } from '@headlessui/react';
import { HiX } from 'react-icons/hi';
import { twJoin, Link } from '@uniwebcms/module-sdk';
import { LuLayers2, LuCrown, LuGem, LuBlocks } from 'react-icons/lu';

const icons = {
    layer: LuLayers2,
    crown: LuCrown,
    gem: LuGem,
    block: LuBlocks,
};

export default function Modal(props) {
    const {
        open,
        onClose,
        title,
        subtitle,
        features = [],
        links = [],
        // triggerText,
        // triggerClassName,
        // title,
        // subtitle,
        // examples,
        // tagEndnote,
        // button,
        // theme,
        // style,
    } = props;

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50 focus:outline-none">
            <div className="fixed inset-0 z-50 bg-black/80"></div>
            <Dialog.Panel className="fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] border px-6 py-6 md:px-8 md:py-8 xl:px-12 xl:py-8 shadow-lg sm:rounded-lg max-w-3xl rounded-xl bg-gray-50 border-gray-400 transform transition-transform duration-300 ease-in-out">
                <div className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
                    <HiX className="w-6 h-6 text-gray-500 hover:text-gray-600" />
                </div>

                <div className="flex flex-col text-center mb-5">
                    <h2 className="font-medium tracking-tight text-3xl mb-2 text-gray-900">
                        {title}
                    </h2>
                    <p className="text-gray-600">{subtitle}</p>
                </div>

                <div className="space-y-5">
                    {features.map((feature, index) => {
                        const { icon, title, description } = feature;
                        const Icon = icons[icon];

                        return (
                            <div
                                key={index}
                                className="p-4 rounded-xl bg-gray-100 border border-gray-300"
                            >
                                <div className="flex items-center justify-between gap-3 mb-2">
                                    <div className="flex items-center gap-3">
                                        {Icon ? <Icon className="w-5 h-5 text-gray-800" /> : null}
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {title}
                                        </h3>
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed">{description}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-center mt-8 gap-x-6">
                    {links.map((link, index) => {
                        const { text, url } = link;

                        return (
                            <Link
                                key={index}
                                to={url}
                                className={twJoin(
                                    'px-6 py-3 font-medium rounded-md focus:outline-none ring-0 focus:ring-2 focus:ring-offset-2',
                                    index % 2 === 0
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
