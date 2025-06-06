import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { BsArrowLeft } from 'react-icons/bs';
import { LuInfo } from 'react-icons/lu';
import MetaInfo from './MetaInfo';
import { website } from '@uniwebcms/module-sdk';

export default function Bar(props) {
    const { styler, onClose } = props;

    const { title, description } = styler;

    return (
        <div className="w-full flex items-center justify-between py-2 px-4 bg-neutral-50 rounded-md">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 cursor-pointer text-neutral-700 mr-1" onClick={onClose}>
                    <BsArrowLeft className="w-full h-full" />
                </div>
                <h2 className="text-sm font-bold mr-1">{title}</h2>
                <Popover className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-3 flex items-center justify-center z-10">
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
                                <Popover.Panel className="absolute left-1/2 top-4 z-10 mt-3 w-64 max-w-[calc(100vw-40px)] -translate-x-1/2 transform sm:px-0 lg:max-w-3xl shadow-lg">
                                    <div className="relative bg-neutral-950 p-4 rounded-lg shadow-lg ring-1 ring-neutral-950/5">
                                        <h2 className="text-base font-bold text-neutral-50">
                                            {title}
                                        </h2>
                                        <p className="mt-2 text-sm text-neutral-300">
                                            {description}
                                        </p>
                                        <MetaInfo styler={styler}></MetaInfo>

                                        <p className="mt-6 text-sm text-neutral-200 font-medium">
                                            {website.localize({
                                                en: 'Use this component system',
                                                fr: 'Utiliser ce système de composants',
                                                es: 'Usar este sistema de componentes',
                                                zh: '使用此组件系统',
                                            })}
                                        </p>
                                        <button className="mt-2 w-full flex items-center justify-center p-2 bg-neutral-700 rounded-md">
                                            <p className="text-xs text-neutral-200 font-medium">
                                                {website.localize({
                                                    en: 'Start From Stratch',
                                                    fr: 'Commencer de zéro',
                                                    es: 'Comenzar desde cero',
                                                    zh: '从头开始',
                                                })}
                                            </p>
                                        </button>
                                        <button className="mt-2 w-full flex items-center justify-center p-2 bg-neutral-700 rounded-md">
                                            <p className="text-xs text-neutral-200 font-medium">
                                                {website.localize({
                                                    en: 'View Templates',
                                                    fr: 'Voir les modèles',
                                                    es: 'Ver plantillas',
                                                    zh: '查看模板',
                                                })}
                                            </p>
                                        </button>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>
            </div>
            {/* <button
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
            </button> */}
        </div>
    );
}
